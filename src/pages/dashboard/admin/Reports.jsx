import React from 'react';
import AdminOverview from './AdminOverview';

const Reports = () => {
    // Reusing AdminOverview charts for now as Requirements largely overlap (Charts, Revenue, User Stats).
    // Can be extended with more specific reports later.
    return (
        <div>
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-500 mb-2 uppercase tracking-wide">Detailed Reports</h2>
                <p className="text-gray-400">Deep dive into platform analytics.</p>
            </div>

            <AdminOverview />
        </div>
    );
};

export default Reports;
