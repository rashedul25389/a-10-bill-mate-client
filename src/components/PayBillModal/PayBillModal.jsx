import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthProvider';
import { toast } from 'react-hot-toast';

export default function PayBillModal({ bill, onClose, theme }) {
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: user?.email || '',
        billId: bill?._id || '',
        amount: bill?.amount || 0,
        username: user?.displayName || '',
        address: '',
        phone: '',
        date: new Date().toISOString().split('T')[0],
        additionalInfo: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...formData };
            await axios.post(
                'https://a-10-bill-mate-server.vercel.app/api/myBills',
                payload
            );
            toast.success('✅ Bill paid successfully!');
            setTimeout(() => onClose(), 1200);
        } catch (err) {
            console.error(err);
            toast.error('❌ Payment failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    // Theme based dynamic colors
    const isLight = theme === 'light';
    const bgColor = isLight ? 'bg-white' : 'bg-gray-900';
    const textColor = isLight ? 'text-gray-900' : 'text-gray-100';
    const inputBg = isLight ? 'bg-gray-50' : 'bg-gray-800';
    const borderColor = isLight ? 'border-gray-300' : 'border-gray-700';
    const labelColor = isLight ? 'text-gray-700' : 'text-gray-200';

    return (
        <div
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}>
            <div
                className={`relative w-full max-w-md rounded-2xl shadow-2xl border ${borderColor} overflow-y-auto my-8 ${bgColor}`}
                style={{ maxHeight: '90vh' }}
                onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <div className="absolute top-3 right-3">
                    <button
                        onClick={onClose}
                        className="text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 text-2xl font-bold transition">
                        ❌
                    </button>
                </div>

                <div className={`p-6 rounded-2xl ${bgColor}`}>
                    <h2
                        className={`text-2xl font-bold mb-6 text-center ${textColor}`}>
                        Pay Bill — {bill?.title}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {[
                            { label: 'Email', name: 'email' },
                            { label: 'Bill ID', name: 'billId' },
                            { label: 'Amount (৳)', name: 'amount' },
                            { label: 'Date', name: 'date' },
                        ].map((item) => (
                            <div key={item.name}>
                                <label
                                    className={`block font-semibold mb-1 ${labelColor}`}>
                                    {item.label}
                                </label>
                                <input
                                    type="text"
                                    name={item.name}
                                    value={formData[item.name]}
                                    readOnly
                                    className={`w-full border ${borderColor} rounded-lg p-2 ${inputBg} ${textColor} cursor-not-allowed`}
                                />
                            </div>
                        ))}

                        {[
                            {
                                label: 'Username',
                                name: 'username',
                                type: 'text',
                            },
                            { label: 'Address', name: 'address', type: 'text' },
                            { label: 'Phone', name: 'phone', type: 'text' },
                        ].map((item) => (
                            <div key={item.name}>
                                <label
                                    className={`block font-semibold mb-1 ${labelColor}`}>
                                    {item.label}
                                </label>
                                <input
                                    type={item.type}
                                    name={item.name}
                                    value={formData[item.name]}
                                    onChange={handleChange}
                                    required
                                    className={`w-full border ${borderColor} rounded-lg p-2 ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition`}
                                />
                            </div>
                        ))}

                        <div>
                            <label
                                className={`block font-semibold mb-1 ${labelColor}`}>
                                Additional Info
                            </label>
                            <textarea
                                name="additionalInfo"
                                value={formData.additionalInfo}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Add any note or reference..."
                                className={`w-full border ${borderColor} rounded-lg p-2 ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition`}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 rounded-lg text-white font-semibold transition flex justify-center items-center gap-2 ${
                                loading
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                            }`}>
                            {loading && (
                                <svg
                                    className="w-5 h-5 animate-spin text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                            )}
                            {loading ? 'Processing...' : 'Confirm Payment'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
