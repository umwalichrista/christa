import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Department from './pages/Department';
import Employee from './pages/Employee';
import Salary from './pages/Salary';
import Reports from './pages/Reports';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { checkAuth } from './services/api';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check authentication status on mount
        const verifyAuth = async () => {
            try {
                const response = await checkAuth();
                setIsAuthenticated(response.data.isAuthenticated);
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0095f6]"></div>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div className="min-h-screen bg-[#fafafa]">
                {isAuthenticated && <Sidebar setIsAuthenticated={setIsAuthenticated} />}

                {/* Main Content Area - Shifted right when sidebar is present */}
                <div className={`${isAuthenticated ? 'ml-64 p-8' : ''} min-h-screen transition-all duration-300`}>
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                isAuthenticated ?
                                    <Navigate to="/employees" replace /> :
                                    <Login setIsAuthenticated={setIsAuthenticated} />
                            }
                        />

                        <Route
                            path="/departments"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <Department />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/employees"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <Employee />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/salaries"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <Salary />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/reports"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <Reports />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/"
                            element={<Navigate to={isAuthenticated ? "/employees" : "/login"} replace />}
                        />

                        <Route
                            path="*"
                            element={<Navigate to={isAuthenticated ? "/employees" : "/login"} replace />}
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
