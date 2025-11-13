import { useState, useEffect } from 'react';
import { Outlet, } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

export const RootLayout = () => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

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
