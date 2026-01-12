import { useState, useEffect } from 'react';
import { getMonthlyPayroll } from '../services/api';

function Reports() {
    const [payrollData, setPayrollData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [currentMonth, setCurrentMonth] = useState('All Months');

    useEffect(() => {
        fetchPayroll();
    }, []);

    const fetchPayroll = async (month = '') => {
        setLoading(true);
        try {
            const response = await getMonthlyPayroll(month);
            setPayrollData(response.data.data);
            setCurrentMonth(response.data.month);
        } catch (error) {
            console.error('Error fetching payroll:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = (e) => {
        e.preventDefault();
        fetchPayroll(selectedMonth);
    };

    const handlePrint = () => {
        window.print();
    };

    const totalNetSalary = payrollData.reduce((sum, item) => sum + Number(item.NetSalary), 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Monthly Employee Payroll Report</h1>
                <p className="text-gray-600 mt-2">View comprehensive payroll information</p>
            </div>

            {/* Filter Section */}
            <div className="card mb-6 print:hidden">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label className="form-label">Filter by Month</label>
                        <input
                            type="text"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="form-input"
                            placeholder="e.g., January 2025"
                        />
                    </div>
                    <button onClick={handleFilter} className="btn-primary">
                        Apply Filter
                    </button>
                    <button onClick={() => { setSelectedMonth(''); fetchPayroll(''); }} className="btn-secondary">
                        Clear Filter
                    </button>
                    <button onClick={handlePrint} className="btn-secondary">
                        🖨️ Print
                    </button>
                </div>
            </div>

            {/* Report Section */}
            <div className="card">
                <div className="mb-6 pb-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                        
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Report Period</p>
                            <p className="font-semibold text-gray-900">{currentMonth}</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        <p className="mt-4 text-gray-600">Loading payroll data...</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            #
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            First Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Last Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Position
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Net Salary (RWF)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {payrollData.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                No payroll data available for the selected period
                                            </td>
                                        </tr>
                                    ) : (
                                        payrollData.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {item.FirstName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {item.LastName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {item.Position}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {item.Department}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600 text-right">
                                                    {Number(item.NetSalary).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                                {payrollData.length > 0 && (
                                    <tfoot className="bg-gray-50">
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                                                TOTAL:
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-700 text-right">
                                                {totalNetSalary.toLocaleString()} RWF
                                            </td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>

                        {payrollData.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600">
                                <p><strong>Report Summary:</strong></p>
                                <p>Total Employees: {payrollData.length}</p>
                                <p>Total Payroll: {totalNetSalary.toLocaleString()} RWF</p>
                                <p className="mt-4">Generated on: {new Date().toLocaleDateString('en-GB')}</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
        </div>
    );
}

export default Reports;
