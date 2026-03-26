import { useState } from 'react';
import { useAuth } from '../../auth/useAuthContext';
import { sendEmailVerification } from 'firebase/auth';

export default function SettingsPage() {
    const { user } = useAuth();
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        setLoading(true);
        try {
            if (user) await sendEmailVerification(user);
            setSent(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        await user?.reload();
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-white p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold text-[#1D2B13] mb-12">Settings</h1>

                <div className="space-y-8">
                    {/* Security & Verification Card */}
                    <section className="bg-[#E9F5DB] rounded-[2.5rem] p-10 shadow-sm">
                        <h2 className="text-3xl font-bold text-[#1D2B13] mb-6">Account Security</h2>

                        {!user?.emailVerified ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-orange-700 bg-orange-50 p-4 rounded-2xl border border-orange-100">
                                    <span className="text-xl">⚠️</span>
                                    <p className="font-semibold">Email Verification Not Complete!</p>
                                </div>

                                <p className="text-gray-700 leading-relaxed">
                                    Your account is active, but we need to verify <span className="font-bold">{user?.email}</span> to enable all security features.
                                </p>

                                <div className="flex flex-wrap gap-4 mt-6">
                                    {!sent ? (
                                        <button
                                            onClick={handleVerify}
                                            disabled={loading}
                                            className="bg-[#1D2B13] text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-all disabled:opacity-50"
                                        >
                                            {loading ? 'Sending...' : 'Send Verification Link'}
                                        </button>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            <p className="text-[#1D2B13] font-medium">✓ Link sent! Check your inbox.</p>
                                            <button
                                                onClick={handleRefresh}
                                                className="text-[#1D2B13] border-2 border-[#1D2B13] px-8 py-3 rounded-full font-bold hover:bg-[#1D2B13] hover:text-white transition-all"
                                            >
                                                I've clicked the link (Refresh)
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 text-green-700 font-bold">
                                <span>Safe & Verified</span>
                                <div className="bg-green-100 p-1 rounded-full">✓</div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

