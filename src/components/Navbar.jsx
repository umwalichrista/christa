import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../services/api';

function Navbar({ setIsAuthenticated }) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            setIsAuthenticated(false);
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const navItems = [
        { path: '/employees', label: 'Employee', icon: '👥' },
        { path: '/departments', label: 'Department', icon: '🏢' },
        { path: '/salaries', label: 'Salary', icon: '💰' },
        { path: '/reports', label: 'Reports', icon: '📊' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="w-10 h-10 bg-primary-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">
                                SP
                            </div>
                            <span className="ml-3 text-xl font-bold text-gray-900 hidden sm:block">
                                SmartPark EPMS
                            </span>
                        </div>

                        <div className="hidden md:ml-10 md:flex md:space-x-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive(item.path)
                                            ? 'bg-primary-100 text-primary-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="mr-1">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center">
                        <button
                            onClick={handleLogout}
                            className="btn-danger flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className="md:hidden pb-4">
                    <div className="flex flex-wrap gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${isActive(item.path)
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="mr-1">{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
