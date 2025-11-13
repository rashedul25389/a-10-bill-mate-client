import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthProvider';
import { toast } from 'react-hot-toast';
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function AddBill() {
    const { user } = useContext(AuthContext);
    const { theme } = useOutletContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        amount: '',
        location: '',
        description: '',
        image: '',
        date: new Date().toISOString().split('T')[0],
        email: user?.email || '',
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
            await axios.post(
                'https://a-10-bill-mate-server.vercel.app/api/bills',
                formData
            );
            toast.success('✅ Bill added successfully!');
            navigate('/bills');
        } catch (error) {
            console.error(error);
            toast.error('Failed to add bill.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`relative max-w-2xl mx-auto mt-10 p-6 rounded-xl shadow-lg transition-colors duration-500
        ${
            theme === 'light'
                ? 'bg-sky-200 text-gray-900'
                : 'bg-gray-900 text-gray-100'
        }`}>
            {loading && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center rounded-xl z-50">
                    <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            )}

            <h2 className="text-2xl font-bold mb-6 text-center transition-colors duration-500">
                Add New Bill
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {[
                    { label: 'Title', name: 'title', type: 'text' },
                    { label: 'Amount (৳)', name: 'amount', type: 'number' },
                    { label: 'Location', name: 'location', type: 'text' },
                    { label: 'Image URL', name: 'image', type: 'url' },
                ].map((field) => (
                    <div key={field.name}>
                        <label
                            className={`block font-semibold mb-1 transition-colors duration-500
                        ${
                            theme === 'light'
                                ? 'text-gray-800'
                                : 'text-gray-200'
                        }`}>
                            {field.label}
                        </label>
                        <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            className={`w-full border rounded p-2 transition-colors duration-500
                        ${
                            theme === 'light'
                                ? 'bg-white text-gray-900 border-gray-300'
                                : 'bg-gray-700 text-gray-100 border-gray-600'
                        }`}
                            required={field.name !== 'image'}
                        />
                    </div>
                ))}

                <div>
                    <label
                        className={`block font-semibold mb-1 transition-colors duration-500
                    ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                        Date
                    </label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className={`w-full border rounded p-2 transition-colors duration-500
                    ${
                        theme === 'light'
                            ? 'bg-white text-gray-900 border-gray-300'
                            : 'bg-gray-700 text-gray-100 border-gray-600'
                    }`}
                        style={{
                            WebkitAppearance: 'textfield',
                            MozAppearance: 'textfield',
                        }}
                        required
                    />
                    <style jsx="true">{`
                        input[type='date']::-webkit-calendar-picker-indicator {
                            cursor: pointer;
                            filter: ${theme === 'light'
                                ? 'invert(0.3)'
                                : 'invert(0.8)'};
                        }
                    `}</style>
                </div>

                <div>
                    <label
                        className={`block font-semibold mb-1 transition-colors duration-500
                    ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                        Category
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full border rounded p-2 transition-colors duration-500
                    ${
                        theme === 'light'
                            ? 'bg-white text-gray-900 border-gray-300'
                            : 'bg-gray-700 text-gray-100 border-gray-600'
                    }`}
                        required>
                        <option value="">Select Category</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Gas">Gas</option>
                        <option value="Water">Water</option>
                        <option value="Internet">Internet</option>
                    </select>
                </div>

                <div>
                    <label
                        className={`block font-semibold mb-1 transition-colors duration-500
                    ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={`w-full border rounded p-2 transition-colors duration-500
                    ${
                        theme === 'light'
                            ? 'bg-white text-gray-900 border-gray-300'
                            : 'bg-gray-700 text-gray-100 border-gray-600'
                    }`}
                        required></textarea>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded transition-colors duration-500
                ${
                    theme === 'light'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}>
                    {loading ? 'Adding...' : 'Add Bill'}
                </button>
            </form>
        </div>
    );
}
