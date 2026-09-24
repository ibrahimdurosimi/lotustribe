import React, { useState, useContext, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, animate } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { usePaystackPayment } from 'react-paystack';
import { 
    LayoutDashboard, Wallet, TrendingUp, History, Download, ArrowUpRight, ArrowDownRight, 
    Settings, Target, Plus, User, FileText, Bell, Lock, CheckCircle, Share2, Info,
    Zap, Sparkles, X, Award, AlertTriangle, ShieldCheck, Check
} from 'lucide-react';
import { AuthContext } from './App';
import { doc, updateDoc, collection, addDoc, query, getDocs, orderBy, serverTimestamp, where, arrayUnion, increment } from 'firebase/firestore';
import { db } from './lib/firebase';
import html2canvas from 'html2canvas';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import confetti from 'canvas-confetti';

const CountUp = ({ to, duration = 1.5 }: { to: number; duration?: number }) => {
    const [value, setValue] = useState(0);

    useEffect(() => {
        const controls = animate(0, to, {
            duration,
            onUpdate: (latest) => setValue(latest),
            ease: "easeOut"
        });
        return () => controls.stop();
    }, [to, duration]);

    return <>{value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>;
};

// Gamified First Investment Celebration Modal
const FirstInvestmentRewardModal = ({
    isOpen,
    onClose,
    amount,
    xp = 250
}: {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    xp?: number;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white rounded-[2.5rem] p-8 md:p-10 max-w-md w-full text-center relative neo-shadow overflow-hidden"
            >
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="relative mx-auto w-24 h-24 mb-5 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-genz-lime animate-ping opacity-25"></div>
                    <div className="w-20 h-20 rounded-full bg-genz-lime border-4 border-black flex items-center justify-center shadow-lg relative z-10 text-4xl">
                        🎒
                    </div>
                </div>

                <div className="inline-flex items-center gap-1.5 bg-black text-genz-lime px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-3">
                    <Sparkles size={14} /> Achievement Unlocked
                </div>

                <h2 className="font-display font-black text-3xl uppercase text-lotus-dark dark:text-white mb-2 leading-tight">
                    First Bag Secured!
                </h2>

                <div className="bg-amber-100 dark:bg-amber-950/60 border-2 border-amber-400 rounded-2xl p-4 mb-5 text-center">
                    <div className="font-display font-black text-2xl text-amber-900 dark:text-amber-200">
                        +{xp} XP EARNED ⭐
                    </div>
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-300 mt-0.5">
                        Added to your Tribe Investor Rank
                    </p>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium leading-relaxed mb-6">
                    You officially funded your first investment of <strong className="text-black dark:text-white">₦{amount.toLocaleString()}</strong>! The hardest step in investing is getting started. Welcome to the Tribe of halal wealth builders.
                </p>

                <button
                    onClick={onClose}
                    className="neo-btn bg-black text-white w-full py-4 text-base font-extrabold uppercase hover:scale-[1.02] transition-transform"
                >
                    Flex My Bag & View Portfolio 🚀
                </button>
            </motion.div>
        </div>
    );
};

// Quick Deposit Modal directly on Dashboard Overview
const QuickDepositModal = ({
    isOpen,
    onClose,
    user,
    userProfile,
    initialFund = 'halal',
    onSuccessDeposit,
    onOpenFullFunding
}: {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    userProfile: any;
    initialFund?: 'halal' | 'fif';
    onSuccessDeposit: (amount: number, fund: 'halal' | 'fif') => void;
    onOpenFullFunding: (fund: 'halal' | 'fif', amount: string) => void;
}) => {
    const [fund, setFund] = useState<'halal' | 'fif'>(initialFund);
    const [amount, setAmount] = useState('10000');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (isOpen) {
            setFund(initialFund);
            setErrorMsg('');
        }
    }, [isOpen, initialFund]);

    if (!isOpen) return null;

    const isTier1 = userProfile?.kycTier === 'tier1';
    const presets = [5000, 10000, 25000, 50000];

    const handleQuickDeposit = async () => {
        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount < 1000) {
            setErrorMsg('Minimum investment amount is ₦1,000.');
            return;
        }

        if (isTier1 && numAmount > 50000) {
            setErrorMsg('Tier 1 accounts have a maximum deposit cap of ₦50,000. Upgrade to Tier 2 for unlimited deposits.');
            return;
        }

        setIsSubmitting(true);
        setErrorMsg('');

        try {
            if (user) {
                const dbField = fund === 'halal' ? 'halalBalance' : 'fifBalance';
                const currentBalance = (fund === 'halal' ? userProfile?.halalBalance : userProfile?.fifBalance) || 0;
                
                const isFirstDeposit = (!userProfile?.badges || !userProfile.badges.includes('First Bag Secured')) &&
                                       (!userProfile?.firstInvestmentCompleted) &&
                                       (!userProfile?.totalInvested || userProfile.totalInvested === 0);

                const updates: any = {
                    [dbField]: currentBalance + numAmount,
                    totalInvested: increment(numAmount),
                };

                if (isFirstDeposit) {
                    updates.badges = arrayUnion('First Bag Secured');
                    updates.xp = increment(250);
                    updates.firstInvestmentCompleted = true;
                }

                await updateDoc(doc(db, 'users', user.uid), updates);
                await addDoc(collection(db, 'users', user.uid, 'transactions'), {
                    type: 'Quick Deposit',
                    fund: fund === 'halal' ? 'Lotus Halal Fund' : 'Lotus FIF Fund',
                    amount: numAmount,
                    status: 'SUCCESS',
                    createdAt: serverTimestamp()
                });

                setIsSubmitting(false);
                onClose();
                onSuccessDeposit(numAmount, fund);
            }
        } catch (e) {
            console.error('Quick deposit error:', e);
            setErrorMsg('Unable to complete payment simulation. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white rounded-[2.5rem] p-6 md:p-8 max-w-lg w-full relative neo-shadow overflow-hidden"
            >
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 bg-genz-lime text-black font-extrabold text-xs px-3 py-1 rounded-full border border-black uppercase mb-2">
                            <Zap size={14} className="fill-black" /> Quick Deposit
                        </div>
                        <h2 className="font-display font-extrabold text-2xl uppercase">
                            Instant Portfolio Funding
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {isTier1 && (
                    <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 rounded-xl p-3 mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-base">⚡</span>
                            <p className="text-xs text-amber-900 dark:text-amber-200 font-bold">
                                Tier 1 Active (₦50,000 Deposit Limit)
                            </p>
                        </div>
                        <Link 
                            to="/invest/onboarding?upgrade=true"
                            className="text-[11px] font-extrabold text-black dark:text-white underline hover:opacity-80"
                        >
                            Upgrade
                        </Link>
                    </div>
                )}

                {/* Fund Selection */}
                <div className="mb-5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Select Target Fund
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setFund('halal')}
                            className={`p-3 rounded-2xl border-2 text-left transition-all ${
                                fund === 'halal'
                                    ? 'border-black bg-genz-pink/20 shadow-sm'
                                    : 'border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            <div className="font-display font-bold text-sm uppercase">Lotus Halal Fund</div>
                            <div className="text-[11px] text-gray-500 font-medium">Equities • Growth</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFund('fif')}
                            className={`p-3 rounded-2xl border-2 text-left transition-all ${
                                fund === 'fif'
                                    ? 'border-black bg-genz-lime/20 shadow-sm'
                                    : 'border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            <div className="font-display font-bold text-sm uppercase">Lotus FIF Fund</div>
                            <div className="text-[11px] text-gray-500 font-medium">Fixed Income • Low Risk</div>
                        </button>
                    </div>
                </div>

                {/* Amount Selection */}
                <div className="mb-5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Amount (₦)
                    </label>
                    <div className="relative mb-3">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-bold text-xl text-gray-400">₦</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
                                setErrorMsg('');
                            }}
                            className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-3.5 pl-10 font-display font-bold text-xl focus:border-black outline-none"
                            placeholder="10000"
                        />
                    </div>

                    {/* Quick Amount Chips */}
                    <div className="grid grid-cols-4 gap-2">
                        {presets.map((amt) => (
                            <button
                                key={amt}
                                type="button"
                                onClick={() => {
                                    setAmount(amt.toString());
                                    setErrorMsg('');
                                }}
                                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                                    amount === amt.toString()
                                        ? 'bg-black text-white border-black'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-transparent hover:border-gray-400'
                                }`}
                            >
                                ₦{amt >= 1000 ? `${amt / 1000}k` : amt}
                            </button>
                        ))}
                    </div>
                </div>

                {errorMsg && (
                    <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-bold mb-4 flex items-center justify-between">
                        <span>{errorMsg}</span>
                        {isTier1 && Number(amount) > 50000 && (
                            <button
                                type="button"
                                onClick={() => setAmount('50000')}
                                className="underline ml-2 uppercase"
                            >
                                Cap to ₦50k
                            </button>
                        )}
                    </div>
                )}

                {/* Reward Callout */}
                {(!userProfile?.badges || !userProfile.badges.includes('First Bag Secured')) && (
                    <div className="bg-genz-lime/20 border border-black/20 rounded-xl p-3 mb-5 flex items-center gap-2">
                        <span className="text-xl">🎒</span>
                        <p className="text-xs font-bold text-black dark:text-white">
                            First deposit awards <strong>"First Bag Secured" Badge</strong> and <strong>+250 XP</strong>!
                        </p>
                    </div>
                )}

                <div className="space-y-2">
                    <button
                        type="button"
                        onClick={handleQuickDeposit}
                        disabled={isSubmitting}
                        className="neo-btn bg-lotus-dark text-white w-full py-4 text-base font-extrabold uppercase flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {isSubmitting ? (
                            <span>Processing Deposit...</span>
                        ) : (
                            <>
                                <span>Deposit ₦{Number(amount || 0).toLocaleString()} Now</span>
                                <Zap size={18} className="fill-current" />
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onOpenFullFunding(fund, amount);
                        }}
                        className="w-full py-2.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white uppercase transition-colors"
                    >
                        Or use full Funding Options (Auto-Invest, Bank Transfer) →
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const DashboardLayout = ({ children, activeTab, setActiveTab }: { children: React.ReactNode, activeTab: string, setActiveTab: (t: string) => void }) => {
    const navItems = [
        { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
        { id: 'funding', icon: Wallet, label: 'Funding' },
        { id: 'transactions', icon: History, label: 'Transactions' },
        { id: 'certificate', icon: Download, label: 'Certificate' },
        { id: 'settings', icon: Settings, label: 'Settings' }
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#111] pt-24 pb-20 md:pb-0 font-sans text-lotus-dark dark:text-white flex justify-center">
            <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-8 mt-8">
                <aside className="md:flex flex-col w-full md:w-64 shrink-0 md:h-[calc(100vh-140px)] md:sticky top-32">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl neo-border neo-shadow p-6 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible flex-1">
                        <h2 className="hidden md:block font-display font-bold text-xl uppercase mb-6 text-gray-500 dark:text-gray-400">My Wealth</h2>
                        
                        {navItems.map(item => (
                            <button 
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all whitespace-nowrap 
                                    ${activeTab === item.id 
                                        ? 'bg-genz-lime neo-border shadow-[2px_2px_0_0_#121212] translate-y-[-2px]' 
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-black dark:text-white'}`}
                            >
                                <item.icon className="w-6 h-6" /> <span className="hidden md:inline">{item.label}</span>
                            </button>
                        ))}

                        <div className="hidden md:block mt-auto bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border-2 border-gray-100 dark:border-gray-800">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Need help with your portfolio?</p>
                            <button className="text-sm font-bold text-lotus-red hover:underline decoration-2 underline-offset-4">Talk to an Advisor</button>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 min-w-0 pb-12">
                    {children}
                </main>
            </div>
        </div>
    );
};

