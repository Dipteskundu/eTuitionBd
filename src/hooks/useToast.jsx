import toast from 'react-hot-toast';

const useToast = () => {
    const success = (message) => {
        toast.success(message, {
            duration: 3000,
            position: 'top-right',
        });
    };

    const error = (message) => {
        toast.error(message, {
            duration: 4000,
            position: 'top-right',
        });
    };

    const info = (message) => {
        toast(message, {
            icon: 'ℹ️',
            duration: 3000,
            position: 'top-right',
        });
    };

    const warning = (message) => {
        toast(message, {
            icon: '⚠️',
            duration: 4000,
            position: 'top-right',
        });
    };

    const loading = (message) => {
        return toast.loading(message, {
            position: 'top-right',
        });
    };

    const dismiss = (toastId) => {
        toast.dismiss(toastId);
    };

    return {
        success,
        error,
        warning,
        info,
        loading,
        dismiss,
        toast, // export original instance if needed
    };
};

export default useToast;
