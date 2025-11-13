import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const RootLayout = () => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });
    const location = useLocation();

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        if (theme === 'dark') {
            root.style.backgroundColor = '#1f2937';
            root.style.color = '#f3f4f6';
        } else {
            root.style.backgroundColor = '#f9fafb';
            root.style.color = '#111827';
        }

        localStorage.setItem('theme', theme);
    }, [theme]);

    // Dynamic page title based on route
    useEffect(() => {
        let pageTitle = 'Bill Mate';

        if (location.pathname === '/') pageTitle = 'Home | Bill Mate';
        else if (location.pathname === '/bills')
            pageTitle = 'All Bills | Bill Mate';
        else if (location.pathname.startsWith('/bills/'))
            pageTitle = 'Bill Details | Bill Mate';
        else if (location.pathname === '/add-bill')
            pageTitle = 'Add Bill | Bill Mate';
        else if (location.pathname === '/mypaybills')
            pageTitle = 'My Paid Bills | Bill Mate';
        else if (location.pathname === '/profile')
            pageTitle = 'Profile | Bill Mate';
        else if (location.pathname === '/help') pageTitle = 'Help | Bill Mate';
        else if (location.pathname === '/login')
            pageTitle = 'Login | Bill Mate';
        else if (location.pathname === '/register')
            pageTitle = 'Register | Bill Mate';
        else pageTitle = '404 Not Found | Bill Mate';

        document.title = pageTitle;
    }, [location.pathname]);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    return (
        <div className="flex flex-col min-h-screen transition-colors duration-500">
            <Navbar toggleTheme={toggleTheme} theme={theme} />

            <main className="flex-1 transition-colors duration-500">
                <Outlet context={{ theme }} />
            </main>

            <Footer theme={theme} />

            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
};

export default RootLayout;
