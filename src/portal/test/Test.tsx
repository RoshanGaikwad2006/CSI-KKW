import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TestQuestion } from './types';
import { QuestionCard } from './QuestionCard';
import { Login } from './Login';

const Test = (): JSX.Element => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
    const [timeLeft, setTimeLeft] = useState(3600); // Default 60 mins (3600s)
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [violations, setViolations] = useState(0);
    const [testStarted, setTestStarted] = useState(false);
    const [testCompleted, setTestCompleted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [isBlurred, setIsBlurred] = useState(false);
    const [showViolationMessage, setShowViolationMessage] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState<{username: string; password?: string; secretCode?: string; name?: string; year?: string; branch?: string} | null>(null);
    const [questions, setQuestions] = useState<TestQuestion[]>([]);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [testMetadata, setTestMetadata] = useState<any>(null);
    const [countdownTime, setCountdownTime] = useState<number>(0);
    const [testStatus, setTestStatus] = useState<'loading' | 'waiting' | 'ready' | 'active' | 'ended'>('ready');
    const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);

    const testRef = useRef<HTMLDivElement>(null);
    const userInfoRef = useRef<{username: string; password?: string; secretCode?: string; name?: string; year?: string; branch?: string} | null>(null);
    const answersRef = useRef<Record<number, string>>({});
    const questionsRef = useRef<TestQuestion[]>([]);
    const timeLeftRef = useRef<number>(3600);
    const isSubmittingRef = useRef<boolean>(false);
    const draftRevisionRef = useRef<number>(1);
    const saveDebounceTimer = useRef<NodeJS.Timeout | null>(null);
    const lastViolationTime = useRef<number>(0);

    // Keep refs in sync for safe async/timer callbacks
    useEffect(() => { answersRef.current = answers; }, [answers]);
    useEffect(() => { questionsRef.current = questions; }, [questions]);
    useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);
    useEffect(() => { userInfoRef.current = userInfo; }, [userInfo]);

    const maxAllowedViolations = testMetadata?.config?.maxViolations || 5;

    // Fetch test schedule and metadata
    const fetchTestMetadata = async (userParam?: string) => {
        try {
            const u = userParam || userInfoRef.current?.username || userInfo?.username;
            const userQuery = u ? `?username=${encodeURIComponent(u)}` : '';
            const response = await fetch(`/api/test-metadata${userQuery}`);
            const data = await response.json();
            
            if (data.testCompleted) {
                setTestCompleted(true);
                setTestStatus('ended');
                return;
            }
            
            setTestMetadata(data);
            checkTestSchedule(data);
        } catch (error) {
            console.error('Error fetching test metadata:', error);
            setTestStatus('ready');
        }
    };

    const checkTestSchedule = (metadata: any) => {
        // Open access: No time slot restriction, candidates can login and start at any time
        setTestStatus('ready');
        const durationSeconds = metadata?.schedule?.duration || metadata?.config?.duration || 3600;
        
        // Only set timeLeft if test not already started
        const u = userInfoRef.current?.username || userInfo?.username;
        if (typeof window !== 'undefined' && u) {
            const savedEndTimeStr = localStorage.getItem(`c2c_end_time_${u}`);
            if (savedEndTimeStr) {
                const remaining = Math.max(0, Math.floor((parseInt(savedEndTimeStr, 10) - Date.now()) / 1000));
                setTimeLeft(remaining);
                return;
            }
        }
        setTimeLeft(durationSeconds);
    };

    // Auto-Restore Active Session on Page Refresh or Reopen
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const restoreSession = async () => {
            const savedSession = localStorage.getItem('c2c_auth_user');
            if (!savedSession) return;

            try {
                const parsedUser = JSON.parse(savedSession);
                if (!parsedUser?.username) return;

                userInfoRef.current = parsedUser;
                setUserInfo(parsedUser);
                setIsLoggedIn(true);
                setQuestionsLoading(true);

                // Check if candidate already submitted test
                const isCompleted = await checkTestStatus(parsedUser.username);
                if (isCompleted) {
                    setTestCompleted(true);
                    setQuestionsLoading(false);
                    return;
                }

                await fetchTestMetadata(parsedUser.username);
                const restored = await loadDraft(parsedUser.username);
                if (!restored) {
                    await fetchQuestions(parsedUser.username);
                }

                // Restore active test state
                const wasStarted = localStorage.getItem(`c2c_test_started_${parsedUser.username}`) === 'true';
                if (wasStarted) {
                    setTestStarted(true);
                    const savedEndTimeStr = localStorage.getItem(`c2c_end_time_${parsedUser.username}`);
                    if (savedEndTimeStr) {
                        const remaining = Math.max(0, Math.floor((parseInt(savedEndTimeStr, 10) - Date.now()) / 1000));
                        setTimeLeft(remaining);
                        if (remaining <= 0) {
                            setTimeout(() => submitTestRef.current(true), 500);
                        }
                    }
                }
            } catch (err) {
                console.error('Error restoring session:', err);
            } finally {
                setQuestionsLoading(false);
            }
        };

        restoreSession();
    }, []);

    // Countdown to start if waiting status
    useEffect(() => {
        if (testStatus === 'waiting' && countdownTime > 0) {
            const timer = setInterval(() => {
                setCountdownTime(prev => {
                    if (prev <= 1) {
                        setTestStatus('ready');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [testStatus, countdownTime]);

    // Rock-Solid Real-Time Test Timer (Wall-clock based)
    useEffect(() => {
        if (!testStarted || testCompleted) return;

        const u = userInfoRef.current?.username || userInfo?.username;
        if (!u) return;

        const updateTimer = () => {
            if (typeof window === 'undefined') return;
            const savedEndTimeStr = localStorage.getItem(`c2c_end_time_${u}`);
            if (!savedEndTimeStr) return;

            const endTime = parseInt(savedEndTimeStr, 10);
            const now = Date.now();
            const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
            setTimeLeft(remaining);

            if (remaining <= 0) {
                console.warn('Test time completed. Auto-submitting.');
                submitTestRef.current(true);
            }
        };

        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);

        return () => clearInterval(timerInterval);
    }, [testStarted, testCompleted]);

    // Violation handler with debounce to avoid rapid multi-firing
    const addViolation = useCallback(() => {
        const now = Date.now();
        // Prevent registering multiple violations within 2.5 seconds
        if (now - lastViolationTime.current < 2500) return;
        lastViolationTime.current = now;

        setViolations(prev => {
            const newCount = prev + 1;
            setShowViolationMessage(true);
            setTimeout(() => setShowViolationMessage(false), 3500);
            
            if (newCount >= maxAllowedViolations) {
                console.warn(`Max violations (${maxAllowedViolations}) reached. Submitting test.`);
                setTimeout(() => submitTestRef.current(true), 300);
            }
            
            return newCount;
        });
    }, [maxAllowedViolations]);

    const enterFullscreen = async () => {
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
                setIsFullscreen(true);
            }
        } catch (err) {
            console.error('Fullscreen request failed:', err);
        }
    };

    // Anti-cheating listeners (clean, no aggressive blur false positives)
    useEffect(() => {
        if (!testStarted || testCompleted) return;

        // Trigger violation only when the tab is actually hidden/minimized
        const handleVisibilityChange = () => {
            if (document.hidden) {
                addViolation();
                setIsBlurred(true);
            } else {
                setIsBlurred(false);
            }
        };

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && testStarted) {
                addViolation();
                setIsFullscreen(false);
            } else {
                setIsFullscreen(true);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Block copy/paste/cut
            if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
                e.preventDefault();
                return;
            }
            
            // Block DevTools shortcuts (F12, Ctrl+Shift+I, Ctrl+U, Alt+Tab)
            if (
                e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
                (e.ctrlKey && (e.key === 'u' || e.key === 'U')) ||
                (e.altKey && e.key === 'Tab')
            ) {
                e.preventDefault();
                addViolation();
            }
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = 'Your test is active. All your answers are safely saved on this computer.';
            return e.returnValue;
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [testStarted, testCompleted, addViolation]);

    const startTest = async () => {
        const u = userInfoRef.current?.username || userInfo?.username;
        if (!u) return;

        const durationSeconds = testMetadata?.schedule?.duration || testMetadata?.config?.duration || 3600;
        const now = Date.now();
        const endTime = now + (durationSeconds * 1000);

        if (typeof window !== 'undefined') {
            localStorage.setItem(`c2c_test_started_${u}`, 'true');
            localStorage.setItem(`c2c_start_time_${u}`, now.toString());
            localStorage.setItem(`c2c_end_time_${u}`, endTime.toString());
        }

        setTimeLeft(durationSeconds);
        await enterFullscreen();
        setTestStarted(true);
        setTimeout(saveDraftToServer, 300);
    };

    // Deterministic question fetching
    const fetchQuestions = async (userParam?: string) => {
        const u = userParam || userInfoRef.current?.username || userInfo?.username;
        if (!u) {
            console.warn('Cannot fetch questions: username missing');
            return;
        }
        try {
            setQuestionsLoading(true);
            const response = await fetch(`/api/questions?username=${encodeURIComponent(u)}`);
            const data = await response.json();
            if (data.questions && data.questions.length > 0) {
                setQuestions(data.questions);
                questionsRef.current = data.questions;
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setQuestionsLoading(false);
        }
    };

    // Instant LocalStorage save (0ms, 100% crash proof, zero server load)
    const saveToLocalStorage = useCallback((currentAnswers: Record<number, string>) => {
        const u = userInfoRef.current?.username || userInfo?.username;
        if (typeof window === 'undefined' || !u) return;
        try {
            const draftObj = {
                username: u,
                answers: currentAnswers,
                flaggedQuestions: Array.from(flaggedQuestions),
                currentQuestion,
                violations,
                testStarted,
                revision: draftRevisionRef.current,
                questionIds: questions.map(q => q._id || q.id),
                timestamp: Date.now()
            };
            localStorage.setItem(`test_draft_${u}`, JSON.stringify(draftObj));
        } catch (err) {
            console.warn('LocalStorage save notice:', err);
        }
    }, [userInfo, flaggedQuestions, currentQuestion, violations, testStarted, questions]);

    // Save draft to server (lightweight, compact payload, with fallback)
    const saveDraftToServer = useCallback(async () => {
        const u = userInfoRef.current?.username || userInfo?.username;
        if (!u || !testStarted || testCompleted) return;

        const duration = testMetadata?.schedule?.duration || 60 * 60;
        let timeSpent = 0;
        if (typeof window !== 'undefined') {
            const startStr = localStorage.getItem(`c2c_start_time_${u}`);
            if (startStr) {
                timeSpent = Math.max(0, Math.floor((Date.now() - parseInt(startStr, 10)) / 1000));
            } else {
                timeSpent = Math.max(0, duration - timeLeftRef.current);
            }
        }

        const questionIds = questionsRef.current.map(q => q._id || q.id);

        const draftData = {
            username: u,
            answers: answersRef.current,
            flaggedQuestions: Array.from(flaggedQuestions),
            currentQuestion,
            timeSpent,
            violations,
            testStarted,
            revision: draftRevisionRef.current,
            questionIds
        };

        try {
            if (!navigator.onLine) throw new Error('Offline');
            await fetch('/api/save-draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(draftData)
            });
        } catch (error) {
            // Offline fallback - already cached in localStorage
            saveToLocalStorage(answersRef.current);
        }
    }, [userInfo, testStarted, testCompleted, testMetadata, flaggedQuestions, currentQuestion, violations, saveToLocalStorage]);

    // Debounced draft save to avoid hammering server on rapid question clicks
    const triggerDebouncedServerSave = useCallback(() => {
        if (saveDebounceTimer.current) {
            clearTimeout(saveDebounceTimer.current);
        }
        saveDebounceTimer.current = setTimeout(() => {
            saveDraftToServer();
        }, 2500); // 2.5s debounce
    }, [saveDraftToServer]);

    // Controlled periodic background sync: every 30 seconds
    useEffect(() => {
        if (!testStarted || testCompleted || !userInfo?.username) return;
        const syncInterval = setInterval(() => {
            saveDraftToServer();
        }, 30000);
        return () => clearInterval(syncInterval);
    }, [testStarted, testCompleted, userInfo, saveDraftToServer]);

    const loadDraft = async (username: string): Promise<boolean> => {
        try {
            // First check fast local storage
            if (typeof window !== 'undefined') {
                const localDraft = localStorage.getItem(`test_draft_${username}`);
                if (localDraft) {
                    try {
                        const parsed = JSON.parse(localDraft);
                        if (parsed.answers) {
                            setAnswers(parsed.answers);
                            answersRef.current = parsed.answers;
                        }
                        if (parsed.revision && typeof parsed.revision === 'number') {
                            draftRevisionRef.current = Math.max(draftRevisionRef.current, parsed.revision);
                        }
                        if (parsed.flaggedQuestions) setFlaggedQuestions(new Set(parsed.flaggedQuestions));
                        if (parsed.currentQuestion !== undefined) setCurrentQuestion(parsed.currentQuestion);
                    } catch (e) {}
                }
            }

            // Sync with server draft
            const response = await fetch(`/api/load-draft?username=${encodeURIComponent(username)}`);
            if (response.ok) {
                const data = await response.json();
                if (data.draft) {
                    if (data.draft.revision && typeof data.draft.revision === 'number') {
                        draftRevisionRef.current = Math.max(draftRevisionRef.current, data.draft.revision);
                    }
                    if (data.draft.answers) {
                        setAnswers(prev => {
                            const merged = { ...data.draft.answers, ...prev };
                            answersRef.current = merged;
                            return merged;
                        });
                    }
                    if (data.draft.flaggedQuestions) setFlaggedQuestions(new Set(data.draft.flaggedQuestions));
                    if (data.draft.currentQuestion !== undefined) setCurrentQuestion(data.draft.currentQuestion);
                    if (data.draft.violations !== undefined) setViolations(data.draft.violations);

                    // Sync server authoritative deadline
                    if (data.draft.deadline && typeof window !== 'undefined') {
                        const serverDeadlineMs = new Date(data.draft.deadline).getTime();
                        localStorage.setItem(`c2c_end_time_${username}`, serverDeadlineMs.toString());
                        if (typeof data.draft.serverRemainingSeconds === 'number') {
                            setTimeLeft(data.draft.serverRemainingSeconds);
                        }
                    }

                    if (data.draft.questions && data.draft.questions.length > 0) {
                        setQuestions(data.draft.questions);
                        questionsRef.current = data.draft.questions;
                        return true;
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load draft from server:', error);
        }
        return false;
    };

    const checkTestStatus = async (username: string) => {
        try {
            const response = await fetch(`/api/check-test-status?username=${encodeURIComponent(username)}`);
            if (response.ok) {
                const data = await response.json();
                if (data.testCompleted) {
                    setTestCompleted(true);
                    return true;
                }
            }
        } catch (error) {
            console.error('Failed to check test status:', error);
        }
        return false;
    };

    const handleLogin = async (credentials: { username: string; password: string; secretCode: string; name?: string; year?: string; branch?: string }) => {
        userInfoRef.current = credentials;
        setUserInfo(credentials);
        setIsLoggedIn(true);
        setQuestionsLoading(true);

        if (typeof window !== 'undefined') {
            localStorage.setItem('c2c_auth_user', JSON.stringify(credentials));
        }

        const isCompleted = await checkTestStatus(credentials.username);
        if (isCompleted) {
            setTestCompleted(true);
            setQuestionsLoading(false);
            return;
        }

        try {
            await fetchTestMetadata(credentials.username);
            const questionsRestored = await loadDraft(credentials.username);
            if (!questionsRestored) {
                await fetchQuestions(credentials.username);
            }

            if (typeof window !== 'undefined') {
                const wasStarted = localStorage.getItem(`c2c_test_started_${credentials.username}`) === 'true';
                if (wasStarted) {
                    setTestStarted(true);
                    const savedEndTimeStr = localStorage.getItem(`c2c_end_time_${credentials.username}`);
                    if (savedEndTimeStr) {
                        const remaining = Math.max(0, Math.floor((parseInt(savedEndTimeStr, 10) - Date.now()) / 1000));
                        setTimeLeft(remaining);
                    }
                }
            }
        } catch (e) {
            console.error('Initialization error after login:', e);
        } finally {
            setQuestionsLoading(false);
        }
    };

    const handleLogout = () => {
        const u = userInfoRef.current?.username || userInfo?.username;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('c2c_auth_user');
            if (u) {
                localStorage.removeItem(`c2c_test_started_${u}`);
                localStorage.removeItem(`c2c_end_time_${u}`);
                localStorage.removeItem(`c2c_start_time_${u}`);
            }
        }
        setIsLoggedIn(false);
        setUserInfo(null);
        userInfoRef.current = null;
        setQuestions([]);
        setTestStarted(false);
    };

    // User selects an option
    const handleAnswer = (questionIndex: number, answer: string) => {
        draftRevisionRef.current += 1;
        setAnswers(prev => {
            const updated = { ...prev, [questionIndex]: answer };
            answersRef.current = updated;
            saveToLocalStorage(updated);
            return updated;
        });
        triggerDebouncedServerSave();
    };

    // Toggle flag for review
    const toggleFlag = (questionIndex: number) => {
        draftRevisionRef.current += 1;
        setFlaggedQuestions(prev => {
            const updated = new Set(prev);
            if (updated.has(questionIndex)) {
                updated.delete(questionIndex);
            } else {
                updated.add(questionIndex);
            }
            return updated;
        });
        triggerDebouncedServerSave();
    };

    // Test Submission with Double-Submit Guard & Safety Backup
    const submitTest = async (forceAutoSubmit = false) => {
        if (isSubmittingRef.current || testCompleted) return;

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setSubmitError(null);

        const u = userInfoRef.current?.username || userInfo?.username;
        if (!u) {
            setIsSubmitting(false);
            isSubmittingRef.current = false;
            return;
        }

        try {
            const duration = testMetadata?.schedule?.duration || 60 * 60;
            let timeSpent = 0;
            if (typeof window !== 'undefined') {
                const startStr = localStorage.getItem(`c2c_start_time_${u}`);
                if (startStr) {
                    timeSpent = Math.max(0, Math.floor((Date.now() - parseInt(startStr, 10)) / 1000));
                } else {
                    timeSpent = Math.max(0, duration - timeLeftRef.current);
                }
            } else {
                timeSpent = Math.max(0, duration - timeLeftRef.current);
            }

            const currentAnswers = answersRef.current;
            const currentQuestions = questionsRef.current;
            const questionIds = currentQuestions.map(q => q._id || q.id);

            const testData = {
                username: u,
                answers: currentAnswers,
                timeSpent,
                violations,
                totalQuestions: currentQuestions.length,
                questionIds,
                submittedAt: new Date().toISOString()
            };

            // Permanent LocalStorage backup in case of lab network failure
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem(`BACKUP_SUBMISSION_${u}`, JSON.stringify(testData));
                } catch (e) {}
            }

            const response = await fetch('/api/submit-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testData)
            });

            const result = await response.json().catch(() => null);

            if (response.ok && (result?.success || result?.alreadySubmitted)) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('c2c_auth_user');
                    localStorage.removeItem(`c2c_test_started_${u}`);
                    localStorage.removeItem(`c2c_end_time_${u}`);
                    localStorage.removeItem(`c2c_start_time_${u}`);
                    localStorage.removeItem(`test_draft_${u}`);
                }

                await fetch('/api/clear-draft', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: u })
                }).catch(() => {});

                setTestCompleted(true);
                setShowSubmitConfirm(false);
                if (document.fullscreenElement) {
                    document.exitFullscreen?.().catch(() => {});
                }
            } else {
                const errorMsg = result?.error || 'Server error while recording answers. Please retry.';
                setSubmitError(errorMsg);
            }
        } catch (error: any) {
            console.error('Error submitting test:', error);
            setSubmitError('Network connection issue during submission. Your responses are safely stored on this computer. Please click Retry.');
        } finally {
            setIsSubmitting(false);
            isSubmittingRef.current = false;
        }
    };

    const submitTestRef = useRef(submitTest);
    useEffect(() => {
        submitTestRef.current = submitTest;
    });

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const goToQuestion = (index: number) => {
        if (index >= 0 && index < questions.length) {
            setCurrentQuestion(index);
        }
    };

    const getQuestionStatus = (index: number) => {
        if (flaggedQuestions.has(index)) return 'flagged';
        if (answers[index]) return 'answered';
        return 'unanswered';
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    // Unauthenticated -> Show Login
    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    // Loading questions
    if (questionsLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <h1 className="text-xl font-semibold mb-4 text-gray-800">Preparing Your Test Environment...</h1>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-xs text-gray-500 mt-4">Restoring your assigned questions & answers...</p>
                </div>
            </div>
        );
    }

    // Test successfully submitted
    if (testCompleted) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-slate-200">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <span className="text-xs uppercase tracking-wider font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full inline-block mb-3">
                        Assessment Completed
                    </span>
                    <h1 className="text-2xl font-black text-gray-900 mb-2">Test Submitted Successfully!</h1>
                    <p className="text-gray-600 text-sm mb-5">
                        Thank you, <span className="font-semibold text-gray-800">{userInfo?.name || userInfo?.username}</span>. Your responses for Campus to Corporate (C2C) 2026 have been securely recorded.
                    </p>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 mb-6 text-left space-y-1.5">
                        <p><strong>Candidate:</strong> {userInfo?.name || userInfo?.username}</p>
                        <p><strong>PRN / Username:</strong> <span className="font-mono">{userInfo?.username}</span></p>
                        {userInfo?.year && <p><strong>Academic Year:</strong> {userInfo.year}</p>}
                        <p><strong>Total Questions:</strong> {questions.length > 0 ? questions.length : 50}</p>
                        <p><strong>Answered:</strong> {Object.keys(answers).length}</p>
                        <p><strong>Security Violations:</strong> {violations}</p>
                    </div>
                    <p className="text-xs text-slate-500 mb-6">
                        Results and shortlists will be published on the official CSI KKWIEER portal.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition shadow-md"
                    >
                        Return to CSI Home
                    </button>
                </div>
            </div>
        );
    }

    // No questions loaded
    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <h1 className="text-xl font-bold mb-4 text-gray-900">No Questions Available</h1>
                    <p className="text-gray-600 mb-6">Unable to load questions from server. Please verify your connection.</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => fetchQuestions(userInfoRef.current?.username || userInfo?.username)}
                            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            Retry Loading
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition text-sm"
                        >
                            Switch Account
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Ready to start instructions screen
    if (!testStarted && testStatus === 'ready') {
        const durationMins = Math.floor((testMetadata?.schedule?.duration || 3600) / 60);
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-slate-200">
                    <div className="text-center mb-6">
                        <span className="text-xs uppercase tracking-wider font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full inline-block mb-2">
                            Campus to Corporate (C2C) 2026
                        </span>
                        <h1 className="text-2xl font-extrabold text-gray-900">
                            Technical & Aptitude Assessment
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">CSI KKWIEER Official Assessment Portal</p>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700 bg-blue-50/70 border border-blue-200 p-4 rounded-xl mb-6">
                        <p><strong>Candidate:</strong> {userInfo?.name || userInfo?.username}</p>
                        <p><strong>PRN / Username:</strong> <span className="font-mono text-xs text-gray-600">{userInfo?.username}</span></p>
                        {userInfo?.year && <p><strong>Academic Year:</strong> {userInfo.year} {userInfo.branch ? `• ${userInfo.branch}` : ''}</p>}
                        <p><strong>Duration:</strong> {durationMins} minutes</p>
                        <p><strong>Total Questions:</strong> {questions.length}</p>
                        <p><strong>Maximum Violations:</strong> {maxAllowedViolations}</p>
                    </div>
                    <div className="space-y-2 text-xs text-gray-600 mb-6 border-l-4 border-yellow-500 pl-3">
                        <p>⚠️ Fullscreen mode is strictly mandatory throughout the assessment.</p>
                        <p>⚠️ Switching tabs or minimizing the browser will be flagged as a security violation.</p>
                        <p>⚠️ Reaching {maxAllowedViolations} violations will trigger automatic submission.</p>
                        <p>⚠️ Your progress is continuously saved. If page reloads, you will resume automatically.</p>
                    </div>
                    <div className="space-y-3">
                        <button
                            onClick={startTest}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition shadow-md"
                        >
                            Enter Fullscreen & Begin Assessment
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full text-center text-xs text-slate-500 hover:text-slate-800 transition py-1"
                        >
                            Wrong student? Click here to Logout / Switch Account
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const answeredCount = Object.keys(answers).length;
    const unansweredCount = questions.length - answeredCount;

    return (
        <div ref={testRef} className="min-h-screen bg-gray-100 select-none">
            {/* Violation Alert Modal */}
            {showViolationMessage && (
                <div className="fixed inset-0 bg-red-700 bg-opacity-95 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-xl text-center max-w-md shadow-2xl">
                        <div className="text-red-600 text-5xl mb-3">⚠️</div>
                        <h2 className="text-xl font-bold text-red-600 mb-2">SECURITY VIOLATION DETECTED</h2>
                        <p className="text-gray-700 text-sm mb-3">
                            You switched away from the active test window. This action has been recorded.
                        </p>
                        <p className="text-base font-bold text-gray-900 mb-4">
                            Violations: <span className="text-red-600">{violations}</span> / {maxAllowedViolations}
                        </p>
                        <p className="text-xs text-gray-500">
                            Reaching {maxAllowedViolations} violations will result in automatic submission.
                        </p>
                        <button
                            onClick={() => setShowViolationMessage(false)}
                            className="mt-4 bg-red-600 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-red-700"
                        >
                            I Understand, Resume Test
                        </button>
                    </div>
                </div>
            )}

            {/* Submission Failed Modal with Retry */}
            {submitError && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-xl text-center max-w-md shadow-2xl">
                        <div className="text-red-500 text-5xl mb-3">⚠️</div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Submission Incomplete</h2>
                        <p className="text-gray-700 text-sm mb-4">{submitError}</p>
                        <div className="bg-green-50 border border-green-200 text-green-800 text-xs p-3 rounded mb-4">
                            Your answers are securely saved on this computer. Please click the button below to retry submission.
                        </div>
                        <button
                            onClick={() => submitTest(false)}
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Retrying Submission...' : 'Retry Submission Now'}
                        </button>
                    </div>
                </div>
            )}

            {/* End Test Confirmation Modal */}
            {showSubmitConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-2xl text-center max-w-md shadow-2xl border border-gray-100">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                            📋
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">Confirm Test Submission</h2>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4 text-xs text-left space-y-1">
                            <p><strong>Candidate:</strong> {userInfo?.name || userInfo?.username}</p>
                            <p><strong>Answered Questions:</strong> <span className="font-semibold text-emerald-600">{answeredCount}</span> / {questions.length}</p>
                            <p><strong>Unanswered Questions:</strong> <span className="font-semibold text-rose-600">{unansweredCount}</span></p>
                            <p><strong>Flagged for Review:</strong> <span className="font-semibold text-amber-600">{flaggedQuestions.size}</span></p>
                        </div>

                        {answeredCount < 5 && (
                            <div className="bg-amber-50 border border-amber-300 text-amber-800 text-xs p-3 rounded-lg mb-4 text-left font-medium">
                                ⚠️ Caution: You have only answered <strong>{answeredCount}</strong> out of {questions.length} questions. Once submitted, your answers cannot be changed.
                            </div>
                        )}

                        <p className="text-gray-600 text-xs mb-5">
                            Are you sure you want to finalize and submit your assessment?
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSubmitConfirm(false)}
                                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition text-sm"
                            >
                                Continue Test
                            </button>
                            <button
                                onClick={() => { setShowSubmitConfirm(false); submitTest(false); }}
                                disabled={isSubmitting}
                                className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50 text-sm shadow-sm"
                            >
                                {isSubmitting ? 'Submitting...' : 'Yes, Submit Test'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Offline Notification */}
            {!isOnline && (
                <div className="fixed top-0 left-0 right-0 bg-yellow-600 text-white text-center py-1.5 z-40 text-xs font-semibold animate-pulse">
                    🔌 OFFLINE MODE: Network disconnected. All progress is safely stored in this browser.
                </div>
            )}

            {/* Fullscreen Required Warning */}
            {!isFullscreen && testStarted && (
                <div className={`fixed left-0 right-0 bg-red-600 text-white text-center py-2 z-40 ${!isOnline ? 'top-8' : 'top-0'}`}>
                    <span className="font-semibold text-sm">⚠️ FULLSCREEN REQUIRED: Click below to re-enter fullscreen</span>
                    <button
                        onClick={enterFullscreen}
                        className="ml-3 bg-white text-red-600 text-xs px-2.5 py-1 rounded font-bold hover:bg-red-50"
                    >
                        Re-enter Fullscreen
                    </button>
                </div>
            )}

            {/* Top Navigation Bar */}
            <div className="bg-white shadow-sm border-b px-6 py-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-base sm:text-lg font-bold text-gray-800">
                            Campus to Corporate (C2C) Aptitude Assessment 2026
                        </h1>
                        <span className="text-xs text-gray-500">
                            Candidate: <strong className="text-gray-800">{userInfo?.name || userInfo?.username}</strong> {userInfo?.year ? `• ${userInfo.year}` : ''}
                        </span>
                    </div>
                    <div className="flex items-center space-x-6">
                        <span className="text-sm text-gray-600 font-medium">
                            Question {currentQuestion + 1} of {questions.length}
                        </span>
                        <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-3 py-1 rounded-lg">
                            <span className="text-xs text-red-700 font-bold">⏱</span>
                            <span className="text-lg font-mono font-bold text-red-600">
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                            violations >= maxAllowedViolations - 1 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-gray-100 text-gray-700'
                        }`}>
                            Violations: {violations}/{maxAllowedViolations}
                        </span>
                        {!isFullscreen && (
                            <button
                                onClick={enterFullscreen}
                                className="text-xs bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 font-medium"
                            >
                                Fullscreen
                            </button>
                        )}
                        <button
                            onClick={() => setShowSubmitConfirm(true)}
                            disabled={isSubmitting}
                            className="text-xs bg-emerald-600 text-white px-4 py-1.5 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-sm disabled:opacity-50"
                        >
                            Finish & Submit
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="flex gap-6 p-6 max-w-7xl mx-auto">
                {/* Left Side: Question Navigator Grid */}
                <div className="w-80 bg-white rounded-xl shadow-sm border p-4 h-fit">
                    <h3 className="font-semibold text-sm mb-3 text-gray-800">Question Navigator</h3>
                    <div className="grid grid-cols-5 gap-2 mb-4 max-h-96 overflow-y-auto p-1">
                        {questions.map((_, index) => {
                            const status = getQuestionStatus(index);
                            const isCurrent = index === currentQuestion;
                            return (
                                <button
                                    key={index}
                                    onClick={() => goToQuestion(index)}
                                    className={`w-9 h-9 text-xs font-semibold rounded-lg border transition-colors ${
                                        isCurrent
                                            ? 'border-blue-600 bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                                            : status === 'answered'
                                            ? 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100'
                                            : status === 'flagged'
                                            ? 'border-orange-500 bg-orange-50 text-orange-700 hover:bg-orange-100'
                                            : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>
                    
                    <div className="space-y-1.5 text-xs text-gray-600 border-t pt-3">
                        <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 bg-green-50 border border-green-500 rounded"></div>
                            <span>Answered ({answeredCount})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 bg-orange-50 border border-orange-500 rounded"></div>
                            <span>Flagged for Review ({flaggedQuestions.size})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 bg-gray-50 border border-gray-200 rounded"></div>
                            <span>Unanswered ({unansweredCount})</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Active Question Card */}
                <div className="flex-1">
                    <QuestionCard
                        question={questions[currentQuestion]}
                        selectedAnswer={answers[currentQuestion]}
                        onAnswer={(answer) => handleAnswer(currentQuestion, answer)}
                        isFlagged={flaggedQuestions.has(currentQuestion)}
                        onToggleFlag={() => toggleFlag(currentQuestion)}
                    />

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-6">
                        <button
                            onClick={prevQuestion}
                            disabled={currentQuestion === 0}
                            className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-300 transition"
                        >
                            Previous
                        </button>

                        <div className="flex space-x-3">
                            {currentQuestion === questions.length - 1 ? (
                                <button
                                    onClick={() => setShowSubmitConfirm(true)}
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-50 shadow-sm"
                                >
                                    Review & Submit Assessment
                                </button>
                            ) : (
                                <button
                                    onClick={nextQuestion}
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
                                >
                                    Next Question
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Test;