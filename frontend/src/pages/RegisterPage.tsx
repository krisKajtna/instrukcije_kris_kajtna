import { useForm } from 'react-hook-form';
import api from '../lib/api';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const onSubmit = async (data: any) => {
        try {
            setServerError('');
            // Force default values or transform data if needed
            await api.post('/auth/register', data);
            navigate('/login'); // Redirect to login after successful registration
        } catch (error: any) {
            setServerError(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Account</h2>

                {serverError && (
                    <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                {...register('firstName', { required: 'Required' })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                {...register('lastName', { required: 'Required' })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            {...register('email', { required: 'Required' })}
                            type="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select {...register('role')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border">
                            <option value="STUDENT">Student</option>
                            <option value="TUTOR">Tutor</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
                            type="password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                        />
                        {errors.password && <span className="text-xs text-red-500">{String(errors.password.message)}</span>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Register
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
