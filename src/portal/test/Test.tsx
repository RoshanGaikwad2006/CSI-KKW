import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TestQuestion } from './types';
import { QuestionCard } from './QuestionCard';
import { Login } from './Login';

const Test = (): JSX.Element => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
    const [timeLeft, setTimeLeft] = useState(2700); // Default 45 mins (2700s)
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
    const [userInfo, setUserInfo] = useState<{username: string; password: string; secretCode: string} | null>(null);
    const [questions, setQuestions] = useState<TestQuestion[]>([]);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [testMetadata, setTestMetadata] = useState<any>(null);
    const [countdownTime, setCountdownTime] = useState<number>(0);
    const [testStatus, setTestStatus] = useState<'loading' | 'waiting' | 'ready' | 'active' | 'ended'>('loading');
    const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);

    const testRef = useRef<HTMLDivElement>(null);
    const saveDebounceTimer = useRef<NodeJS.Timeout | null>(null);
    const lastViolationTime = useRef<number>(0);

    const maxAllowedViolations = testMetadata?.config?.maxViolations || 5;

    // Fetch test schedule and metadata
    const fetchTestMetadata = async () => {
        try {
            const userParam = userInfo?.username ? `?username=${encodeURIComponent(userInfo.username)}` : '';
            const response = await fetch(`/api/test-metadata${userParam}`);
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
        if (!metadata?.schedule) {
            setTestStatus('ready');
            return;
        }

        const now = new Date();
        const nowTime = now.getTime();
        
        let startTime, endTime;
        if (metadata.schedule.startTime?.$date) {
            startTime = new Date(metadata.schedule.startTime.$date);
            endTime = new Date(metadata.schedule.endTime.$date);
        } else {
            startTime = new Date(metadata.schedule.startTime);
            endTime = new Date(metadata.schedule.endTime);
        }
        
        const startTimeMs = startTime.getTime();
        const endTimeMs = endTime.getTime();
        
        if (nowTime < startTimeMs) {
            const countdown = Math.max(0, Math.floor((startTimeMs - nowTime) / 1000));
            setTestStatus('waiting');
            setCountdownTime(countdown);
        } else if (nowTime >= startTimeMs && nowTime <= endTimeMs) {
            setTestStatus('ready');
            const durationSeconds = metadata.schedule.duration || 45 * 60;
            const remainingScheduleTime = Math.floor((endTimeMs - nowTime) / 1000);
            const timeAllowed = Math.min(durationSeconds, remainingScheduleTime);
            setTimeLeft(timeAllowed > 0 ? timeAllowed : durationSeconds);
        } else {
            setTestStatus('ended');
        }
    };

    // Countdown to start
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

    // Test duration timer (ticking every second)
    // NOTE: Does NOT trigger server requests on tick!
    useEffect(() => {
        if (!testStarted || testCompleted) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Time up -> trigger auto submit
                    submitTest(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [testStarted, testCompleted, answers, questions, userInfo, violations]);

    // Violation handler with debounce to avoid rapid multi-firing
    const addViolation = useCallback(() => {
        const now = Date.now();
        // Prevent registering multiple violations within 2 seconds
        if (now - lastViolationTime.current < 2000) return;
        lastViolationTime.current = now;

        setViolations(prev => {
            const newCount = prev + 1;
            setShowViolationMessage(true);
            setTimeout(() => setShowViolationMessage(false), 3500);
            
            if (newCount >= maxAllowedViolations) {
                console.warn(`Max violations (${maxAllowedViolations}) reached. Submitting test.`);
                submitTest(true);
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
            e.returnValue = 'Are you sure you want to exit? Your progress may be lost.';
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
        await enterFullscreen();
        setTestStarted(true);
        // Save initial draft
        setTimeout(saveDraftToServer, 200);
    };

    // Deterministic question fetching
    const fetchQuestions = async () => {
        if (!userInfo?.username) return;
        try {
            setQuestionsLoading(true);
            const response = await fetch(`/api/questions?username=${encodeURIComponent(userInfo.username)}`);
            const data = await response.json();
            if (data.questions && data.questions.length > 0) {
                setQuestions(data.questions);
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setQuestionsLoading(false);
        }
    };

    // Instant LocalStorage save (0ms, 100% crash proof, zero server load)
    const saveToLocalStorage = useCallback((currentAnswers: Record<number, string>) => {
        if (typeof window === 'undefined' || !userInfo?.username) return;
        try {
            const draftObj = {
                username: userInfo.username,
                answers: currentAnswers,
                flaggedQuestions: Array.from(flaggedQuestions),
                currentQuestion,
                violations,
                testStarted,
                questionIds: questions.map(q => q._id || q.id),
                timestamp: Date.now()
            };
            localStorage.setItem(`test_draft_${userInfo.username}`, JSON.stringify(draftObj));
        } catch (err) {
            console.warn('LocalStorage save notice:', err);
        }
    }, [userInfo, flaggedQuestions, currentQuestion, violations, testStarted, questions]);

    // Save draft to server (lightweight, compact payload, with fallback)
    const saveDraftToServer = useCallback(async () => {
        if (!userInfo?.username || !testStarted || testCompleted) return;

        const duration = testMetadata?.schedule?.duration || 45 * 60;
        const timeSpent = Math.max(0, duration - timeLeft);
        const questionIds = questions.map(q => q._id || q.id);

        const draftData = {
            username: userInfo.username,
            answers,
            flaggedQuestions: Array.from(flaggedQuestions),
            currentQuestion,
            timeSpent,
            violations,
            testStarted,
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
            saveToLocalStorage(answers);
        }
    }, [userInfo, testStarted, testCompleted, testMetadata, timeLeft, questions, answers, flaggedQuestions, currentQuestion, violations, saveToLocalStorage]);

    // Debounced draft save to avoid hammering server on rapid question clicks
    const triggerDebouncedServerSave = useCallback(() => {
        if (saveDebounceTimer.current) {
            clearTimeout(saveDebounceTimer.current);
        }
        saveDebounceTimer.current = setTimeout(() => {
            saveDraftToServer();
        }, 3500); // Wait 3.5s after student stops clicking
    }, [saveDraftToServer]);

    // Controlled periodic background sync: every 45 seconds (drop load by 98%)
    useEffect(() => {
        if (!testStarted || testCompleted || !userInfo?.username) return;
        const syncInterval = setInterval(() => {
            saveDraftToServer();
        }, 45000); // 45s interval
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
                        if (parsed.answers) setAnswers(parsed.answers);
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
                    if (data.draft.answers) setAnswers(data.draft.answers);
                    if (data.draft.flaggedQuestions) setFlaggedQuestions(new Set(data.draft.flaggedQuestions));
                    if (data.draft.currentQuestion !== undefined) setCurrentQuestion(data.draft.currentQuestion);
                    if (data.draft.violations !== undefined) setViolations(data.draft.violations);
                    if (data.draft.testStarted !== undefined) setTestStarted(data.draft.testStarted);

                    if (data.draft.questions && data.draft.questions.length > 0) {
                        setQuestions(data.draft.questions);
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

    const handleLogin = async (credentials: { username: string; password: string; secretCode: string }) => {
        setUserInfo(credentials);
        setIsLoggedIn(true);

        const isCompleted = await checkTestStatus(credentials.username);
        if (isCompleted) return;

        setTimeout(async () => {
            await fetchTestMetadata();
            const questionsRestored = await loadDraft(credentials.username);
            if (!questionsRestored) {
                await fetchQuestions();
            }
        }, 100);
    };

    // User selects an option
    const handleAnswer = (questionIndex: number, answer: string) => {
        setAnswers(prev => {
            const updated = { ...prev, [questionIndex]: answer };
            saveToLocalStorage(updated);
            return updated;
        });
        triggerDebouncedServerSave();
    };

    // Toggle flag for review
    const toggleFlag = (questionIndex: number) => {
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

    // Test Submission with Retry & Safety Backup
    const submitTest = async (forceAutoSubmit = false) => {
        if (isSubmitting || testCompleted) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const duration = testMetadata?.schedule?.duration || 45 * 60;
            const timeSpent = Math.max(0, duration - timeLeft);
            const questionIds = questions.map(q => q._id || q.id);

            const testData = {
                username: userInfo?.username,
                answers,
                timeSpent,
                violations,
                totalQuestions: questions.length,
                questionIds,
                submittedAt: new Date().toISOString()
            };

            // Permanent LocalStorage backup in case of lab network failure
            if (typeof window !== 'undefined' && userInfo?.username) {
                try {
                    localStorage.setItem(`BACKUP_SUBMISSION_${userInfo.username}`, JSON.stringify(testData));
                } catch (e) {}
            }

            const response = await fetch('/api/submit-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testData)
            });

            const result = await response.json().catch(() => null);

            if (response.ok && (result?.success || result?.alreadySubmitted)) {
                if (userInfo?.username) {
                    await fetch('/api/clear-draft', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: userInfo.username })
                    }).catch(() => {});
                    localStorage.removeItem(`test_draft_${userInfo.username}`);
                }
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
            setSubmitError('Network failure during submission. Your answers are safe on this PC. Please click Retry.');
        } finally {
            setIsSubmitting(false);
        }
    };

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

    // Waiting for scheduled start time
    if (testStatus === 'waiting') {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold mb-6">{testMetadata?.title || 'Aptitude Test'}</h1>
                    <p className="text-gray-600 mb-4">Test will start automatically in:</p>
                    <div className="text-4xl font-bold text-blue-600 mb-4">
                        {formatTime(countdownTime)}
                    </div>
                    <p className="text-sm text-gray-500">Please stay on this page. When timer hits zero, you will be able to begin.</p>
                </div>
            </div>
        );
    }

    // Test period has ended
    if (testStatus === 'ended' && !testCompleted) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold mb-4 text-red-600">Test Period Concluded</h1>
                    <p className="text-gray-600">The scheduled time slot for this test has ended.</p>
                </div>
            </div>
        );
    }

    // Loading questions
    if (questionsLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <h1 className="text-xl font-semibold mb-4">Preparing Your Test Environment...</h1>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
            </div>
        );
    }

    // No questions loaded
    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <h1 className="text-xl font-bold mb-4">No Questions Available</h1>
                    <p className="text-gray-600 mb-6">Unable to load questions from server. Please verify your connection.</p>
                    <button
                        onClick={fetchQuestions}
                        className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
                    >
                        Retry Loading
                    </button>
                </div>
            </div>
        );
    }

    // Test successfully submitted
    if (testCompleted) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Test Submitted Successfully!</h1>
                    <p className="text-gray-600 mb-4">
                        Thank you, <span className="font-semibold text-gray-800">{userInfo?.username}</span>. Your responses have been securely recorded.
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded p-4 text-sm text-gray-600 mb-6 text-left">
                        <p>• Total Questions: {questions.length}</p>
                        <p>• Answered: {Object.keys(answers).length}</p>
                        <p>• Violations Recorded: {violations}</p>
                    </div>
                    <p className="text-xs text-gray-500 mb-6">
                        Results will be evaluated and published by the CSI team. You may now safely close this window.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
                    >
                        Return to CSI Home
                    </button>
                </div>
            </div>
        );
    }

    // Ready to start instructions screen
    if (!testStarted && testStatus === 'ready') {
        const durationMins = Math.floor((testMetadata?.schedule?.duration || 2700) / 60);
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
                    <h1 className="text-2xl font-bold text-center mb-6">{testMetadata?.title || 'CSI Technical Aptitude Assessment'}</h1>
                    <div className="space-y-3 text-sm text-gray-700 bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                        <p><strong>Candidate:</strong> {userInfo?.username}</p>
                        <p><strong>Duration:</strong> {durationMins} minutes</p>
                        <p><strong>Total Questions:</strong> {questions.length}</p>
                        <p><strong>Maximum Violations:</strong> {maxAllowedViolations}</p>
                    </div>
                    <div className="space-y-2 text-xs text-gray-600 mb-6 border-l-4 border-yellow-500 pl-3">
                        <p>⚠️ Fullscreen mode is strictly mandatory throughout the assessment.</p>
                        <p>⚠️ Switching tabs or minimizing the browser will be flagged as a security violation.</p>
                        <p>⚠️ Reaching {maxAllowedViolations} violations will trigger automatic submission.</p>
                        <p>⚠️ Ensure all answers are selected before final submission.</p>
                    </div>
                    <button
                        onClick={startTest}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                    >
                        Enter Fullscreen & Begin Assessment
                    </button>
                </div>
            </div>
        );
    }

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
                            Your answers are securely saved in this browser. Please click the button below to retry submission.
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
                    <div className="bg-white p-6 rounded-xl text-center max-w-md shadow-xl">
                        <h2 className="text-lg font-bold text-gray-900 mb-3">Confirm Submission</h2>
                        <p className="text-gray-600 text-sm mb-4">
                            You have answered <strong>{Object.keys(answers).length}</strong> out of <strong>{questions.length}</strong> questions.
                            Are you sure you want to finalize and submit your test?
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowSubmitConfirm(false)}
                                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-medium hover:bg-gray-300"
                            >
                                Continue Test
                            </button>
                            <button
                                onClick={() => { setShowSubmitConfirm(false); submitTest(false); }}
                                disabled={isSubmitting}
                                className="flex-1 bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Submitting...' : 'Yes, Submit'}
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
                        className="ml-3 bg-white text-red-600 text-xs px-2 py-1 rounded font-bold"
                    >
                        Re-enter
                    </button>
                </div>
            )}

            {/* Top Navigation Bar */}
            <div className="bg-white shadow-sm border-b px-6 py-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">{testMetadata?.title || 'Aptitude Test'}</h1>
                        <span className="text-xs text-gray-500">Student: <strong>{userInfo?.username}</strong></span>
                    </div>
                    <div className="flex items-center space-x-6">
                        <span className="text-sm text-gray-600">
                            Question {currentQuestion + 1} of {questions.length}
                        </span>
                        <span className="text-lg font-mono font-bold text-red-600">
                            {formatTime(timeLeft)}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                            violations >= maxAllowedViolations - 1 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-gray-100 text-gray-700'
                        }`}>
                            Violations: {violations}/{maxAllowedViolations}
                        </span>
                        {!isFullscreen && (
                            <button
                                onClick={enterFullscreen}
                                className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                                Fullscreen
                            </button>
                        )}
                        <button
                            onClick={() => setShowSubmitConfirm(true)}
                            disabled={isSubmitting}
                            className="text-xs bg-red-600 text-white px-3 py-1.5 rounded font-semibold hover:bg-red-700 disabled:opacity-50"
                        >
                            End Test
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="flex gap-6 p-6 max-w-7xl mx-auto">
                {/* Left Side: Question Navigator Grid */}
                <div className="w-80 bg-white rounded-lg shadow-sm border p-4 h-fit">
                    <h3 className="font-semibold text-sm mb-3 text-gray-800">Question Navigator</h3>
                    <div className="grid grid-cols-5 gap-2 mb-4 max-h-96 overflow-y-auto p-1">
                        {questions.map((_, index) => {
                            const status = getQuestionStatus(index);
                            const isCurrent = index === currentQuestion;
                            return (
                                <button
                                    key={index}
                                    onClick={() => goToQuestion(index)}
                                    className={`w-9 h-9 text-xs font-semibold rounded border transition-colors ${
                                        isCurrent
                                            ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
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
                            <span>Answered ({Object.keys(answers).length})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 bg-orange-50 border border-orange-500 rounded"></div>
                            <span>Flagged for Review ({flaggedQuestions.size})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 bg-gray-50 border border-gray-200 rounded"></div>
                            <span>Unanswered ({questions.length - Object.keys(answers).length})</span>
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
                            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-300 transition"
                        >
                            Previous
                        </button>

                        <div className="flex space-x-3">
                            {currentQuestion === questions.length - 1 ? (
                                <button
                                    onClick={() => setShowSubmitConfirm(true)}
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Test'}
                                </button>
                            ) : (
                                <button
                                    onClick={nextQuestion}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                                >
                                    Next
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