import { useState, useEffect } from 'react';
import { getSalaries, createSalary, updateSalary, deleteSalary, getDepartments } from '../services/api';

function Salary() {
    const [salaries, setSalaries] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        DepartmentCode: '',
        GrossSalary: '',
        TotalDeduction: '',
        NetSalary: '',
        Month: ''
    });

    useEffect(() => {
        fetchSalaries();
        fetchDepartments();
    }, []);

    useEffect(() => {
        // Auto-calculate net salary
        const gross = parseFloat(formData.GrossSalary) || 0;
        const deduction = parseFloat(formData.TotalDeduction) || 0;
        const net = gross - deduction;
        setFormData(prev => ({ ...prev, NetSalary: net.toString() }));
    }, [formData.GrossSalary, formData.TotalDeduction]);

    const fetchSalaries = async () => {
        try {
            const response = await getSalaries();
            setSalaries(response.data.data);
        } catch (error) {
            console.error('Error fetching salaries:', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await getDepartments();
            setDepartments(response.data.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            if (editingId) {
                await updateSalary(editingId, formData);
                setMessage({ type: 'success', text: 'Salary updated successfully!' });
                setEditingId(null);
            } else {
                await createSalary(formData);
                setMessage({ type: 'success', text: 'Salary created successfully!' });
            }

            setFormData({
                DepartmentCode: '',
                GrossSalary: '',
                TotalDeduction: '',
                NetSalary: '',
                Month: ''
            });
            fetchSalaries();
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Operation failed'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (salary) => {
        setEditingId(salary.SalaryID);
        setFormData({
            DepartmentCode: salary.DepartmentCode,
            GrossSalary: salary.GrossSalary.toString(),
            TotalDeduction: salary.TotalDeduction.toString(),
            NetSalary: salary.NetSalary.toString(),
            Month: salary.Month
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this salary record?')) {
            return;
        }

        try {
            await deleteSalary(id);
            setMessage({ type: 'success', text: 'Salary deleted successfully!' });
            fetchSalaries();
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to delete salary'
            });
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({
            DepartmentCode: '',
            GrossSalary: '',
            TotalDeduction: '',
            NetSalary: '',
            Month: ''
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Salary Management</h1>
                <p className="text-gray-600 mt-2">Manage employee salary records with full CRUD operations</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1 card">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        {editingId ? 'Edit Salary Record' : 'Add New Salary Record'}
                    </h2>

                    {message.text && (
                        <div className={`px-4 py-3 rounded-lg mb-4 ${message.type === 'success'
                                ? 'bg-green-50 border border-green-200 text-green-700'
                                : 'bg-red-50 border border-red-200 text-red-700'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="form-label">Department</label>
                            <select
                                name="DepartmentCode"
                                value={formData.DepartmentCode}
                                onChange={handleChange}
                                className="form-input"
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept.DepartmentCode} value={dept.DepartmentCode}>
                                        {dept.DepartmentName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="form-label">Gross Salary (RWF)</label>
                            <input
                                type="number"
                                name="GrossSalary"
                                value={formData.GrossSalary}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="e.g., 300000"
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label">Total Deduction (RWF)</label>
                            <input
                                type="number"
                                name="TotalDeduction"
                                value={formData.TotalDeduction}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="e.g., 20000"
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label">Net Salary (Auto-calculated)</label>
                            <input
                                type="number"
                                name="NetSalary"
                                value={formData.NetSalary}
                                className="form-input bg-gray-100"
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="form-label">Month</label>
                            <input
                                type="text"
                                name="Month"
                                value={formData.Month}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="e.g., January 2025"
                                required
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="btn-primary flex-1"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : editingId ? 'Update' : 'Add Salary'}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 card">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">All Salary Records ({salaries.length})</h2>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gross</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deduction</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {salaries.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                            No salary records found
                                        </td>
                                    </tr>
                                ) : (
                                    salaries.map((salary) => (
                                        <tr key={salary.SalaryID} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{salary.DepartmentName}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{Number(salary.GrossSalary).toLocaleString()}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{Number(salary.TotalDeduction).toLocaleString()}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-primary-600">{Number(salary.NetSalary).toLocaleString()}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{salary.Month}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(salary)}
                                                        className="text-blue-600 hover:text-blue-900 font-medium"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(salary.SalaryID)}
                                                        className="text-red-600 hover:text-red-900 font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Salary;
