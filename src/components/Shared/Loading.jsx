const Loading = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="text-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4 text-lg text-gray-600">Loading...</p>
            </div>
        </div>
    );
};

export default Loading;
