import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const onSubmit = async (data: any) => {
        try {
            setServerError('');
            const response = await api.post('/auth/login', data);
            login(response.data.access_token, response.data.user);
            navigate('/dashboard'); // Redirect to dashboard after login
        } catch (error: any) {
            setServerError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>

                {serverError && (
                    <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            {...register('email', { required: 'Email is required' })}
                            type="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                        />
                        {errors.email && <span className="text-xs text-red-500">{String(errors.email.message)}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            {...register('password', { required: 'Password is required' })}
                            type="password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                        />
                        {errors.password && <span className="text-xs text-red-500">{String(errors.password.message)}</span>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
