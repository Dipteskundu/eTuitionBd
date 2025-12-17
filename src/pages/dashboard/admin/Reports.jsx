import React, { useState } from 'react';
import AdminOverview from './AdminOverview';
import { FileDown, Calendar, PieChart, BarChart, TrendingUp, Users } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { motion } from 'framer-motion';
import useToast from '../../../hooks/useToast';

const Reports = () => {
    const { showToast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateReport = (type) => {
        setIsGenerating(true);
        // Simulator report generation
        setTimeout(() => {
            setIsGenerating(false);
            showToast(`${type} Report generated successfully!`, 'success');
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
                <div>
                    <h1 className="text-3xl font-heading font-bold gradient-text">Reports & Analytics</h1>
                    <p className="text-base-content/70">Deep dive into platform analytics.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="primary"
                        size="sm"
                        leftIcon={FileDown}
                        onClick={() => handleGenerateReport('Weekly')}
                        isLoading={isGenerating}
                    >
                        Download Weekly
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        leftIcon={FileDown}
                        onClick={() => handleGenerateReport('Monthly')}
                        isLoading={isGenerating}
                    >
                        Download Monthly
                    </Button>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <AdminOverview />
            </motion.div>
        </div>
    );
};

export default Reports;
