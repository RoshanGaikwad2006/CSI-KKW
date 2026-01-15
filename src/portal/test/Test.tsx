import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TestQuestion } from './types';
import { QuestionCard } from './QuestionCard';
import { Login } from './Login';

const Test = (): JSX.Element => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
    const [timeLeft, setTimeLeft] = useState(3600);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [violations, setViolations] = useState(0);
    const [testStarted, setTestStarted] = useState(false);
    const [testCompleted, setTestCompleted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
    const [offlineQueue, setOfflineQueue] = useState<any[]>([]);

    const testRef = useRef<HTMLDivElement>(null);

    const fetchTestMetadata = async () => {
        console.log('🔍 Fetching test metadata...');
        try {
            const response = await fetch(`/api/test-metadata?username=${userInfo?.username}`);
            console.log('📡 Metadata response status:', response.status);
            
            const data = await response.json();
            console.log('📋 Raw metadata received:', JSON.stringify(data, null, 2));
            
            if (data.testCompleted) {
                setTestCompleted(true);
                setTestStatus('ended');
                return;
            }
            
            setTestMetadata(data);
            console.log('✅ Metadata set, calling checkTestSchedule...');
            checkTestSchedule(data);
               
        } catch (error) {
            console.error('💥 Error fetching test metadata:', error);
            setTestStatus('ready'); // Fallback to ready if metadata fails
        }
    };

    const checkTestSchedule = (metadata: any) => {
        console.log('⏰ Checking test schedule...');
        
        const now = new Date();
        console.log('🕐 Current time:', now.toISOString());
        console.log('🕐 Current timestamp:', now.getTime());
        
        console.log('📅 Schedule data:', metadata.schedule);
        console.log('🚀 Start time raw:', metadata.schedule.startTime);
        console.log('🏁 End time raw:', metadata.schedule.endTime);
        
        // Handle different date formats - keep as UTC
        let startTime, endTime;
        
        if (metadata.schedule.startTime.$date) {
            startTime = new Date(metadata.schedule.startTime.$date);
            endTime = new Date(metadata.schedule.endTime.$date);
        } else {
            startTime = new Date(metadata.schedule.startTime);
            endTime = new Date(metadata.schedule.endTime);
        }
        
        console.log('🚀 Parsed start time:', startTime.toISOString());
        console.log('🏁 Parsed end time:', endTime.toISOString());
        console.log('🚀 Start timestamp:', startTime.getTime());
        console.log('🏁 End timestamp:', endTime.getTime());
        
        const nowTime = now.getTime();
        const startTimeMs = startTime.getTime();
        const endTimeMs = endTime.getTime();
        
        console.log('⏱️ Time comparison:');
        console.log('   Now:', nowTime);
        console.log('   Start:', startTimeMs);
        console.log('   End:', endTimeMs);
        console.log('   Now < Start:', nowTime < startTimeMs);
        console.log('   Now >= Start && Now <= End:', nowTime >= startTimeMs && nowTime <= endTimeMs);
        console.log('   Now > End:', nowTime > endTimeMs);
        
        if (nowTime < startTimeMs) {
            const countdown = Math.floor((startTimeMs - nowTime) / 1000);
            console.log('⏳ Test is waiting. Countdown:', countdown, 'seconds');
            setTestStatus('waiting');
            setCountdownTime(countdown);
        } else if (nowTime >= startTimeMs && nowTime <= endTimeMs) {
            console.log('✅ Test is ready to start');
            setTestStatus('ready');
            // Give 45 minutes from login, but cap at schedule end time
            const fortyFiveMinutes = 45 * 60; // 45 minutes in seconds
            const remainingScheduleTime = Math.floor((endTimeMs - nowTime) / 1000);
            const timeAllowed = Math.min(fortyFiveMinutes, remainingScheduleTime);
            setTimeLeft(timeAllowed);
            console.log(`Time allowed: ${timeAllowed}s (45min: ${fortyFiveMinutes}s, remaining: ${remainingScheduleTime}s)`);
        } else {
            console.log('❌ Test period has ended');
            setTestStatus('ended');
        }
        
        console.log('🎯 Final test status:', testStatus);
    };

    // Countdown timer effect
    useEffect(() => {
        if (testStatus === 'waiting' && countdownTime > 0) {
            console.log('⏰ Starting countdown timer. Time left:', countdownTime);
            const timer = setInterval(() => {
                setCountdownTime(prev => {
                    if (prev <= 1) {
                        console.log('🎉 Countdown finished! Setting status to ready');
                        setTestStatus('ready');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [testStatus, countdownTime]);

    // Timer - counts down allocated time (30 min or remaining schedule time)
    useEffect(() => {
        if (!testStarted || testCompleted) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Auto-submit with current data when time runs out
                    const initialTime = 45 * 60;
                    const timeSpent = initialTime - 1; // Almost full time used
                    const actualQuestionCount = testMetadata?.config?.totalQuestions || questions.length;
                    const presentedQuestions = questions.slice(0, actualQuestionCount);
                    
                    const testData = {
                        username: userInfo?.username,
                        answers,
                        timeSpent,
                        violations,
                        totalQuestions: presentedQuestions.length,
                        questions: presentedQuestions
                    };

                    // Submit immediately on timeout
                    (async () => {
                        try {
                            setIsSubmitting(true);
                            const response = await fetch('/api/submit-test', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(testData)
                            });
                            
                            if (response.ok && userInfo?.username) {
                                await fetch('/api/clear-draft', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ username: userInfo.username })
                                });
                            }
                        } catch (error) {
                            console.error('Timeout submission error:', error);
                        } finally {
                            setTestCompleted(true);
                            setIsSubmitting(false);
                            if (document.fullscreenElement) {
                                document.exitFullscreen?.();
                            }
                        }
                    })();
                    
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [testStarted, testCompleted, answers, questions, testMetadata, userInfo, violations]);

    const addViolation = useCallback(() => {
        setViolations(prev => {
            const newCount = prev + 1;
            setShowViolationMessage(true);
            setTimeout(() => setShowViolationMessage(false), 3000);
            
            if (newCount >= 3) {
                console.log('🚨 3 violations reached! Submitting test immediately...');
                console.log('Test data:', { username: userInfo?.username, violations: newCount, answers: Object.keys(answers).length });
                
                // Immediate submission without async complications
                const initialTime = 45 * 60; // 45 minutes in seconds
                const timeSpent = initialTime - timeLeft;
                const actualQuestionCount = testMetadata?.config?.totalQuestions || questions.length;
                const presentedQuestions = questions.slice(0, actualQuestionCount);
                const testData = {
                    username: userInfo?.username,
                    answers,
                    timeSpent,
                    violations: newCount,
                    totalQuestions: presentedQuestions.length,
                    questions: presentedQuestions
                };

                // Use async/await for clearer flow
                (async () => {
                    try {
                        if (isSubmitting) return; // Prevent double submission
                        setIsSubmitting(true);
                        
                        console.log('📤 Sending submission request...');
                        const response = await fetch('/api/submit-test', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(testData)
                        });
                        
                        console.log('📡 Response status:', response.status);
                        if (response.ok) {
                            console.log('✅ Test submitted successfully due to violations');
                            // Clear draft after successful submission
                            if (userInfo?.username) {
                                await fetch('/api/clear-draft', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ username: userInfo.username })
                                });
                            }
                        } else {
                            console.error('❌ Submission failed:', response.statusText);
                        }
                    } catch (error) {
                        console.error('💥 Submission error:', error);
                    } finally {
                        console.log('🏁 Setting test as completed');
                        setTestCompleted(true);
                        setIsSubmitting(false);
                        if (document.fullscreenElement) {
                            document.exitFullscreen?.();
                        }
                    }
                })();
            }
            
            return newCount;
        });
    }, [testMetadata, timeLeft, userInfo, answers, questions.length]);



    const enterFullscreen = async () => {
        try {
            await document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } catch (err) {
            console.error('Fullscreen failed:', err);
        }
    };

    // Anti-cheating measures
    useEffect(() => {
        if (!testStarted) return;

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
            // Disable copy/paste (but don't count as violations)
            if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
                e.preventDefault();
                return;
            }
            
            // Disable F12, Ctrl+Shift+I, Ctrl+U, Alt+Tab
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.key === 'u') ||
                (e.altKey && e.key === 'Tab') ||
                e.key === 'Alt') {
                e.preventDefault();
                addViolation();
            }
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        const handleBlur = () => {
            addViolation();
            setIsBlurred(true);
        };

        const handleFocus = () => {
            setIsBlurred(false);
        };

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = 'Are you sure you want to leave? Your test progress will be lost.';
            return 'Are you sure you want to leave? Your test progress will be lost.';
        };

        // Add event listeners
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [testStarted, addViolation]);

    const startTest = async () => {
        console.log('🚀 Starting test...');
        await enterFullscreen();
        setTestStarted(true);
        // Save draft when test starts
        setTimeout(saveDraft, 100);
    };

    const fetchQuestions = async () => {
        console.log('📝 Fetching questions...');
        try {
            setQuestionsLoading(true);
            const response = await fetch('/api/questions');
            const data = await response.json();
            if (data.questions) {
                console.log('✅ Questions loaded:', data.questions.length);
                setQuestions(data.questions);
                // Save draft immediately after questions are loaded
                setTimeout(saveDraft, 100);
            } else {
                console.error('❌ No questions received from API');
            }
        } catch (error) {
            console.error('💥 Error fetching questions:', error);
        } finally {
            setQuestionsLoading(false);
        }
    };

    const processOfflineQueue = async () => {
        if (offlineQueue.length === 0) return;
        
        console.log(`📤 Processing ${offlineQueue.length} queued requests`);
        const successful = [];
        
        for (const request of offlineQueue) {
            try {
                await fetch(request.url, request.options);
                successful.push(request);
                console.log('✅ Synced queued request');
            } catch (error) {
                console.error('❌ Failed to sync request:', error);
            }
        }
        
        // Remove successful requests from queue
        setOfflineQueue(prev => prev.filter(item => !successful.includes(item)));
        
        if (typeof window !== 'undefined') {
            localStorage.removeItem('offlineQueue');
        }
    };

    const saveDraft = async () => {
        if (!userInfo?.username) return;
        
        const initialTime = 45 * 60; // 45 minutes in seconds
        const timeSpent = initialTime - timeLeft;
        const draftData = {
            username: userInfo.username,
            answers,
            flaggedQuestions: Array.from(flaggedQuestions),
            currentQuestion,
            timeSpent,
            violations,
            testStarted,
            questions
        };
        
        const requestData = {
            url: '/api/save-draft',
            options: {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(draftData)
            }
        };
        
        try {
            if (!isOnline) throw new Error('Offline');
            await fetch(requestData.url, requestData.options);
            console.log('✅ Draft saved to server');
        } catch (error) {
            console.log('💾 Saving draft locally (offline)');
            setOfflineQueue(prev => {
                const updated = prev.filter(item => item.type !== 'draft');
                return [...updated, { ...requestData, type: 'draft', timestamp: Date.now() }];
            });
            if (typeof window !== 'undefined') {
                localStorage.setItem('testDraft', JSON.stringify(draftData));
                localStorage.setItem('offlineQueue', JSON.stringify(offlineQueue));
            }
        }
    };

    const loadDraft = async (username: string) => {
        try {
            const response = await fetch(`/api/load-draft?username=${username}`);
            if (response.ok) {
                const data = await response.json();
                if (data.draft) {
                    setAnswers(data.draft.answers || {});
                    setFlaggedQuestions(new Set(data.draft.flaggedQuestions || []));
                    setCurrentQuestion(data.draft.currentQuestion || 0);
                    // Calculate timeLeft from timeSpent
                    const initialTime = 45 * 60; // 45 minutes in seconds
                    const timeSpent = data.draft.timeSpent || 0;
                    const remainingTime = Math.max(0, initialTime - timeSpent);
                    setTimeLeft(remainingTime);
                    setViolations(data.draft.violations || 0);
                    setTestStarted(data.draft.testStarted || false);
                    if (data.draft.questions && data.draft.questions.length > 0) {
                        setQuestions(data.draft.questions);
                        console.log('✅ Draft restored with saved questions:', data.draft.questions.length);
                        return true; // Indicate questions were restored
                    } else {
                        console.log('✅ Draft restored without questions');
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load draft:', error);
        }
        return false; // Indicate no questions were restored
    };

    const checkTestStatus = async (username: string) => {
        try {
            const response = await fetch(`/api/check-test-status?username=${username}`);
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
        console.log('👤 User logged in:', credentials.username);
        setUserInfo(credentials);
        setIsLoggedIn(true);
        
        // Restore offline data
        if (typeof window !== 'undefined') {
            const offlineDraft = localStorage.getItem('testDraft');
            const savedQueue = localStorage.getItem('offlineQueue');
            
            if (offlineDraft) {
                try {
                    const draftData = JSON.parse(offlineDraft);
                    if (draftData.username === credentials.username) {
                        console.log('📱 Restoring offline progress');
                        setAnswers(draftData.answers || {});
                        setFlaggedQuestions(new Set(draftData.flaggedQuestions || []));
                        setCurrentQuestion(draftData.currentQuestion || 0);
                        const initialTime = 45 * 60;
                        const timeSpent = draftData.timeSpent || 0;
                        const remainingTime = Math.max(0, initialTime - timeSpent);
                        setTimeLeft(remainingTime);
                        setViolations(draftData.violations || 0);
                        setTestStarted(draftData.testStarted || false);
                        if (draftData.questions) setQuestions(draftData.questions);
                    }
                } catch (error) {
                    console.error('Failed to restore offline draft:', error);
                }
            }
            
            if (savedQueue) {
                try {
                    const queueData = JSON.parse(savedQueue);
                    setOfflineQueue(queueData);
                } catch (error) {
                    console.error('Failed to restore offline queue:', error);
                }
            }
        }
        
        // Check if test is already completed
        const isCompleted = await checkTestStatus(credentials.username);
        if (isCompleted) return;
        
        // Load other data
        setTimeout(async () => {
            fetchTestMetadata();
            const questionsRestored = await loadDraft(credentials.username);
            // Only fetch new questions if no questions were restored from draft
            if (!questionsRestored) {
                fetchQuestions();
            }
        }, 100);
    };

    const handleAnswer = (questionId: number, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
        // Auto-save draft on answer change
        setTimeout(saveDraft, 100);
    };

    // Network connectivity monitoring
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const checkConnectivity = async () => {
            try {
                const response = await fetch('/api/ping', { 
                    method: 'GET',
                    cache: 'no-cache',
                    signal: AbortSignal.timeout(5000)
                });
                const wasOffline = !isOnline;
                setIsOnline(response.ok);
                if (wasOffline && response.ok) {
                    console.log('🌐 Connection restored, processing offline queue');
                    processOfflineQueue();
                }
            } catch (error) {
                console.log('🔌 Connection lost');
                setIsOnline(false);
            }
        };

        const handleOnline = () => {
            console.log('🌐 Browser detected online');
            checkConnectivity();
        };
        
        const handleOffline = () => {
            console.log('🔌 Browser detected offline');
            setIsOnline(false);
        };

        // Initial check
        checkConnectivity();
        
        // Periodic connectivity check every 10 seconds
        const interval = setInterval(checkConnectivity, 10000);
        
        // Browser events as backup
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            clearInterval(interval);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [isOnline]);

    // Auto-save draft every 10 seconds
    useEffect(() => {
        if (!userInfo?.username) return;
        const interval = setInterval(saveDraft, 10000);
        return () => clearInterval(interval);
    }, [userInfo, answers, flaggedQuestions, currentQuestion, timeLeft, violations, testStarted, questions]);

    // Save draft when timeLeft changes (every second during test)
    useEffect(() => {
        if (testStarted && userInfo?.username) {
            saveDraft();
        }
    }, [timeLeft]);

    const toggleFlag = (questionId: number) => {
        setFlaggedQuestions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(questionId)) {
                newSet.delete(questionId);
            } else {
                newSet.add(questionId);
            }
            return newSet;
        });
        // Auto-save draft on flag change
        setTimeout(saveDraft, 100);
    };

    const goToQuestion = (questionIndex: number) => {
        setCurrentQuestion(questionIndex);
    };

    const getQuestionStatus = (questionIndex: number) => {
        if (flaggedQuestions.has(questionIndex)) return 'flagged';
        if (answers[questionIndex]) return 'answered';
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

    const submitTest = async () => {
        if (isSubmitting || testCompleted) {
            console.log('Submission blocked - already submitting or completed');
            return;
        }
        
        console.log('Starting test submission...');
        setIsSubmitting(true);
        try {
            const initialTime = 45 * 60; // 45 minutes in seconds
            const timeSpent = initialTime - timeLeft;
            const actualQuestionCount = testMetadata?.config?.totalQuestions || questions.length;
            const presentedQuestions = questions.slice(0, actualQuestionCount);
            const testData = {
                username: userInfo?.username,
                answers,
                timeSpent,
                violations,
                totalQuestions: presentedQuestions.length,
                questions: presentedQuestions
            };

            const response = await fetch('/api/submit-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData)
            });

            if (response.ok) {
                console.log('Test results saved successfully');
                // Clear draft after successful submission
                if (userInfo?.username) {
                    await fetch('/api/clear-draft', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: userInfo.username })
                    });
                }
            } else {
                console.error('Failed to save test results');
            }
        } catch (error) {
            console.error('Error submitting test:', error);
        } finally {
            setTestCompleted(true);
            setIsSubmitting(false);
            if (document.fullscreenElement) {
                document.exitFullscreen?.();
            }
        }
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    };



    // console.log('🎯 Current render state:', { testStatus, isLoggedIn, questionsLoading, questionsCount: questions.length });

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    if (testStatus === 'waiting') {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold mb-6">{testMetadata?.title || 'Aptitude Test'}</h1>
                    <p className="text-gray-600 mb-4">Test will start in:</p>
                    <div className="text-4xl font-bold text-blue-600 mb-4">
                        {formatTime(countdownTime)}
                    </div>
                    <p className="text-sm text-gray-500">Please wait for the test to begin</p>
                </div>
            </div>
        );
    }

    if (testStatus === 'ended' && !testCompleted) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold mb-6">Test Period Ended</h1>
                    <p className="text-gray-600">The test period has expired. You can no longer take this test.</p>
                </div>
            </div>
        );
    }

    if (questionsLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold mb-6">Loading Questions...</h1>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold mb-6">No Questions Available</h1>
                    <p className="text-gray-600 mb-4">Unable to load questions from the database.</p>
                    <button
                        onClick={fetchQuestions}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (testCompleted) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Test Completed!</h1>
                        <p className="text-gray-600">You have submitted this test, {userInfo?.username}.</p>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-4">
                        You cannot retake the test. Your submission has been recorded.
                    </p>
                    
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    if (!testStarted && testStatus === 'ready') {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                    <h1 className="text-2xl font-bold text-center mb-6">{testMetadata?.title || 'Aptitude Test'}</h1>
                    <div className="space-y-4 text-sm text-gray-600">
                        <p>• Test duration: {Math.floor((testMetadata?.schedule?.duration || 3600) / 60)} minutes</p>
                        <p>• Total questions: {questions.length}</p>
                        <p>• No tab switching allowed</p>
                        <p>• Fullscreen mode required</p>
                        <p>• Copy/paste disabled</p>
                        <p>• Maximum 3 violations allowed</p>
                    </div>
                    <button
                        onClick={startTest}
                        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Start Test
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div ref={testRef} className="min-h-screen bg-gray-100 select-none">
            
            {/* Violation Warning Overlay */}
            {showViolationMessage && (
                <div className="fixed inset-0 bg-red-600 bg-opacity-90 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg text-center max-w-md">
                        <div className="text-red-600 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-red-600 mb-4">VIOLATION DETECTED</h2>
                        <p className="text-gray-700 mb-4">
                            You switched away from the test window. This has been recorded as a violation.
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                            Violations: {violations}/3
                        </p>
                        <p className="text-sm text-red-600">
                            Click anywhere to return to the test
                        </p>
                    </div>
                </div>
            )}
            
            {/* Connection Status */}
            {!isOnline && (
                <div className="fixed top-0 left-0 right-0 bg-orange-600 text-white text-center py-2 z-50 animate-pulse">
                    <span className="font-semibold">🔌 OFFLINE - Progress saved locally ({offlineQueue.length} pending)</span>
                </div>
            )}
            
            {/* Fullscreen Warning */}
            {!isFullscreen && testStarted && (
                <div className={`fixed left-0 right-0 bg-red-600 text-white text-center py-2 z-40 ${!isOnline ? 'top-10' : 'top-0'}`}>
                    <span className="font-semibold">⚠️ FULLSCREEN REQUIRED - Press F11 or click the fullscreen button</span>
                </div>
            )}
            <div className="bg-white shadow-sm border-b px-6 py-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-semibold">{testMetadata?.title || 'Aptitude Test'}</h1>
                        <span className="text-sm text-gray-500">Welcome, {userInfo?.username}</span>
                    </div>
                    <div className="flex items-center space-x-6">
                        <span className="text-sm text-gray-600">
                            Question {currentQuestion + 1} of {questions.length}
                        </span>
                        <span className="text-lg font-mono text-red-600">
                            {formatTime(timeLeft)}
                        </span>
                        <span className={`text-sm font-semibold ${
                            violations >= 2 ? 'text-red-600 animate-pulse' : 'text-red-600'
                        }`}>
                            Violations: {violations}/3
                        </span>
                        {!isFullscreen && (
                            <button
                                onClick={enterFullscreen}
                                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                                Enter Fullscreen
                            </button>
                        )}
                        <button
                            onClick={submitTest}
                            disabled={isSubmitting}
                            className="text-sm bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Ending...' : 'End Test'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex gap-6 p-6">
                <div className="w-80 bg-white rounded-lg shadow-md p-4">
                    <h3 className="font-semibold mb-4">Question Navigator</h3>
                    <div className="grid grid-cols-5 gap-2 mb-4">
                        {questions.map((_, index) => {
                            const status = getQuestionStatus(index);
                            const isCurrent = index === currentQuestion;
                            return (
                                <button
                                    key={index}
                                    onClick={() => goToQuestion(index)}
                                    className={`w-10 h-10 text-sm font-medium rounded border-2 transition-colors ${
                                        isCurrent
                                            ? 'border-blue-500 bg-blue-500 text-white'
                                            : status === 'answered'
                                            ? 'border-green-500 bg-green-100 text-green-700 hover:bg-green-200'
                                            : status === 'flagged'
                                            ? 'border-orange-500 bg-orange-100 text-orange-700 hover:bg-orange-200'
                                            : 'border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-100 border border-green-500 rounded"></div>
                            <span>Answered ({Object.keys(answers).length})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-orange-100 border border-orange-500 rounded"></div>
                            <span>Flagged ({flaggedQuestions.size})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-50 border border-gray-300 rounded"></div>
                            <span>Unanswered ({questions.length - Object.keys(answers).length})</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    <QuestionCard
                        question={questions[currentQuestion]}
                        selectedAnswer={answers[currentQuestion]}
                        onAnswer={(answer) => handleAnswer(currentQuestion, answer)}
                        isFlagged={flaggedQuestions.has(currentQuestion)}
                        onToggleFlag={() => toggleFlag(currentQuestion)}
                    />

                    <div className="flex justify-between mt-8">
                        <button
                            onClick={prevQuestion}
                            disabled={currentQuestion === 0}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
                        >
                            Previous
                        </button>

                        <div className="flex space-x-4">
                            {currentQuestion === questions.length - 1 ? (
                                <button
                                    onClick={submitTest}
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Test'}
                                </button>
                            ) : (
                                <button
                                    onClick={nextQuestion}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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