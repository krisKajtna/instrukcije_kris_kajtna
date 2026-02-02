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
            await api.post('/auth/register', data);
            navigate('/login');
        } catch (error: any) {
            setServerError(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card-glass w-full max-w-[440px] p-8 md:p-12">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-semibold text-[#1D1D1F] tracking-tight">Create Account</h2>
                    <p className="text-[#86868B] mt-2 text-sm">Join to start learning or teaching</p>
                </div>

                {serverError && (
                    <div className="p-3 mb-6 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 text-center">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-[#86868B] uppercase tracking-wide mb-2 ml-1">First Name</label>
                            <input
                                {...register('firstName', { required: 'Required' })}
                                placeholder="John"
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[#86868B] uppercase tracking-wide mb-2 ml-1">Last Name</label>
                            <input
                                {...register('lastName', { required: 'Required' })}
                                placeholder="Doe"
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[#86868B] uppercase tracking-wide mb-2 ml-1">Email</label>
                        <input
                            {...register('email', { required: 'Required' })}
                            type="email"
                            placeholder="john@example.com"
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[#86868B] uppercase tracking-wide mb-2 ml-1">Role</label>
                        <div className="relative">
                            <select
                                {...register('role')}
                                className="input-field appearance-none cursor-pointer"
                            >
                                <option value="STUDENT">Student</option>
                                <option value="TUTOR">Tutor</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[#86868B] uppercase tracking-wide mb-2 ml-1">Password</label>
                        <input
                            {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
                            type="password"
                            placeholder="••••••••"
                            className="input-field"
                        />
                        {errors.password && <span className="text-xs text-red-500 mt-1 ml-1 block">{String(errors.password.message)}</span>}
                    </div>

                    <button
                        type="submit"
                        className="btn-primary w-full mt-4"
                    >
                        Register
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-[#86868B]">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-[#0071E3] hover:underline transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
