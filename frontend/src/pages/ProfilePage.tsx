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
        } catch (err) {
            console.error(err);
            setMsg('Avatar upload failed.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

            {msg && <div className="bg-blue-100 text-blue-800 p-3 rounded mb-4">{msg}</div>}

            <div className="mb-8 flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden text-2xl font-bold text-gray-500">
                    {user?.avatarUrl ? (
                        <img src={`http://localhost:3000${user.avatarUrl}`} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        user?.firstName?.[0]
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Change Avatar</label>
                    <input type="file" onChange={onFileUpload} accept="image/*" />
                </div>
            </div>

            <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input {...register('firstName')} className="mt-1 block w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input {...register('lastName')} className="mt-1 block w-full border rounded p-2" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea {...register('bio')} rows={4} className="mt-1 block w-full border rounded p-2" />
                </div>

                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                    Save Changes
                </button>
            </form>
        </div>
    );
}
