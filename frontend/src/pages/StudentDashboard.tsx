import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Tutor {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    bio: string | null;
}

interface Subject {
    id: string;
    name: string;
}

interface SearchResult {
    userId: string; // The tutor's user ID is indirectly here via the relation, wait. The backend subjects/:id/tutors returns TutorSubject[] which has `tutor` object. 
    // Let's check the Service: include: { tutor: ... }
    // So the result item is: { id: "ts_id", price: 10, tutor: { ... } }
    // But wait, creating reservation needs `tutorId`. Is that `tutor.id` (User ID) or `TutorSubject.tutorId`? 
    // Prisma schema: TutorSubject has `tutorId` which is the User ID.
    tutorId: string;
    price: number;
    tutor: Tutor;
}

export default function StudentDashboard() {
    const { user, login } = useAuth();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [tutors, setTutors] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    // Booking Modal State
    const [bookingTutor, setBookingTutor] = useState<SearchResult | null>(null);
    const [startTime, setStartTime] = useState('');
    const [msg, setMsg] = useState('');

    useEffect(() => {
        api.get('/subjects').then(res => setSubjects(res.data));
    }, []);

    useEffect(() => {
        if (selectedSubject) {
            setLoading(true);
            api.get(`/subjects/${selectedSubject}/tutors`)
                .then(res => setTutors(res.data))
                .catch(console.error)
                .finally(() => setLoading(false));
        } else {
            setTutors([]);
        }
    }, [selectedSubject]);

    const handleBook = async () => {
        if (!bookingTutor || !startTime) return;

        // Default 1 hour duration
        const start = new Date(startTime);
        const end = new Date(start.getTime() + 60 * 60 * 1000);

        try {
            setMsg('');
            await api.post('/reservations', {
                tutorId: bookingTutor.tutorId, // This comes from the TutorSubject result
                subjectId: selectedSubject,
                startTime: start.toISOString(),
                endTime: end.toISOString()
            });

            // Refresh user balance in context
            if (user) {
                // We might need to fetch profile again or just deduct locally for UI speed
                const { data: updatedUser } = await api.get('/users/profile');
                login(localStorage.getItem('token') || '', updatedUser);
            }

            setMsg('Reservation confirmed!');
            setTimeout(() => {
                setBookingTutor(null);
                setMsg('');
                setStartTime('');
            }, 2000);
        } catch (error: any) {
            console.error(error);
            setMsg(error.response?.data?.message || 'Booking failed');
        }
    };

    return (
        <div className="p-6 relative">
            <h2 className="text-2xl font-bold mb-6">Find a Tutor</h2>

            <div className="mb-8">
                <select
                    className="w-full max-w-md border rounded p-3 text-lg"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                >
                    <option value="">Select a subject to learn...</option>
                    {subjects.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
            </div>

            {loading && <div>Loading tutors...</div>}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutors.map(t => (
                    <div key={t.tutorId} className="bg-white rounded-lg shadow-md overflow-hidden p-6 border hover:border-blue-500 transition">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-500 overflow-hidden">
                                {t.tutor.avatarUrl ? (
                                    <img src={`http://localhost:3000${t.tutor.avatarUrl}`} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    t.tutor.firstName[0]
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{t.tutor.firstName} {t.tutor.lastName}</h3>
                                <p className="text-blue-600 font-medium">{t.price} tokens / hr</p>
                            </div>
                        </div>
                        {t.tutor.bio && <p className="text-gray-600 text-sm mb-4 line-clamp-3">{t.tutor.bio}</p>}
                        <button
                            onClick={() => setBookingTutor(t)}
                            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                        >
                            Book Session
                        </button>
                    </div>
                ))}
            </div>

            {selectedSubject && !loading && tutors.length === 0 && (
                <p className="text-gray-500 text-center mt-8">No tutors found for this subject yet.</p>
            )}

            {/* Booking Modal */}
            {bookingTutor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-xl font-bold mb-4">Book Session with {bookingTutor.tutor.firstName}</h3>

                        {msg && <div className={`p-2 mb-4 rounded ${msg.includes('confirmed') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{msg}</div>}

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Start Time</label>
                            <input
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>

                        <div className="mb-6 bg-gray-50 p-3 rounded text-sm">
                            <div className="flex justify-between">
                                <span>Price/Hour:</span>
                                <span className="font-medium">{bookingTutor.price} tokens</span>
                            </div>
                            <div className="flex justify-between mt-1">
                                <span>Your Balance:</span>
                                <span className={`font-medium ${user && user.balance < bookingTutor.price ? 'text-red-600' : 'text-green-600'}`}>{user?.balance} tokens</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setBookingTutor(null)} className="flex-1 bg-gray-200 py-2 rounded">Cancel</button>
                            <button
                                onClick={handleBook}
                                disabled={!startTime || (user ? user.balance < bookingTutor.price : true)}
                                className="flex-1 bg-indigo-600 text-white py-2 rounded disabled:opacity-50"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
