import { useState, useEffect } from 'react';
import { getEmployees, createEmployee, getDepartments } from '../services/api';

function Employee() {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        EmployeeNumber: '',
        FirstName: '',
        LastName: '',
        Position: '',
        Address: '',
        Telephone: '',
        Gender: '',
        HiredDate: '',
        DepartmentCode: ''
    });

    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await getEmployees();
            setEmployees(response.data.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
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
            await createEmployee(formData);
            setMessage({ type: 'success', text: 'Employee created successfully!' });
            setFormData({
                EmployeeNumber: '',
                FirstName: '',
                LastName: '',
                Position: '',
                Address: '',
                Telephone: '',
                Gender: '',
                HiredDate: '',
                DepartmentCode: ''
            });
            fetchEmployees();
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to create employee'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
                <p className="text-gray-600 mt-2">Add new employees to the system</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1 card">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Employee</h2>

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
                            <label className="form-label">Employee Number</label>
                            <input
                                type="text"
                                name="EmployeeNumber"
                                value={formData.EmployeeNumber}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="e.g., EMP001"
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                name="FirstName"
                                value={formData.FirstName}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                name="LastName"
                                value={formData.LastName}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label">Position</label>
                            <input
                                type="text"
                                name="Position"
                                value={formData.Position}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="e.g., Mechanic, Cashier"
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label">Address</label>
                            <input
                                type="text"
                                name="Address"
                                value={formData.Address}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">Telephone</label>
                            <input
                                type="tel"
                                name="Telephone"
                                value={formData.Telephone}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="e.g., +250788123456"
                            />
                        </div>

                        <div>
                            <label className="form-label">Gender</label>
                            <select
                                name="Gender"
                                value={formData.Gender}
                                onChange={handleChange}
                                className="form-input"
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="form-label">Hired Date</label>
                            <input
                                type="date"
                                name="HiredDate"
                                value={formData.HiredDate}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

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

                        <button
                            type="submit"
                            className="btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Employee'}
                        </button>
                    </form>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 card">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">All Employees ({employees.length})</h2>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emp #</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {employees.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                            No employees found
                                        </td>
                                    </tr>
                                ) : (
                                    employees.map((emp) => (
                                        <tr key={emp.EmployeeNumber} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{emp.EmployeeNumber}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{emp.FirstName} {emp.LastName}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{emp.Position}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{emp.DepartmentName}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{emp.Telephone || 'N/A'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{emp.Gender}</td>
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

export default Employee;
