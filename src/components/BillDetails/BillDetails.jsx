import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PayBillModal from '../PayBillModal/PayBillModal';
import { AuthContext } from '../../contexts/AuthProvider';
import { useOutletContext } from 'react-router-dom';
import NotFound from '../../pages/NotFound';

export default function BillDetails() {
    const { id } = useParams();
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { user } = useContext(AuthContext);
    const { theme } = useOutletContext();
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`https://a-10-bill-mate-server.vercel.app/api/bills/${id}`)
            .then((res) => {
                if (!res.data || Object.keys(res.data).length === 0) {
                    setNotFound(true);
                } else {
                    setBill(res.data);
                }
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading)
        return (
            <p className="text-center mt-10 transition-colors duration-500">
                Loading...
            </p>
        );

    if (notFound) return <NotFound theme={theme} />;

    const billDate = new Date(bill.date);
    const now = new Date();
    const isCurrentMonth =
        billDate.getMonth() === now.getMonth() &&
        billDate.getFullYear() === now.getFullYear();

    return (
        <div
            className={`max-w-2xl mx-auto mt-10 border rounded-lg p-6 shadow transition-colors duration-500 ${
                theme === 'light'
                    ? 'bg-sky-200 text-gray-900 border-blue-200'
                    : 'bg-gray-900 text-gray-100 border-gray-600'
            }`}>
            <h2 className="text-2xl font-bold mb-3 transition-colors duration-500">
                {bill.title}
            </h2>

            <p className="transition-colors duration-500">
                <strong>Category:</strong> {bill.category}
            </p>
            <p className="transition-colors duration-500">
                <strong>Location:</strong> {bill.location}
            </p>
            <p className="transition-colors duration-500">
                <strong>Description:</strong> {bill.description}
            </p>

            {bill.image && (
                <img
                    src={bill.image}
                    alt={bill.title}
                    className="w-full h-80 object-top rounded my-4 transition-shadow duration-500 shadow-md"
                />
            )}

            <p className="transition-colors duration-500">
                <strong>Amount:</strong> ৳{bill.amount}
            </p>
            <p className="transition-colors duration-500">
                <strong>Date:</strong> {billDate.toLocaleDateString()}
            </p>

            <button
                disabled={!isCurrentMonth}
                onClick={() => setShowModal(true)}
                className={`mt-4 px-4 py-2 rounded text-white transition-colors duration-500 ${
                    isCurrentMonth
                        ? theme === 'light'
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-400 cursor-not-allowed'
                }`}>
                Pay Bill
            </button>

            {!isCurrentMonth && (
                <p className="text-red-500 mt-2 text-sm transition-colors duration-500">
                    Only current month bills can be paid.
                </p>
            )}

            {/* Payment Modal */}
            {showModal && (
                <PayBillModal
                    bill={bill}
                    user={user}
                    theme={theme} // pass theme to modal
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
