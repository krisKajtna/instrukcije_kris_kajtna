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
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            <div className="mb-12 text-center">
                <h2 className="text-4xl font-semibold tracking-tight text-[#1D1D1F] mb-4">Find a Tutor</h2>
                <p className="text-[#86868B] max-w-lg mx-auto">Choose a subject to see available tutors and book your session instantly.</p>
            </div>

            <div className="mb-12 max-w-md mx-auto">
                <div className="relative">
                    <select
                        className="input-field appearance-none cursor-pointer"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                        <option value="">Select a subject to learn...</option>
                        {subjects.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {loading && <div className="text-center text-[#86868B] animate-pulse">Loading tutors...</div>}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tutors.map(t => (
                    <div key={t.tutorId} className="card-glass p-8 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col items-center text-center">
                        <div className="w-24 h-24 mb-6 rounded-full overflow-hidden shadow-inner bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400">
                            {t.tutor.avatarUrl ? (
                                <img src={`http://localhost:3000${t.tutor.avatarUrl}`} alt="" className="w-full h-full object-cover" />
                            ) : (
                                t.tutor.firstName[0]
                            )}
                        </div>

                        <h3 className="font-semibold text-xl text-[#1D1D1F] mb-1">{t.tutor.firstName} {t.tutor.lastName}</h3>
                        <p className="text-[#0071E3] font-medium mb-4 bg-blue-50 px-3 py-1 rounded-full text-sm">{t.price} tokens / hr</p>

                        {t.tutor.bio && <p className="text-[#86868B] text-sm mb-6 line-clamp-2">{t.tutor.bio}</p>}

                        <button
                            onClick={() => setBookingTutor(t)}
                            className="btn-primary w-full mt-auto"
                        >
                            Book Session
                        </button>
                    </div>
                ))}
            </div>

            {selectedSubject && !loading && tutors.length === 0 && (
                <div className="text-center mt-12 p-12 bg-white/50 rounded-3xl border border-dashed border-gray-300">
                    <p className="text-[#86868B]">No tutors found for this subject yet.</p>
                </div>
            )}

            {/* Booking Modal */}
            {bookingTutor && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-scale-up">
                        <h3 className="text-2xl font-semibold mb-2 text-[#1D1D1F]">Book Session</h3>
                        <p className="text-[#86868B] text-sm mb-6">with {bookingTutor.tutor.firstName}</p>

                        {msg && <div className={`p-3 mb-6 rounded-xl text-sm ${msg.includes('confirmed') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{msg}</div>}

                        <div className="mb-6">
                            <label className="block text-xs font-medium text-[#86868B] uppercase tracking-wide mb-2 ml-1">Start Time</label>
                            <input
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div className="mb-8 bg-[#F5F5F7] p-4 rounded-xl text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-[#86868B]">Price/Hour</span>
                                <span className="font-medium text-[#1D1D1F]">{bookingTutor.price} tokens</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#86868B]">Your Balance</span>
                                <span className={`font-medium ${user && user.balance < bookingTutor.price ? 'text-red-500' : 'text-green-600'}`}>{user?.balance} tokens</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setBookingTutor(null)} className="btn-secondary flex-1">Cancel</button>
                            <button
                                onClick={handleBook}
                                disabled={!startTime || (user ? user.balance < bookingTutor.price : true)}
                                className="btn-primary flex-1"
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
