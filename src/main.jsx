import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Home from './components/Home/Home';
import Bills from './components/Bills/Bills';
import BillDetails from './components/BillDetails/BillDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './routes/PrivateRoute';
import AuthProvider from './contexts/AuthProvider';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            { index: true, element: <Home /> },
            {
                path: 'bills/:id',
                element: (
                    <PrivateRoute>
                        <BillDetails />
                    </PrivateRoute>
                ),
            },
            { path: 'bills', element: <Bills /> },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            {
                path: 'mypaybills',
                element: (
                    <PrivateRoute>
                        <MyBills />
                    </PrivateRoute>
                ),
            },
            {
                path: 'add-bill',
                element: (
                    <PrivateRoute>
                        <AddBill />
                    </PrivateRoute>
                ),
            },
            {
                path: 'profile',
                element: (
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                ),
            },
            {
                path: 'help',
                element: <Help />,
            },
            {
                path: '*',
                element: <NotFound />,
            },
        ],
    },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>
);
