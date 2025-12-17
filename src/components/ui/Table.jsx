import React from 'react';
import { motion } from 'framer-motion';

const Table = ({
    columns = [],
    data = [],
    loading = false,
    emptyMessage = 'No data available',
    onRowClick,
    hoverable = true,
    striped = false,
    className = '',
}) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-base-content/50 text-lg">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-base-200">
            <table className={`table w-full ${className}`}>
                {/* Head */}
                <thead className="bg-base-200">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="font-heading font-bold text-base-content uppercase text-sm"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* Body */}
                <tbody>
                    {data.map((row, rowIndex) => (
                        <motion.tr
                            key={rowIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: rowIndex * 0.05 }}
                            onClick={() => onRowClick && onRowClick(row)}
                            className={`
                                ${striped && rowIndex % 2 === 1 ? 'bg-base-200/30' : ''}
                                ${hoverable ? 'hover:bg-base-200/50 cursor-pointer' : ''}
                                ${onRowClick ? 'cursor-pointer' : ''}
                                transition-colors duration-200
                            `}
                        >
                            {columns.map((column, colIndex) => (
                                <td key={colIndex} className="text-base-content/80">
                                    {column.render
                                        ? column.render(row[column.accessor], row, rowIndex)
                                        : row[column.accessor]}
                                </td>
                            ))}
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
