import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function Help() {
    const { theme } = useOutletContext();
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            q: 'How to pay a bill?',
            a: 'Go to Home, select a bill, and click Pay.',
        },
        {
            q: 'Can I see my payment history?',
            a: 'Yes, go to Profile to view all bills you paid.',
        },
        {
            q: 'Is my payment secure?',
            a: 'All payments are processed securely using HTTPS.',
        },
    ];

    // Theme colors
    const bgColor = theme === 'light' ? 'bg-sky-100' : 'bg-gray-900';
    const textColor = theme === 'light' ? 'text-gray-900' : 'text-gray-100';
    const subTextColor = theme === 'light' ? 'text-gray-700' : 'text-gray-300';
    const shadow = theme === 'light' ? 'shadow-md' : 'shadow-lg';

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4 transition-colors duration-500">
            <h2 className={`text-3xl font-bold mb-6 text-center ${textColor}`}>
                Help & FAQ
            </h2>

            <div className="space-y-4">
                {faqs.map((faq, i) => (
                    <div
                        key={i}
                        className={`${bgColor} p-5 rounded-xl ${shadow} transition-colors duration-500 cursor-pointer`}
                        onClick={() => toggleFAQ(i)}>
                        <div className="flex justify-between items-center">
                            <p className={`font-semibold ${textColor}`}>
                                {faq.q}
                            </p>
                            <span className="text-gray-500">
                                {openIndex === i ? (
                                    <FaChevronUp />
                                ) : (
                                    <FaChevronDown />
                                )}
                            </span>
                        </div>
                        <div
                            className={`mt-2 overflow-hidden transition-all duration-300 ${
                                openIndex === i
                                    ? 'max-h-40 opacity-100'
                                    : 'max-h-0 opacity-0'
                            }`}>
                            <p className={`${subTextColor} text-sm`}>{faq.a}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