export const InvestDashboard = () => {
    const { user, userProfile, refreshProfile } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('overview');
    const location = useLocation();

    // Quick Deposit Modal State
    const [isQuickDepositOpen, setIsQuickDepositOpen] = useState(false);
    const [quickDepositFund, setQuickDepositFund] = useState<'halal' | 'fif'>('halal');
    const [prefilledAmount, setPrefilledAmount] = useState('10000');

    // Gamification Reward Celebration Modal
    const [rewardCelebration, setRewardCelebration] = useState<{
        isOpen: boolean;
        amount: number;
        xp: number;
    } | null>(null);

    // Trigger Quick Deposit if navigated with state
    useEffect(() => {
        if (location.state?.openQuickDeposit) {
            if (location.state?.fund) setQuickDepositFund(location.state.fund);
            setIsQuickDepositOpen(true);
        }
    }, [location.state]);

    const fifBalance = userProfile?.fifBalance || 0;
    const halalBalance = userProfile?.halalBalance || 0;
    const totalBalance = fifBalance + halalBalance;
    const totalEarnings = 0; // Stub for actual earnings
    
    // Default allocations if 0 to show visual
    const halalPercent = totalBalance > 0 ? Math.round((halalBalance / totalBalance) * 100) : 50;
    const fifPercent = totalBalance > 0 ? Math.round((fifBalance / totalBalance) * 100) : 50;

    const handleOpenQuickDeposit = (fund: 'halal' | 'fif' = 'halal', amount: string = '10000') => {
        setQuickDepositFund(fund);
        setPrefilledAmount(amount);
        setIsQuickDepositOpen(true);
    };

    const handleRewardUnlocked = (reward: { badge: string; xp: number; amount: number }) => {
        setRewardCelebration({
            isOpen: true,
            amount: reward.amount,
            xp: reward.xp
        });
    };

    const handleQuickDepositSuccess = (amount: number, fund: 'halal' | 'fif') => {
        refreshProfile();
        const isFirst = (!userProfile?.badges || !userProfile.badges.includes('First Bag Secured')) &&
                        (!userProfile?.firstInvestmentCompleted) &&
                        (!userProfile?.totalInvested || userProfile.totalInvested === 0);

        if (isFirst) {
            confetti({
                particleCount: 160,
                spread: 90,
                origin: { y: 0.5 },
                colors: ['#000000', '#D1FD0A', '#FF70A6', '#FFFFFF', '#0A2540']
            });
            handleRewardUnlocked({
                badge: 'First Bag Secured',
                xp: 250,
                amount
            });
        }
    };

    return (
        <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                >
                    {activeTab === 'overview' && (
                        <>
                            {/* Header Welcome & Quick Action Shortcuts */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-gray-100 dark:border-gray-800 pb-6">
                                <div>
                                    <h1 className="text-4xl font-display font-extrabold uppercase">
                                        Welcome back, <span className="text-[#C10202]">{user?.displayName?.split(' ')[0] || 'Investor'}</span>!
                                    </h1>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Here's how your Halal portfolio is performing today.</p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <button className="neo-btn bg-white dark:bg-gray-900 text-black dark:text-white px-5 py-3 text-sm hidden sm:flex items-center gap-2">
                                        <Download size={16}/> Statement
                                    </button>
                                    <button 
                                        onClick={() => handleOpenQuickDeposit('halal')} 
                                        className="neo-btn bg-genz-lime text-black px-6 py-3 text-sm font-extrabold flex items-center gap-2 border-2 border-black"
                                    >
                                        <Zap size={16} className="fill-black" /> + Quick Deposit
                                    </button>
                                    <button onClick={() => setActiveTab('funding')} className="neo-btn bg-black text-white px-6 py-3 text-sm font-bold">
                                        Funding Tab
                                    </button>
                                </div>
                            </div>

                            {/* Progressive KYC Tier Status Banner */}
                            {userProfile?.kycTier === 'tier1' && (
                                <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-black rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 neo-shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-300 text-black flex items-center justify-center font-black text-lg border-2 border-black shrink-0">
                                            ⚡
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="font-display font-bold text-sm uppercase text-amber-950 dark:text-amber-100">
                                                    Tier 1 Starter Account Active (₦50,000 Deposit Cap)
                                                </h4>
                                                <span className="bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-amber-400">
                                                    Express KYC
                                                </span>
                                            </div>
                                            <p className="text-xs text-amber-800 dark:text-amber-300 font-medium mt-0.5">
                                                You can deposit up to ₦50,000 right now. Upgrade to Tier 2 for unlimited investments and instant bank withdrawals.
                                            </p>
                                        </div>
                                    </div>
                                    <Link 
                                        to="/invest/onboarding?upgrade=true"
                                        className="neo-btn bg-amber-300 hover:bg-amber-400 text-black px-4 py-2 text-xs font-extrabold uppercase shrink-0 transition-transform"
                                    >
                                        Upgrade to Tier 2 →
                                    </Link>
                                </div>
                            )}

                            {!userProfile?.kycCompleted && (
                                <div className="bg-genz-lime/20 border-2 border-black rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 neo-shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-genz-lime text-black flex items-center justify-center font-black text-lg border-2 border-black shrink-0">
                                            ⚡
                                        </div>
                                        <div>
                                            <h4 className="font-display font-bold text-sm uppercase">
                                                Activate Your Investor Account
                                            </h4>
                                            <p className="text-xs text-gray-600 dark:text-gray-300 font-medium mt-0.5">
                                                Start in 60s with Tier 1 (Name & Phone only - Up to ₦50k) or complete Full SEC Verification.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link 
                                            to="/invest/onboarding?tier=tier1"
                                            className="neo-btn bg-genz-lime text-black px-4 py-2 text-xs font-extrabold uppercase shrink-0"
                                        >
                                            ⚡ 60s Quick Start
                                        </Link>
                                        <Link 
                                            to="/invest/onboarding?tier=full"
                                            className="neo-btn bg-black text-white px-4 py-2 text-xs font-extrabold uppercase shrink-0"
                                        >
                                            Full KYC
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Portfolio Value Summary with Quick Deposit Preset Bar */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 bg-lotus-dark text-white rounded-[2rem] p-8 neo-border neo-shadow border-2 border-black relative overflow-hidden flex flex-col justify-between">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                                    <div>
                                        <div className="flex items-center justify-between mb-2 relative z-10">
                                            <p className="text-gray-400 font-medium uppercase tracking-wider text-sm">
                                                Total Portfolio Balance
                                            </p>
                                            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-xs font-bold border border-green-500/30">
                                                + 0.0% All Time
                                            </span>
                                        </div>
                                        <h2 className="text-5xl md:text-6xl font-display font-extrabold text-white mb-4 relative z-10">
                                            ₦<CountUp to={totalBalance} />
                                        </h2>

                                        {/* Prominent Quick Deposit Action Bar directly inside Hero */}
                                        <div className="bg-white/10 p-4 rounded-2xl border border-white/20 relative z-10 mb-4 backdrop-blur-sm">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <div className="flex items-center gap-2">
                                                    <Zap size={18} className="text-genz-lime fill-genz-lime" />
                                                    <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                                                        Instant Top-Up:
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {[5000, 10000, 25000, 50000].map(amt => (
                                                        <button
                                                            key={amt}
                                                            onClick={() => handleOpenQuickDeposit('halal', amt.toString())}
                                                            className="bg-white/15 hover:bg-genz-lime hover:text-black text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20 transition-all"
                                                        >
                                                            +₦{amt >= 1000 ? `${amt / 1000}k` : amt}
                                                        </button>
                                                    ))}
                                                    <button
                                                        onClick={() => handleOpenQuickDeposit('halal')}
                                                        className="bg-genz-lime text-black font-extrabold text-xs px-3.5 py-1.5 rounded-lg border border-black hover:opacity-90 transition-all flex items-center gap-1"
                                                    >
                                                        + Custom
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 relative z-10 pt-2 border-t border-white/10">
                                        <div className="bg-white/10 px-4 py-2 rounded-xl text-sm font-medium border border-white/20">
                                            <span className="text-gray-400 block text-xs">Total Earnings</span>
                                            <span className="text-green-400 font-bold">+ ₦{totalEarnings}</span>
                                        </div>
                                        <div className="bg-white/10 px-4 py-2 rounded-xl text-sm font-medium border border-white/20">
                                            <span className="text-gray-400 block text-xs">Pending Deposits</span>
                                            <span className="text-white font-bold">₦0.00</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 neo-border neo-shadow-sm flex flex-col justify-between">
                                    <h3 className="font-display font-bold text-gray-500 dark:text-gray-400 uppercase text-sm mb-4">Asset Allocation</h3>
                                    <div className="flex-1 flex flex-col justify-center">
                                        {/* Simple simulated chart layout */}
                                        <div className="flex items-end h-24 gap-2 mb-4">
                                            <motion.div initial={{ height: 0 }} animate={{ height: `${halalPercent}%` }} transition={{ duration: 1, ease: "easeOut" }} className="w-1/2 bg-genz-pink rounded-t-xl" />
                                            <motion.div initial={{ height: 0 }} animate={{ height: `${fifPercent}%` }} transition={{ duration: 1, ease: "easeOut", delay: 0.2 }} className="w-1/2 bg-genz-lime rounded-t-xl border border-black/10" />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2 font-bold"><div className="w-3 h-3 rounded-full bg-genz-pink"></div> Halal Equity</div>
                                                <span>{halalPercent}%</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2 font-bold"><div className="w-3 h-3 rounded-full bg-genz-lime border border-black/10"></div> FIF (Fixed Income)</div>
                                                <span>{fifPercent}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Gamified Tribe Investor Badges & XP Showcase */}
                            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 neo-border neo-shadow-sm">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b-2 border-gray-100 dark:border-gray-800 pb-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-display font-extrabold text-2xl uppercase">Tribe Investor Rank</h3>
                                            <span className="bg-genz-lime text-black font-extrabold text-xs px-3 py-1 rounded-full border border-black uppercase">
                                                ⭐ {userProfile?.xp || 0} XP
                                            </span>
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
                                            Level {Math.floor((userProfile?.xp || 0) / 250) + 1} • Halal Wealth Builder
                                        </p>
                                    </div>
                                    <div className="text-xs font-bold uppercase text-gray-400">
                                        {userProfile?.badges?.includes('First Bag Secured') ? '1 of 3 Badges Unlocked' : '0 of 3 Badges Unlocked'}
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-3 gap-4">
                                    {/* Badge 1: First Bag Secured */}
                                    <div className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                                        userProfile?.badges?.includes('First Bag Secured')
                                            ? 'bg-genz-lime/20 border-black dark:border-white shadow-sm'
                                            : 'bg-gray-50 dark:bg-gray-800/50 border-dashed border-gray-300 dark:border-gray-700'
                                    }`}>
                                        <div>
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-3xl">🎒</span>
                                                {userProfile?.badges?.includes('First Bag Secured') ? (
                                                    <span className="bg-black text-genz-lime text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase border border-genz-lime">
                                                        Unlocked
                                                    </span>
                                                ) : (
                                                    <span className="bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                                        +250 XP
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="font-display font-bold text-base uppercase mb-1">First Bag Secured</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                                {userProfile?.badges?.includes('First Bag Secured')
                                                    ? 'Funded your first halal investment in Lotus Tribe!'
                                                    : 'Make your first deposit to secure the bag & claim +250 XP.'}
                                            </p>
                                        </div>
                                        {!userProfile?.badges?.includes('First Bag Secured') && (
                                            <button
                                                onClick={() => handleOpenQuickDeposit('halal')}
                                                className="mt-4 text-xs font-extrabold text-black bg-genz-lime py-2 px-3 rounded-xl text-center uppercase hover:opacity-90 border border-black flex items-center justify-center gap-1.5"
                                            >
                                                <Zap size={13} className="fill-black" /> Deposit & Unlock
                                            </button>
                                        )}
                                    </div>

                                    {/* Badge 2: Vibe Checked */}
                                    <div className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                                        userProfile?.riskProfile
                                            ? 'bg-purple-50 dark:bg-purple-950/30 border-black dark:border-white shadow-sm'
                                            : 'bg-gray-50 dark:bg-gray-800/50 border-dashed border-gray-300 dark:border-gray-700'
                                    }`}>
                                        <div>
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-3xl">🧠</span>
                                                {userProfile?.riskProfile ? (
                                                    <span className="bg-black text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                                                        Unlocked
                                                    </span>
                                                ) : (
                                                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                                        +100 XP
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="font-display font-bold text-base uppercase mb-1">Vibe Checked</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                                {userProfile?.riskProfile
                                                    ? `Certified as ${userProfile.riskProfile} risk tolerance!`
                                                    : 'Take the quick investor quiz to discover your vibe.'}
                                            </p>
                                        </div>
                                        {!userProfile?.riskProfile && (
                                            <Link
                                                to="/quiz"
                                                className="mt-4 text-xs font-bold text-black dark:text-white bg-gray-200 dark:bg-gray-700 py-2 px-3 rounded-xl text-center uppercase hover:bg-black hover:text-white transition-colors block"
                                            >
                                                Take Vibe Check
                                            </Link>
                                        )}
                                    </div>

                                    {/* Badge 3: Halal Scholar */}
                                    <div className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                                        (userProfile?.completedLessons?.length || 0) > 0
                                            ? 'bg-blue-50 dark:bg-blue-950/30 border-black dark:border-white shadow-sm'
                                            : 'bg-gray-50 dark:bg-gray-800/50 border-dashed border-gray-300 dark:border-gray-700'
                                    }`}>
                                        <div>
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-3xl">📚</span>
                                                {(userProfile?.completedLessons?.length || 0) > 0 ? (
                                                    <span className="bg-black text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                                                        Unlocked
                                                    </span>
                                                ) : (
                                                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                                        +150 XP
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="font-display font-bold text-base uppercase mb-1">Halal Scholar</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                                {(userProfile?.completedLessons?.length || 0) > 0
                                                    ? `${userProfile.completedLessons.length} lessons mastered in LMS.`
                                                    : 'Learn how Islamic finance and sukuk work in our Academy.'}
                                            </p>
                                        </div>
                                        {(!userProfile?.completedLessons || userProfile.completedLessons.length === 0) && (
                                            <Link
                                                to="/learn"
                                                className="mt-4 text-xs font-bold text-black dark:text-white bg-gray-200 dark:bg-gray-700 py-2 px-3 rounded-xl text-center uppercase hover:bg-black hover:text-white transition-colors block"
                                            >
                                                Start Learning
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* My Funds */}
                            <h3 className="font-display font-bold text-2xl uppercase mt-8 mb-4 border-b-2 border-gray-100 dark:border-gray-800 pb-2">My Funds</h3>
                            
                            {totalBalance === 0 ? (
                                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] neo-border neo-shadow-sm text-center">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 neo-border">
                                        <Wallet className="w-8 h-8"/>
                                    </div>
                                    <h4 className="font-display font-bold text-xl uppercase mb-2">No Active Funds</h4>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">You don't have any active investments yet. Make a quick deposit to start growing your halal wealth.</p>
                                    <button 
                                        onClick={() => handleOpenQuickDeposit('halal')} 
                                        className="neo-btn bg-black text-white px-8 py-3 text-sm font-extrabold uppercase flex items-center justify-center gap-2 mx-auto"
                                    >
                                        <Zap size={16} className="text-genz-lime fill-genz-lime" /> + Quick Deposit
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Halal Fund Card */}
                                        {halalBalance > 0 && (
                                            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] neo-border neo-shadow-sm flex flex-col group hover:border-black transition-all">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <div className="inline-block px-3 py-1 bg-genz-pink text-black dark:text-white font-bold text-xs uppercase rounded-lg mb-2 neo-border">Moderate Risk</div>
                                                        <h4 className="font-display font-bold text-2xl uppercase">Lotus Halal Fund</h4>
                                                    </div>
                                                    <TrendingUp className="text-green-500 w-6 h-6" />
                                                </div>
                                                <div className="mb-2">
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase mb-1">Current Value</p>
                                                    <p className="text-3xl font-display font-bold">₦<CountUp to={halalBalance} duration={1} /></p>
                                                </div>
                                                <div className="flex justify-between items-end mt-4 pt-4 border-t-2 border-gray-50">
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">Total Return</p>
                                                        <p className="text-sm font-bold text-green-500">+ ₦0 (0.0%)</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => handleOpenQuickDeposit('halal')} 
                                                            className="text-xs font-extrabold bg-genz-pink text-black px-3 py-2 rounded-xl transition-all border border-black"
                                                        >
                                                            + Deposit
                                                        </button>
                                                        <button onClick={() => setActiveTab('funding')} className="text-xs font-bold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 px-3 py-2 rounded-xl transition-colors">
                                                            Manage
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* FIF Fund Card */}
                                        {fifBalance > 0 && (
                                            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] neo-border neo-shadow-sm flex flex-col group hover:border-black transition-all">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <div className="inline-block px-3 py-1 bg-genz-lime text-black dark:text-white font-bold text-xs uppercase rounded-lg mb-2 neo-border">Low Risk</div>
                                                        <h4 className="font-display font-bold text-2xl uppercase">Lotus FIF Fund</h4>
                                                    </div>
                                                    <TrendingUp className="text-green-500 w-6 h-6" />
                                                </div>
                                                <div className="mb-2">
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase mb-1">Current Value</p>
                                                    <p className="text-3xl font-display font-bold">₦<CountUp to={fifBalance} duration={1} /></p>
                                                </div>
                                                <div className="flex justify-between items-end mt-4 pt-4 border-t-2 border-gray-50">
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">Total Return</p>
                                                        <p className="text-sm font-bold text-green-500">+ ₦0 (0.0%)</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => handleOpenQuickDeposit('fif')} 
                                                            className="text-xs font-extrabold bg-genz-lime text-black px-3 py-2 rounded-xl transition-all border border-black"
                                                        >
                                                            + Deposit
                                                        </button>
                                                        <button onClick={() => setActiveTab('funding')} className="text-xs font-bold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 px-3 py-2 rounded-xl transition-colors">
                                                            Manage
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <FundPerformanceChart />
                                </>
                            )}
                        </>
                    )}

                    {activeTab === 'funding' && (
                        <FundingTab 
                            user={user} 
                            userProfile={userProfile} 
                            setActiveTab={setActiveTab} 
                            onRewardUnlocked={handleRewardUnlocked}
                            initialFund={quickDepositFund}
                            initialAmount={prefilledAmount}
                        />
                    )}
                    {activeTab === 'transactions' && <TransactionsTab user={user} />}
                    {activeTab === 'certificate' && <CertificateTab user={user} userProfile={userProfile} />}
                    {activeTab === 'settings' && <SettingsTab user={user} userProfile={userProfile} />}

                </motion.div>
            </AnimatePresence>

            {/* Quick Deposit Modal */}
            <QuickDepositModal
                isOpen={isQuickDepositOpen}
                onClose={() => setIsQuickDepositOpen(false)}
                user={user}
                userProfile={userProfile}
                initialFund={quickDepositFund}
                onSuccessDeposit={handleQuickDepositSuccess}
                onOpenFullFunding={(fund, amt) => {
                    setQuickDepositFund(fund);
                    setPrefilledAmount(amt);
                    setActiveTab('funding');
                }}
            />

            {/* First Investment Achievement Reward Modal */}
            {rewardCelebration && (
                <FirstInvestmentRewardModal
                    isOpen={rewardCelebration.isOpen}
                    onClose={() => setRewardCelebration(null)}
                    amount={rewardCelebration.amount}
                    xp={rewardCelebration.xp}
                />
            )}
        </DashboardLayout>
    );
};

const FundingTab = ({ 
    user, 
    userProfile, 
    setActiveTab, 
    onRewardUnlocked,
    initialFund = 'halal',
    initialAmount = ''
}: { 
    user: any; 
    userProfile: any; 
    setActiveTab: (t: string) => void;
    onRewardUnlocked?: (reward: { badge: string; xp: number; amount: number }) => void;
    initialFund?: 'halal' | 'fif';
    initialAmount?: string;
}) => {
    const { refreshProfile } = useContext(AuthContext);
    const [actionType, setActionType] = useState<'deposit' | 'withdraw'>('deposit');
    const [amount, setAmount] = useState(initialAmount || '');
    const [fund, setFund] = useState<'halal' | 'fif'>(initialFund || 'halal');
    const [status, setStatus] = useState<'idle' | 'paystack' | 'success' | 'withdraw_success'>('idle');
    const [isLoading, setIsLoading] = useState(false);
    const [frequency, setFrequency] = useState('one-time');
    const [countdown, setCountdown] = useState(15);
    const [validationError, setValidationError] = useState('');

    React.useEffect(() => {
        let timer: any;
        if (status === 'success' && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (status === 'success' && countdown <= 0) {
            setActiveTab('overview');
            setStatus('idle');
            setCountdown(15);
        }
        return () => clearInterval(timer);
    }, [status, countdown, setActiveTab]);

    const isTier1 = userProfile?.kycTier === 'tier1';
    const hasAnyKyc = userProfile?.kycCompleted || userProfile?.tier1Completed || isTier1;

    const config: any = {
        reference: (new Date()).getTime().toString(),
        email: user?.email || "user@example.com",
        amount: Number(amount) * 100, // Paystack amount is in kobo
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_placeholder_key_replace_me",
    };

    if (frequency === 'daily' && import.meta.env.VITE_PAYSTACK_PLAN_DAILY) {
        config.plan = import.meta.env.VITE_PAYSTACK_PLAN_DAILY;
    } else if (frequency === 'weekly' && import.meta.env.VITE_PAYSTACK_PLAN_WEEKLY) {
        config.plan = import.meta.env.VITE_PAYSTACK_PLAN_WEEKLY;
    } else if (frequency === 'monthly' && import.meta.env.VITE_PAYSTACK_PLAN_MONTHLY) {
        config.plan = import.meta.env.VITE_PAYSTACK_PLAN_MONTHLY;
    }
    
    // We can init the hook here to obey rules of hooks.
    const initializePayment = usePaystackPayment(config);

    if (user && !hasAnyKyc) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-10 neo-border neo-shadow-sm max-w-2xl mx-auto text-center mt-6">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/60 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-5 neo-border border-black text-2xl">
                    ⚡
                </div>
                <h3 className="font-display font-extrabold text-3xl uppercase mb-2">Choose How to Start</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 max-w-lg mx-auto text-sm">
                    Lotus Tribe supports Progressive KYC. You can start investing immediately with Express verification, or complete full verification for unlimited access.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 text-left mb-6">
                    <div className="p-5 rounded-2xl border-2 border-black bg-genz-lime/20 flex flex-col justify-between">
                        <div>
                            <div className="inline-block px-2.5 py-0.5 bg-black text-genz-lime font-extrabold text-[10px] uppercase rounded-md mb-2">
                                60 Seconds
                            </div>
                            <h4 className="font-display font-extrabold text-lg uppercase mb-1">Tier 1 Express</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-300 font-medium mb-3">
                                Only your Name, Phone, and State needed. No BVN or documents required today.
                            </p>
                            <div className="text-xs font-bold text-black dark:text-white">
                                • Deposit cap: ₦50,000<br/>
                                • Full access to Halal & FIF portfolios
                            </div>
                        </div>
                        <Link to="/invest/onboarding?tier=tier1" className="mt-4">
                            <button className="neo-btn bg-black text-white w-full py-2.5 text-xs font-extrabold uppercase">
                                Start Express (60s) →
                            </button>
                        </Link>
                    </div>

                    <div className="p-5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 flex flex-col justify-between">
                        <div>
                            <div className="inline-block px-2.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase rounded-md mb-2">
                                Full Access
                            </div>
                            <h4 className="font-display font-extrabold text-lg uppercase mb-1">Tier 2/3 SEC Full</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-3">
                                Complete verification with BVN/NIN for full institutional investment privileges.
                            </p>
                            <div className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                • Unlimited deposits<br/>
                                • Instant bank withdrawals anytime
                            </div>
                        </div>
                        <Link to="/invest/onboarding?tier=full" className="mt-4">
                            <button className="neo-btn bg-white dark:bg-gray-900 text-black dark:text-white border-2 border-black w-full py-2.5 text-xs font-extrabold uppercase">
                                Full Verification →
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const currentBalance = (fund === 'halal' ? userProfile?.halalBalance : userProfile?.fifBalance) || 0;

    const handleProceed = () => {
        setValidationError('');
        const numAmount = Number(amount);
        if (!amount || isNaN(numAmount) || numAmount < 1000) {
            setValidationError('Please enter a valid amount (minimum investment is ₦1,000).');
            return;
        }

        if (actionType === 'deposit' && isTier1 && numAmount > 50000) {
            setValidationError('⚠️ Tier 1 accounts have a maximum deposit cap of ₦50,000 per SEC guidelines. Please adjust to ₦50,000 or upgrade to Tier 2 for unlimited deposits.');
            return;
        }
        
        if (actionType === 'withdraw') {
            if (isTier1) {
                setValidationError('⚠️ Withdrawals require SEC-compliant Tier 2 KYC verification (Settlement Bank Account & BVN). Please upgrade your account to withdraw funds.');
                return;
            }
            if (numAmount > currentBalance) {
                setValidationError('Insufficient funds for this withdrawal.');
                return;
            }
            handleWithdrawal();
            return;
        }

        if (actionType === 'deposit') {
            setStatus('paystack');
        }
    };

    const handleWithdrawal = async () => {
        setIsLoading(true);
        if (user) {
            try {
                const dbField = fund === 'halal' ? 'halalBalance' : 'fifBalance';
                
                const updates: any = {
                    [dbField]: currentBalance - Number(amount),
                };

                const updatePromise = updateDoc(doc(db, 'users', user.uid), updates);
                
                const txPromise = addDoc(collection(db, 'users', user.uid, 'transactions'), {
                    type: 'Withdrawal',
                    fund: fund === 'halal' ? 'Lotus Halal Fund' : 'Lotus FIF Fund',
                    amount: -Number(amount),
                    status: 'SUCCESS',
                    createdAt: serverTimestamp()
                });

                await Promise.race([
                    Promise.all([updatePromise, txPromise]),
                    new Promise(resolve => setTimeout(resolve, 3000))
                ]).catch(e => console.warn('Offline update warning:', e));

                try {
                    await fetch('/api/send-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            to: user.email,
                            subject: 'Withdrawal Processed - Lotus Tribe',
                            html: `
                                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
                                    <h2 style="color: #0A0A0A; text-transform: uppercase;">Withdrawal Processed!</h2>
                                    <p>Hello ${userProfile?.firstName || 'Investor'},</p>
                                    <p>Your withdrawal of <strong>₦${Number(amount).toLocaleString()}</strong> from the <strong>${fund === 'halal' ? 'Lotus Halal Fund' : 'Lotus FIF Fund'}</strong> has been processed to your bank account.</p>
                                    <p>Thank you for investing with Lotus Tribe.</p>
                                </div>
                            `
                        })
                    });
                } catch (emailErr) {
                    console.error('Failed to send email notification:', emailErr);
                }

                setTimeout(() => {
                    setIsLoading(false);
                    setStatus('withdraw_success');
                    refreshProfile();
                }, 1000);
            } catch (e) {
                console.error('Error updating balance', e);
                setIsLoading(false);
            }
        }
    };

    const handlePaystackMock = async (success: boolean) => {
        setIsLoading(true);
        if (success) {
            if (user) {
                // Mock balance update
                try {
                    const dbField = fund === 'halal' ? 'halalBalance' : 'fifBalance';
                    const currentBalance = (fund === 'halal' ? userProfile?.halalBalance : userProfile?.fifBalance) || 0;
                    
                    const isFirstDeposit = (!userProfile?.badges || !userProfile.badges.includes('First Bag Secured')) &&
                                           (!userProfile?.firstInvestmentCompleted) &&
                                           (!userProfile?.totalInvested || userProfile.totalInvested === 0);

                    const updates: any = {
                        [dbField]: currentBalance + Number(amount),
                        totalInvested: increment(Number(amount)),
                    };

                    if (isFirstDeposit) {
                        updates.badges = arrayUnion('First Bag Secured');
                        updates.xp = increment(250);
                        updates.firstInvestmentCompleted = true;
                    }

                    if (frequency !== 'one-time') {
                        updates.autoInvest = arrayUnion({
                            fund,
                            amount: Number(amount),
                            frequency,
                            createdAt: new Date().toISOString()
                        });
                    }

                    const updatePromise = updateDoc(doc(db, 'users', user.uid), updates);
                    
                    const txPromise = addDoc(collection(db, 'users', user.uid, 'transactions'), {
                        type: frequency !== 'one-time' ? 'Auto-Invest Initial' : 'Deposit',
                        fund: fund === 'halal' ? 'Lotus Halal Fund' : 'Lotus FIF Fund',
                        amount: Number(amount),
                        status: 'SUCCESS',
                        createdAt: serverTimestamp()
                    });

                    await Promise.race([
                        Promise.all([updatePromise, txPromise]),
                        new Promise(resolve => setTimeout(resolve, 3000))
                    ]).catch(e => console.warn('Offline update warning:', e));

                    // Send email notification via backend
                    try {
                        await fetch('/api/send-email', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                to: user.email,
                                subject: 'Deposit Successful - Lotus Tribe',
                                html: `
                                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
                                        <h2 style="color: #0A0A0A; text-transform: uppercase;">Payment Received!</h2>
                                        <p>Hello ${userProfile?.firstName || 'Investor'},</p>
                                        <p>Your deposit of <strong>₦${Number(amount).toLocaleString()}</strong> to the <strong>${fund === 'halal' ? 'Lotus Halal Fund' : 'Lotus FIF Fund'}</strong> has been processed successfully.</p>
                                        ${frequency !== 'one-time' ? `<p style="color: #2563eb; font-weight: bold;">You have successfully set up a ${frequency} Auto-Invest plan.</p>` : ''}
                                        <p>Thank you for investing with Lotus Tribe.</p>
                                    </div>
                                `
                            })
                        });
                    } catch (emailErr) {
                        console.error('Failed to send email notification:', emailErr);
                    }

                    if (isFirstDeposit) {
                        confetti({
                            particleCount: 160,
                            spread: 90,
                            origin: { y: 0.5 },
                            colors: ['#000000', '#D1FD0A', '#FF70A6', '#FFFFFF', '#0A2540']
                        });
                        if (onRewardUnlocked) {
                            onRewardUnlocked({
                                badge: 'First Bag Secured',
                                xp: 250,
                                amount: Number(amount)
                            });
                        }
                    }

                    setTimeout(() => {
                        setIsLoading(false);
                        setStatus('success');
                        refreshProfile(); // Get fresh auth context data quickly
                    }, 500);
                } catch (e) {
                    console.error('Error updating balance', e);
                    setIsLoading(false);
                    setStatus('idle');
                }
            } else {
                setTimeout(() => {
                    setIsLoading(false);
                    setStatus('success');
                }, 500);
            }
        } else {
            setIsLoading(false);
            setStatus('idle');
        }
    };

    if (status === 'paystack') {
        const onSuccess = (reference: any) => {
            console.log('Payment complete! Reference:', reference);
            handlePaystackMock(true);
        };
        const onClose = () => {
            console.log('Payment closed by user.');
            setIsLoading(false);
            setStatus('idle');
        };

        return (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 neo-border neo-shadow-sm max-w-md mx-auto text-center mt-10">
                <h3 className="font-display font-bold text-2xl uppercase mb-4">Paystack Integration Setup</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium leading-relaxed">
                    You are about to pay <span className="font-bold text-black dark:text-white border-b-2 border-black">₦{Number(amount).toLocaleString()}</span> into {fund === 'halal' ? 'Lotus Halal Fund' : 'Lotus FIF Fund'}
                </p>
                {frequency !== 'one-time' && (
                    <p className="text-sm font-bold text-blue-600 mb-6 bg-blue-50 py-2 rounded-lg border border-blue-200 uppercase">
                        {frequency} Auto-Invest Activated
                    </p>
                )}
                
                <div className="space-y-4">
                    <button 
                        onClick={() => {
                            setIsLoading(true);
                            if (!import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) {
                                alert("VITE_PAYSTACK_PUBLIC_KEY is not defined in your environment variables. Please add it to test live payments. Simulating success for now.");
                                setTimeout(() => handlePaystackMock(true), 1500);
                            } else {
                                initializePayment({ onSuccess, onClose });
                            }
                        }} 
                        disabled={isLoading}
                        className="neo-btn bg-black text-white w-full uppercase py-4 shadow-md disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {isLoading ? 'Connecting...' : 'Pay securely with Paystack'}
                    </button>
                    <button 
                        onClick={() => setStatus('idle')} 
                        disabled={isLoading}
                        className="neo-btn bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 w-full uppercase py-3 border-2 border-transparent disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-10 neo-border neo-shadow-sm max-w-md mx-auto text-center mt-10">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 neo-border border-green-500">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="font-display font-extrabold text-3xl uppercase mb-4">Payment Successful!</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">Your ₦{Number(amount).toLocaleString()} deposit to the {fund === 'halal' ? 'Lotus Halal Fund' : 'Lotus FIF Fund'} has been received.</p>
                {frequency !== 'one-time' && (
                    <p className="text-sm font-bold text-blue-600 mb-6 uppercase border-b-2 border-dashed border-blue-200 pb-2 inline-block">
                        {frequency} Auto-Invest Subscribed Successfully
                    </p>
                )}
                
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6 border border-gray-200 dark:border-gray-800 rounded-lg p-2 inline-block">
                    Redirecting to dashboard in {countdown}s...
                </p>

                <div className="space-y-4">
                    <button onClick={() => {
                        setStatus('idle');
                        setCountdown(15);
                    }} className="neo-btn bg-black text-white w-full py-4 uppercase">
                        Make another deposit
                    </button>
                    <button onClick={() => {
                        setActiveTab('overview');
                        setStatus('idle');
                        setCountdown(15);
                    }} className="neo-btn bg-white dark:bg-gray-800 text-black dark:text-white border-2 border-black dark:border-white w-full py-4 uppercase hover:-translate-y-1 transition-transform">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (status === 'withdraw_success') {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-10 neo-border neo-shadow-sm max-w-md mx-auto text-center mt-10">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 neo-border border-green-500">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="font-display font-extrabold text-3xl uppercase mb-4">Withdrawal Processed!</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">Your withdrawal of ₦{Number(amount).toLocaleString()} from the {fund === 'halal' ? 'Lotus Halal Fund' : 'Lotus FIF Fund'} has been processed and sent to your bank account.</p>
                <button onClick={() => {
                    setStatus('idle');
                    setAmount('');
                }} className="neo-btn bg-black text-white w-full py-3 uppercase">
                    Done
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 neo-border neo-shadow-sm max-w-2xl mx-auto">
            {isTier1 && (
                <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-300 text-black flex items-center justify-center font-black text-sm border-2 border-black shrink-0">
                            ⚡
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-display font-extrabold text-xs uppercase text-amber-900 dark:text-amber-200">
                                    Tier 1 Express Account Active
                                </span>
                                <span className="bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-amber-400">
                                    ₦50,000 Cap
                                </span>
                            </div>
                            <p className="text-xs text-amber-800 dark:text-amber-300 font-medium mt-0.5">
                                You can deposit up to ₦50,000. Upgrade to Tier 2 for unlimited deposits and instant bank withdrawals.
                            </p>
                        </div>
                    </div>
                    <Link 
                        to="/invest/onboarding?upgrade=true"
                        className="neo-btn bg-black text-white px-3.5 py-1.5 text-xs font-extrabold uppercase shrink-0"
                    >
                        Upgrade →
                    </Link>
                </div>
            )}

            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-8">
                <button 
                    onClick={() => {
                        setActionType('deposit');
                        setValidationError('');
                    }}
                    className={`flex-1 py-3 px-4 rounded-lg font-bold uppercase text-sm transition-all ${actionType === 'deposit' ? 'bg-white dark:bg-gray-900 shadow-sm text-black dark:text-white border-2 border-black' : 'text-gray-500 dark:text-gray-400 border-2 border-transparent'}`}
                >
                    Deposit Funds
                </button>
                <button 
                    onClick={() => {
                        setActionType('withdraw');
                        setValidationError('');
                    }}
                    className={`flex-1 py-3 px-4 rounded-lg font-bold uppercase text-sm transition-all ${actionType === 'withdraw' ? 'bg-white dark:bg-gray-900 shadow-sm text-black dark:text-white border-2 border-black' : 'text-gray-500 dark:text-gray-400 border-2 border-transparent'}`}
                >
                    Withdraw Funds
                </button>
            </div>

            <h2 className="font-display font-extrabold text-3xl uppercase mb-2">
                {actionType === 'deposit' ? 'Add Funds' : 'Withdraw Funds'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">
                {actionType === 'deposit' ? 'Invest into your preferred Lotus Tribe portfolios safely.' : 'Withdraw from your active portfolios directly to your bank account.'}
            </p>

            {validationError && (
                <div className="p-4 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-2 border-red-300 rounded-2xl text-xs font-bold mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <span>{validationError}</span>
                    {isTier1 && Number(amount) > 50000 && (
                        <button
                            type="button"
                            onClick={() => {
                                setAmount('50000');
                                setValidationError('');
                            }}
                            className="neo-btn bg-red-600 text-white px-3 py-1 text-[11px] uppercase shrink-0"
                        >
                            Set to ₦50,000
                        </button>
                    )}
                </div>
            )}
            
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <label className="block text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Select Fund</label>
                        {actionType === 'withdraw' && (
                            <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                Available: ₦{currentBalance.toLocaleString()}
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            type="button"
                            onClick={(e) => { e.preventDefault(); setFund('halal'); }} 
                            className={`p-4 rounded-xl border-2 transition-all text-center ${fund === 'halal' ? 'border-genz-pink bg-pink-50' : 'border-gray-200 dark:border-gray-700'}`}
                        >
                            <div className="font-display font-bold uppercase">Halal Fund</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">(Moderate Risk)</div>
                        </button>
                        <button 
                            type="button"
                            onClick={(e) => { e.preventDefault(); setFund('fif'); }} 
                            className={`p-4 rounded-xl border-2 transition-all text-center ${fund === 'fif' ? 'border-genz-lime bg-[#F4FFDC]' : 'border-gray-200 dark:border-gray-700'}`}
                        >
                            <div className="font-display font-bold uppercase">FIF Fund</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">(Low Risk)</div>
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2">
                        Amount to {actionType === 'deposit' ? 'Invest' : 'Withdraw'} (₦)
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-bold text-2xl text-gray-400">₦</span>
                        <input 
                            type="number" 
                            min="1000"
                            max={actionType === 'withdraw' ? currentBalance : undefined}
                            value={amount}
                            onChange={e => {
                                setAmount(e.target.value);
                                setValidationError('');
                            }}
                            placeholder="0.00" 
                            className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 pl-12 font-display font-bold text-2xl focus:border-black outline-none transition-colors"
                        />
                    </div>

                    {/* Quick Amount Preset Chips for Deposits */}
                    {actionType === 'deposit' && (
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            <span className="text-xs text-gray-400 font-bold uppercase">Quick amounts:</span>
                            {[5000, 10000, 25000, 50000].map(amt => (
                                <button
                                    key={amt}
                                    type="button"
                                    onClick={() => {
                                        setAmount(amt.toString());
                                        setValidationError('');
                                    }}
                                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                                        amount === amt.toString()
                                            ? 'bg-black text-white border-black'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-transparent hover:border-gray-400'
                                    }`}
                                >
                                    ₦{amt >= 1000 ? `${amt / 1000}k` : amt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {actionType === 'deposit' && (
                    <div>
                        <label className="block text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2">Auto-Invest Frequency</label>
                        <div className="grid grid-cols-4 gap-2">
                            {['one-time', 'daily', 'weekly', 'monthly'].map((freq) => (
                                <button 
                                    key={freq}
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); setFrequency(freq); }} 
                                    className={`p-2 rounded-lg text-xs font-bold uppercase tracking-wider border-2 transition-all text-center ${frequency === freq ? 'border-lotus-dark bg-lotus-dark text-white' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400'}`}
                                >
                                    {freq.replace('-', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pt-4">
                    <button 
                        onClick={handleProceed}
                        disabled={isLoading}
                        className="neo-btn bg-genz-blue text-lotus-dark dark:text-white w-full py-4 text-lg uppercase flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? 'Processing...' : (actionType === 'deposit' ? 'Proceed to Payment' : 'Withdraw to Bank Account')}
                        {!isLoading && actionType === 'deposit' && <ArrowUpRight className="w-5 h-5"/>}
                    </button>
                </div>
            </div>

            {userProfile?.autoInvest && userProfile.autoInvest.length > 0 && (
                <div className="mt-12 pt-8 border-t-2 border-gray-100 dark:border-gray-800">
                    <h3 className="font-display font-bold text-xl uppercase mb-4">Active Auto-Investments</h3>
                    <div className="space-y-3">
                        {userProfile.autoInvest.map((ai: any, i: number) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-black dark:text-white">{ai.fund === 'halal' ? 'Halal Fund' : 'FIF Fund'}</p>
                                        <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">{ai.frequency}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">₦{ai.amount.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const TransactionsTab = ({ user }: { user: any }) => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        if (!user) return;
        const fetchTxs = async () => {
            try {
                const q = query(collection(db, 'users', user.uid, 'transactions'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const txs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTransactions(txs);
            } catch (e) {
                console.error("Error fetching transactions", e);
            } finally {
                setLoading(false);
            }
        };
        fetchTxs();
    }, [user]);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 neo-border neo-shadow-sm min-h-[60vh]">
            <h2 className="font-display font-extrabold text-3xl uppercase mb-8">Transaction History</h2>
            
            {loading ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-10 font-bold uppercase tracking-widest">Loading...</div>
            ) : transactions.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-10 font-bold uppercase tracking-widest">No transactions yet</div>
            ) : (
                <div className="space-y-4">
                    {transactions.map((tc) => (
                        <div key={tc.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center neo-border shadow-sm shrink-0 ${tc.type === 'Auto-Invest' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                    {tc.type === 'Auto-Invest' ? <Target size={24} /> : <ArrowDownRight size={24} />}
                                </div>
                                <div>
                                    <p className="font-bold text-lg">{tc.type}: {tc.fund}</p>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                        {tc.createdAt?.toDate ? tc.createdAt.toDate().toLocaleDateString() : 'Just now'} • SUCCESS
                                    </p>
                                </div>
                            </div>
                            <div className="text-right sm:w-auto w-full sm:text-right text-left pl-16 sm:pl-0">
                                <p className="font-bold text-xl text-green-600">+ ₦{Number(tc.amount).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const SettingsTab = ({ user, userProfile }: any) => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 neo-border neo-shadow-sm max-w-3xl mx-auto">
            <h2 className="font-display font-extrabold text-3xl uppercase mb-8 border-b-2 border-gray-100 dark:border-gray-800 pb-4">Account Settings</h2>
            
            <div className="space-y-8">
                {/* Profile Settings */}
                <section>
                    <h3 className="flex items-center gap-2 font-display font-bold text-xl uppercase mb-4 text-gray-500 dark:text-gray-400"><User className="w-5 h-5"/> Profile Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Full Name</label>
                            <input type="text" readOnly value={user?.displayName || ''} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 font-medium outline-none text-gray-600 dark:text-gray-300 cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Email Address</label>
                            <input type="email" readOnly value={user?.email || ''} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 font-medium outline-none text-gray-600 dark:text-gray-300 cursor-not-allowed" />
                        </div>
                    </div>
                </section>

                {/* KYC Status */}
                <section>
                    <h3 className="flex items-center gap-2 font-display font-bold text-xl uppercase mb-4 text-gray-500 dark:text-gray-400"><FileText className="w-5 h-5"/> KYC & Verification</h3>
                    {userProfile?.kycCompleted ? (
                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <div>
                                    <p className="font-bold text-green-900">Tier 2 Verified</p>
                                    <p className="text-sm font-medium text-green-700">Account verified</p>
                                </div>
                            </div>
                            <button className="text-sm font-bold bg-white dark:bg-gray-900 text-green-700 px-4 py-2 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">Upgrade to Tier 3</button>
                        </div>
                    ) : (
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:block">
                                   <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-bold border border-red-300">!</div>
                                </div>
                                <div>
                                    <p className="font-bold text-red-900">Unverified Account</p>
                                    <p className="text-sm font-medium text-red-700">Complete KYC to start investing.</p>
                                </div>
                            </div>
                            <Link to="/invest/onboarding" className="text-sm font-bold bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-700 transition-colors uppercase">Verify Now</Link>
                        </div>
                    )}
                </section>

                <hr className="border-gray-100 dark:border-gray-800" />

                {/* Security */}
                <section>
                    <h3 className="flex items-center gap-2 font-display font-bold text-xl uppercase mb-4 text-gray-500 dark:text-gray-400"><Lock className="w-5 h-5"/> Security</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-bold">Two-Factor Authentication</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account.</p>
                            </div>
                            <button className="px-4 py-2 bg-black text-white text-sm font-bold rounded-lg uppercase">Enable 2FA</button>
                        </div>
                        <div className="flex items-center justify-between py-3 border-t border-gray-50">
                            <div>
                                <p className="font-bold">Change Password</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password</p>
                            </div>
                            <button className="px-4 py-2 border-2 border-gray-200 dark:border-gray-700 text-black dark:text-white text-sm font-bold rounded-lg uppercase hover:border-black transition-colors">Update</button>
                        </div>
                    </div>
                </section>
                
                <hr className="border-gray-100 dark:border-gray-800" />
                
                <div className="flex justify-between items-center bg-red-50 p-4 rounded-xl border border-red-100">
                    <div>
                        <p className="font-bold text-red-600">Danger Zone</p>
                        <p className="text-xs text-red-500">Permanently delete your account and data.</p>
                    </div>
                    <button className="px-4 py-2 bg-white dark:bg-gray-900 text-red-600 border border-red-200 text-sm font-bold rounded-lg hover:bg-red-100 transition-colors">Delete Account</button>
                </div>
            </div>
        </div>
    );
};

const CertificateTab = ({ user, userProfile }: any) => {
    const handleShare = async () => {
        const certificateElement = document.getElementById('dashboard-vibe-certificate');
        if (!certificateElement) return;

        try {
            const canvas = await html2canvas(certificateElement, { scale: 2, useCORS: true });
            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            link.download = `LotusTribe_VibeCheck_${user?.displayName || 'Member'}.png`;
            link.click();
        } catch (err) {
            console.log("Error generating certificate image:", err);
            alert("Could not generate image. Please try again.");
        }
    };

    if (!userProfile?.riskProfile) {
        return (
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl neo-border neo-shadow-sm text-center min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <Info className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-display font-bold text-2xl uppercase mb-2">No Certificate Yet!</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-6">You need to complete the Vibe Check assessment to generate your investor certificate.</p>
                <Link to="/quiz">
                    <button className="neo-btn bg-black text-white px-8 py-3 text-sm">
                        Take Vibe Check
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-display font-extrabold text-3xl uppercase">Your Certificate</h2>
                <button onClick={handleShare} className="neo-btn bg-lotus-dark text-white px-6 py-2 uppercase text-sm flex items-center gap-2">
                    <Download className="w-4 h-4"/> Download
                </button>
            </div>
            
            <div id="dashboard-vibe-certificate" className="bg-white dark:bg-gray-900 p-2 rounded-3xl neo-shadow mb-8 border-4 border-black inline-block w-full">
                <div className="bg-[#fffdf9] p-8 md:p-12 rounded-2xl border-2 border-dashed border-gray-400 relative overflow-hidden">
                   {/* Ornate corners */}
                   <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-lotus-dark"></div>
                   <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-lotus-dark"></div>
                   <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-lotus-dark"></div>
                   <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-lotus-dark"></div>
                   
                   {/* Watermark bg */}
                   <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                      <div className="text-[200px] font-display font-black transform -rotate-12">LOTUS</div>
                   </div>
                   
                   <div className="relative z-10 text-center">
                     <h2 className="font-display font-black text-3xl md:text-5xl uppercase text-lotus-dark dark:text-white mb-2 tracking-widest">
                       Certificate of Vibe
                     </h2>
                     <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs mb-8">Official Lotus Tribe Assessment</p>
                     
                     <div className="text-7xl mb-6">
                       {userProfile.riskProfile === 'Steady Saver' ? '🐢' : userProfile.riskProfile === 'Calculated Thinker' ? '🧠' : '🚀'}
                     </div>
                     
                     <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl mb-8 border border-gray-200 dark:border-gray-700">
                        <p className="font-display font-bold text-xl md:text-2xl text-lotus-dark dark:text-white leading-relaxed">
                           Dear <span className="text-lotus-red border-b-2 border-lotus-red px-2">{user?.displayName || 'Tribe Member'}</span>, <br/><br/>
                           This is to certify that you have successfully completed your Lotus Tribe Investment Vibe Check. Your investment personality is formally recognized as:
                        </p>
                        <h1 className="font-display font-black text-4xl md:text-5xl uppercase mt-6 mb-4 text-lotus-dark dark:text-white bg-genz-lime inline-block px-4 py-2 transform -rotate-1 shadow-md border-2 border-black">
                          {userProfile.riskProfile}
                        </h1>
                        <p className="text-lg md:text-xl font-bold text-gray-700 dark:text-gray-200 mt-2">
                           You are on course to be a {userProfile.riskProfile === 'Steady Saver' ? 'low-risk' : userProfile.riskProfile === 'Calculated Thinker' ? 'calculated' : 'high-risk'} Billionaire investor. 🥂
                        </p>
                     </div>
                     
                     <div className="flex justify-between items-end border-t-2 border-gray-200 dark:border-gray-700 pt-6 mt-10">
                        <div className="text-left">
                           <div className="font-[signature] font-bold text-3xl text-lotus-dark dark:text-white mb-1 opacity-70">Lotus Tribe</div>
                           <div className="w-32 h-px bg-black mb-1"></div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Authorized Signature</p>
                        </div>
                        <div className="text-right">
                           <div className="font-mono font-bold text-sm text-lotus-dark dark:text-white mb-1">{new Date().toLocaleDateString()}</div>
                           <div className="w-24 h-px bg-black mb-1 ml-auto"></div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Date of Issue</p>
                        </div>
                     </div>
                     
                     <p className="text-[10px] text-gray-400 mt-8 text-left font-sans font-medium italic">
                       * Disclaimer: This assessment is designed as an educational tool to help you understand your general investor profile. It does not constitute formal financial advice. All investments carry risks, and you should perform independent research before making any financial decisions.
                     </p>
                   </div>
                </div>
            </div>
            <div className="text-center mt-6">
                 <Link to="/quiz">
                    <button className="text-gray-500 dark:text-gray-400 font-bold uppercase text-xs hover:text-black dark:text-white hover:underline underline-offset-4 transition-all">
                        Retake Vibe Check
                    </button>
                 </Link>
            </div>
        </div>
    );
};

const FundPerformanceChart = () => {
    const [period, setPeriod] = useState('1M');
    const periods = ['1D', '1W', '1M', '3M', '6M', '1Y', '3Y', '5Y'];
    
    // Generate mock data based on period
    const data = useMemo(() => {
        let points = 30; // default for 1M
        let volatility = 5;
        let baseline = 10000;
        
        if (period === '1D') { points = 24; volatility = 2; }
        else if (period === '1W') { points = 7; volatility = 3; }
        else if (period === '1M') { points = 30; volatility = 5; }
        else if (period === '3M') { points = 12; volatility = 8; }
        else if (period === '6M') { points = 24; volatility = 10; }
        else if (period === '1Y') { points = 12; volatility = 15; }
        else if (period === '3Y') { points = 36; volatility = 25; }
        else if (period === '5Y') { points = 60; volatility = 40; }

        const mockData = [];
        let currentVal = baseline;
        for (let i = 0; i < points; i++) {
            currentVal += (Math.random() - 0.45) * volatility * 100; // Slight upward trend
            const displayLabel = period === '1D' ? `${i}:00` : `T-${points - i}`;
            mockData.push({
                name: displayLabel,
                value: Math.round(currentVal)
            });
        }
        return mockData;
    }, [period]);

    return (
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-white dark:bg-gray-900 rounded-3xl p-6 mt-8 neo-border neo-shadow-sm min-h-[400px]">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                 <div>
                    <h3 className="font-display font-bold text-xl uppercase mb-1">Portfolio Performance</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Track your investment growth over time.</p>
                 </div>
                 <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 overflow-x-auto w-full sm:w-auto">
                    {periods.map(p => (
                        <button 
                            key={p} 
                            onClick={() => setPeriod(p)}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-colors shrink-0 ${period === p ? 'bg-white dark:bg-gray-900 shadow-sm text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:text-white'}`}
                        >
                            {p}
                        </button>
                    ))}
                 </div>
             </div>
             
             <div className="h-[300px] w-full mt-4">
                 <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                         <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                         <XAxis axisLine={false} tickLine={false} dataKey="name" tick={{fill: '#9ca3af', fontSize: 12}} dy={10} minTickGap={20} />
                         <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(val) => `₦${(val/1000).toFixed(0)}k`} />
                         <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Value']}
                            labelStyle={{ color: '#6b7280', fontWeight: 'bold', marginBottom: '4px' }}
                         />
                         <Area type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                     </AreaChart>
                 </ResponsiveContainer>
             </div>
        </motion.div>
    );
};
