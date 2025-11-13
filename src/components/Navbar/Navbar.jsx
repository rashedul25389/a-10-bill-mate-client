import { NavLink, Link } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../../contexts/AuthProvider';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar({ toggleTheme, theme }) {
    const { user, logOut } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const tooltipRef = useRef();

    const handleLogout = () => {
        logOut().catch((err) => console.log(err));
        setTooltipOpen(false);
        setMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
                setTooltipOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const activeClass = 'underline underline-offset-4';

    return (
        <nav
            className={`sticky top-0 z-50 flex justify-between items-center px-4 py-3
        ${
            theme === 'light'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-900 text-white shadow-lg'
        }`}>
            {/* Logo */}
            <div className="text-2xl font-bold">
                <Link to="/">BILL MATE</Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4 relative">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `hover:underline transition ${
                            isActive ? activeClass : ''
                        }`
                    }>
                    Home
                </NavLink>
                <NavLink
                    to="/bills"
                    className={({ isActive }) =>
                        `hover:underline transition ${
                            isActive ? activeClass : ''
                        }`
                    }>
                    Bills
                </NavLink>
                {user && (
                    <NavLink
                        to="/add-bill"
                        className={({ isActive }) =>
                            `hover:underline transition ${
                                isActive ? activeClass : ''
                            }`
                        }>
                        Add Bill
                    </NavLink>
                )}
                {user && (
                    <NavLink
                        to="/mypaybills"
                        className={({ isActive }) =>
                            `hover:underline transition ${
                                isActive ? activeClass : ''
                            }`
                        }>
                        My Pay Bills
                    </NavLink>
                )}
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `hover:underline transition ${
                            isActive ? activeClass : ''
                        }`
                    }>
                    Profile
                </NavLink>
                <NavLink
                    to="/help"
                    className={({ isActive }) =>
                        `hover:underline transition ${
                            isActive ? activeClass : ''
                        }`
                    }>
                    Help
                </NavLink>

                {user && (
                    <div
                        className="relative flex items-center space-x-4"
                        ref={tooltipRef}>
                        <button
                            onClick={() => setTooltipOpen(!tooltipOpen)}
                            className="w-10 h-10 rounded-full border border-white overflow-hidden flex items-center justify-center focus:outline-none">
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <FaUserCircle className="w-full h-full text-white" />
                            )}
                        </button>

                        <button
                            onClick={handleLogout}
                            className="px-3 py-1 rounded bg-sky-400 hover:bg-red-600 text-white text-sm font-medium transition">
                            Logout
                        </button>

                        <div
                            className={`absolute right-0 mt-50 w-56 rounded-lg p-3 shadow-lg transform transition-all duration-300 origin-top-right ${
                                tooltipOpen
                                    ? 'opacity-100 scale-100'
                                    : 'opacity-0 scale-95 pointer-events-none'
                            } ${
                                theme === 'light'
                                    ? 'bg-sky-200 text-gray-900'
                                    : 'bg-gray-900 text-white'
                            }`}>
                            <p className="font-semibold mb-2 text-center">
                                {user.displayName}
                            </p>
                            <div className="flex justify-center mb-2">
                                <button
                                    onClick={toggleTheme}
                                    className={`px-3 py-1 rounded transition font-medium ${
                                        theme === 'light'
                                            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                            : 'bg-gray-700 text-white hover:bg-gray-600'
                                    }`}>
                                    {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
                                </button>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white font-medium transition">
                                Logout
                            </button>
                        </div>
                    </div>
                )}

                {!user && (
                    <>
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                `hover:underline transition ${
                                    isActive ? activeClass : ''
                                }`
                            }>
                            Login
                        </NavLink>
                        <NavLink
                            to="/register"
                            className={({ isActive }) =>
                                `hover:underline transition ${
                                    isActive ? activeClass : ''
                                }`
                            }>
                            Register
                        </NavLink>
                    </>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
                <button
                    onClick={toggleTheme}
                    className="px-2 py-1 rounded bg-white text-blue-600 hover:bg-gray-100 transition">
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
                <button onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
                    menuOpen
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setMenuOpen(false)}>
                <div
                    className={`absolute top-0 right-0 w-64 h-full ${
                        theme === 'light'
                            ? 'bg-white text-gray-900'
                            : 'bg-gray-800 text-white'
                    } p-6 flex flex-col space-y-4 transform transition-transform duration-300 ${
                        menuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                    onClick={(e) => e.stopPropagation()}>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `hover:underline transition ${
                                isActive ? activeClass : ''
                            }`
                        }
                        onClick={() => setMenuOpen(false)}>
                        Home
                    </NavLink>
                    <NavLink
                        to="/bills"
                        className={({ isActive }) =>
                            `hover:underline transition ${
                                isActive ? activeClass : ''
                            }`
                        }
                        onClick={() => setMenuOpen(false)}>
                        Bills
                    </NavLink>
                    {user && (
                        <NavLink
                            to="/add-bill"
                            className={({ isActive }) =>
                                `hover:underline transition ${
                                    isActive ? activeClass : ''
                                }`
                            }
                            onClick={() => setMenuOpen(false)}>
                            Add Bill
                        </NavLink>
                    )}
                    {user && (
                        <NavLink
                            to="/mypaybills"
                            className={({ isActive }) =>
                                `hover:underline transition ${
                                    isActive ? activeClass : ''
                                }`
                            }
                            onClick={() => setMenuOpen(false)}>
                            My Pay Bills
                        </NavLink>
                    )}
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `hover:underline transition ${
                                isActive ? activeClass : ''
                            }`
                        }
                        onClick={() => setMenuOpen(false)}>
                        Profile
                    </NavLink>
                    <NavLink
                        to="/help"
                        className={({ isActive }) =>
                            `hover:underline transition ${
                                isActive ? activeClass : ''
                            }`
                        }
                        onClick={() => setMenuOpen(false)}>
                        Help
                    </NavLink>

                    {user ? (
                        <div className="mt-4 flex flex-col space-y-2 items-center">
                            <div className="flex items-center space-x-2">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full"
                                    />
                                ) : (
                                    <FaUserCircle className="w-10 h-10" />
                                )}
                                <p>{user.displayName}</p>
                            </div>

                            <button
                                onClick={toggleTheme}
                                className="ml-2 px-3 py-1 rounded bg-white dark:bg-gray-700 text-blue-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white font-medium transition">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-2">
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    `hover:underline transition ${
                                        isActive ? activeClass : ''
                                    }`
                                }
                                onClick={() => setMenuOpen(false)}>
                                Login
                            </NavLink>
                            <NavLink
                                to="/register"
                                className={({ isActive }) =>
                                    `hover:underline transition ${
                                        isActive ? activeClass : ''
                                    }`
                                }
                                onClick={() => setMenuOpen(false)}>
                                Register
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
