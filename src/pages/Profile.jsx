import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthProvider';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';

export default function Profile() {
    const { user } = useContext(AuthContext);
    const { theme } = useOutletContext();
    const [myBills, setMyBills] = useState([]);

    useEffect(() => {
        if (user?.email) {
            axios
                .get(
                    `https://a-10-bill-mate-server.vercel.app/api/myBills?email=${user.email}`
                )
                .then((res) =>
                    setMyBills(
                        res.data.sort(
                            (a, b) => new Date(b.date) - new Date(a.date)
                        )
                    )
                )
                .catch((err) => console.error(err));
        }
    }, [user]);

    const totalPaid = myBills.reduce(
        (sum, bill) => sum + Number(bill.amount || 0),
        0
    );

    // Theme color
    const bgColor = theme === 'light' ? 'bg-sky-100' : 'bg-gray-900';
    const cardBg = theme === 'light' ? 'bg-white' : 'bg-gray-800';
    const textColor = theme === 'light' ? 'text-gray-900' : 'text-gray-100';
    const subTextColor = theme === 'light' ? 'text-gray-700' : 'text-gray-300';
    const borderColor =
        theme === 'light' ? 'border-gray-200' : 'border-gray-700';

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4 transition-colors duration-500">
            <h2 className={`text-3xl font-bold mb-6 text-center ${textColor}`}>
                My Profile
            </h2>
            <div
                className={`${bgColor} ${textColor} shadow-lg rounded-lg p-6 mb-6 transition-colors duration-500`}>
                <div className="flex items-center space-x-4 mb-6">
                    {user?.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt="Avatar"
                            className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
                        />
                    ) : (
                        <FaUserCircle className="w-20 h-20 text-gray-400" />
                    )}
                    <div>
                        <p className="font-semibold text-lg">
                            {user?.displayName || 'Guest'}
                        </p>
                        <p className={`text-sm ${subTextColor}`}>
                            {user?.email || 'N/A'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                    <div
                        className={`${cardBg} p-4 rounded-lg shadow-md flex-1 transition-colors duration-500 text-center`}>
                        <p className="text-sm font-medium">Total Bills Paid</p>
                        <p className={`text-xl font-bold ${textColor}`}>
                            {myBills.length}
                        </p>
                    </div>
                    <div
                        className={`${cardBg} p-4 rounded-lg shadow-md flex-1 transition-colors duration-500 text-center`}>
                        <p className="text-sm font-medium">Total Amount Paid</p>
                        <p className={`text-xl font-bold ${textColor}`}>
                            ৳{totalPaid.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Paid Bills List */}
                {myBills.length > 0 && (
                    <div className="space-y-4">
                        <h3
                            className={`font-semibold text-lg mb-2 ${textColor}`}>
                            Paid Bills
                        </h3>
                        {myBills.map((bill) => (
                            <div
                                key={bill._id}
                                className={`${cardBg} border ${borderColor} rounded-lg p-4 shadow-md transition-all duration-300  hover:scale-102 hover:shadow-2xl`}>
                                <p>
                                    <strong>Title:</strong>{' '}
                                    <span className={subTextColor}>
                                        {bill.title}
                                    </span>
                                </p>
                                <p>
                                    <strong>Category:</strong>{' '}
                                    <span className={subTextColor}>
                                        {bill.category}
                                    </span>
                                </p>
                                <p>
                                    <strong>Amount:</strong>{' '}
                                    <span className={subTextColor}>
                                        ৳{Number(bill.amount).toLocaleString()}
                                    </span>
                                </p>
                                <p>
                                    <strong>Date:</strong>{' '}
                                    <span className={subTextColor}>
                                        {new Date(
                                            bill.date
                                        ).toLocaleDateString()}
                                    </span>
                                </p>
                                {bill.address && (
                                    <p>
                                        <strong>Address:</strong>{' '}
                                        <span className={subTextColor}>
                                            {bill.address}
                                        </span>
                                    </p>
                                )}
                                {bill.additionalInfo && (
                                    <p>
                                        <strong>Notes:</strong>{' '}
                                        <span className={subTextColor}>
                                            {bill.additionalInfo}
                                        </span>
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
