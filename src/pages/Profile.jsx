import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthProvider';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';

export default function Profile() {
    const { user, loading: userLoading } = useContext(AuthContext);
    const { theme } = useOutletContext();
    const [myBills, setMyBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userLoading && user?.email) {
            setLoading(true);
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
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user, userLoading]);

    const totalPaid = myBills.reduce(
        (sum, bill) => sum + Number(bill.amount || 0),
        0
    );

    const bgColor = theme === 'light' ? 'bg-sky-100' : 'bg-gray-900';
    const cardBg = theme === 'light' ? 'bg-white' : 'bg-gray-800';
    const textColor = theme === 'light' ? 'text-gray-900' : 'text-gray-100';
    const subTextColor = theme === 'light' ? 'text-gray-700' : 'text-gray-300';
    const borderColor =
        theme === 'light' ? 'border-gray-200' : 'border-gray-700';

    // Loading spinner
    if (loading || userLoading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <p className="text-center mt-10 text-gray-500">
                You need to login to see your profile and bills.
            </p>
        );
    }

    return (
        <div className={`max-w-4xl mx-auto mt-10 p-4 ${textColor}`}>
            <h2 className="text-3xl font-bold mb-6 text-center">My Profile</h2>

            <div
                className={`${bgColor} shadow-lg rounded-lg p-6 mb-6 transition-colors duration-500`}>
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
                        className={`${cardBg} p-4 rounded-lg shadow-md flex-1 text-center`}>
                        <p className="text-sm font-medium">Total Bills Paid</p>
                        <p className={`text-xl font-bold ${textColor}`}>
                            {myBills.length}
                        </p>
                    </div>
                    <div
                        className={`${cardBg} p-4 rounded-lg shadow-md flex-1 text-center`}>
                        <p className="text-sm font-medium">Total Amount Paid</p>
                        <p className={`text-xl font-bold ${textColor}`}>
                            ৳{totalPaid.toLocaleString()}
                        </p>
                    </div>
                </div>

                {myBills.length > 0 ? (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg mb-2">
                            Paid Bills
                        </h3>
                        {myBills.map((bill) => (
                            <div
                                key={bill._id}
                                className={`${cardBg} border ${borderColor} rounded-lg p-4 shadow-md hover:scale-[1.02] transition-all duration-300`}>
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-lg">
                                        {bill.title}
                                    </h4>
                                    <span className="text-sm font-medium text-sky-500">
                                        {bill.category}
                                    </span>
                                </div>

                                <p className={`mt-2 ${subTextColor}`}>
                                    <strong>Amount:</strong> ৳
                                    {Number(bill.amount).toLocaleString()}
                                </p>
                                <p className={subTextColor}>
                                    <strong>Date:</strong>{' '}
                                    {new Date(bill.date).toLocaleDateString()}
                                </p>
                                {bill.address && (
                                    <p className={subTextColor}>
                                        <strong>Address:</strong> {bill.address}
                                    </p>
                                )}
                                {bill.description && (
                                    <p className={subTextColor}>
                                        <strong>Description:</strong>{' '}
                                        {bill.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-6">
                        No paid bills yet.
                    </p>
                )}
            </div>
        </div>
    );
}
