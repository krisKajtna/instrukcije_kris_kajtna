import { useEffect, useState } from 'react';
import api from '../lib/api';

interface Subject {
    id: string;
    name: string;
}

interface TutorSubject {
    id: string;
    price: number;
    subject: Subject;
}

export default function TutorDashboard() {
    const [mySubjects, setMySubjects] = useState<TutorSubject[]>([]);
    const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [subjectsRes, mySubjectsRes] = await Promise.all([
                api.get('/subjects'),
                api.get('/users/subjects')
            ]);
            setAllSubjects(subjectsRes.data);
            setMySubjects(mySubjectsRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/users/subjects', {
                subjectId: selectedSubject,
                price: Number(price)
            });
            // Refresh list
            const res = await api.get('/users/subjects');
            setMySubjects(res.data);
            setSelectedSubject('');
            setPrice('');
        } catch (error) {
            alert('Failed to add subject');
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Tutor Dashboard</h2>

            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h3 className="text-xl font-semibold mb-4">Add Teaching Subject</h3>
                <form onSubmit={handleAddSubject} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Subject</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full border rounded p-2"
                            required
                        >
                            <option value="">Select a subject...</option>
                            {allSubjects.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-32">
                        <label className="block text-sm font-medium mb-1">Price (Tokens)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full border rounded p-2"
                            min="1"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Add
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">My Subjects</h3>
                <div className="grid gap-4">
                    {mySubjects.map(ts => (
                        <div key={ts.id} className="flex justify-between items-center border-b pb-2">
                            <span className="font-medium">{ts.subject.name}</span>
                            <span className="text-gray-600">{ts.price} tokens/hour</span>
                        </div>
                    ))}
                    {mySubjects.length === 0 && <p className="text-gray-500">No subjects added yet.</p>}
                </div>
            </div>
        </div>
    );
}
