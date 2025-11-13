import { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function Bills() {
    const { theme } = useOutletContext();
    const [bills, setBills] = useState([]);
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);

    const categories = [
        {
            name: 'Electricity',
            color: 'bg-yellow-300',
            textColor: 'text-yellow-800',
        },
        { name: 'Gas', color: 'bg-red-300', textColor: 'text-red-800' },
        { name: 'Water', color: 'bg-blue-300', textColor: 'text-blue-800' },
        {
            name: 'Internet',
            color: 'bg-green-300',
            textColor: 'text-green-800',
        },
    ];

    useEffect(() => {
        setLoading(true);
        let url = 'https://a-10-bill-mate-server.vercel.app/api/bills';
        if (category) url += `?category=${category}`;

        axios
            .get(url)
            .then((res) => {
                const sortedBills = res.data.sort(
                    (a, b) => new Date(b.date) - new Date(a.date)
                );
                setBills(sortedBills);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [category]);

    // Loading
    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div
            className={`max-w-6xl mx-auto mt-10 px-4 transition-colors duration-500`}>
            <h2
                className={`text-3xl font-bold mb-6 text-center transition-colors duration-500 ${
                    theme === 'light' ? 'text-gray-900' : 'text-gray-100'
                }`}>
                All Billss
            </h2>

            {/* Category Filter */}
            <div className="mb-6 text-center">
                <select
                    className={`w-full max-w-xs border rounded-lg p-2 shadow-sm transition-colors duration-300 ${
                        theme === 'light'
                            ? 'border-gray-300 bg-sky-100 text-gray-800 focus:ring-blue-400'
                            : 'border-gray-600 bg-gray-700 text-gray-100 focus:ring-blue-500'
                    }`}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {bills.map((bill) => {
                    const cat = categories.find(
                        (c) => c.name === bill.category
                    );
                    const bgColor = cat ? cat.color : 'bg-gray-300';
                    const txtColor = cat ? cat.textColor : 'text-gray-800';

                    return (
                        <motion.div
                            key={bill._id}
                            whileHover={{ scale: 1.05 }}
                            className={`border rounded-lg shadow-xl p-4 flex flex-col transition duration-400 hover:shadow-2xl ${
                                theme === 'light'
                                    ? 'bg-sky-100 text-gray-900 border-blue-200'
                                    : 'bg-gray-700 text-gray-100 border-gray-600'
                            }`}>
                            <img
                                src={bill.image}
                                alt={bill.title}
                                className="w-full h-50 object-center rounded mb-3"
                            />
                            <h3
                                className={`font-bold text-lg mb-1 transition-colors duration-500`}>
                                {bill.title}
                            </h3>

                            <span
                                className={`inline-block px-2 py-1 rounded text-sm font-semibold my-2 max-w-fit ${bgColor} ${txtColor}`}>
                                {bill.category}
                            </span>

                            <p
                                className={`mb-1 transition-colors duration-500`}>
                                Location: {bill.location}
                            </p>
                            <p
                                className={`mb-3 transition-colors duration-500`}>
                                Amount: ৳{bill.amount}
                            </p>

                            <Link
                                to={`/bills/${bill._id}`}
                                className={`mt-auto px-3 py-2 rounded text-center transition-colors duration-300 ${
                                    theme === 'light'
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}>
                                See Details
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
