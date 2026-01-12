import { useState, useEffect } from 'react';
import { getDepartments, createDepartment } from '../services/api';

function Department() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        DepartmentCode: '',
        DepartmentName: '',
        GrossSalary: '',
        TotalDeduction: ''
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

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
            await createDepartment(formData);
            setMessage({ type: 'success', text: 'Department created successfully!' });
            setFormData({
                DepartmentCode: '',
                DepartmentName: '',
                GrossSalary: '',
                TotalDeduction: ''
            });
            fetchDepartments();
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to create department'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
                <p className="text-gray-600 mt-2">Add new departments to the system</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Department</h2>

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
                            <label className="form-label">Department Code</label>
                            <input
                                type="text"
                                name="DepartmentCode"
                                value={formData.DepartmentCode}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="e.g., CW, ST, MC"
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label">Department Name</label>
                            <input
                                type="text"
                                name="DepartmentName"
                                value={formData.DepartmentName}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="e.g., Carwash"
                                required
                            />
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

                        <button
                            type="submit"
                            className="btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Department'}
                        </button>
                    </form>
                </div>

                {/* List Section */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Existing Departments</h2>

                    <div className="space-y-3">
                        {departments.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No departments found</p>
                        ) : (
                            departments.map((dept) => (
                                <div key={dept.DepartmentCode} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{dept.DepartmentName}</h3>
                                            <p className="text-sm text-gray-600">Code: {dept.DepartmentCode}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Gross: {Number(dept.GrossSalary).toLocaleString()} RWF</p>
                                            <p className="text-sm text-gray-600">Deduction: {Number(dept.TotalDeduction).toLocaleString()} RWF</p>
                                            <p className="text-sm font-medium text-primary-600">
                                                Net: {(Number(dept.GrossSalary) - Number(dept.TotalDeduction)).toLocaleString()} RWF
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Department;
