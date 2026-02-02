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
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card-glass w-full max-w-[400px] p-8 md:p-12 animate-fade-in-up">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-semibold text-[#1D1D1F] tracking-tight">Welcome Back</h2>
                    <p className="text-[#86868B] mt-2 text-sm">Please sign in to continue</p>
                </div>

                {serverError && (
                    <div className="p-3 mb-6 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 text-center">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-xs font-medium text-[#86868B] uppercase tracking-wide mb-2 ml-1">Email</label>
                        <input
                            {...register('email', { required: 'Email is required' })}
                            type="email"
                            placeholder="name@example.com"
                            className="input-field"
                        />
                        {errors.email && <span className="text-xs text-red-500 mt-1 ml-1 block">{String(errors.email.message)}</span>}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[#86868B] uppercase tracking-wide mb-2 ml-1">Password</label>
                        <input
                            {...register('password', { required: 'Password is required' })}
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
                        Sign In
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-[#86868B]">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-[#0071E3] hover:underline transition-colors">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
