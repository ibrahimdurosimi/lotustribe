import React, { useState, useContext } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Wallet, TrendingUp, History, Download, ArrowUpRight, ArrowDownRight, Settings, Target } from 'lucide-react';
import { AuthContext } from './App';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-[#fafafa] pt-24 pb-20 md:pb-0 font-sans text-lotus-dark flex justify-center">
            <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-8 mt-8">
                <aside className="hidden md:flex flex-col w-64 shrink-0 h-[calc(100vh-140px)] sticky top-32">
                    <div className="bg-white rounded-3xl neo-border neo-shadow p-6 flex-1 flex flex-col gap-2">
                        <h2 className="font-display font-bold text-xl uppercase mb-6 text-gray-500">My Wealth</h2>
                        
                        <Link to="/dashboard" className="flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all bg-genz-lime neo-border shadow-[2px_2px_0_0_#121212] translate-y-[-2px]">
                            <LayoutDashboard className="w-6 h-6" /> Overview
                        </Link>
                        <Link to="/dashboard" className="flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all hover:bg-gray-100 text-gray-600 hover:text-black">
                            <Wallet className="w-6 h-6" /> Funding
                        </Link>
                        <Link to="/dashboard" className="flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all hover:bg-gray-100 text-gray-600 hover:text-black">
                            <History className="w-6 h-6" /> Transactions
                        </Link>
                        <Link to="/dashboard" className="flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all hover:bg-gray-100 text-gray-600 hover:text-black">
                            <Settings className="w-6 h-6" /> Settings
                        </Link>

                        <div className="mt-auto bg-gray-50 rounded-2xl p-4 border-2 border-gray-100">
                            <p className="text-sm font-medium text-gray-500 mb-2">Need help with your portfolio?</p>
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
    const { user, userProfile } = useContext(AuthContext);

    const fifBalance = userProfile?.fifBalance || 0;
    const halalBalance = userProfile?.halalBalance || 0;
    const totalBalance = fifBalance + halalBalance;
    const totalEarnings = 0; // Stub for actual earnings
    
    const halalPercent = totalBalance > 0 ? Math.round((halalBalance / totalBalance) * 100) : 50;
    const fifPercent = totalBalance > 0 ? Math.round((fifBalance / totalBalance) * 100) : 50;

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header Welcome */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-gray-100 pb-6">
                    <div>
                        <h1 className="text-4xl font-display font-extrabold uppercase">
                            Welcome back, <span className="text-[#C10202]">{user?.displayName?.split(' ')[0] || 'Investor'}</span>!
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">Here's how your Halal portfolio is performing today.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="neo-btn bg-white text-black px-6 py-3 text-sm hidden sm:flex items-center gap-2">
                            <Download size={16}/> Statement
                        </button>
                        <button className="neo-btn bg-black text-white px-8 py-3 text-sm">
                            + Invest Now
                        </button>
                    </div>
                </div>

                {/* Portfolio Value Summary */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-lotus-dark text-white rounded-[2rem] p-8 neo-border neo-shadow border-2 border-black relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                        <p className="text-gray-400 font-medium mb-2 uppercase tracking-wider text-sm flex items-center justify-between relative z-10">
                            Total Balance
                            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-xs font-bold">+ 0.0% All Time</span>
                        </p>
                        <h2 className="text-5xl md:text-6xl font-display font-extrabold text-white mb-2 relative z-10">₦{totalBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
                        <div className="flex items-center gap-2 mt-8 relative z-10">
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
                    
                    <div className="bg-white rounded-[2rem] p-6 neo-border neo-shadow-sm flex flex-col justify-between">
                        <h3 className="font-display font-bold text-gray-500 uppercase text-sm mb-4">Asset Allocation</h3>
                        <div className="flex-1 flex flex-col justify-center">
                            {/* Simple simulated chart layout */}
                            <div className="flex items-end h-24 gap-2 mb-4">
                                <div className="w-1/2 bg-genz-pink rounded-t-xl transition-all" style={{ height: `${halalPercent}%` }}></div>
                                <div className="w-1/2 bg-genz-lime rounded-t-xl border border-black/10 transition-all" style={{ height: `${fifPercent}%` }}></div>
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

                {/* My Funds */}
                <h3 className="font-display font-bold text-2xl uppercase mt-8 mb-4 border-b-2 border-gray-100 pb-2">My Funds</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Halal Fund Card */}
                    <div className="bg-white p-6 rounded-[2rem] neo-border neo-shadow-sm flex flex-col group cursor-pointer hover:border-black transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="inline-block px-3 py-1 bg-genz-pink text-black font-bold text-xs uppercase rounded-lg mb-2 neo-border">Moderate Risk</div>
                                <h4 className="font-display font-bold text-2xl uppercase">Lotus Halal Fund</h4>
                            </div>
                            <TrendingUp className="text-green-500 w-6 h-6" />
                        </div>
                        <div className="mb-2">
                            <p className="text-gray-500 text-sm font-medium uppercase mb-1">Current Value</p>
                            <p className="text-3xl font-display font-bold">₦{halalBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                        </div>
                        <div className="flex justify-between items-end mt-4 pt-4 border-t-2 border-gray-50">
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Total Return</p>
                                <p className="text-sm font-bold text-green-500">+ ₦0 (0.0%)</p>
                            </div>
                            <button className="text-sm font-bold bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-colors">Manage</button>
                        </div>
                    </div>

                    {/* FIF Fund Card */}
                    <div className="bg-white p-6 rounded-[2rem] neo-border neo-shadow-sm flex flex-col group cursor-pointer hover:border-black transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="inline-block px-3 py-1 bg-genz-lime text-black font-bold text-xs uppercase rounded-lg mb-2 neo-border">Low Risk</div>
                                <h4 className="font-display font-bold text-2xl uppercase">Lotus FIF Fund</h4>
                            </div>
                            <TrendingUp className="text-green-500 w-6 h-6" />
                        </div>
                        <div className="mb-2">
                            <p className="text-gray-500 text-sm font-medium uppercase mb-1">Current Value</p>
                            <p className="text-3xl font-display font-bold">₦{fifBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                        </div>
                        <div className="flex justify-between items-end mt-4 pt-4 border-t-2 border-gray-50">
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Total Return</p>
                                <p className="text-sm font-bold text-green-500">+ ₦0 (0.0%)</p>
                            </div>
                            <button className="text-sm font-bold bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-colors">Manage</button>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-3xl p-6 neo-border neo-shadow-sm mt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-display font-bold text-xl uppercase">Recent Activity</h3>
                        <button className="text-sm font-bold text-lotus-red hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center neo-border shadow-sm">
                                    <ArrowUpRight size={20} />
                                </div>
                                <div>
                                    <p className="font-bold">Auto-Invest: Halal Fund</p>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">12 May 2026 • SUCCESS</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg text-green-600">+ ₦50,000</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center neo-border shadow-sm">
                                    <ArrowUpRight size={20} />
                                </div>
                                <div>
                                    <p className="font-bold">Auto-Invest: FIF Fund</p>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">12 May 2026 • SUCCESS</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg text-green-600">+ ₦20,000</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center neo-border shadow-sm">
                                    <Target size={20} />
                                </div>
                                <div>
                                    <p className="font-bold">Dividend Earned</p>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">01 May 2026 • SUCCESS</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg text-green-600">+ ₦12,450</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};
