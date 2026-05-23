import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, TrendingUp, Calculator as CalcIcon, TestTube, ArrowRight, ArrowLeft, CheckCircle2, DollarSign, Target } from 'lucide-react';
import { Calculator } from './Funds';
import { AuthContext, FeatureProducts } from './App';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './lib/firebase';

export const InvestLanding = () => {
    const { user, userProfile, refreshProfile } = useContext(AuthContext);
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [result, setResult] = useState<'fif' | 'halal' | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const quizQuestions = [
        {
            question: "When do you need to withdraw this money?",
            options: [
                { text: "Within 1-3 years (School, Travel, Wedding)", points: 1 },
                { text: "3-5 years+ (House deposit, big plans)", points: 2 },
                { text: "5+ years (Retirement, long term wealth)", points: 3 },
            ]
        },
        {
            question: "How do you feel about seeing your balance drop temporarily?",
            options: [
                { text: "I would panic and sell immediately.", points: 1 },
                { text: "I'd endure it if it means higher returns later.", points: 2 },
                { text: "I don't care about short-term drops at all.", points: 3 }
            ]
        },
        {
            question: "What's your primary goal?",
            options: [
                { text: "Preserve what I have and earn a little extra.", points: 1 },
                { text: "A mix of safety and growth.", points: 2 },
                { text: "Maximize growth aggressively.", points: 3 }
            ]
        }
    ];

    const handleAnswer = async (points: number) => {
        const newAnswers = [...answers, points];
        if (currentQuestion < quizQuestions.length - 1) {
            setAnswers(newAnswers);
            setCurrentQuestion(prev => prev + 1);
        } else {
            // Calculate outcome
            const sum = newAnswers.reduce((a, b) => a + b, 0) + points;
            const finalResult = sum <= 4 ? 'fif' : 'halal';
            setResult(finalResult);

            // Save result to profile if user is logged in
            if (user) {
                setIsSaving(true);
                try {
                    const riskProfile = finalResult === 'fif' ? 'Low Risk' : 'Moderate';
                    await updateDoc(doc(db, 'users', user.uid), {
                        riskProfile,
                        quizCompleted: true,
                        updatedAt: serverTimestamp()
                    });
                    refreshProfile();
                } catch (e) {
                    console.error("Error saving quiz result", e);
                } finally {
                    setIsSaving(false);
                }
            }
        }
    };

    const resetQuiz = () => {
        setQuizStarted(false);
        setCurrentQuestion(0);
        setAnswers([]);
        setResult(null);
    };

    const handleAcceptResult = () => {
        navigate('/invest/onboarding', { state: { fund: result } });
    };

    return (
        <div className="min-h-screen bg-genz-blue/20">
            <div className="pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header */}
                    <div className="text-center max-w-4xl mx-auto mb-20 mt-10">
                        <div className="inline-block px-5 py-2 rounded-full bg-lotus-red text-white font-display font-medium text-sm tracking-wider uppercase mb-8 neo-shadow-sm">
                           Start Building Wealth
                        </div>
                        <h1 className="text-6xl md:text-8xl font-display font-extrabold text-lotus-dark dark:text-white uppercase leading-none tracking-tight mb-8">
                            Make your money <br/> <span className="bg-genz-lime px-4 py-2 inline-block rounded-2xl transform shadow-sm">work for you</span>
                        </h1>
                        <p className="text-2xl font-medium text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Whether you're saving for a vacation next year or building generational wealth, Lotus has a halal, ethical fund structurally built for you.
                        </p>
                    </div>

                    {/* Vibe Check Quiz Section */}
                    <div id="vibe-check" className="bg-white dark:bg-gray-900 rounded-[3rem] p-8 md:p-16 neo-border neo-shadow mb-24 relative overflow-hidden">
                        
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-genz-blue rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-genz-pink rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

                        <div className="relative z-10">
                            {!quizStarted && (
                                <div className="text-center max-w-2xl mx-auto">
                                    <div className="w-20 h-20 bg-genz-lime rounded-3xl neo-border flex items-center justify-center mx-auto mb-8 transform -rotate-2">
                                        <TestTube size={40} className="text-lotus-dark dark:text-white" />
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-display font-bold uppercase mb-6 text-lotus-dark dark:text-white">The Investor Vibe Check</h2>
                                    <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 font-medium leading-relaxed">
                                        Not sure which fund is right for you? Take our 3-question vibe check, and we'll instantly match you with a tailored investment strategy. Low risk or growth focused? Let's find out.
                                    </p>
                                    <button 
                                        onClick={() => setQuizStarted(true)}
                                        className="neo-btn bg-lotus-dark text-white px-12 py-5 flex justify-center items-center gap-3 mx-auto text-xl"
                                    >
                                        Start Vibe Check <ArrowRight size={24} />
                                    </button>
                                </div>
                            )}

                            {quizStarted && !result && (
                                <div className="max-w-2xl mx-auto">
                                    <div className="flex justify-between items-center mb-10 border-b border-gray-100 dark:border-gray-800 pb-6">
                                        <h3 className="font-display font-bold text-2xl text-gray-300">Question {currentQuestion + 1} of {quizQuestions.length}</h3>
                                        <button onClick={resetQuiz} className="text-gray-400 hover:text-lotus-dark dark:text-white font-bold uppercase text-sm flex items-center gap-1 transition-colors">
                                            <ArrowLeft size={16} /> Cancel
                                        </button>
                                    </div>
                                    <AnimatePresence mode="wait">
                                        <motion.div 
                                            key={currentQuestion}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                        >
                                            <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight mb-10 text-lotus-dark dark:text-white">
                                                {quizQuestions[currentQuestion].question}
                                            </h2>
                                            <div className="space-y-4">
                                                {quizQuestions[currentQuestion].options.map((opt, i) => (
                                                    <button 
                                                        key={i}
                                                        onClick={() => handleAnswer(opt.points)}
                                                        className="w-full text-left p-6 rounded-[1.5rem] bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 hover:border-lotus-dark/20 font-bold text-lg hover:bg-genz-lime transition-all transform hover:-translate-y-1 hover:shadow-lg"
                                                    >
                                                        {opt.text}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            )}

                            {result && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center max-w-3xl mx-auto"
                                >
                                    <div className="inline-block px-4 py-1.5 rounded-full bg-lotus-dark text-white font-bold text-sm uppercase tracking-widest mb-8 neo-shadow-sm">
                                        Your Perfect Match
                                    </div>
                                    
                                    {result === 'fif' ? (
                                        <div className="bg-genz-lime p-8 md:p-12 rounded-[2.5rem] neo-border neo-shadow mb-10">
                                            <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-2xl neo-border flex items-center justify-center mx-auto mb-6">
                                                <Shield size={40} className="text-lotus-dark dark:text-white" />
                                            </div>
                                            <h2 className="text-4xl md:text-5xl font-display font-extrabold uppercase mb-4 text-lotus-dark dark:text-white">Lotus Halal Fixed Income Fund</h2>
                                            <p className="text-xl font-medium mb-8 text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
                                                You are the Steady Saver! You value capital preservation and steady returns. The FIF is perfect for short-term goals with zero exposure to high-risk equities.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-genz-pink p-8 md:p-12 rounded-[2.5rem] neo-border neo-shadow mb-10">
                                            <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-2xl neo-border flex items-center justify-center mx-auto mb-6">
                                                <TrendingUp size={40} className="text-lotus-dark dark:text-white" />
                                            </div>
                                            <h2 className="text-4xl md:text-5xl font-display font-extrabold uppercase mb-4 text-lotus-dark dark:text-white">Lotus Halal Investment Fund</h2>
                                            <p className="text-xl font-medium mb-8 text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
                                                You are the Growth Seeker! You have a medium-to-long term horizon and tolerate some risk for higher returns. The Halal Fund invests in a diversified portfolio to build serious wealth.
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <button 
                                            onClick={handleAcceptResult}
                                            disabled={isSaving}
                                            className="neo-btn bg-lotus-dark text-white px-12 py-5 flex justify-center items-center gap-2 text-xl disabled:opacity-50"
                                        >
                                            {isSaving ? 'Matching...' : 'Invest Now'} <ArrowRight size={20} />
                                        </button>
                                        <button 
                                            onClick={resetQuiz}
                                            className="px-8 py-4 font-bold uppercase text-gray-400 hover:text-lotus-dark dark:text-white transition-colors"
                                        >
                                            Retake Quiz
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* The Funds Section */}
                    <FeatureProducts />

                    {/* Feature Examples */}
                    <div className="mb-24">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase text-lotus-dark dark:text-white">What can Lotus do for you?</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 neo-border neo-shadow flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500">
                                <div className="w-24 h-24 bg-genz-lime rounded-full flex items-center justify-center mb-8 border border-lotus-dark/5 shadow-inner">
                                    <span className="text-5xl">✈️</span>
                                </div>
                                <h3 className="text-3xl font-display font-bold mb-4 uppercase text-lotus-dark dark:text-white">The Vacation Fund</h3>
                                <p className="text-lg text-gray-500 dark:text-gray-400 font-medium mb-8 leading-relaxed">
                                    Planning a trip to Dubai next summer? Use the <strong>Fixed Income Fund (FIF)</strong>. You can safely park your money, protect it from inflation, and earn a steady return with zero fear of market dips before your flight.
                                </p>
                                <Link to="/invest/onboarding" state={{ fund: 'fif' }} className="neo-btn bg-lotus-dark text-white w-full uppercase mt-auto text-lg py-4">Start FIF Goal</Link>
                            </div>
                            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 neo-border neo-shadow flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500">
                                <div className="w-24 h-24 bg-genz-purple rounded-full flex items-center justify-center mb-8 border border-lotus-dark/5 shadow-inner">
                                    <span className="text-5xl">🏡</span>
                                </div>
                                <h3 className="text-3xl font-display font-bold mb-4 uppercase text-lotus-dark dark:text-white">House Deposit</h3>
                                <p className="text-lg text-gray-500 dark:text-gray-400 font-medium mb-8 leading-relaxed">
                                    Need a house downpayment in 4 years? The <strong>Halal Investment Fund</strong> balances risk and growth. Let compound interest accelerate your path to homeownership outperforming standard savings.
                                </p>
                                <Link to="/invest/onboarding" state={{ fund: 'halal' }} className="neo-btn bg-lotus-dark text-white w-full uppercase mt-auto text-lg py-4">Start Halal Goal</Link>
                            </div>
                        </div>
                    </div>

                    {/* Calculator Section */}
                    <div className="mb-24 scale-[1.02]">
                        <Calculator />
                    </div>

                    {/* FAQ */}
                    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-10 md:p-16 rounded-[3rem] neo-border neo-shadow mb-20 border border-gray-100 dark:border-gray-800">
                        <h2 className="text-4xl font-display font-bold uppercase mb-12 text-center text-lotus-dark dark:text-white">Frequently Asked Questions</h2>
                        <div className="grid gap-8">
                            {[
                                { q: "How much do I need to start?", a: "You can start investing in either the Lotus Halal Investment Fund or the Fixed Income Fund with just ₦5,000." },
                                { q: "Are there any hidden fees?", a: "No caps. No hidden fees. We pride ourselves on transparent, ethical investing. Management fees are clearly stated (e.g. 1.5% NAV for FIF)." },
                                { q: "What makes it Halal?", a: "Our funds are certified annually for Shari'ah compliance. We never invest in interest-bearing instruments, gambling, alcohol, or other prohibited industries." },
                                { q: "Can I withdraw my money anytime?", a: "Yes. Both funds offer high liquidity. The FIF has a minimal 30-day holding period, and the Halal fund offers flexible entry and exit." }
                            ].map((faq, i) => (
                                <div key={i} className="p-8 rounded-[2rem] bg-gray-50/50 border border-gray-100 dark:border-gray-800 hover:bg-white dark:bg-gray-900 hover:shadow-sm transition-all">
                                    <h4 className="font-display font-bold text-xl mb-3 text-lotus-dark dark:text-white">{faq.q}</h4>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
