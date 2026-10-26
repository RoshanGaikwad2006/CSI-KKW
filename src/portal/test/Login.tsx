import React, { useState } from 'react';
import { authenticateUser } from '../../api/auth';

interface LoginProps {
    onLogin: (credentials: { username: string; password: string; secretCode: string; name?: string; year?: string; branch?: string }) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [secretCode, setSecretCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const cleanUser = username.trim();
        const cleanPass = password.trim();
        const cleanCode = secretCode.trim();

        if (!cleanUser || !cleanPass || !cleanCode) {
            setError('Please fill in all 3 credentials.');
            setLoading(false);
            return;
        }

        try {
            const result = await authenticateUser(cleanUser, cleanPass, cleanCode);
            if (result.success) {
                onLogin({
                    username: cleanUser,
                    password: cleanPass,
                    secretCode: cleanCode,
                    name: result.user?.name || cleanUser,
                    year: result.user?.year || '',
                    branch: result.user?.branch || ''
                });
            } else {
                setError(result.error || 'Authentication failed');
            }
        } catch (authErr: any) {
            setError(authErr.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-100">
                <div className="text-center mb-6">
                    <span className="text-xs uppercase tracking-wider font-extrabold px-3 py-1 bg-blue-100 text-blue-700 rounded-full inline-block mb-2">
                        Campus to Corporate (C2C) 2026
                    </span>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        Assessment Login
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Computer Society of India (CSI) • KKWIEER
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                            PRN / Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-mono"
                            placeholder="e.g. 23U01234 or test_final_2026"
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="Enter test password"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                            Lab Secret Code
                        </label>
                        <input
                            type="password"
                            value={secretCode}
                            onChange={(e) => setSecretCode(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-mono uppercase"
                            placeholder="Provided by lab coordinator"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl text-center font-medium">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                <span>Verifying Access...</span>
                            </>
                        ) : (
                            <span>Access Assessment</span>
                        )}
                    </button>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 text-center space-y-1">
                    <p className="font-medium text-slate-600">Lab Instructions:</p>
                    <p>• Do not open new tabs or minimize the browser window.</p>
                    <p>• In case of any technical issue, inform the lab invigilator.</p>
                </div>
            </div>
        </div>
    );
};