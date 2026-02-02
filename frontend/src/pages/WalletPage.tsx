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
            // res.data should be the updated user or balance? 
            // The backend deposit returns the User object (user.update result).

            // Update local context
            if (user) {
                // We reuse login to refresh the user in context. Ideally we'd have a setUser or refreshUser method.
                // Let's assume login updates the state.
                // Or we can manually construct the new user object if we just have the balance.
                // But wait, the backend `walletService.deposit` returns the updated user.
                login(localStorage.getItem('token') || '', res.data);
            }
            setMsg(`Successfully added ${amount} tokens!`);
        } catch (error) {
            console.error(error);
            setMsg('Failed to deposit tokens.');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow mt-8">
            <h2 className="text-2xl font-bold mb-6 text-center">My Wallet</h2>

            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 text-center mb-8">
                <p className="text-gray-600 mb-2">Current Balance</p>
                <p className="text-4xl font-bold text-indigo-600">{user?.balance} <span className="text-lg text-gray-500">tokens</span></p>
            </div>

            <h3 className="text-lg font-semibold mb-4">Buy Tokens</h3>
            {msg && <div className={`p-3 rounded mb-4 ${msg.includes('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{msg}</div>}

            <form onSubmit={handleDeposit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <select
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full border rounded p-2"
                    >
                        <option value="50">50 Tokens - 5€</option>
                        <option value="100">100 Tokens - 9€</option>
                        <option value="200">200 Tokens - 16€</option>
                        <option value="500">500 Tokens - 35€</option>
                    </select>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                    Purchase Tokens
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">This is a mock payment. No real money is charged.</p>
            </form>
        </div>
    );
}
