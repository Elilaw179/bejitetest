import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EmailSent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
            return;
        }
        const params = new URLSearchParams(location.search);
        const paramEmail = params.get('email');
        if (paramEmail) {
            setEmail(paramEmail);
        }
    }, [location.search, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
            <h1 className="text-2xl font-bold mb-10 text-[#16730F]">
                Email Verification
            </h1>
            <p className="text-gray-600 mb-4">
                We&apos;ve sent a verification link to <strong>{email}</strong>.
            </p>
            <p className="text-gray-500 mb-6">
                Please check your inbox and click the link to verify your
                account.
            </p>
           

            <p className="text-sm text-gray-400 mt-4">
                Didn&apos;t receive the email? Check your spam folder or request
                another one.
            </p>

             {/* Go Back to Login Button */}
            <button
                onClick={() => navigate('/')}
                className="mt-4 bg-[#16730F] text-white px-6 py-2 rounded-xl hover:bg-[#125c0c] transition"
            >
                Go back to Login
            </button>
        </div>
    );
};

export default EmailSent;
