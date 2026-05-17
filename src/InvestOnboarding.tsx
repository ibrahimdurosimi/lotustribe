import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Camera, Upload, CheckCircle2, ArrowRight, ShieldCheck, ChevronLeft } from 'lucide-react';
import { AuthContext } from './App';
import { db } from './lib/firebase';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';

export const InvestOnboarding = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, userProfile, refreshProfile } = useContext(AuthContext);
    const [step, setStep] = useState(1);
    const [fundSelected] = useState(location.state?.fund || 'fif');
    
    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        bvn: '',
        nin: '',
        dob: '',
        gender: '',
        address: '',
        stateOfOrigin: '',
        nationality: 'Nigerian',
        bankCode: '',
        accountNumber: ''
    });

    // Pre-fill from profile if matches
    useEffect(() => {
        if (userProfile && user) {
            const nameParts = user.displayName?.split(' ') || [];
            setFormData(prev => ({
                ...prev,
                firstName: nameParts[0] || prev.firstName,
                lastName: nameParts[nameParts.length - 1] || prev.lastName,
            }));
        }
    }, [userProfile, user]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Simulate API call to Lotus Capital Investment API
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (user) {
                // Update Firestore profile
                await updateDoc(doc(db, 'users', user.uid), {
                    kycCompleted: true,
                    onboarded: true,
                    updatedAt: serverTimestamp(),
                    // In a real app we might save non-sensitive kyc data or just a flag
                });
                refreshProfile();
            }
            
            setIsSuccess(true);
        } catch (error) {
            console.error("KYC Submission error", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-genz-blue/10 flex items-center justify-center p-4">
                <div className="bg-white p-10 md:p-16 rounded-[3rem] neo-border neo-shadow text-center max-w-lg w-full">
                    <div className="w-24 h-24 bg-genz-lime rounded-full flex items-center justify-center mx-auto mb-8 border border-lotus-dark/10 shadow-inner">
                        <CheckCircle2 size={48} className="text-lotus-dark" />
                    </div>
                    <h2 className="font-display font-extrabold text-4xl uppercase mb-4 text-lotus-dark">Account Verified!</h2>
                    <p className="font-medium text-gray-500 mb-8 text-lg leading-relaxed">
                        Your KYC has been approved. Welcome to the Lotus Tribe! Your {fundSelected.toUpperCase()} investment account is now active and ready to fund.
                    </p>
                    <Link to="/dashboard" className="neo-btn bg-lotus-dark text-white px-8 py-4 uppercase block w-full text-xl hover:-translate-y-1 transition-transform">
                        Go to Dashboard
                    </Link>
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
                        {[
                            { step: 1, label: "Personal Details" },
                            { step: 2, label: "Identity & Verification" },
                            { step: 3, label: "Bank Account Details" }
                        ].map((item) => (
                            <div key={item.step} className={`flex items-center gap-4 ${step >= item.step ? 'opacity-100' : 'opacity-30'}`}>
                                <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-sm transition-colors ${step === item.step ? 'border-white bg-white text-black' : step > item.step ? 'border-genz-lime bg-genz-lime text-black' : 'border-white/20 text-white/20'}`}>
                                    {step > item.step ? <CheckCircle2 size={18} /> : item.step}
                                </div>
                                <span className={`font-bold uppercase tracking-wider text-sm ${step === item.step ? 'text-white' : step > item.step ? 'text-genz-lime' : 'text-gray-500'}`}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3 text-sm text-gray-300 font-medium mb-2">
                        <ShieldCheck size={18} className="text-genz-lime"/>
                        <span>Secure API Connection</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Your data is securely encrypted and submitted directly to Lotus Capital Limited infrastructure.</p>
                </div>
            </div>

            {/* Right Form Area */}
            <div className="w-full lg:w-2/3 bg-gray-50 flex flex-col p-6 lg:p-20 overflow-y-auto">
                <div className="max-w-2xl w-full mx-auto my-auto">
                    
                    <div className="lg:hidden mb-10">
                        <Link to="/invest" className="inline-flex items-center gap-2 font-display font-bold uppercase mb-8 hover:text-lotus-dark transition-colors text-gray-400">
                            <ChevronLeft size={18} /> Back
                        </Link>
                        <h1 className="text-4xl font-display font-bold text-lotus-dark uppercase mb-2">KYC Profile</h1>
                        <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">Step {step} of 3</p>
                    </div>

                    <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
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
                                    <h2 className="text-3xl font-display font-bold uppercase mb-8 border-b border-gray-200 pb-4 text-lotus-dark">Personal Details</h2>
                                    
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark transition-colors">First Name</label>
                                            <input required name="firstName" value={formData.firstName} onChange={handleInput} className="w-full bg-white p-4 rounded-xl border border-gray-200 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Enter first name" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark transition-colors">Middle Name (Optional)</label>
                                            <input name="middleName" value={formData.middleName} onChange={handleInput} className="w-full bg-white p-4 rounded-xl border border-gray-200 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Enter middle name" />
                                        </div>
                                        <div className="md:col-span-2 group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark transition-colors">Last Name</label>
                                            <input required name="lastName" value={formData.lastName} onChange={handleInput} className="w-full bg-white p-4 rounded-xl border border-gray-200 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="Enter last name" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark transition-colors">Date of Birth</label>
                                            <input required type="date" name="dob" value={formData.dob} onChange={handleInput} className="w-full bg-white p-4 rounded-xl border border-gray-200 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 text-gray-700 transition-all" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark transition-colors">Gender</label>
                                            <div className="relative">
                                                <select required name="gender" value={formData.gender} onChange={handleInput} className="w-full bg-white p-4 rounded-xl border border-gray-200 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 appearance-none transition-all">
                                                    <option value="" disabled>Select Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <ArrowRight size={16} className="rotate-90" />
                                                </div>
                                            </div>
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
                                    <h2 className="text-3xl font-display font-bold uppercase mb-8 border-b border-gray-200 pb-4 text-lotus-dark">Identity Verification</h2>
                                    
                                    <div className="bg-genz-blue border border-lotus-dark/5 rounded-2xl p-6 mb-8 flex gap-4 shadow-sm">
                                        <ShieldCheck size={28} className="text-lotus-dark/40 shrink-0"/>
                                        <p className="text-sm text-lotus-dark/70 font-medium leading-relaxed">Federal regulation requires us to verify your identity. Your BVN and NIN will be checked securely via our encrypted portal.</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark transition-colors">BVN (Bank Verification Number)</label>
                                            <input required name="bvn" value={formData.bvn} onChange={handleInput} maxLength={11} className="w-full bg-white p-4 rounded-xl border border-gray-200 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all tracking-widest" placeholder="11-digit BVN" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark transition-colors">NIN (National ID Number)</label>
                                            <input required name="nin" value={formData.nin} onChange={handleInput} maxLength={11} className="w-full bg-white p-4 rounded-xl border border-gray-200 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all tracking-widest" placeholder="11-digit NIN" />
                                        </div>
                                        
                                        <div className="md:col-span-2 group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark transition-colors">Residential Address</label>
                                            <input required name="address" value={formData.address} onChange={handleInput} className="w-full bg-white p-4 rounded-xl border border-gray-200 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 mb-4 transition-all" placeholder="Street address" />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input required name="stateOfOrigin" value={formData.stateOfOrigin} onChange={handleInput} className="w-full bg-white p-4 rounded-xl border border-gray-200 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 transition-all" placeholder="State" />
                                                <input required disabled name="nationality" value={formData.nationality} onChange={handleInput} className="w-full bg-gray-100 p-4 rounded-xl border border-gray-200 text-gray-400 outline-none font-medium h-14 transition-all" />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 mt-4">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Profile Photo (KYC Mandatory)</label>
                                            <div className="border border-dashed border-gray-300 rounded-3xl p-10 text-center hover:border-lotus-dark/30 hover:bg-white hover:shadow-sm transition-all cursor-pointer bg-gray-50/50 group">
                                                <div className="flex justify-center gap-6 mb-6">
                                                    <div className="w-16 h-16 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-lotus-dark group-hover:scale-110 transition-all shadow-sm">
                                                        <Camera size={24} />
                                                    </div>
                                                    <div className="w-16 h-16 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-lotus-dark group-hover:scale-110 transition-all shadow-sm">
                                                        <Upload size={24} />
                                                    </div>
                                                </div>
                                                <span className="font-bold text-gray-500 group-hover:text-lotus-dark transition-colors uppercase text-sm tracking-wide">Click to take photo or browse</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 mt-8">
                                        <button type="button" onClick={prevStep} className="px-8 py-4 font-bold uppercase text-gray-400 hover:text-lotus-dark transition-colors">Back</button>
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
                                    <h2 className="text-3xl font-display font-bold uppercase mb-8 border-b border-gray-200 pb-4 text-lotus-dark">Bank Details</h2>
                                    
                                    <div className="bg-genz-lime border border-lotus-dark/5 rounded-2xl p-6 mb-8 flex gap-4 shadow-sm">
                                        <CheckCircle2 size={28} className="text-lotus-dark/40 shrink-0"/>
                                        <p className="text-sm text-lotus-dark/70 font-medium leading-relaxed">Final step! Add the bank account for funding your {fundSelected.toUpperCase()} investments and receiving fast withdrawals.</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2 group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark transition-colors">Select Bank</label>
                                            <div className="relative">
                                                <select required name="bankCode" value={formData.bankCode} onChange={handleInput} className="w-full bg-white p-4 rounded-xl border border-gray-200 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 appearance-none transition-all">
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
                                        <div className="md:col-span-2 group">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-lotus-dark transition-colors">Account Number</label>
                                            <input required name="accountNumber" value={formData.accountNumber} onChange={handleInput} maxLength={10} className="w-full bg-white p-4 rounded-xl border border-gray-200 focus:border-lotus-dark/30 focus:ring-4 focus:ring-lotus-dark/5 outline-none font-medium h-14 tracking-[0.2em] text-xl transition-all" placeholder="0000000000" />
                                        </div>
                                    </div>

                                    <div className="mt-8 bg-gray-100 p-6 rounded-2xl border border-gray-200">
                                        <p className="text-[10px] text-gray-500 font-medium leading-relaxed uppercase tracking-wider">
                                            By submitting this application, you agree to the Terms and Conditions of Lotus Capital Limited and the prospectus of the selected mutual fund. You confirm that all information provided is accurate and true.
                                        </p>
                                    </div>

                                    <div className="flex gap-4 mt-8">
                                        <button type="button" disabled={isSubmitting} onClick={prevStep} className="px-8 py-4 font-bold uppercase text-gray-400 hover:text-lotus-dark transition-colors disabled:opacity-50">Back</button>
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
                </div>
            </div>
        </div>
    );
};
