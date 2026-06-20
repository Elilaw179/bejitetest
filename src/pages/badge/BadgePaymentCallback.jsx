import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyBadgeSubscription } from '../../services/verifiedBadgeApi';

export default function BadgePaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Verifying your subscription...');

  useEffect(() => {
    const verify = async () => {
      const ref = searchParams.get('reference') || searchParams.get('trxref');
      if (!ref) {
        setStatus('error');
        setMessage('Payment reference not found');
        return;
      }

      try {
        const response = await verifyBadgeSubscription(ref);
        if (response?.data?.status === 'success') {
          setStatus('success');
          setMessage('Verified Badge activated! Redirecting...');
          setTimeout(() => navigate('/badge-holder', { replace: true }), 2000);
        } else {
          setStatus('error');
          setMessage('Payment verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Badge payment verification error:', error);
        setStatus('error');
        setMessage('An error occurred during verification.');
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1A3E32] mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">Processing Payment</h2>
            <p className="text-gray-600 mt-2">{message}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-2xl">✓</div>
            <h2 className="text-xl font-semibold text-gray-900">You're Verified!</h2>
            <p className="text-gray-600 mt-2">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 text-2xl">✕</div>
            <h2 className="text-xl font-semibold text-gray-900">Payment Failed</h2>
            <p className="text-gray-600 mt-2">{message}</p>
            <button
              type="button"
              onClick={() => navigate('/badge')}
              className="mt-4 px-6 py-2 bg-[#1A3E32] text-white rounded-lg hover:bg-[#16362a]"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
