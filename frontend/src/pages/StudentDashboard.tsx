import { useEffect, useState } from 'react';
import api from '../lib/api';

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
    id: string;
    price: number;
    tutor: Tutor;
}

export default function StudentDashboard() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [tutors, setTutors] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);

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

    return (
        <div className="p-6">
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
                    <div key={t.id} className="bg-white rounded-lg shadow-md overflow-hidden p-6 border hover:border-blue-500 transition">
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
                        <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                            Book Session
                        </button>
                    </div>
                ))}
            </div>

            {selectedSubject && !loading && tutors.length === 0 && (
                <p className="text-gray-500 text-center mt-8">No tutors found for this subject yet.</p>
            )}
        </div>
    );
}
