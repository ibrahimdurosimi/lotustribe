import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Shield, TrendingUp, Calendar, ChevronRight, CheckCircle2, Wallet, ArrowRight, Zap, Target, ArrowLeft } from 'lucide-react';

export const Calculator = () => {
  const [initial, setInitial] = useState<number>(5000);
  const [monthly, setMonthly] = useState<number>(10000);
  const [years, setYears] = useState<number>(5);
  const [fundType, setFundType] = useState<'fif' | 'halal'>('fif');

  const expectedReturn = fundType === 'fif' ? 0.15 : 0.20; // Example illustrative rates from fact sheet (FY 2025: FIF 15%, Halal 36% but let's be conservative)

  // FV = P(1+r/n)^(nt) + PMT * [((1+r/n)^(nt) - 1) / (r/n)]
  let balance = initial;
  let totalInvested = initial;
  for (let m = 1; m <= years * 12; m++) {
     balance += monthly;
     totalInvested += monthly;
     balance = balance * (1 + expectedReturn / 12);
  }

  return (
    <div className="bg-white p-8 md:p-10 rounded-3xl neo-border neo-shadow border-2 border-black max-w-4xl mx-auto">
      <h3 className="font-display font-bold text-2xl uppercase mb-8 flex items-center justify-between">
        <span>Investment Calculator 🧮</span>
      </h3>
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase mb-3 text-gray-500">Select Fund</label>
            <div className="grid grid-cols-2 gap-3">
               <button 
                 onClick={() => setFundType('fif')} 
                 className={`p-3 rounded-xl border-2 font-bold text-sm transition-all ${fundType === 'fif' ? 'bg-genz-lime border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-black'}`}
               >
                 Lotus FIF
               </button>
               <button 
                 onClick={() => setFundType('halal')} 
                 className={`p-3 rounded-xl border-2 font-bold text-sm transition-all ${fundType === 'halal' ? 'bg-genz-pink border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-black'}`}
               >
                 Halal Fund
               </button>
            </div>
          </div>

          <div>
             <label className="flex justify-between text-xs font-bold uppercase mb-3 text-gray-600">
                <span>Initial Investment</span>
                <span className="text-black bg-gray-100 px-2 py-1 rounded-md neo-border shadow-sm text-xs">₦ {initial.toLocaleString()}</span>
             </label>
             <input type="range" min="5000" max="1000000" step="5000" value={initial} onChange={(e) => setInitial(Number(e.target.value))} className="w-full accent-lotus-dark h-1.5 bg-gray-200 rounded-lg cursor-pointer" />
          </div>

          <div>
             <label className="flex justify-between text-xs font-bold uppercase mb-3 text-gray-600">
                <span>Monthly Contribution</span>
                <span className="text-black bg-gray-100 px-2 py-1 rounded-md neo-border shadow-sm text-xs">₦ {monthly.toLocaleString()}</span>
             </label>
             <input type="range" min="0" max="500000" step="5000" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="w-full accent-lotus-dark h-1.5 bg-gray-200 rounded-lg cursor-pointer" />
          </div>

          <div>
             <label className="flex justify-between text-xs font-bold uppercase mb-3 text-gray-600">
                <span>Time Horizon</span>
                <span className="text-black bg-gray-100 px-2 py-1 rounded-md neo-border shadow-sm text-xs">{years} Years</span>
             </label>
             <input type="range" min="1" max="30" step="1" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-lotus-dark h-1.5 bg-gray-200 rounded-lg cursor-pointer" />
          </div>
        </div>

        <div className="bg-lotus-dark text-white rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden neo-shadow border-2 border-black">
           <div className="absolute -top-10 -right-10 p-4 opacity-10 transform rotate-12">
              <TrendingUp size={120} />
           </div>
           <div className="relative z-10">
             <div className="inline-block px-2 py-1 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-widest mb-4 border border-white/20">
               Projected Outcome
             </div>
             <p className="text-gray-400 font-medium mb-1 text-sm">Expected Future Value (Est.)</p>
             <h4 className="font-display font-bold text-4xl text-genz-lime break-words leading-none">₦ {Math.round(balance).toLocaleString()}</h4>
           </div>
           
           <div className="mt-8 space-y-4 relative z-10">
              <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                 <span className="text-gray-400 font-medium text-sm">Total Invested</span>
                 <span className="font-bold text-base">₦ {totalInvested.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                 <span className="text-gray-400 font-medium text-sm">Projected Returns</span>
                 <span className="font-bold text-base text-green-400">+ ₦ {Math.round(balance - totalInvested).toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-gray-700/50">
                <p className="text-[10px] text-gray-500 leading-relaxed font-mono">
                   *This calculator uses a projected rate of {expectedReturn * 100}% based purely on illustrative returns. The value of investments may rise and fall. Past performance does not guarantee future results.
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

export const InvestFIF = () => {
   return (
      <div className="min-h-screen bg-[#fafafa] pt-32 pb-24">
         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/" className="inline-flex items-center gap-2 font-display font-bold uppercase mb-8 hover:text-genz-pink transition-colors">
               <ArrowLeft size={18} /> Back to Home
            </Link>
            
            <div className="bg-genz-lime rounded-[3rem] p-12 md:p-20 neo-border neo-shadow mb-12 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
               <div className="max-w-2xl relative z-10">
                  <div className="inline-block px-4 py-2 bg-black text-white font-bold font-display uppercase rounded-xl mb-6 shadow-sm border border-black/20 text-sm tracking-wide">Low Risk 🛡️</div>
                  <h1 className="text-5xl md:text-7xl font-display font-extrabold text-black leading-none uppercase mb-8">Lotus Halal Fixed Income Fund (FIF)</h1>
                  <p className="text-2xl font-medium text-black/80 max-w-xl">
                     A resilient, Shari'ah-compliant fixed income fund tailored for short to medium-term goals. Low risk, steady returns. No equities.
                  </p>
               </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
               <div className="lg:col-span-2 space-y-12">
                  <div className="bg-white rounded-[2.5rem] p-10 neo-border neo-shadow-sm">
                     <h2 className="text-3xl font-display font-bold uppercase mb-6 flex items-center gap-3">
                        <Target className="text-lotus-red" /> What is it?
                     </h2>
                     <p className="text-lg text-gray-700 leading-relaxed mb-6 font-medium">
                        The Lotus FIF invests in fixed income instruments such as Sukuk (non-interest bonds) and fixed return contracts (Ijarah & Murabaha). It acts as both a savings and investment vehicle, aiming to preserve your capital while offering competitive quarterly distributions against conventional options.
                     </p>
                     
                     <div className="grid sm:grid-cols-2 gap-6 mt-10">
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                           <h4 className="font-bold text-lg mb-2">Fund Goals</h4>
                           <p className="text-gray-600 font-medium">Travel, Weddings, Masters Programs, Hajj/Umrah, Emergency funds, or Gadgets.</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                           <h4 className="font-bold text-lg mb-2">Income Payout</h4>
                           <p className="text-gray-600 font-medium">Aims to pay out 80% of profit to investors on a quarterly basis.</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-10 neo-border neo-shadow-sm">
                     <h2 className="text-3xl font-display font-bold uppercase mb-8">Fund Overview</h2>
                     <div className="overflow-hidden bg-gray-50 rounded-2xl border border-gray-200 mb-8">
                        <table className="w-full text-left text-sm md:text-base">
                           <tbody className="divide-y divide-gray-200">
                              <tr className="hover:bg-gray-100 transition-colors">
                                 <th className="py-4 px-6 font-bold text-gray-700 w-1/3">Fund Manager</th>
                                 <td className="py-4 px-6 font-medium text-gray-600">Lotus Capital Ltd</td>
                              </tr>
                              <tr className="hover:bg-gray-100 transition-colors">
                                 <th className="py-4 px-6 font-bold text-gray-700 w-1/3">Base Currency</th>
                                 <td className="py-4 px-6 font-medium text-gray-600">Naira (NGN)</td>
                              </tr>
                              <tr className="hover:bg-gray-100 transition-colors">
                                 <th className="py-4 px-6 font-bold text-gray-700 w-1/3">Launch Date</th>
                                 <td className="py-4 px-6 font-medium text-gray-600">May 2008</td>
                              </tr>
                              <tr className="hover:bg-gray-100 transition-colors">
                                 <th className="py-4 px-6 font-bold text-gray-700 w-1/3">Management Fee</th>
                                 <td className="py-4 px-6 font-medium text-gray-600">1.5% per annum</td>
                              </tr>
                              <tr className="hover:bg-gray-100 transition-colors">
                                 <th className="py-4 px-6 font-bold text-gray-700 w-1/3">Target Assets</th>
                                 <td className="py-4 px-6 font-medium text-gray-600">Sukuk (Sovereign & Corporate), Halal Fixed placements</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>

                     <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div>
                           <h3 className="font-display font-bold text-xl uppercase mb-4 text-[#C10202]">Target Asset Allocation</h3>
                           <ul className="space-y-3 font-medium text-gray-600">
                              <li className="flex justify-between border-b pb-2"><span>Sovereign/Sub-Sovereign Sukuk</span> <span>50% - 70%</span></li>
                              <li className="flex justify-between border-b pb-2"><span>Corporate Sukuk</span> <span>0% - 30%</span></li>
                              <li className="flex justify-between border-b pb-2"><span>Halal Fixed Term Investments</span> <span>0% - 40%</span></li>
                              <li className="flex justify-between pb-2"><span>Cash & Cash Equivalents</span> <span>0% - 5%</span></li>
                           </ul>
                        </div>
                        <div>
                           <h3 className="font-display font-bold text-xl uppercase mb-4 text-[#C10202]">Who is this for?</h3>
                           <p className="text-gray-600 font-medium leading-relaxed">
                              Ideal for conservative investors searching for a low-risk product that ensures capital preservation. 
                              Perfect for saving towards specific short to medium-term goals like rent, a new car, or an emergency fund, without compromising on Islamic finance principles.
                           </p>
                        </div>
                     </div>

                     <h2 className="text-3xl font-display font-bold uppercase mb-6">Fund Highlights</h2>
                     <ul className="grid sm:grid-cols-2 gap-4">
                        {[
                           "Minimum investment: ₦5,000",
                           "Capital Preservation strategy",
                           "No exposure to high-risk equities",
                           "Asset Backed & Ethical",
                           "YTD Return (Q1 2026): 3.75%",
                           "FY 2025 Return: 15.00%",
                           "Dividend Payout: Quarterly",
                           "Regulated by the SEC"
                        ].map((item, i) => (
                           <li key={i} className="flex items-start gap-4 text-lg font-medium text-gray-700 p-4 bg-gray-50 rounded-xl border border-gray-100">
                              <CheckCircle2 className="w-6 h-6 text-genz-lime flex-shrink-0" />
                              <span>{item}</span>
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="bg-lotus-dark text-white rounded-[2.5rem] p-8 neo-border neo-shadow sticky top-32">
                     <h3 className="font-display font-bold text-2xl uppercase mb-6 text-center border-b border-gray-700 pb-6">Start Investing</h3>
                     
                     <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center">
                           <span className="text-gray-400 font-medium">Risk Level</span>
                           <span className="font-bold bg-green-500/20 text-green-400 px-3 py-1 rounded-lg">Low Risk</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-400 font-medium">Holding Period</span>
                           <span className="font-bold">Min 30 Days</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-400 font-medium">Min Investment</span>
                           <span className="font-bold">₦5,000</span>
                        </div>
                     </div>
                     
                     <Link to="/invest/onboarding" state={{ fund: 'fif' }} className="w-full neo-btn bg-genz-lime text-black text-xl py-4 flex justify-center items-center gap-2">
                        Get Started <ChevronRight />
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export const InvestHalal = () => {
   return (
      <div className="min-h-screen bg-[#fafafa] pt-32 pb-24">
         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/" className="inline-flex items-center gap-2 font-display font-bold uppercase mb-8 hover:text-genz-pink transition-colors">
               <ArrowLeft size={18} /> Back to Home
            </Link>
            
            <div className="bg-genz-pink rounded-[3rem] p-12 md:p-20 neo-border neo-shadow mb-12 relative overflow-hidden">
               <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/30 rounded-full blur-3xl translate-y-1/2 translate-x-1/4"></div>
               <div className="max-w-2xl relative z-10">
                  <div className="inline-block px-4 py-2 bg-black text-white font-bold font-display uppercase rounded-xl mb-6 shadow-sm border border-black/20 text-sm tracking-wide">Moderate Risk 📈</div>
                  <h1 className="text-5xl md:text-7xl font-display font-extrabold text-black leading-none uppercase mb-8">Lotus Halal Investment Fund</h1>
                  <p className="text-2xl font-medium text-black/80 max-w-xl">
                     A balanced fund built for medium to long-term growth. Diversify your wealth without compromising your values.
                  </p>
               </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
               <div className="lg:col-span-2 space-y-12">
                  <div className="bg-white rounded-[2.5rem] p-10 neo-border neo-shadow-sm">
                     <h2 className="text-3xl font-display font-bold uppercase mb-6 flex items-center gap-3">
                        <Wallet className="text-genz-pink" /> What is it?
                     </h2>
                     <p className="text-lg text-gray-700 leading-relaxed mb-6 font-medium">
                        Designed for investors with moderate risk tolerance, the Halal Fund invests in a broadly diversified portfolio of equities, asset-backed investments (leases and trade finance contracts), and sukuk. This balanced approach protects against extreme volatility while offering substantial long-term upside potential.
                     </p>
                     
                     <div className="grid sm:grid-cols-2 gap-6 mt-10">
                        <div className="p-6 bg-pink-50 rounded-2xl border border-pink-200">
                           <h4 className="font-bold text-lg mb-2">Fund Goals</h4>
                           <p className="text-gray-600 font-medium">Retirement planning, child's education, creating generational wealth.</p>
                        </div>
                        <div className="p-6 bg-pink-50 rounded-2xl border border-pink-200">
                           <h4 className="font-bold text-lg mb-2">Income Payout</h4>
                           <p className="text-gray-600 font-medium">Dividends are paid periodically at the discretion of the Fund Manager.</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-10 neo-border neo-shadow-sm">
                     <h2 className="text-3xl font-display font-bold uppercase mb-8">Fund Overview</h2>
                     <div className="overflow-hidden bg-pink-50/30 rounded-2xl border border-pink-100 mb-8">
                        <table className="w-full text-left text-sm md:text-base">
                           <tbody className="divide-y divide-pink-100">
                              <tr className="hover:bg-pink-50 transition-colors">
                                 <th className="py-4 px-6 font-bold text-gray-700 w-1/3">Fund Manager</th>
                                 <td className="py-4 px-6 font-medium text-gray-600">Lotus Capital Ltd</td>
                              </tr>
                              <tr className="hover:bg-pink-50 transition-colors">
                                 <th className="py-4 px-6 font-bold text-gray-700 w-1/3">Base Currency</th>
                                 <td className="py-4 px-6 font-medium text-gray-600">Naira (NGN)</td>
                              </tr>
                              <tr className="hover:bg-pink-50 transition-colors">
                                 <th className="py-4 px-6 font-bold text-gray-700 w-1/3">Launch Date</th>
                                 <td className="py-4 px-6 font-medium text-gray-600">August 2008</td>
                              </tr>
                              <tr className="hover:bg-pink-50 transition-colors">
                                 <th className="py-4 px-6 font-bold text-gray-700 w-1/3">Management Fee</th>
                                 <td className="py-4 px-6 font-medium text-gray-600">1.5% per annum</td>
                              </tr>
                              <tr className="hover:bg-pink-50 transition-colors">
                                 <th className="py-4 px-6 font-bold text-gray-700 w-1/3">Target Assets</th>
                                 <td className="py-4 px-6 font-medium text-gray-600">Equities & Halal Fixed Income (Diversified)</td>
                              </tr>
                              <tr className="hover:bg-pink-50 transition-colors">
                                 <th className="py-4 px-6 font-bold text-gray-700 w-1/3">Benchmark</th>
                                 <td className="py-4 px-6 font-medium text-gray-600">NSE Lotus Islamic Index (NSELII)</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>

                     <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div>
                           <h3 className="font-display font-bold text-xl uppercase mb-4 text-[#C10202]">Target Asset Allocation</h3>
                           <ul className="space-y-3 font-medium text-gray-600">
                              <li className="flex justify-between border-b border-pink-100 pb-2"><span>Equities</span> <span>20% - 80%</span></li>
                              <li className="flex justify-between border-b border-pink-100 pb-2"><span>Real Estate/Cash/Sukuk</span> <span>20% - 80%</span></li>
                           </ul>
                        </div>
                        <div>
                           <h3 className="font-display font-bold text-xl uppercase mb-4 text-[#C10202]">Who is this for?</h3>
                           <p className="text-gray-600 font-medium leading-relaxed">
                              Ideal for investors with a moderate to high risk appetite seeking long-term capital appreciation. Perfect way to beat inflation while growing wealth ethically over the years.
                           </p>
                        </div>
                     </div>

                     <h2 className="text-3xl font-display font-bold uppercase mb-6">Fund Highlights</h2>
                     <ul className="grid sm:grid-cols-2 gap-4">
                        {[
                           "Minimum investment: ₦5,000",
                           "Long-term capital growth",
                           "Diversified equity exposure",
                           "Competitive benchmark beating",
                           "YTD Return (Q1 2026): 24.25%",
                           "FY 2025 Return: 36.76%",
                           "Dividend Payout: Periodically",
                           "Shari'ah Certified"
                        ].map((item, i) => (
                           <li key={i} className="flex items-start gap-4 text-lg font-medium text-gray-700 p-4 bg-pink-50 rounded-xl border border-pink-100">
                              <CheckCircle2 className="w-6 h-6 text-genz-pink flex-shrink-0" />
                              <span>{item}</span>
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="bg-lotus-dark text-white rounded-[2.5rem] p-8 neo-border neo-shadow sticky top-32">
                     <h3 className="font-display font-bold text-2xl uppercase mb-6 text-center border-b border-gray-700 pb-6">Start Investing</h3>
                     
                     <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center">
                           <span className="text-gray-400 font-medium">Risk Level</span>
                           <span className="font-bold bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-lg">Moderate</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-400 font-medium">Holding Period</span>
                           <span className="font-bold">3 - 5 Years</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-400 font-medium">Min Investment</span>
                           <span className="font-bold">₦5,000</span>
                        </div>
                     </div>
                     
                     <Link to="/invest/onboarding" state={{ fund: 'halal' }} className="w-full neo-btn bg-genz-pink text-black text-xl py-4 flex justify-center items-center gap-2">
                        Get Started <ChevronRight />
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};
