import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function Footer({ theme }) {
    const linkClass = `text-sm font-medium transition-colors duration-300
    ${
        theme === 'light'
            ? 'text-white hover:text-blue-200 hover:underline'
            : 'text-gray-300 hover:text-white hover:underline'
    }`;

    const socialIconClass = `w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-300
        ${
            theme === 'light'
                ? 'bg-white text-blue-600 hover:bg-blue-200 hover:text-white'
                : 'bg-gray-800 text-white hover:bg-blue-600 hover:text-white'
        }`;

    return (
        <footer
            className={`w-full pt-12 transition-colors duration-500 mt-10 ${
                theme === 'light'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-900 text-gray-100'
            }`}>
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row md:justify-between md:items-start gap-10 md:gap-0">
                <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 md:gap-4">
                    <h1 className="text-3xl font-bold tracking-tight">
                        BILL MATE
                    </h1>
                    <p className="text-sm max-w-xs">
                        Your Utility Bill Management System. Track payments,
                        manage bills, and generate reports easily.
                    </p>
                </div>

                <div className="flex flex-col items-center md:items-start gap-2">
                    <h2 className="font-semibold mb-2">Useful Links</h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        <Link to="/" className={linkClass}>
                            Home
                        </Link>
                        <Link to="/" className={linkClass}>
                            About
                        </Link>
                        <Link to="/" className={linkClass}>
                            Services
                        </Link>
                        <Link to="/" className={linkClass}>
                            Contact
                        </Link>
                        <Link to="/" className={linkClass}>
                            Support
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-start gap-2">
                    <h2 className="font-semibold mb-2">Follow Us</h2>
                    <div className="flex gap-4 mt-2">
                        <Link
                            to={'https://facebook.com'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={socialIconClass}>
                            <FaFacebookF />
                        </Link>
                        <Link
                            to={'https://twitter.com'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={socialIconClass}>
                            <FaXTwitter />
                        </Link>
                        <Link
                            to={'https://instagram.com'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={socialIconClass}>
                            <FaInstagram />
                        </Link>
                        <Link
                            to={'https://linkedin.com'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={socialIconClass}>
                            <FaLinkedinIn />
                        </Link>
                    </div>
                </div>
            </div>

            <div
                className={`w-full mt-6 py-3 text-sm text-center shadow-2xl shadow-red-700 transition-colors duration-500 ${
                    theme === 'light'
                        ? 'bg-sky-400/30 text-white'
                        : 'bg-gray-800/50 text-gray-100'
                }`}>
                © 2025 BILL MATE. All Rights Reserved.
            </div>
        </footer>
    );
}
