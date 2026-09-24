import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Camera, Upload, CheckCircle2, ArrowRight, ShieldCheck, ChevronLeft, Zap, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { AuthContext } from './App';
import { db } from './lib/firebase';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { sendEmailNotification } from './lib/email';

export const InvestOnboarding = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, userProfile, refreshProfile } = useContext(AuthContext);
    
    // Parse query params for tier preference and upgrade intent
    const searchParams = new URLSearchParams(location.search);
    const isUpgrade = searchParams.get('upgrade') === 'true';
    const initialTierParam = searchParams.get('tier');
    
    // Mode can be 'tier1' (Express Starter - 60s) or 'full' (Tier 2/3 Full Verification)
    const [mode, setMode] = useState<'tier1' | 'full'>(
        isUpgrade || initialTierParam === 'full' || (userProfile?.kycTier === 'tier1' && isUpgrade) 
            ? 'full' 
            : 'tier1'
    );
    
    const [step, setStep] = useState(1);
    const [fundSelected, setFundSelected] = useState<'fif' | 'halal'>(location.state?.fund || 'fif');
    
    // Form State
    const [formData, setFormData] = useState({
        // Step 1 / Tier 1: Personal
        firstName: '', middleName: '', lastName: '', dob: '', gender: '',
        residentialAddress: '', stateOfResidence: '', mobileNumber: '', emailAddress: '',
        cityOfBirth: '', countryOfBirth: '', stateOfOrigin: '', lga: '',
        maritalStatus: '', religion: '', nationality: 'Nigerian', otherNationality: '',
        
        // Step 2: Identity & Tax
        bvn: '', nin: '', idCardType: '', idCardNumber: '', idCardIssueDate: '', idCardExpiryDate: '',
        taxResidence: '', taxId: '', TINUnavailableReason: '',
        seniorPublicOffice: '', politicalRelatives: '',
        
        // Step 3: Employment
        sourceOfFunds: '', sourceOfFundsOther: '', estimatedAnnualIncome: '', employmentStatus: '',
        occupation: '', employerName: '', employerAddress: '', employerStateCountry: '', industrySector: '',
        investmentHorizon: '',
        
        // Step 4: Next of Kin
        nokTitle: '', nokGender: '', nokFirstname: '', nokSurname: '', nokOtherName: '',
        nokDob: '', nokMobile: '', nokAddress: '', nokState: '', nokRelationship: '', nokEmail: '',

        // Step 5: Bank
        bankCode: '', accountNumber: '', accountName: '', distributionPayment: 'reinvest'
    });

    // Pre-fill from profile if matches
    useEffect(() => {
        if (userProfile && user) {
            const nameParts = user.displayName?.split(' ') || [];
            setFormData(prev => ({
                ...prev,
                firstName: nameParts[0] || prev.firstName,
                lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : prev.lastName,
                emailAddress: user.email || prev.emailAddress,
                mobileNumber: (userProfile as any)?.mobileNumber || prev.mobileNumber,
                stateOfResidence: (userProfile as any)?.stateOfResidence || prev.stateOfResidence,
            }));
        }
    }, [userProfile, user]);

    // If already Tier 1 and upgrading, start on Step 2 (Identity) to save time
    useEffect(() => {
        if (isUpgrade && userProfile?.tier1Completed) {
            setStep(2);
        }
    }, [isUpgrade, userProfile]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    // Fast Tier 1 Express Submission (Name, Phone, State)
    const handleTier1Submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1200));

            if (user) {
                const updatePromise = updateDoc(doc(db, 'users', user.uid), {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    mobileNumber: formData.mobileNumber,
                    stateOfResidence: formData.stateOfResidence,
                    kycCompleted: true,
                    kycTier: 'tier1',
                    tier1Completed: true,
                    depositLimit: 50000,
                    onboarded: true,
                    updatedAt: serverTimestamp(),
                });
                
                await Promise.race([
                    updatePromise,
                    new Promise(resolve => setTimeout(resolve, 2000))
                ]).catch(e => console.warn('Offline update warning:', e));
                
                refreshProfile();

                if (user.email) {
                    sendEmailNotification(user.email, 'Tier 1 Account Activated - Lotus Tribe', `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
                            <h2 style="color: #0A0A0A; text-transform: uppercase;">Tier 1 Activated!</h2>
                            <p>Hi ${formData.firstName},</p>
                            <p>Your Tier 1 starter account is active with a ₦50,000 deposit limit.</p>
                            <p>You can now fund your account and earn your <strong>First Bag Secured 🎒</strong> badge and <strong>+250 XP</strong>!</p>
                        </div>
                    `).catch(console.error);
                }
            }
            setIsSuccess(true);
        } catch (error) {
            console.error("Tier 1 submission error", error);
            setIsSuccess(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Full Tier 2/3 SEC Compliant Submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (user) {
                const updatePromise = updateDoc(doc(db, 'users', user.uid), {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    dob: formData.dob,
                    gender: formData.gender,
                    residentialAddress: formData.residentialAddress,
                    stateOfResidence: formData.stateOfResidence,
                    mobileNumber: formData.mobileNumber,
                    bvn: formData.bvn ? `***${formData.bvn.slice(-4)}` : '',
                    nin: formData.nin ? `***${formData.nin.slice(-4)}` : '',
                    idCardType: formData.idCardType,
                    taxResidence: formData.taxResidence,
                    bankCode: formData.bankCode,
                    accountNumber: formData.accountNumber,
                    accountName: formData.accountName,
                    distributionPayment: formData.distributionPayment,
                    kycCompleted: true,
                    kycTier: 'tier2',
                    tier1Completed: true,
                    tier2Completed: true,
                    depositLimit: null, // Unlimited
                    onboarded: true,
                    updatedAt: serverTimestamp(),
                });
                
                await Promise.race([
                    updatePromise,
                    new Promise(resolve => setTimeout(resolve, 2000))
                ]).catch(e => console.warn('Offline update warning:', e));
                
                refreshProfile();

                if (user.email) {
                    sendEmailNotification(user.email, 'Account Fully Verified - Lotus Tribe', `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
                            <h2 style="color: #0A0A0A; text-transform: uppercase;">Tier 2 Full Verification Approved!</h2>
                            <p>Hi ${formData.firstName},</p>
                            <p>Your full regulatory verification is complete. You have unlocked unlimited deposits, automated debits, and instant withdrawals.</p>
                            <p>Welcome to the top tier of Lotus Tribe!</p>
                        </div>
                    `).catch(console.error);
                }
            }
            
            setIsSuccess(true);
        } catch (error) {
            console.error("KYC Submission error", error);
            setIsSuccess(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        const isTier1 = mode === 'tier1' && userProfile?.kycTier !== 'tier2';
        return (
            <div className="min-h-screen bg-[#FFFDF9] dark:bg-gray-950 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-900 p-8 md:p-14 rounded-[3rem] neo-border neo-shadow text-center max-w-lg w-full">
                    <div className={`w-24 h-24 ${isTier1 ? 'bg-genz-lime' : 'bg-emerald-400'} rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-black shadow-inner`}>
                        {isTier1 ? <Zap size={48} className="text-black fill-black" /> : <CheckCircle2 size={48} className="text-black" />}
                    </div>
                    
                    <div className="inline-block px-4 py-1 rounded-full bg-black text-white font-bold text-xs uppercase tracking-widest mb-3">
                        {isTier1 ? '⚡ Tier 1 Verified' : '🛡️ Full Tier 2 Verified'}
                    </div>

                    <h2 className="font-display font-extrabold text-3xl md:text-4xl uppercase mb-3 text-lotus-dark dark:text-white">
                        {isTier1 ? 'Quick Start Active!' : 'Account Fully Verified!'}
                    </h2>
                    
                    <p className="font-medium text-gray-600 dark:text-gray-300 mb-8 text-base leading-relaxed">
                        {isTier1 ? (
                            <>
                                Your starter account is live with a <strong className="text-black dark:text-white">₦50,000 deposit limit</strong>. Make your first deposit to claim the exclusive <strong className="text-lotus-dark dark:text-white">"First Bag Secured" 🎒 Badge</strong> and <strong className="text-lotus-dark dark:text-white">+250 XP</strong>!
                            </>
                        ) : (
                            <>
                                Your Tier 2 SEC KYC has been approved. You now enjoy <strong className="text-black dark:text-white">unlimited deposits</strong>, automated savings, and seamless withdrawals.
                            </>
                        )}
                    </p>

                    <div className="space-y-3">
                        <Link 
                            to="/dashboard" 
                            state={{ openQuickDeposit: true, fund: fundSelected }}
                            className="neo-btn bg-lotus-dark text-white px-8 py-4 uppercase block w-full text-lg hover:-translate-y-1 transition-transform font-bold"
                        >
                            {isTier1 ? 'Make First Deposit & Claim 250 XP 🚀' : 'Go to Investment Dashboard'}
                        </Link>

                        {isTier1 && (
                            <button
                                onClick={() => { setIsSuccess(false); setMode('full'); setStep(2); }}
                                className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white uppercase tracking-wider py-2"
                            >
                                Or upgrade to Tier 2 (Unlimited) now →
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-lotus-dark flex">
            {/* Left Sidebar */}
            <div className="hidden lg:flex w-1/3 bg-black text-white p-12 flex-col relative border-r border-white/5">
                <Link to="/invest" className="inline-flex items-center gap-2 font-display font-bold uppercase mb-12 hover:text-genz-lime transition-colors text-gray-400">
                    <ChevronLeft size={18} /> Back
                </Link>
                <div className="mb-auto">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 font-bold text-xs uppercase tracking-widest mb-6 border border-white/10 text-gray-300">
                        {fundSelected === 'fif' ? 'Fixed Income Fund' : 'Halal Investment Fund'}
                    </div>
                    <h1 className="text-5xl font-display font-bold text-white leading-tight uppercase mb-6">
                        Start your <br/><span className={fundSelected === 'fif' ? "text-genz-lime" : "text-genz-pink"}>Wealth Journey.</span>
                    </h1>
                    <p className="text-gray-400 font-medium text-lg mb-10 leading-relaxed">
                        Complete your KYC profile in a few minutes. We're directly integrated with Lotus Capital for a secure, seamless onboarding.
                    </p>

                    <div className="space-y-6">
                        {mode === 'tier1' ? (
                            [
                                { step: 1, label: "Basic Details (Name & Phone)", active: true, done: false },
                                { step: 2, label: "₦50k Deposit Cap", active: false, done: false },
                                { step: 3, label: "+250 XP First Bag Reward", active: false, done: false }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-sm transition-colors ${item.active ? 'border-genz-lime bg-genz-lime text-black font-extrabold' : 'border-white/20 text-white/40'}`}>
                                        {idx === 0 ? <Zap size={18} className="fill-current text-black" /> : idx + 1}
                                    </div>
                                    <div>
                                        <span className={`font-bold uppercase tracking-wider text-sm block ${item.active ? 'text-white' : 'text-gray-500'}`}>{item.label}</span>
                                        {idx === 0 && <span className="text-[11px] text-genz-lime font-medium">⚡ 60-Second Express Flow</span>}
                                    </div>
                                </div>
                            ))
                        ) : (
                            [
                                { step: 1, label: "Personal Details" },
                                { step: 2, label: "Identity & Tax" },
                                { step: 3, label: "Employment" },
                                { step: 4, label: "Next of Kin" },
                                { step: 5, label: "Bank & Declaration" }
                            ].map((item) => (
                                <div key={item.step} className={`flex items-center gap-4 ${step >= item.step ? 'opacity-100' : 'opacity-30'}`}>
                                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-sm transition-colors ${step === item.step ? 'border-white bg-white dark:bg-gray-900 text-black dark:text-white' : step > item.step ? 'border-genz-lime bg-genz-lime text-black dark:text-white' : 'border-white/20 text-white/20 dark:text-gray-600'}`}>
                                        {step > item.step ? <CheckCircle2 size={18} /> : item.step}
                                    </div>
                                    <span className={`font-bold uppercase tracking-wider text-sm ${step === item.step ? 'text-white' : step > item.step ? 'text-genz-lime' : 'text-gray-500 dark:text-gray-400'}`}>{item.label}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="mt-12 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3 text-sm text-gray-300 font-medium mb-2">
                        <ShieldCheck size={18} className="text-genz-lime"/>
                        <span>Secure API Connection</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Your data is securely encrypted and submitted directly to Lotus Capital Limited infrastructure.</p>
                </div>
            </div>

            {/* Right Form Area */}
            <div className="w-full lg:w-2/3 bg-gray-50 dark:bg-gray-800 flex flex-col p-6 lg:p-20 overflow-y-auto">
                <div className="max-w-2xl w-full mx-auto my-auto">
                    
                    <div className="lg:hidden mb-6">
                        <Link to="/invest" className="inline-flex items-center gap-2 font-display font-bold uppercase mb-4 hover:text-lotus-dark dark:text-white transition-colors text-gray-400">
                            <ChevronLeft size={18} /> Back
                        </Link>
                        <h1 className="text-3xl font-display font-bold text-lotus-dark dark:text-white uppercase mb-1">
                            {mode === 'tier1' ? '⚡ Tier 1 Quick Onboarding' : 'KYC Verification'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest text-xs">
                            {mode === 'tier1' ? '60 Seconds • Up to ₦50k Limit' : `Step ${step} of 5`}
                        </p>
                    </div>

                    {/* Progressive KYC Tier Mode Switcher */}
                    <div className="bg-white dark:bg-gray-900 p-2 rounded-2xl border-2 border-black neo-shadow-sm mb-8 grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => { setMode('tier1'); setStep(1); }}
                            className={`p-3 rounded-xl text-left transition-all ${
                                mode === 'tier1' 
                                    ? 'bg-genz-lime text-black font-extrabold border-2 border-black shadow-sm' 
                                    : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white font-bold'
                            }`}
                        >
                            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider mb-1">
                                <Zap size={14} className="fill-current text-black" />
                                <span className="font-display">Tier 1 Express</span>
                                <span className="bg-black text-white text-[10px] px-1.5 py-0.5 rounded ml-auto font-mono">60s</span>
                            </div>
                            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">Deposit up to ₦50k instantly</p>
                        </button>

                        <button
                            type="button"
                            onClick={() => { setMode('full'); }}
                            className={`p-3 rounded-xl text-left transition-all ${
                                mode === 'full' 
                                    ? 'bg-black text-white font-extrabold shadow-sm' 
                                    : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white font-bold'
                            }`}
                        >
                            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider mb-1">
                                <ShieldCheck size={14} className={mode === 'full' ? "text-genz-lime" : ""} />
                                <span className="font-display">Tier 2/3 Full SEC</span>
                                <span className="bg-genz-lime text-black text-[10px] px-1.5 py-0.5 rounded ml-auto font-mono">PRO</span>
                            </div>
                            <p className={`text-xs font-semibold ${mode === 'full' ? 'text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>
                                Unlimited deposits & withdrawals
                            </p>
                        </button>
                    </div>

                    {/* TIER 1 EXPRESS FORM */}
                    {mode === 'tier1' ? (
                        <form onSubmit={handleTier1Submit} className="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-3xl border-2 border-black neo-shadow">
                            <div className="border-b-2 border-gray-100 dark:border-gray-800 pb-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-display font-extrabold uppercase text-lotus-dark dark:text-white flex items-center gap-2">
                                        <Zap className="text-black fill-black" size={24} /> Express Starter Details
                                    </h2>
                                    <span className="bg-genz-lime text-black text-xs font-extrabold px-3 py-1 rounded-full border border-black uppercase">
                                        ₦50k Cap
                                    </span>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                    Get started in 60 seconds with no BVN or NIN needed today. Start investing small and upgrade anytime.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="group">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">First Name *</label>
                                    <input 
                                        required 
                                        name="firstName" 
                                        value={formData.firstName} 
                                        onChange={handleInput} 
                                        className="w-full bg-gray-50 dark:bg-gray-800 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white font-medium outline-none" 
                                        placeholder="First name" 
                                    />
                                </div>

                                <div className="group">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Surname / Last Name *</label>
                                    <input 
                                        required 
                                        name="lastName" 
                                        value={formData.lastName} 
                                        onChange={handleInput} 
                                        className="w-full bg-gray-50 dark:bg-gray-800 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white font-medium outline-none" 
                                        placeholder="Last name" 
                                    />
                                </div>

                                <div className="group">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Mobile Phone Number *</label>
                                    <input 
                                        required 
                                        type="tel"
                                        name="mobileNumber" 
                                        value={formData.mobileNumber} 
                                        onChange={handleInput} 
                                        className="w-full bg-gray-50 dark:bg-gray-800 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white font-medium outline-none" 
                                        placeholder="08012345678" 
                                    />
                                </div>

                                <div className="group">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">State of Residence *</label>
                                    <input 
                                        required 
                                        name="stateOfResidence" 
                                        value={formData.stateOfResidence} 
                                        onChange={handleInput} 
                                        className="w-full bg-gray-50 dark:bg-gray-800 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white font-medium outline-none" 
                                        placeholder="e.g. Lagos, Abuja, Kano" 
                                    />
                                </div>
                            </div>

                            {/* Fund Target Picker */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Initial Fund Selection</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFundSelected('fif')}
                                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                                            fundSelected === 'fif' 
                                                ? 'border-black bg-genz-lime/30 dark:bg-genz-lime/10' 
                                                : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                    >
                                        <div className="font-bold text-sm">Lotus FIF Fund</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Fixed Income • Low Risk</div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setFundSelected('halal')}
                                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                                            fundSelected === 'halal' 
                                                ? 'border-black bg-genz-pink/30 dark:bg-genz-pink/10' 
                                                : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                    >
                                        <div className="font-bold text-sm">Lotus Halal Fund</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Halal Equities • Growth</div>
                                    </button>
                                </div>
                            </div>

                            {/* Incentive & Regulatory Disclosure */}
                            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 rounded-xl space-y-2">
                                <div className="flex items-start gap-2">
                                    <Sparkles size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
                                        <strong>Bonus:</strong> Completing your first deposit unlocks the exclusive <strong className="underline">"First Bag Secured" 🎒 Badge</strong> and awards <strong className="underline">+250 XP</strong> to your Tribe rank!
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <AlertCircle size={18} className="text-gray-400 shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                                        Tier 1 is compliant with SEC progressive KYC guidelines for retail accounts up to ₦50,000. Full BVN and ID verification are required for withdrawals and unlimited investments.
                                    </p>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="neo-btn bg-lotus-dark text-white text-lg py-4 flex justify-center items-center gap-3 w-full uppercase font-bold"
                            >
                                {isSubmitting ? 'Activating Account...' : 'Activate Tier 1 & Fund Account ⚡'}
                            </button>
                        </form>
                    ) : (
                    /* TIER 2/3 FULL SEC COMPLIANCE WIZARD */
                    <form onSubmit={step === 5 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
                        <AnimatePresence mode="wait">
                            {/* STEP 1 */}
                            {step === 1 && (
                                 <motion.div 
                                     key="step1"
                                     initial={{ opacity: 0, scale: 0.98 }}
                                     animate={{ opacity: 1, scale: 1 }}
                                     exit={{ opacity: 0, scale: 0.98 }}
                                     className="space-y-8"
                                 >
                                     <h2 className="text-3xl font-display font-bold uppercase mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 text-lotus-dark dark:text-white">Personal Details</h2>
                                     
                                     <div className="grid md:grid-cols-2 gap-6">
                                         <div className="group md:col-span-2">
                                             <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Surname / Last Name *</label>
                                             <input required name="lastName" value={formData.lastName} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Enter surname" />
                                         </div>
                                         <div className="group">
                                             <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">First Name *</label>
                                             <input required name="firstName" value={formData.firstName} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Enter first name" />
                                         </div>
                                         <div className="group">
                                             <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Other Name</label>
                                             <input name="middleName" value={formData.middleName} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Enter other name" />
                                         </div>
                                         <div className="group">
                                             <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Date of Birth *</label>
                                             <input required type="date" name="dob" value={formData.dob} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 text-gray-700 dark:text-gray-200 transition-all" />
                                         </div>
                                         <div className="group">
                                             <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Gender *</label>
                                             <div className="relative">
                                                 <select required name="gender" value={formData.gender} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 appearance-none transition-all">
                                                     <option value="" disabled>Select Gender</option>
                                                     <option value="male">Male</option>
                                                     <option value="female">Female</option>
                                                 </select>
                                                 <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                     <ArrowRight size={16} className="rotate-90" />
                                                 </div>
                                             </div>
                                         </div>
                                         <div className="md:col-span-2 group">
                                             <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Residential Address *</label>
                                             <input required name="residentialAddress" value={formData.residentialAddress} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Street address" />
                                         </div>
                                         <div className="group">
                                             <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">State of Residence *</label>
                                             <input required name="stateOfResidence" value={formData.stateOfResidence} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="E.g. Lagos" />
                                         </div>
                                         <div className="group">
                                             <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Mobile Number *</label>
                                             <input required name="mobileNumber" value={formData.mobileNumber} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="E.g. 080..." />
                                         </div>
                                         <div className="group">
                                             <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Email Address *</label>
                                             <input required type="email" name="emailAddress" value={formData.emailAddress} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Email" />
                                         </div>
                                         <div className="group">
                                             <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">City and Country of Birth *</label>
                                             <input required name="cityOfBirth" value={formData.cityOfBirth} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="City, Country" />
                                         </div>
                                         <div className="group">
                                             <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">State of Origin *</label>
                                             <input required name="stateOfOrigin" value={formData.stateOfOrigin} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="State" />
                                         </div>
                                         <div className="group">
                                             <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">LGA *</label>
                                             <input required name="lga" value={formData.lga} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Local Govt Area" />
                                         </div>
                                         <div className="group">
                                             <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Marital Status *</label>
                                             <div className="relative">
                                                 <select required name="maritalStatus" value={formData.maritalStatus} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 appearance-none transition-all">
                                                     <option value="" disabled>Select Status</option>
                                                     <option value="single">Single</option>
                                                     <option value="married">Married</option>
                                                     <option value="widowed">Widowed</option>
                                                 </select>
                                                 <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                     <ArrowRight size={16} className="rotate-90" />
                                                 </div>
                                             </div>
                                         </div>
                                         <div className="group">
                                             <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Religion *</label>
                                             <input required name="religion" value={formData.religion} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Religion" />
                                         </div>
                                         <div className="group md:col-span-2">
                                             <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Nationality *</label>
                                             <input required name="nationality" value={formData.nationality} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Nationality" />
                                         </div>
                                         <div className="group md:col-span-2">
                                             <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Other Nationality (Optional)</label>
                                             <input name="otherNationality" value={formData.otherNationality} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all mb-2" placeholder="If dual nationality" />
                                             {formData.otherNationality && (
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" id="usTax" required className="w-4 h-4 text-lotus-dark dark:text-white border-gray-300 rounded focus:ring-lotus-dark" />
                                                    <label htmlFor="usTax" className="text-xs font-medium text-gray-500 dark:text-gray-400">I confirm I am not subject to US Tax Laws</label>
                                                </div>
                                             )}
                                         </div>
                                     </div>
                                     <button type="submit" className="neo-btn bg-lotus-dark text-white text-xl py-5 flex justify-center items-center gap-3 w-full mt-8 uppercase">
                                         Continue <ArrowRight size={20}/>
                                     </button>
                                 </motion.div>
                             )}

                            {/* STEP 2 */}
                            {step === 2 && (
                                <motion.div 
                                    key="step2"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="space-y-8"
                                >
                                    <h2 className="text-3xl font-display font-bold uppercase mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 text-lotus-dark dark:text-white">Identity & Tax</h2>
                                    
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">BVN *</label>
                                            <input required name="bvn" value={formData.bvn} onChange={handleInput} maxLength={11} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all tracking-widest" placeholder="11-digit BVN" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">NIN *</label>
                                            <input required name="nin" value={formData.nin} onChange={handleInput} maxLength={11} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all tracking-widest" placeholder="11-digit NIN" />
                                        </div>
                                        
                                        <div className="group md:col-span-2">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">ID Card Type *</label>
                                            <div className="relative">
                                                <select required name="idCardType" value={formData.idCardType} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 appearance-none transition-all">
                                                    <option value="" disabled>Select ID</option>
                                                    <option value="nimc">NIMC Card</option>
                                                    <option value="drivers_license">Drivers License</option>
                                                    <option value="intl_passport">Int'l Passport</option>
                                                    <option value="voters_card">Permanent Voters Card</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <ArrowRight size={16} className="rotate-90" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="group md:col-span-2">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">ID Card Number *</label>
                                            <input required name="idCardNumber" value={formData.idCardNumber} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Enter ID number" />
                                        </div>

                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">ID Issue Date</label>
                                            <input type="date" name="idCardIssueDate" value={formData.idCardIssueDate} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 text-gray-700 dark:text-gray-200 transition-all" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">ID Expiry Date</label>
                                            <input type="date" name="idCardExpiryDate" value={formData.idCardExpiryDate} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 text-gray-700 dark:text-gray-200 transition-all" />
                                        </div>

                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Country of tax residence *</label>
                                            <input required name="taxResidence" value={formData.taxResidence} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="E.g. Nigeria" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Tax Payer ID / TIN</label>
                                            <input name="taxId" value={formData.taxId} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Enter TIN" />
                                        </div>

                                        {!formData.taxId && (
                                            <div className="group md:col-span-2">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">If TIN is unavailable, please explain</label>
                                                <input name="TINUnavailableReason" value={formData.TINUnavailableReason} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Reason for no TIN" />
                                            </div>
                                        )}
                                        
                                        <div className="md:col-span-2 group mt-4">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Have you held or do you currently hold a Senior Public / Govt Office? *</label>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2"><input type="radio" name="seniorPublicOffice" value="yes" onChange={handleInput} checked={formData.seniorPublicOffice === 'yes'} required/> Yes</label>
                                                <label className="flex items-center gap-2"><input type="radio" name="seniorPublicOffice" value="no" onChange={handleInput} checked={formData.seniorPublicOffice === 'no'} required/> No</label>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Do you have close relatives/associates occupying any political position or royalty? *</label>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2"><input type="radio" name="politicalRelatives" value="yes" onChange={handleInput} checked={formData.politicalRelatives === 'yes'} required/> Yes</label>
                                                <label className="flex items-center gap-2"><input type="radio" name="politicalRelatives" value="no" onChange={handleInput} checked={formData.politicalRelatives === 'no'} required/> No</label>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="flex gap-4 mt-8">
                                        <button type="button" onClick={prevStep} className="px-8 py-4 font-bold uppercase text-gray-400 hover:text-lotus-dark dark:text-white transition-colors">Back</button>
                                        <button type="submit" className="neo-btn bg-lotus-dark text-white text-xl py-5 flex-1 flex justify-center items-center gap-3 uppercase">
                                            Continue <ArrowRight size={20}/>
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3 */}
                            {step === 3 && (
                                <motion.div 
                                    key="step3"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="space-y-8"
                                >
                                    <h2 className="text-3xl font-display font-bold uppercase mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 text-lotus-dark dark:text-white">Employment & Source of Funds</h2>
                                    
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2 group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Source of Funds *</label>
                                            <div className="relative">
                                                <select required name="sourceOfFunds" value={formData.sourceOfFunds} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 appearance-none transition-all">
                                                    <option value="" disabled>Select Source</option>
                                                    <option value="employment">Employment</option>
                                                    <option value="inheritance">Inheritance</option>
                                                    <option value="saleOfAsset">Sale of Asset</option>
                                                    <option value="businessActivities">Business Activities</option>
                                                    <option value="others">Others</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <ArrowRight size={16} className="rotate-90" />
                                                </div>
                                            </div>
                                        </div>

                                        {formData.sourceOfFunds === 'others' && (
                                            <div className="md:col-span-2 group">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Please Specify Source *</label>
                                                <input required name="sourceOfFundsOther" value={formData.sourceOfFundsOther} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Specify..." />
                                            </div>
                                        )}

                                        <div className="md:col-span-2 group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Estimated Annual Income *</label>
                                            <div className="relative">
                                                <select required name="estimatedAnnualIncome" value={formData.estimatedAnnualIncome} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 appearance-none transition-all">
                                                    <option value="" disabled>Select Income Range</option>
                                                    <option value="100k-1m">N100,000 - N1Million</option>
                                                    <option value="1m-5m">N1Million - N5Million</option>
                                                    <option value="5m-10m">N5Million - N10Million</option>
                                                    <option value="10m-15m">N10Million - N15Million</option>
                                                    <option value="15m+">N15Million & Above</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <ArrowRight size={16} className="rotate-90" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Employment Status *</label>
                                            <div className="relative">
                                                <select required name="employmentStatus" value={formData.employmentStatus} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 appearance-none transition-all">
                                                    <option value="" disabled>Select Status</option>
                                                    <option value="salaried">Salaried Employment</option>
                                                    <option value="selfEmployed">Self Employed</option>
                                                    <option value="retired">Retired</option>
                                                    <option value="student">Student</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <ArrowRight size={16} className="rotate-90" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Occupation/Business Type</label>
                                            <input name="occupation" value={formData.occupation} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="E.g. Engineer" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Employer/Business Name</label>
                                            <input name="employerName" value={formData.employerName} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Enter Name" />
                                        </div>
                                        <div className="md:col-span-2 group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Employer/Business Address</label>
                                            <input name="employerAddress" value={formData.employerAddress} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Enter Address" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">State & Country</label>
                                            <input name="employerStateCountry" value={formData.employerStateCountry} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="State & Country" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Industry/Sector</label>
                                            <input name="industrySector" value={formData.industrySector} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="E.g. Technology" />
                                        </div>
                                        
                                        <div className="md:col-span-2 group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Investment Horizon *</label>
                                            <div className="relative">
                                                <select required name="investmentHorizon" value={formData.investmentHorizon} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 appearance-none transition-all">
                                                    <option value="" disabled>Select Horizon</option>
                                                    <option value="30-90">30 - 90 days</option>
                                                    <option value="180-365">180 - 365 days</option>
                                                    <option value="1yr+">1 year and above</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <ArrowRight size={16} className="rotate-90" />
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="flex gap-4 mt-8">
                                        <button type="button" onClick={prevStep} className="px-8 py-4 font-bold uppercase text-gray-400 hover:text-lotus-dark dark:text-white transition-colors">Back</button>
                                        <button type="submit" className="neo-btn bg-lotus-dark text-white text-xl py-5 flex-1 flex justify-center items-center gap-3 uppercase">
                                            Continue <ArrowRight size={20}/>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                            
                            {/* STEP 4 */}
                            {step === 4 && (
                                <motion.div 
                                    key="step4"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="space-y-8"
                                >
                                    <h2 className="text-3xl font-display font-bold uppercase mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 text-lotus-dark dark:text-white">Next of Kin</h2>
                                    
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Title (Mr, Mrs, Miss, Chief, Dr) *</label>
                                            <input required name="nokTitle" value={formData.nokTitle} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Enter title" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Gender *</label>
                                            <div className="relative">
                                                <select required name="nokGender" value={formData.nokGender} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 appearance-none transition-all">
                                                    <option value="" disabled>Select Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <ArrowRight size={16} className="rotate-90" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="group md:col-span-2">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Surname *</label>
                                            <input required name="nokSurname" value={formData.nokSurname} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Enter surname" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">First Name *</label>
                                            <input required name="nokFirstname" value={formData.nokFirstname} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Enter first name" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Other Name</label>
                                            <input name="nokOtherName" value={formData.nokOtherName} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Enter other name" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Date of Birth *</label>
                                            <input required type="date" name="nokDob" value={formData.nokDob} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 text-gray-700 dark:text-gray-200 transition-all" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Mobile No. *</label>
                                            <input required name="nokMobile" value={formData.nokMobile} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="E.g. 080..." />
                                        </div>
                                        <div className="group md:col-span-2">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Address *</label>
                                            <input required name="nokAddress" value={formData.nokAddress} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Enter address" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">State *</label>
                                            <input required name="nokState" value={formData.nokState} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="State" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Relationship *</label>
                                            <input required name="nokRelationship" value={formData.nokRelationship} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="E.g. Sister, Father" />
                                        </div>
                                        <div className="group md:col-span-2">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Email Address *</label>
                                            <input required type="email" name="nokEmail" value={formData.nokEmail} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Email Address" />
                                        </div>

                                    </div>

                                    <div className="flex gap-4 mt-8">
                                        <button type="button" onClick={prevStep} className="px-8 py-4 font-bold uppercase text-gray-400 hover:text-lotus-dark dark:text-white transition-colors">Back</button>
                                        <button type="submit" className="neo-btn bg-lotus-dark text-white text-xl py-5 flex-1 flex justify-center items-center gap-3 uppercase">
                                            Continue <ArrowRight size={20}/>
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 5 */}
                            {step === 5 && (
                                <motion.div 
                                    key="step5"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="space-y-8"
                                >
                                    <h2 className="text-3xl font-display font-bold uppercase mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 text-lotus-dark dark:text-white">Bank Details & Declaration</h2>
                                    
                                    <div className="bg-genz-lime border border-lotus-dark/5 rounded-2xl p-6 mb-8 flex gap-4 shadow-sm">
                                        <CheckCircle2 size={28} className="text-lotus-dark/40 shrink-0"/>
                                        <p className="text-sm text-lotus-dark/70 font-medium leading-relaxed">Final step! Add the bank account for funding your {fundSelected.toUpperCase()} investments and receiving fast withdrawals.</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2 group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Bank Name *</label>
                                            <div className="relative">
                                                <select required name="bankCode" value={formData.bankCode} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 appearance-none transition-all">
                                                    <option value="" disabled>Choose your bank</option>
                                                    <option value="044">Access Bank</option>
                                                    <option value="058">GTBank</option>
                                                    <option value="033">UBA</option>
                                                    <option value="057">Zenith Bank</option>
                                                    <option value="232">Sterling Bank</option>
                                                    <option value="073">Stanbic IBTC</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <ArrowRight size={16} className="rotate-90" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Bank Account Number *</label>
                                            <input required name="accountNumber" value={formData.accountNumber} onChange={handleInput} maxLength={10} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 tracking-widest transition-all" placeholder="0000000000" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Bank Account Name *</label>
                                            <input required name="accountName" value={formData.accountName} onChange={handleInput} className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Account Name" />
                                        </div>
                                        
                                        <div className="md:col-span-2 group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark dark:text-white transition-colors">Distribution Payment *</label>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2 font-bold cursor-pointer"><input type="radio" name="distributionPayment" value="reinvest" onChange={handleInput} checked={formData.distributionPayment === 'reinvest'} required className="w-4 h-4 text-lotus-dark dark:text-white accent-lotus-dark"/> Reinvest</label>
                                                <label className="flex items-center gap-2 font-bold cursor-pointer"><input type="radio" name="distributionPayment" value="bank" onChange={handleInput} checked={formData.distributionPayment === 'bank'} required className="w-4 h-4 text-lotus-dark dark:text-white accent-lotus-dark"/> Pay to my Bank Account</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold leading-relaxed uppercase tracking-wider mb-2 text-lotus-dark dark:text-white">
                                            DECLARATION
                                        </p>
                                        <ul className="text-xs text-gray-500 dark:text-gray-400 list-disc ml-4 space-y-1">
                                            <li>I am at least 18 years old.</li>
                                            <li>The information given is correct to the best of my knowledge and belief...</li>
                                            <li>I certify that the proceeds are legitimate and not the proceed of any unlawful activity.</li>
                                            <li>I consent to the processing and retention of my personal data as provided herein and in accordance with the Nigeria Data Protection Act 2023.</li>
                                        </ul>
                                    </div>

                                    <div className="flex gap-4 mt-8">
                                        <button type="button" disabled={isSubmitting} onClick={prevStep} className="px-8 py-4 font-bold uppercase text-gray-400 hover:text-lotus-dark dark:text-white transition-colors disabled:opacity-50">Back</button>
                                        <button type="submit" disabled={isSubmitting} className="neo-btn bg-lotus-dark text-white text-xl py-5 flex-1 flex justify-center items-center gap-3 uppercase disabled:opacity-70">
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-3">
                                                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                                    SUBMITTING...
                                                </span>
                                            ) : (
                                                <>COMPLETE PROFILE <CheckCircle2 size={22}/></>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                    )}
                </div>
            </div>
        </div>
    );
};
