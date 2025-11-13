import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthProvider';
import { Toaster, toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const { createUser, googleLogin, updateUserProfile } =
        useContext(AuthContext);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const photo = form.photo.value;
        const password = form.password.value;

        setError('');

        // Password validation
        if (password.length < 6) {
            return setError('Password must be at least 6 characters long!');
        }
        if (!/[A-Z]/.test(password)) {
            return setError(
                'Password must contain at least one uppercase letter!'
            );
        }
        if (!/[a-z]/.test(password)) {
            return setError(
                'Password must contain at least one lowercase letter!'
            );
        }

        try {
            await createUser(email, password);

            if (updateUserProfile) {
                await updateUserProfile({
                    displayName: name,
                    photoURL: photo,
                });
            }

            toast.success('✅ Account created successfully!');
            form.reset();

            setTimeout(() => {
                navigate('/');
            }, 1000); // 1 second delay for toast
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    };

    const handleGoogle = async () => {
        try {
            await googleLogin();
            toast.success('✅ Account created with Google!');
            setTimeout(() => {
                navigate('/');
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
                    Create an Account
                </h2>

                <form onSubmit={handleRegister} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                        required
                    />
                    <input
                        type="text"
                        name="photo"
                        placeholder="Photo URL"
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                    />

                    {/* Password Field with Eye Toggle */}
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
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

                    {error && (
                        <p className="text-red-600 bg-red-50 border border-red-200 rounded-md p-2 text-sm">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold shadow-sm">
                        Register
                    </button>
                </form>

                <div className="mt-5 text-center text-gray-700">
                    <p>
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-blue-600 font-semibold hover:underline">
                            Login
                        </Link>
                    </p>
                </div>

                <div className="mt-5">
                    <button
                        onClick={handleGoogle}
                        className="w-full border border-gray-300 py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-100 transition duration-200 font-medium text-gray-900">
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

export default Register;
