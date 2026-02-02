import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function WalletPage() {
    const { user, login } = useAuth(); // We'll use login to update user state if needed, or we might need a separate updateBalance function
    const [amount, setAmount] = useState('100');
    const [msg, setMsg] = useState('');

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setMsg('');
            const res = await api.post('/wallet/deposit', { amount: Number(amount) });

            // Update local context
            if (user) {
                login(localStorage.getItem('token') || '', res.data);
            }
            setMsg(`Successfully added ${amount} tokens!`);
            setTimeout(() => setMsg(''), 3000);
        } catch (error) {
            console.error(error);
            setMsg('Failed to deposit tokens.');
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4 py-12">
            <h2 className="text-3xl font-semibold text-[#1D1D1F] mb-8 tracking-tight text-center">Wallet</h2>

            <div className="card-glass p-8 mb-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                <p className="text-[#86868B] font-medium mb-4 uppercase tracking-wider text-xs">Current Balance</p>
                <div className="flex items-baseline justify-center gap-2">
                    <span className="text-6xl font-bold text-[#1D1D1F] tracking-tighter">{user?.balance}</span>
                    <span className="text-xl text-[#86868B] font-medium">tokens</span>
                </div>
            </div>

            <div className="card-glass p-8">
                <h3 className="text-xl font-semibold text-[#1D1D1F] mb-6">Add Funds</h3>

                {msg && <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${msg.includes('Success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{msg}</div>}

                <form onSubmit={handleDeposit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-medium text-[#86868B] uppercase tracking-wide mb-2 ml-1">Select Amount</label>
                        <div className="relative">
                            <select
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="input-field appearance-none cursor-pointer"
                            >
                                <option value="50">50 Tokens - 5€</option>
                                <option value="100">100 Tokens - 9€</option>
                                <option value="200">200 Tokens - 16€</option>
                                <option value="500">500 Tokens - 35€</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full shadow-lg hover:shadow-xl transform active:scale-[0.98] transition-all">
                        Purchase Tokens
                    </button>

                    <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[#86868B]">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Mock payment environment. No real money charged.
                    </div>
                </form>
            </div>
        </div>
    );
}
