import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Reservation {
    id: string;
    startTime: string;
    endTime: string;
    price: number;
    status: string;
    subject: {
        name: string;
    };
    tutor?: {
        firstName: string;
        lastName: string;
    };
    student?: {
        firstName: string;
        lastName: string;
    };
}

export default function ReservationsPage() {
    const { user } = useAuth();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const res = await api.get('/reservations');
            setReservations(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="max-w-5xl mx-auto p-8 min-h-screen">
            <h2 className="text-3xl font-semibold text-[#1D1D1F] mb-8 tracking-tight">My Reservations</h2>

            {loading ? (
                <div className="text-[#86868B] animate-pulse">Loading reservations...</div>
            ) : (
                <div className="card-glass overflow-hidden">
                    {reservations.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-[#1D1D1F] font-medium mb-2">No reservations yet</p>
                            <p className="text-[#86868B] text-sm">Book a session to get started.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-5 text-xs font-semibold text-[#86868B] uppercase tracking-wider">Subject</th>
                                        <th className="p-5 text-xs font-semibold text-[#86868B] uppercase tracking-wider">{user?.role === 'STUDENT' ? 'Tutor' : 'Student'}</th>
                                        <th className="p-5 text-xs font-semibold text-[#86868B] uppercase tracking-wider">Date & Time</th>
                                        <th className="p-5 text-xs font-semibold text-[#86868B] uppercase tracking-wider">Price</th>
                                        <th className="p-5 text-xs font-semibold text-[#86868B] uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {reservations.map(res => (
                                        <tr key={res.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="p-5 font-medium text-[#1D1D1F]">{res.subject.name}</td>
                                            <td className="p-5 text-[#1D1D1F]">
                                                {user?.role === 'STUDENT'
                                                    ? `${res.tutor?.firstName} ${res.tutor?.lastName}`
                                                    : `${res.student?.firstName} ${res.student?.lastName}`
                                                }
                                            </td>
                                            <td className="p-5">
                                                <div className="text-sm font-medium text-[#1D1D1F]">{formatDate(res.startTime)}</div>
                                                <div className="text-xs text-[#86868B] mt-0.5">
                                                    {formatTime(res.startTime)} - {formatTime(res.endTime)}
                                                </div>
                                            </td>
                                            <td className="p-5 font-medium text-[#0071E3]">{res.price} tokens</td>
                                            <td className="p-5">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${res.status === 'CONFIRMED' || res.status === 'COMPLETED'
                                                        ? 'bg-green-50 text-green-700 border-green-100'
                                                        : res.status === 'CANCELLED'
                                                            ? 'bg-red-50 text-red-700 border-red-100'
                                                            : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                    }`}>
                                                    {res.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
