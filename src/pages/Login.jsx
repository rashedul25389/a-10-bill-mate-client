import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthProvider';
import { Toaster, toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const { signInUser, googleLogin } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleLogin = async (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        setError('');

        try {
            await signInUser(email, password);
            form.reset();
            toast.success('✅ Login successful!');
            setTimeout(() => {
                navigate(from, { replace: true });
            }, 1000); // 1 second delay, toast দেখানোর জন্য
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    };

    const handleGoogle = async () => {
        try {
            await googleLogin();
            toast.success('✅ Login successful with Google!');
            setTimeout(() => {
                navigate(from, { replace: true });
            }, 1000);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-200">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Login
                </h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                        required
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Enter your password"
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-600">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <div className="text-right">
                        <Link
                            to="/forget-password"
                            className="text-sm text-blue-600 hover:underline">
                            Forget Password?
                        </Link>
                    </div>

                    {error && (
                        <p className="text-red-600 bg-red-50 border border-red-200 rounded-md p-2 text-sm">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm">
                        Login
                    </button>
                </form>

                <div className="mt-5 text-center text-gray-700">
                    <p>
                        Don’t have an account?{' '}
                        <Link
                            to="/register"
                            className="text-blue-600 font-semibold hover:underline">
                            Register
                        </Link>
                    </p>
                </div>

                <div className="mt-5">
                    <button
                        onClick={handleGoogle}
                        className="w-full border border-gray-300 text-gray-900 font-medium py-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2">
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="google"
                            className="w-5 h-5"
                        />
                        Continue with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
