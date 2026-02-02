import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { useState } from 'react';

export default function ProfilePage() {
    const { user, login } = useAuth(); // login is used to update the user in context
    const { register, handleSubmit } = useForm({
        defaultValues: {
            firstName: user?.firstName,
            lastName: user?.lastName,
            bio: user?.bio,
        }
    });
    const [msg, setMsg] = useState('');

    const onUpdateProfile = async (data: any) => {
        try {
            const res = await api.patch('/users/profile', data);
            // Update local context
            const updatedUser = { ...user, ...res.data };
            login(localStorage.getItem('token') || '', updatedUser);
            setMsg('Profile updated successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error(err);
            setMsg('Failed to update profile.');
        }
    };

    const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            const res = await api.patch('/users/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Update local context
            const updatedUser = { ...user, ...res.data };
            login(localStorage.getItem('token') || '', updatedUser);
            setMsg('Avatar updated!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error(err);
            setMsg('Avatar upload failed.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 py-12">
            <h2 className="text-3xl font-semibold text-[#1D1D1F] mb-8 tracking-tight">Settings</h2>

            {msg && <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 mb-8 flex items-center shadow-sm">{msg}</div>}

            <div className="card-glass p-8 mb-8">
                <h3 className="text-lg font-medium text-[#1D1D1F] mb-6">Public Profile</h3>

                <div className="flex items-center gap-8 mb-8 pb-8 border-b border-gray-100">
                    <div className="relative group cursor-pointer">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden text-3xl font-bold text-gray-400 border-4 border-white shadow-sm transition-transform group-hover:scale-105">
                            {user?.avatarUrl ? (
                                <img src={`http://localhost:3000${user.avatarUrl}`} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                user?.firstName?.[0]
                            )}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-medium">Edit</span>
                        </div>
                        <input
                            type="file"
                            onChange={onFileUpload}
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-[#1D1D1F]">{user?.firstName} {user?.lastName}</h4>
                        <p className="text-[#86868B] text-sm mt-1">{user?.role}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-medium text-[#86868B] uppercase tracking-wide mb-2 ml-1">First Name</label>
                            <input {...register('firstName')} className="input-field" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[#86868B] uppercase tracking-wide mb-2 ml-1">Last Name</label>
                            <input {...register('lastName')} className="input-field" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[#86868B] uppercase tracking-wide mb-2 ml-1">Bio</label>
                        <textarea
                            {...register('bio')}
                            rows={4}
                            className="input-field resize-none"
                            placeholder="Tell us a bit about yourself..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button type="submit" className="btn-primary">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            <div className="text-center text-[#86868B] text-xs">
                Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
            </div>
        </div>
    );
}
