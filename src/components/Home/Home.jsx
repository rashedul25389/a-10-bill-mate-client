import { useEffect, useState, useRef } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Home() {
    const { theme } = useOutletContext();
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideInterval = useRef(null);

    const slides = [
        {
            img: 'https://i.ibb.co/mVWf2n2G/electricity-bill-payment-history.jpg',
            text: 'Pay Your Electricity Bills Easily & Securely',
        },
        {
            img: 'https://i.ibb.co/jZgFXVTj/Flat-Vector-Online-Gas-Bill-Payment-Concept-Graphic-Illustration-700.webp',
            text: 'Manage Your Monthly Gas Payments Hassle-Free',
        },
        {
            img: 'https://i.ibb.co/svSZyTNC/faucet-3240211-1280.jpg',
            text: 'Track and Pay Water Bills Instantly Online',
        },
    ];

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

    // Fetch bills
    useEffect(() => {
        let isMounted = true;
        axios
            .get('https://a-10-bill-mate-server.vercel.app/api/bills/recent')
            .then((res) => {
                if (isMounted) {
                    setBills(res.data);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.error(err);
                if (isMounted) setLoading(false);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    // Auto slide
    useEffect(() => {
        slideInterval.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(slideInterval.current);
    }, [slides.length]);

    const nextSlide = () =>
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () =>
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    if (loading)
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
            </div>
        );

    return (
        <div className="max-w-6xl mx-auto mt-10 space-y-16 px-4 transition-colors duration-500">
            {/* Slider */}
            <div
                className="relative w-full h-64 md:h-96 overflow-hidden rounded-2xl shadow-lg"
                onMouseEnter={() => clearInterval(slideInterval.current)}
                onMouseLeave={() => {
                    slideInterval.current = setInterval(() => {
                        setCurrentSlide((prev) => (prev + 1) % slides.length);
                    }, 5000);
                }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0">
                        <img
                            src={slides[currentSlide].img}
                            alt={`Slide ${currentSlide + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6">
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-white text-2xl md:text-4xl font-bold text-center drop-shadow-lg px-4">
                                {slides[currentSlide].text}
                            </motion.h2>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/60 hover:bg-white text-black rounded-full p-2 z-10">
                    <FaChevronLeft size={24} />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/60 hover:bg-white text-black rounded-full p-2 z-10">
                    <FaChevronRight size={24} />
                </button>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {slides.map((_, i) => (
                        <span
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className={`cursor-pointer w-3 h-3 rounded-full transition-all ${
                                currentSlide === i
                                    ? 'bg-blue-600 scale-125'
                                    : 'bg-white/70'
                            }`}></span>
                    ))}
                </div>
            </div>

            <div>
                <h2
                    className={`text-3xl font-bold mb-6 text-center ${
                        theme === 'light' ? 'text-gray-900' : 'text-gray-100'
                    }`}>
                    Categories
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((cat) => (
                        <div
                            key={cat.name}
                            className={`p-6 rounded-xl shadow-lg flex items-center justify-center font-bold text-xl ${cat.color} ${cat.textColor} hover:scale-105 transform transition`}>
                            {cat.name}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2
                    className={`text-3xl font-bold mb-6 text-center ${
                        theme === 'light' ? 'text-gray-900' : 'text-gray-100'
                    }`}>
                    Recent Bills
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {bills.slice(0, 6).map((bill) => {
                        const cat = categories.find(
                            (c) => c.name === bill.category
                        );
                        const catColor = cat ? cat.color : 'bg-gray-300';
                        const catTextColor = cat
                            ? cat.textColor
                            : 'text-gray-800';
                        return (
                            <motion.div
                                key={bill._id}
                                whileHover={{ scale: 1.05 }}
                                className={`border rounded-xl shadow-xl p-4 flex flex-col hover:shadow-2xl transition ${
                                    theme === 'light'
                                        ? 'bg-sky-100 text-gray-900 border-blue-200'
                                        : 'bg-gray-700 text-gray-100 border-gray-600'
                                }`}>
                                <img
                                    src={bill.image}
                                    alt={bill.title}
                                    className="w-full h-50 object-center rounded mb-3"
                                />
                                <h3 className="font-bold text-lg mb-2">
                                    {bill.title}
                                </h3>
                                <span
                                    className={`inline-block px-2 py-1 rounded text-sm font-semibold max-w-fit my-2 ${catColor} ${catTextColor}`}>
                                    {bill.category}
                                </span>
                                <p className="text-sm mb-1">
                                    Location: {bill.location}
                                </p>
                                <p className="text-sm mb-3">
                                    Date:{' '}
                                    {new Date(bill.date).toLocaleDateString(
                                        'en-GB'
                                    )}
                                </p>
                                <Link
                                    to={`/bills/${bill._id}`}
                                    className="mt-auto text-center px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition">
                                    See Details
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
