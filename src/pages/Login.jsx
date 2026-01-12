import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

function Login({ setIsAuthenticated }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login({ username, password });
            if (response.data.success) {
                setIsAuthenticated(true);
                navigate('/employees');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-[350px]">
                {/* Main Login Card */}
                <div className="bg-white border border-gray-300 rounded-sm py-10 px-10 mb-4">
                    <div className="text-center mb-8">
                        <h1 className="font-serif text-4xl mb-8 select-none" >
                            SmartPark
                        </h1>
                    </div>

                    {error && (
                        <div className="mb-4 text-center text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-2">
                        <div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-2 py-2 bg-gray-50 border border-gray-300 rounded-sm text-xs focus:outline-none focus:border-gray-400"
                                placeholder="Enter your username"
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-2 py-2 bg-gray-50 border border-gray-300 rounded-sm text-xs focus:outline-none focus:border-gray-400"
                                placeholder="Enter your password"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white text-sm font-semibold py-1.5 rounded-lg transition duration-200 mt-4 disabled:opacity-70"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>
                    </form>
                </div>

                {/* Sign Up Link Card */}
               
            </div>
        </div>
    );
}

export default Login;
