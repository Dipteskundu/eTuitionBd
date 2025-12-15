import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useToast from '../../../hooks/useToast';
import { User, DollarSign, CreditCard } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Swal from 'sweetalert2';

const Applications = () => {
    const { tuitionId } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { showToast } = useToast();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tuitionDetails, setTuitionDetails] = useState(null);

    // Payment State
    const [selectedApp, setSelectedApp] = useState(null);
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!tuitionId) {
                setLoading(false);
                return;
            }
            try {
                // Fetch Tuition Details
                const tuitionRes = await axiosSecure.get(`/tuitions/${tuitionId}`);
                setTuitionDetails(tuitionRes.data);

                // Fetch Applications (Strict Endpoint)
                const appsRes = await axiosSecure.get(`/applications/${tuitionId}`);
                setApplications(appsRes.data);
            } catch (error) {
                console.error(error);
                showToast('Failed to load applications.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [tuitionId, axiosSecure]);

    const handleAcceptClick = async (app) => {
        // 1. Wonderful Alert "Slider" (Confirmation)
        const result = await Swal.fire({
            title: 'Accept this Tutor?',
            text: `Are you sure you want to accept ${app.tutorName || 'this tutor'}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed to payment',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            setSelectedApp(app);
            document.getElementById('payment_modal').showModal();
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setPaymentProcessing(true);

        const form = e.target;
        const cardName = form.cardName.value;
        const cardNumber = form.cardNumber.value;

        // Simulate 2 seconds processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const payload = {
                applicationId: selectedApp._id,
                tuitionId: tuitionId, // Use URL param directly
                tutorEmail: selectedApp.tutorEmail,
                amount: tuitionDetails?.salary || 0, // Fallback safely
            };

            // Use Demo Payment API
            const res = await axiosSecure.post('/payments/demo', payload);

            if (res.data.success) {
                document.getElementById('payment_modal').close();
                Swal.fire(
                    'Payment Successful!',
                    `You have hired ${selectedApp.tutorName || 'the tutor'}!`,
                    'success'
                );
                // Update local state
                setApplications(prev => prev.map(a =>
                    a._id === selectedApp._id ? { ...a, status: 'approved' } : // Approved status
                        (a.tuitionId === tuitionId && a._id !== selectedApp._id) ? { ...a, status: 'rejected' } : a // Reject others
                ));
            }
        } catch (error) {
            console.error(error);
            showToast('Payment failed. Please try again.', 'error');
        } finally {
            setPaymentProcessing(false);
        }
    };

    const handleDelete = async (appId) => {
        const result = await Swal.fire({
            title: 'Delete Application?',
            text: "This will remove the application permanently.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Delete'
        });

        if (!result.isConfirmed) return;

        try {
            const res = await axiosSecure.delete(`/applications/${appId}`);
            if (res.data.deletedCount > 0) {
                showToast('Application deleted.', 'success');
                setApplications(prev => prev.filter(app => app._id !== appId));
            }
        } catch (error) {
            console.error(error);
            showToast('Failed to delete application.', 'error');
        }
    };

    // Kept handleReject for status update logic if preferred, but user requested Delete. 
    // We can keep both or replacing Reject with Delete? User prompt says "Accept / Reject / Delete". So we usually need all 3.
    // I'll keep Reject as status update (PATCH) and add Delete (DELETE) as a separate option.

    const handleReject = async (appId) => {
        // Confirmation before reject
        const result = await Swal.fire({
            title: 'Reject this Tutor?',
            text: "Do you want to reject this application? (Status will be 'rejected')",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Reject'
        });

        if (!result.isConfirmed) return;

        try {
            // Updated to PATCH /applications/:id
            const res = await axiosSecure.patch(`/applications/${appId}`, { status: 'rejected' });
            if (res.data.modifiedCount > 0) {
                showToast('Application rejected.', 'success');
                setApplications(prev => prev.map(app =>
                    app._id === appId ? { ...app, status: 'rejected' } : app
                ));
            }
        } catch (error) {
            console.error(error);
            showToast('Failed to reject application.', 'error');
        }
    };

    if (loading) return <div className="flex justify-center p-8"><span className="loading loading-spinner text-primary"></span></div>;

    if (!tuitionId) return <div className="p-8 text-center">Please select a tuition to view applications.</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Review Applications</h1>
                {tuitionDetails && (
                    <p className="text-gray-500">
                        For: <span className="font-semibold text-primary">{tuitionDetails.subject}</span> ({tuitionDetails.class}) -
                        Salary: BDT {tuitionDetails.salary}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {applications.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-base-100 rounded-xl border border-base-200">
                        No applications received yet.
                    </div>
                ) : (
                    applications.map((app) => (
                        <div key={app._id} className="card bg-base-100 shadow-sm border border-base-200">
                            <div className="card-body">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-3">
                                        <div className="avatar placeholder">
                                            <div className="bg-neutral-focus text-neutral-content rounded-full w-12 h-12">
                                                <span className="text-xl">
                                                    {app.tutorName ? app.tutorName[0] : 'T'}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <h2 className="card-title text-base">{app.tutorName || app.tutorEmail}</h2>
                                            <p className="text-xs text-gray-500">Applied on: {new Date(app.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className={`badge ${app.status === 'approved' ? 'badge-success text-white' :
                                        app.status === 'rejected' ? 'badge-error text-white' :
                                            'badge-warning text-white'
                                        }`}>
                                        {app.status}
                                    </div>
                                </div>

                                <div className="divider my-2"></div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Experience:</span>
                                        <span className="font-medium">{app.experience || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Qualification:</span>
                                        <span className="font-medium">{app.qualification || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Expected Salary:</span>
                                        <span className="font-medium">BDT {app.expectedSalary || tuitionDetails?.salary}</span>
                                    </div>
                                </div>

                                <div className="card-actions justify-end mt-4">
                                    {app.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleReject(app._id)}
                                                className="btn btn-sm btn-ghost text-error"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleDelete(app._id)}
                                                className="btn btn-sm btn-ghost text-gray-400 hover:text-red-500"
                                                title="Delete permanently"
                                            >
                                                Delete
                                            </button>
                                            <Button
                                                onClick={() => handleAcceptClick(app)}
                                                size="sm"
                                                variant="primary"
                                                className="gap-2"
                                            >
                                                <DollarSign size={16} /> Accept & Pay
                                            </Button>
                                        </>
                                    )}
                                    {app.status === 'accepted' && (
                                        <button className="btn btn-sm btn-disabled w-full">Selected Tutor</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Wonderful Payment Modal */}
            <dialog id="payment_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <CreditCard className="text-primary" /> Secure Payment
                    </h3>
                    <p className="mb-4 text-sm text-gray-500">
                        You are paying <span className="font-bold">BDT {tuitionDetails?.salary}</span> to hire this tutor.
                    </p>

                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Card Holder Name</span></label>
                            <input name="cardName" type="text" placeholder="John Doe" className="input input-bordered w-full" required />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Card Number (Demo)</span></label>
                            <input name="cardNumber" type="text" placeholder="1234 5678 9012 3456" className="input input-bordered w-full" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Expiry</span></label>
                                <input type="text" placeholder="MM/YY" className="input input-bordered w-full" required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">CVC</span></label>
                                <input type="text" placeholder="123" className="input input-bordered w-full" required />
                            </div>
                        </div>

                        <div className="modal-action">
                            <button type="button" className="btn" onClick={() => document.getElementById('payment_modal').close()} disabled={paymentProcessing}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={paymentProcessing}>
                                {paymentProcessing ? <span className="loading loading-spinner"></span> : `Pay BDT ${tuitionDetails?.salary}`}
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div >
    );
};

export default Applications;
