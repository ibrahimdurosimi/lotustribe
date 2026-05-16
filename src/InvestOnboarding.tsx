import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, Upload, CheckCircle2, ArrowRight, ShieldCheck, ChevronLeft } from 'lucide-react';

export const InvestOnboarding = () => {
    const location = useLocation();
    const [step, setStep] = useState(1);
    const [fundSelected] = useState(location.state?.fund || 'fif'); // Default if not provided
    
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
        // Simulate API call to Lotus Capital Investment API
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 2500);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
                <div className="bg-white p-10 md:p-16 rounded-[3rem] neo-border neo-shadow text-center max-w-lg w-full">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-black">
                        <CheckCircle2 size={48} className="text-black" />
                    </div>
                    <h2 className="font-display font-extrabold text-4xl uppercase mb-4">Account Verified!</h2>
                    <p className="font-medium text-gray-600 mb-8 text-lg">
                        Your KYC has been approved. Welcome to the Lotus Tribe! Your {fundSelected.toUpperCase()} investment account is now active and ready to fund.
                    </p>
                    <Link to="/dashboard" className="neo-btn bg-black text-white px-8 py-4 uppercase block w-full text-xl hover:-translate-y-1 transition-transform">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-lotus-dark flex">
            {/* Left Sidebar */}
            <div className="hidden lg:flex w-1/3 bg-black text-white p-12 flex-col relative border-r-2 border-gray-800">
                <Link to="/invest" className="inline-flex items-center gap-2 font-display font-bold uppercase mb-12 hover:text-genz-lime transition-colors">
                    <ChevronLeft size={18} /> Back
                </Link>
                <div className="mb-auto">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 font-bold text-xs uppercase tracking-widest mb-6 border border-white/20">
                        {fundSelected === 'fif' ? 'Fixed Income Fund' : 'Halal Investment Fund'}
                    </div>
                    <h1 className="text-5xl font-display font-bold text-white leading-tight uppercase mb-6">
                        Start your <br/><span className={fundSelected === 'fif' ? "text-genz-lime" : "text-genz-pink"}>Wealth Journey.</span>
                    </h1>
                    <p className="text-gray-400 font-medium text-lg mb-10">
                        Complete your KYC profile in a few minutes. We're directly integrated with Lotus Capital for a secure, seamless onboarding.
                    </p>

                    <div className="space-y-6">
                        {[
                            { step: 1, label: "Personal Details" },
                            { step: 2, label: "Identity & Verification" },
                            { step: 3, label: "Bank Account Details" }
                        ].map((item) => (
                            <div key={item.step} className={`flex items-center gap-4 ${step >= item.step ? 'opacity-100' : 'opacity-40'}`}>
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${step === item.step ? 'border-white bg-white text-black' : step > item.step ? 'border-green-400 bg-green-400 text-black' : 'border-gray-600 text-gray-600'}`}>
                                    {step > item.step ? <CheckCircle2 size={16} /> : item.step}
                                </div>
                                <span className={`font-bold uppercase tracking-wider ${step === item.step ? 'text-white' : step > item.step ? 'text-green-400' : 'text-gray-600'}`}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3 text-sm text-gray-400 font-medium font-mono mb-2">
                        <ShieldCheck size={16} className="text-green-400"/>
                        <span>Secure API Connection</span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">Your data is securely encrypted and submitted directly to Lotus Capital Limited infrastructure.</p>
                </div>
            </div>

            {/* Right Form Area */}
            <div className="w-full lg:w-2/3 bg-[#fafafa] flex flex-col p-6 lg:p-20 overflow-y-auto">
                <div className="max-w-2xl w-full mx-auto my-auto">
                    
                    <div className="lg:hidden mb-10">
                        <Link to="/invest" className="inline-flex items-center gap-2 font-display font-bold uppercase mb-8 hover:text-black transition-colors text-gray-500">
                            <ChevronLeft size={18} /> Back
                        </Link>
                        <h1 className="text-4xl font-display font-bold text-black uppercase mb-2">KYC Profile</h1>
                        <p className="text-gray-600 font-medium">Step {step} of 3</p>
                    </div>

                    <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
                        <AnimatePresence mode="wait">
                            {/* STEP 1 */}
                            {step === 1 && (
                                <motion.div 
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <h2 className="text-3xl font-display font-bold uppercase mb-8 border-b-2 border-black/10 pb-4">Personal Details</h2>
                                    
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold uppercase tracking-wide text-gray-600 mb-2">First Name</label>
                                            <input required name="firstName" value={formData.firstName} onChange={handleInput} className="w-full bg-white p-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-medium h-14" placeholder="Enter first name" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold uppercase tracking-wide text-gray-600 mb-2">Middle Name (Optional)</label>
                                            <input name="middleName" value={formData.middleName} onChange={handleInput} className="w-full bg-white p-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-medium h-14" placeholder="Enter middle name" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold uppercase tracking-wide text-gray-600 mb-2">Last Name</label>
                                            <input required name="lastName" value={formData.lastName} onChange={handleInput} className="w-full bg-white p-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-medium h-14" placeholder="Enter last name" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold uppercase tracking-wide text-gray-600 mb-2">Date of Birth</label>
                                            <input required type="date" name="dob" value={formData.dob} onChange={handleInput} className="w-full bg-white p-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-medium h-14 text-gray-700" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold uppercase tracking-wide text-gray-600 mb-2">Gender</label>
                                            <select required name="gender" value={formData.gender} onChange={handleInput} className="w-full bg-white p-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-medium h-14 appearance-none">
                                                <option value="" disabled>Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" className="neo-btn bg-black text-white text-xl py-4 flex justify-between items-center w-full mt-8">
                                        Continue <ArrowRight size={20}/>
                                    </button>
                                </motion.div>
                            )}

                            {/* STEP 2 */}
                            {step === 2 && (
                                <motion.div 
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <h2 className="text-3xl font-display font-bold uppercase mb-8 border-b-2 border-black/10 pb-4">Identity Verification</h2>
                                    
                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8 flex gap-4">
                                        <ShieldCheck size={28} className="text-blue-500 shrink-0"/>
                                        <p className="text-sm text-blue-900 font-medium">Federal regulation requires us to verify your identity. Your BVN and NIN will be checked securely.</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold uppercase tracking-wide text-gray-600 mb-2">Bank Verification Number (BVN)</label>
                                            <input required name="bvn" value={formData.bvn} onChange={handleInput} maxLength={11} className="w-full bg-white p-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-medium h-14" placeholder="11-digit BVN" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold uppercase tracking-wide text-gray-600 mb-2">National ID Number (NIN)</label>
                                            <input required name="nin" value={formData.nin} onChange={handleInput} maxLength={11} className="w-full bg-white p-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-medium h-14" placeholder="11-digit NIN" />
                                        </div>
                                        
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold uppercase tracking-wide text-gray-600 mb-2">Residential Address</label>
                                            <input required name="address" value={formData.address} onChange={handleInput} className="w-full bg-white p-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-medium h-14 mb-4" placeholder="Street address" />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input required name="stateOfOrigin" value={formData.stateOfOrigin} onChange={handleInput} className="w-full bg-white p-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-medium h-14" placeholder="State" />
                                                <input required disabled name="nationality" value={formData.nationality} onChange={handleInput} className="w-full bg-gray-100 p-4 rounded-xl border-2 border-gray-200 text-gray-500 outline-none font-medium h-14" />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 mt-4">
                                            <label className="block text-sm font-bold uppercase tracking-wide text-gray-600 mb-2">Upload Profile Photo</label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-black transition-colors cursor-pointer bg-white">
                                                <div className="flex justify-center gap-4 mb-4">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center neo-border text-gray-500">
                                                        <Camera size={20} />
                                                    </div>
                                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center neo-border text-gray-500">
                                                        <Upload size={20} />
                                                    </div>
                                                </div>
                                                <span className="font-bold text-gray-600">Take photo or browse files</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 mt-8">
                                        <button type="button" onClick={prevStep} className="px-8 py-4 font-bold uppercase text-gray-500 hover:text-black transition-colors border-2 border-transparent hover:border-black rounded-xl">Back</button>
                                        <button type="submit" className="neo-btn bg-black text-white text-xl py-4 flex-1 flex justify-center items-center gap-2">
                                            Continue <ArrowRight size={20}/>
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3 */}
                            {step === 3 && (
                                <motion.div 
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <h2 className="text-3xl font-display font-bold uppercase mb-8 border-b-2 border-black/10 pb-4">Bank Account Details</h2>
                                    
                                    <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-8 flex gap-4">
                                        <CheckCircle2 size={28} className="text-green-500 shrink-0"/>
                                        <p className="text-sm text-green-900 font-medium">Final step! Add the bank account you will use to fund your {fundSelected.toUpperCase()} investments and receive withdrawals.</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold uppercase tracking-wide text-gray-600 mb-2">Select Bank</label>
                                            <select required name="bankCode" value={formData.bankCode} onChange={handleInput} className="w-full bg-white p-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-medium h-14 appearance-none">
                                                <option value="" disabled>Choose your bank</option>
                                                <option value="044">Access Bank</option>
                                                <option value="058">GTBank</option>
                                                <option value="033">UBA</option>
                                                <option value="057">Zenith Bank</option>
                                                <option value="232">Sterling Bank</option>
                                                <option value="073">Stanbic IBTC</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold uppercase tracking-wide text-gray-600 mb-2">Account Number</label>
                                            <input required name="accountNumber" value={formData.accountNumber} onChange={handleInput} maxLength={10} className="w-full bg-white p-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-medium h-14 tracking-widest text-lg" placeholder="0000000000" />
                                        </div>
                                    </div>

                                    <div className="mt-8 bg-gray-100 p-6 rounded-2xl">
                                        <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                            By submitting this application, you agree to the Terms and Conditions of Lotus Capital Limited and the prospectus of the selected mutual fund. You confirm that all information provided is accurate and true.
                                        </p>
                                    </div>

                                    <div className="flex gap-4 mt-8">
                                        <button type="button" disabled={isSubmitting} onClick={prevStep} className="px-8 py-4 font-bold uppercase text-gray-500 hover:text-black transition-colors border-2 border-transparent hover:border-black rounded-xl disabled:opacity-50">Back</button>
                                        <button type="submit" disabled={isSubmitting} className="neo-btn bg-lotus-red text-white text-xl py-4 flex-1 flex justify-center items-center gap-2 border-black disabled:opacity-70">
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                    PROCESSING
                                                </span>
                                            ) : (
                                                <>COMPLETE PROFILE <CheckCircle2 size={20}/></>
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
