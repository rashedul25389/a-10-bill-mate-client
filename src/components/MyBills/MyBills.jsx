import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../contexts/AuthProvider';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useOutletContext } from 'react-router-dom';

export default function MyBills() {
    const { user, loading } = useContext(AuthContext);
    const { theme } = useOutletContext();
    const [myBills, setMyBills] = useState([]);

    // Fetch bills for logged-in user
    useEffect(() => {
        if (!loading && user?.email) {
            axios
                .get(
                    `https://a-10-bill-mate-server.vercel.app/api/myBills?email=${user.email}`
                )
                .then((res) => setMyBills(res.data))
                .catch((err) => console.error(err));
        }
    }, [user, loading]);

    if (loading)
        return (
            <p className="text-center mt-10 transition-colors duration-500">
                Loading user info...
            </p>
        );
    if (!user)
        return (
            <p className="text-center mt-10 transition-colors duration-500">
                You need to login to see your bills.
            </p>
        );

    const totalAmount = myBills.reduce(
        (sum, b) => sum + Number(b.amount || 0),
        0
    );

    // Download Report (PDF)
    const downloadPDF = () => {
        if (myBills.length === 0) {
            Swal.fire('No bills to download!', '', 'info');
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('My Paid Bills Report', 14, 15);

        doc.setFontSize(12);
        doc.text(`Total Bills: ${myBills.length}`, 14, 25);
        doc.text(`Total Amount: ৳${totalAmount.toLocaleString()}`, 14, 32);

        const tableData = myBills.map((b) => [
            b.username,
            b.email,
            `৳${Number(b.amount || 0).toLocaleString()}`,
            b.address,
            b.phone,
            new Date(b.date).toLocaleDateString(),
        ]);

        autoTable(doc, {
            head: [['Name', 'Email', 'Amount', 'Address', 'Phone', 'Date']],
            body: tableData,
            startY: 40,
        });

        doc.save('My_Bills_Report.pdf');
    };

    // Update Bill
    const handleUpdate = async (bill) => {
        const { value: formValues } = await Swal.fire({
            title: 'Update Bill',
            html: `
            <input id="amount" class="swal2-input" placeholder="Amount" value="${
                bill.amount
            }" />
            <input id="address" class="swal2-input" placeholder="Address" value="${
                bill.address
            }" />
            <input id="phone" class="swal2-input" placeholder="Phone" value="${
                bill.phone
            }" />
            <input id="date" type="date" class="swal2-input" value="${
                bill.date?.split('T')[0]
            }" />
            <style>
                /* Theme-aware input styling */
                .swal2-input {
                    color: ${
                        theme === 'light' ? '#111827' : '#f3f4f6'
                    } !important;
                    background-color: ${
                        theme === 'light' ? '#ffffff' : '#374151'
                    } !important;
                    border: 1px solid ${
                        theme === 'light' ? '#d1d5db' : '#4b5563'
                    } !important;
                }

                /* Calendar icon color */
                input[type="date"]::-webkit-calendar-picker-indicator {
                    cursor: pointer;
                    filter: ${
                        theme === 'light' ? 'invert(0.3)' : 'invert(0.8)'
                    };
                }
            </style>
        `,
            focusConfirm: false,
            preConfirm: () => ({
                amount: document.getElementById('amount').value,
                address: document.getElementById('address').value,
                phone: document.getElementById('phone').value,
                date: document.getElementById('date').value,
            }),
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel',
        });

        if (!formValues) return;

        Swal.fire({
            title: 'Do you want to save the changes?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Save',
            denyButtonText: `Don't save`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(
                        `https://a-10-bill-mate-server.vercel.app/api/myBills/${bill._id}`,
                        formValues
                    );
                    Swal.fire('Saved!', '', 'success');
                    setMyBills((prev) =>
                        prev.map((b) =>
                            b._id === bill._id ? { ...b, ...formValues } : b
                        )
                    );
                } catch (err) {
                    Swal.fire('Error', 'Failed to update bill', err);
                }
            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info');
            }
        });
    };

    //  Delete Bill
    const handleDelete = (id) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger mr-3',
            },
            buttonsStyling: false,
        });

        swalWithBootstrapButtons
            .fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    axios
                        .delete(
                            `https://a-10-bill-mate-server.vercel.app/api/myBills/${id}`
                        )
                        .then(() => {
                            swalWithBootstrapButtons.fire({
                                title: 'Deleted!',
                                text: 'Your bill has been deleted.',
                                icon: 'success',
                            });
                            setMyBills((prev) =>
                                prev.filter((b) => b._id !== id)
                            );
                        })
                        .catch(() => {
                            Swal.fire(
                                'Error',
                                'Failed to delete bill',
                                'error'
                            );
                        });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire({
                        title: 'Cancelled',
                        text: 'Your bill is safe :)',
                        icon: 'error',
                    });
                }
            });
    };

    return (
        <div
            className={`max-w-6xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${
                theme === 'light' ? 'text-gray-900' : 'text-gray-100'
            }`}>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center transition-colors duration-500">
                My Paid Bills
            </h2>

            <div className="text-center mb-6 transition-colors duration-500 space-y-2">
                <p className="text-sm sm:text-base">
                    Total Bills:{' '}
                    <span className="font-semibold">{myBills.length}</span>
                </p>
                <p className="text-sm sm:text-base">
                    Total Amount:{' '}
                    <span className="font-semibold">
                        ৳{totalAmount.toLocaleString()}
                    </span>
                </p>
                <button
                    onClick={downloadPDF}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded transition">
                    Download Report (PDF)
                </button>
            </div>

            {myBills.length === 0 ? (
                <p className="text-center mt-10 text-gray-500 text-sm sm:text-base transition-colors duration-500">
                    You haven't paid any bills yet.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table
                        className={`w-full border table-auto text-sm sm:text-base transition-colors duration-500 ${
                            theme === 'light' ? 'bg-white' : 'bg-gray-800'
                        }`}>
                        <thead
                            className={`transition-colors duration-500 ${
                                theme === 'light'
                                    ? 'bg-gray-200'
                                    : 'bg-gray-700'
                            }`}>
                            <tr>
                                <th className="p-1 sm:p-2 border">Username</th>
                                <th className="p-1 sm:p-2 border">Email</th>
                                <th className="p-1 sm:p-2 border">Amount</th>
                                <th className="p-1 sm:p-2 border">Address</th>
                                <th className="p-1 sm:p-2 border">Phone</th>
                                <th className="p-1 sm:p-2 border">Date</th>
                                <th className="p-1 sm:p-2 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myBills.map((bill) => (
                                <tr
                                    key={bill._id}
                                    className="text-center hover:bg-gray-100 dark:hover:bg-gray-400 transition-colors duration-500">
                                    <td className="border p-1 sm:p-2">
                                        {bill.username}
                                    </td>
                                    <td className="border p-1 sm:p-2">
                                        {bill.email}
                                    </td>
                                    <td className="border p-1 sm:p-2">
                                        ৳{' '}
                                        {Number(
                                            bill.amount || 0
                                        ).toLocaleString()}
                                    </td>
                                    <td className="border p-1 sm:p-2">
                                        {bill.address}
                                    </td>
                                    <td className="border p-1 sm:p-2">
                                        {bill.phone}
                                    </td>
                                    <td className="border p-1 sm:p-2">
                                        {new Date(
                                            bill.date
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="border p-1 sm:p-2 space-x-1 sm:space-x-2 max-md:space-y-1">
                                        <button
                                            onClick={() => handleUpdate(bill)}
                                            className="bg-green-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded hover:bg-green-600 transition-colors duration-500 max-md:w-full">
                                            Update
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(bill._id)
                                            }
                                            className="bg-red-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded hover:bg-red-600 transition-colors duration-500 max-md:w-full">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
