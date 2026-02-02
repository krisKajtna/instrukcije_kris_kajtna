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
        return new Date(dateStr).toLocaleString();
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">My Reservations</h2>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {reservations.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">No reservations found.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600">Subject</th>
                                    <th className="p-4 font-semibold text-gray-600">{user?.role === 'STUDENT' ? 'Tutor' : 'Student'}</th>
                                    <th className="p-4 font-semibold text-gray-600">Time</th>
                                    <th className="p-4 font-semibold text-gray-600">Price</th>
                                    <th className="p-4 font-semibold text-gray-600">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {reservations.map(res => (
                                    <tr key={res.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium">{res.subject.name}</td>
                                        <td className="p-4">
                                            {user?.role === 'STUDENT'
                                                ? `${res.tutor?.firstName} ${res.tutor?.lastName}`
                                                : `${res.student?.firstName} ${res.student?.lastName}`
                                            }
                                        </td>
                                        <td className="p-4 text-sm">
                                            <div>{formatDate(res.startTime)}</div>
                                            <div className="text-gray-500 text-xs">to {new Date(res.endTime).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="p-4 font-medium text-indigo-600">{res.price} 🪙</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                                {res.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
