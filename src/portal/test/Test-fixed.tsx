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
    const [isBlurred, setIsBlurred] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState<{username: string; password: string; secretCode: string} | null>(null);
    const [questions, setQuestions] = useState<TestQuestion[]>([]);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [testMetadata, setTestMetadata] = useState<any>(null);
    const [countdownTime, setCountdownTime] = useState<number>(0);
    const [testStatus, setTestStatus] = useState<'loading' | 'waiting' | 'ready' | 'active' | 'ended'>('loading');

    const testRef = useRef<HTMLDivElement>(null);

    const fetchTestMetadata = async () => {
        try {
            const response = await fetch('/api/test-metadata');
            const data = await response.json();
            if (data.testId) {
                setTestMetadata(data);
                checkTestSchedule(data);
            }
        } catch (error) {
            console.error('Error fetching test metadata:', error);
            setTestStatus('ready'); // Fallback to ready if metadata fails
        }
    };

    const checkTestSchedule = (metadata: any) => {
        const now = new Date().getTime();
        const startTime = new Date(metadata.schedule.startTime.$date).getTime();
        const endTime = new Date(metadata.schedule.endTime.$date).getTime();
        
        if (now < startTime) {
            setTestStatus('waiting');
            setCountdownTime(Math.floor((startTime - now) / 1000));
        } else if (now >= startTime && now <= endTime) {
            setTestStatus('ready');
            setTimeLeft(metadata.schedule.duration);
        } else {
            setTestStatus('ended');
        }
    };

    // Countdown timer effect
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

    // Timer
    useEffect(() => {
        if (!testStarted || testCompleted) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    submitTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [testStarted, testCompleted]);

    const addViolation = useCallback(() => {
        // COMMENTED OUT FOR TESTING
    }, []);

    const enterFullscreen = async () => {
        try {
            await document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } catch (err) {
            console.error('Fullscreen failed:', err);
        }
    };

    const startTest = async () => {
        setTestStarted(true);
    };

    const fetchQuestions = async () => {
        try {
            setQuestionsLoading(true);
            const response = await fetch('/api/questions');
            const data = await response.json();
            if (data.questions) {
                setQuestions(data.questions);
            } else {
                console.error('No questions received from API');
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setQuestionsLoading(false);
        }
    };

    const handleLogin = (credentials: { username: string; password: string; secretCode: string }) => {
        setUserInfo(credentials);
        setIsLoggedIn(true);
        fetchTestMetadata();
        fetchQuestions();
    };

    const handleAnswer = (questionId: number, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

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
    };

    const goToQuestion = (questionIndex: number) => {
        setCurrentQuestion(questionIndex);
    };

    const getQuestionStatus = (questionIndex: number) => {
        if (answers[questionIndex]) return 'answered';
        if (flaggedQuestions.has(questionIndex)) return 'flagged';
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
        try {
            const timeSpent = (testMetadata?.schedule?.duration || 3600) - timeLeft;
            const testData = {
                username: userInfo?.username,
                answers,
                timeSpent,
                violations,
                totalQuestions: questions.length
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
            } else {
                console.error('Failed to save test results');
            }
        } catch (error) {
            console.error('Error submitting test:', error);
        }

        setTestCompleted(true);
        if (document.fullscreenElement) {
            document.exitFullscreen?.();
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

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

    if (testStatus === 'ended') {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold mb-6">Test Ended</h1>
                    <p className="text-gray-600">The test period has expired.</p>
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
                        <p className="text-gray-600">Thank you for taking the test, {userInfo?.username}.</p>
                    </div>
                    
                    <div className="mb-6">
                        <p className="text-sm text-gray-600 mb-3">Please rate your experience:</p>
                        <div className="flex justify-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    className="text-2xl text-yellow-400 hover:text-yellow-500 transition-colors"
                                    onClick={() => console.log(`Rated ${star} stars`)}
                                >
                                    ⭐
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <p className="text-sm text-gray-500">
                        Your responses have been recorded. You may now close this window.
                    </p>
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

    // MAIN TEST VIEW
    return (
        <div ref={testRef} className="min-h-screen bg-gray-100 select-none">
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
                        <span className="text-sm text-red-600">
                            Violations: {violations}/3
                        </span>
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
                                <>
                                    <button
                                        onClick={submitTest}
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Submit Test
                                    </button>
                                    {/* NEW: End Test Button on every question */}
                                    <button
                                        onClick={submitTest}
                                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        End Test Now
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={nextQuestion}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Next
                                    </button>
                                    <button
                                        onClick={submitTest}
                                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        End Test Now
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Test;
