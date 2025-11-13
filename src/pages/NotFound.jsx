import { useOutletContext, Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
    const outletContext = useOutletContext();
    const theme = outletContext?.theme || 'light';

    return (
        <div
            className={`flex flex-col items-center justify-center min-h-screen px-4 transition-colors duration-500 ${
                theme === 'light'
                    ? 'bg-gray-50 text-gray-900'
                    : 'bg-gray-800 text-gray-100'
            }`}>
            <FaExclamationTriangle
                className={`text-7xl mb-4 animate-bounce ${
                    theme === 'light' ? 'text-yellow-500' : 'text-yellow-400'
                }`}
            />
            <h1 className="text-6xl font-extrabold mb-4 animate-pulse">404</h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-center">
                Oops! Page Not Found
            </h2>
            <p className="mb-6 text-center max-w-md">
                The page you are looking for does not exist or has been moved.
            </p>

            <img
                src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
                alt="Not found illustration"
                className="w-50 mb-6 transition-transform duration-500 hover:scale-105"
            />

            <Link
                to="/"
                className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-500 ${
                    theme === 'light'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}>
                Go to Home
            </Link>
        </div>
    );
}
