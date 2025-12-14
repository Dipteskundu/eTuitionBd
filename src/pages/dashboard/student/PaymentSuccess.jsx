import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [status, setStatus] = useState('verifying'); // verifying, success, error

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                setStatus('error');
                return;
            }
            try {
                const res = await axiosSecure.post('/payment-success', { sessionId });
                if (res.data.success) {
                    setStatus('success');
                } else {
                    setStatus('error');
                }
            } catch (error) {
                console.error("Payment verification failed:", error);
                setStatus('error');
            }
        };

        if (status === 'verifying') {
            verifyPayment();
        }
    }, [sessionId, axiosSecure, status]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
            {status === 'verifying' && (
                <div className="flex flex-col items-center gap-4">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <h2 className="text-xl font-semibold">Verifying Payment...</h2>
                    <p className="text-gray-500">Please wait while we confirm your transaction.</p>
                </div>
            )}

            {status === 'success' && (
                <div className="flex flex-col items-center gap-4 max-w-md">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
                    <p className="text-gray-600">
                        Thank you! Your payment has been processed successfully. The tutor has been approved for your tuition.
                    </p>
                    <div className="mt-8">
                        <Button
                            variant="primary"
                            onClick={() => navigate('/dashboard/student/my-tuitions')}
                        >
                            Return to Dashboard
                        </Button>
                    </div>
                </div>
            )}

            {status === 'error' && (
                <div className="flex flex-col items-center gap-4 max-w-md">
                    <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Payment Verification Failed</h2>
                    <p className="text-gray-600">
                        We couldn't verify your payment. If you were charged, please contact support.
                    </p>
                    <div className="mt-8">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/dashboard/student/applications')}
                        >
                            Back to Applications
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentSuccess;
