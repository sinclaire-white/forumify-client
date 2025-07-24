
import  { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import { FadeLoader } from 'react-spinners'; 
const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user, refetchUser } = useAuth(); 
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Processing your membership upgrade...');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id');
    const userEmail = queryParams.get('email'); // Get email from URL as well

    const handleMembershipUpgrade = async () => {
      if (!sessionId || !userEmail || !user?.email) {
        setMessage('Missing payment information. Please try again.');
        setLoading(false);
        return;
      }

      // Basic security: Ensure the email in URL matches logged-in user
      if (userEmail !== user.email) {
          setMessage('Security warning: Email mismatch. Please log in with the correct account.');
          setLoading(false);
          
           navigate('/login');
          return;
      }

      try {
        

        const paymentAmount = 10; // $10.00 
        const paymentCurrency = 'usd';

        const res = await axiosSecure.patch('/users/membership', {
          email: userEmail,
          transactionId: sessionId, // Using Stripe Checkout Session ID as transaction ID for demo
          amount: paymentAmount,
          currency: paymentCurrency,
        });

        if (res.data.success) {
          setMessage('🎉 Congratulations! Your Gold Membership is now active.');
          Swal.fire({
            icon: 'success',
            title: 'Membership Activated!',
            html: `Welcome to Gold status! Transaction ID: <code>${sessionId}</code>`,
            showConfirmButton: false,
            timer: 3000
          });
          // Crucial: Refetch user data to update badge/membership status in UI
          refetchUser(); 
          setTimeout(() => navigate('/dashboard'), 2000); // Redirect to dashboard
        } else {
          setMessage(`Membership upgrade failed: ${res.data.message || 'Unknown error.'}`);
          Swal.fire({
            icon: 'error',
            title: 'Upgrade Failed!',
            text: res.data.message || 'Payment succeeded but membership update failed. Please contact support.',
          });
          setTimeout(() => navigate('/membership'), 3000); // Go back to membership page
        }
      } catch (error) {
        console.error('Error upgrading membership:', error);
        setMessage('There was an error processing your membership. Please contact support.');
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'An unexpected error occurred. Please contact support.',
        });
        setTimeout(() => navigate('/membership'), 3000); // Go back to membership page
      } finally {
        setLoading(false);
      }
    };

    if (user) { // Only run if user is loaded
        handleMembershipUpgrade();
    }
  }, [location.search, navigate, axiosSecure, user, refetchUser]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100">
      <div className="p-8 text-center bg-white rounded-lg shadow-lg">
        {loading ? (
          <>
            <FadeLoader color="#36d7b7" />
            <p className="mt-4 text-lg font-semibold text-gray-700">{message}</p>
          </>
        ) : (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-green-600">Payment Status</h2>
            <p className="text-xl text-gray-800">{message}</p>
            {!message.includes("Congratulations") && (
                <button
                    onClick={() => navigate('/membership')}
                    className="px-6 py-3 mt-6 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
                >
                    Try Again
                </button>
            )}
            {message.includes("Congratulations") && (
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 mt-6 text-white transition-colors bg-green-500 rounded-md hover:bg-green-600"
                >
                    Go to Dashboard
                </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;