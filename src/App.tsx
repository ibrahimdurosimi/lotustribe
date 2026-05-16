import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Zap,
  TestTube,
  Trophy,
  Users,
  MessageCircle,
  TrendingUp,
  Award,
  Flame,
  Menu,
  X,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { auth, loginWithGoogle, logout, db, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { LMSLayout, LMSDashboard, LMSCourses, LMSCoursePlayer, LMSCommunity, LMSAchievements } from './LMS';

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  loading: boolean;
  userProfile: any;
  refreshProfile: () => void;
}
const AuthContext = createContext<AuthContextType>({ user: null, loading: true, userProfile: null, refreshProfile: () => {} });

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, userProfile, refreshProfile: () => user && fetchProfile(user.uid) }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, userProfile } = useContext(AuthContext);

  return (
    <nav className="fixed w-full z-50 p-4 pointer-events-none">
      <div className="max-w-6xl mx-auto bg-white neo-border neo-shadow rounded-2xl pointer-events-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-lotus-red rounded-lg neo-border flex items-center justify-center transform -rotate-6">
            <Zap className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tighter text-lotus-dark uppercase">
            Lotus<span className="text-lotus-red">Tribe</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 font-display font-semibold">
          <Link to="/" className="hover:text-genz-pink transition-colors hover:-translate-y-0.5 inline-block transform duration-150">Home</Link>
          <Link to="/quiz" className="hover:text-genz-blue transition-colors hover:-translate-y-0.5 inline-block transform duration-150">Vibe Check</Link>
          <Link to="/learn" className="hover:text-genz-purple transition-colors hover:-translate-y-0.5 inline-block transform duration-150">Learn</Link>
          <Link to="/learn/community" className="hover:text-genz-pink transition-colors hover:-translate-y-0.5 inline-block transform duration-150">Community</Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col text-right leading-tight">
                <span className="text-sm font-bold">{user.displayName}</span>
                {userProfile?.riskProfile && (
                  <span className="text-xs text-genz-purple uppercase tracking-wider">{userProfile.riskProfile}</span>
                )}
              </div>
              <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} className="w-10 h-10 rounded-full neo-border" alt="Avatar"/>
              <button onClick={logout} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button onClick={loginWithGoogle} className="neo-btn bg-genz-lime text-lotus-dark px-6 py-2 text-sm uppercase translate-y-0">
              Log In / Join
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 neo-border rounded-lg bg-gray-100 hover:bg-genz-lime transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="md:hidden absolute top-24 left-4 right-4 bg-white neo-border neo-shadow rounded-2xl p-6 flex flex-col gap-4 pointer-events-auto"
        >
          <Link to="/" className="font-display font-bold text-xl uppercase py-2 border-b-2 border-black" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/quiz" className="font-display font-bold text-xl uppercase py-2 border-b-2 border-black" onClick={() => setIsOpen(false)}>Vibe Check</Link>
          <Link to="/learn" className="font-display font-bold text-xl uppercase py-2 border-b-2 border-black" onClick={() => setIsOpen(false)}>Learn</Link>
          <Link to="/learn/community" className="font-display font-bold text-xl uppercase py-2 border-b-2 border-black" onClick={() => setIsOpen(false)}>Community</Link>
          {user ? (
             <div className="flex items-center justify-between pt-4">
               <div className="flex items-center gap-3">
                 <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} className="w-12 h-12 rounded-full neo-border" alt="Avatar"/>
                 <div>
                   <div className="font-bold">{user.displayName}</div>
                   {userProfile?.riskProfile && <div className="text-xs font-bold text-genz-purple">{userProfile.riskProfile}</div>}
                 </div>
               </div>
               <button onClick={() => { logout(); setIsOpen(false); }} className="p-2 bg-red-100 text-red-600 rounded-lg neo-border shadow-sm">
                 <LogOut className="w-5 h-5" />
               </button>
             </div>
          ) : (
            <button onClick={() => { loginWithGoogle(); setIsOpen(false); }} className="neo-btn bg-genz-lime text-lotus-dark w-full mt-4 uppercase text-lg">
              Join the Tribe
            </button>
          )}
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-40 pb-20 overflow-hidden bg-[#fafafa]">
      {/* Fun background blobs */}
      <div className="absolute top-20 -left-20 w-64 h-64 bg-genz-lime rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-40 -right-20 w-72 h-72 bg-genz-pink rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-genz-blue rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-lotus-dark text-white font-display font-bold text-sm tracking-wider uppercase mb-6 neo-shadow-sm rotate-2">
              🔥 Built for Gen Z
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-lotus-dark leading-[0.9] tracking-tighter mb-6 uppercase">
              Investing <br/> <span className="text-genz-pink inline-block -rotate-2">without</span> the <br/> boring stuff.
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-lg font-medium">
              Halal, SEC-regulated investing that actually makes sense. Take the quiz, level up your knowledge, and build wealth with the squad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="neo-btn bg-genz-lime text-lotus-dark text-lg flex items-center justify-center gap-2 group">
                Start Playing 🎮
              </button>
              <button className="neo-btn bg-white text-lotus-dark text-lg flex items-center justify-center">
                Explore Funds
              </button>
            </div>
            
            <div className="mt-10 flex items-center gap-4 bg-white p-3 rounded-xl neo-border inline-flex neo-shadow-sm">
              <div className="flex -space-x-4">
                <img className="w-10 h-10 rounded-full neo-border" src="https://i.pravatar.cc/100?img=1" alt="avatar" />
                <img className="w-10 h-10 rounded-full neo-border" src="https://i.pravatar.cc/100?img=2" alt="avatar" />
                <img className="w-10 h-10 rounded-full neo-border" src="https://i.pravatar.cc/100?img=3" alt="avatar" />
              </div>
              <div className="font-display font-bold text-sm">
                +10,000 Gen Z investors <br/> already joined!
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-[550px] w-full flex items-center justify-center"
          >
            {/* Main Phone Mockup */}
            <div className="w-[300px] h-[600px] bg-lotus-dark rounded-[2.5rem] neo-border neo-shadow p-3 relative z-20 overflow-hidden transform -rotate-3">
              <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative flex flex-col">
                <div className="bg-genz-blue p-6 pb-12 text-white">
                   <div className="flex justify-between items-center mb-6">
                      <Menu className="w-6 h-6" />
                      <div className="w-10 h-10 rounded-full bg-genz-pink neo-border neo-shadow-sm flex items-center justify-center font-bold text-lotus-dark">
                        LV2
                      </div>
                   </div>
                   <h2 className="font-display font-bold text-3xl mb-1">₦ 150,450.00</h2>
                   <p className="opacity-80 font-medium flex items-center gap-1"><TrendingUp className="w-4 h-4"/> +12% this month</p>
                </div>
                <div className="flex-1 bg-white rounded-t-[2rem] -mt-6 p-6 relative">
                   <div className="w-full bg-gray-100 h-2 rounded-full mb-6 mt-2 relative">
                     <div className="absolute top-0 left-0 bg-genz-purple h-full rounded-full w-2/3"></div>
                   </div>
                   <p className="font-bold text-center mb-4 uppercase tracking-wide text-xs text-gray-500">Your Badges</p>
                   <div className="flex justify-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-yellow-100 neo-border neo-shadow-sm flex items-center justify-center transform -rotate-6">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                      </div>
                      <div className="w-16 h-16 rounded-2xl bg-red-100 neo-border neo-shadow-sm flex items-center justify-center transform rotate-6 scale-110">
                        <Flame className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="w-16 h-16 rounded-2xl bg-blue-100 neo-border neo-shadow-sm flex items-center justify-center transform -rotate-3">
                        <Award className="w-8 h-8 text-blue-500" />
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Floating assets */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute top-20 right-0 bg-genz-lime neo-border neo-shadow px-4 py-3 rounded-2xl z-30 transform rotate-12 flex items-center gap-2"
            >
              <span className="text-2xl">💸</span>
              <span className="font-display font-bold text-lotus-dark uppercase tracking-tight">Dividends!</span>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 left-0 bg-genz-pink text-white neo-border neo-shadow px-4 py-3 rounded-2xl z-30 transform -rotate-6 flex items-center gap-2"
            >
              <Users className="w-5 h-5 text-lotus-dark" />
              <span className="font-display font-bold text-lotus-dark uppercase tracking-tight">Tribe Active</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeatureVibeCheck = () => {
  return (
    <section id="vibe-check" className="py-24 bg-white border-y-4 border-black relative overflow-hidden">
      {/* Marquee background pattern */}
      <div className="absolute top-0 w-full overflow-hidden border-b-2 border-black bg-genz-lime py-2 whitespace-nowrap flex z-0">
        <div className="animate-marquee font-display font-bold uppercase tracking-widest flex whitespace-nowrap">
          {Array(20).fill("• TAKE THE PROFILE TEST • VIBE CHECK YOUR MONEY ").map((text, i) => (
            <span key={i} className="mx-4">{text}</span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-100 p-6 rounded-3xl neo-border neo-shadow transform -rotate-6 hover:rotate-0 transition-transform cursor-pointer">
                  <div className="text-5xl mb-4">🐢</div>
                  <h3 className="font-display font-bold text-xl mb-1">Steady Saver</h3>
                  <p className="text-sm font-medium">Low risk, plays it safe.</p>
                </div>
                <div className="bg-red-100 p-6 rounded-3xl neo-border neo-shadow transform rotate-3 translate-y-8 hover:translate-y-4 transition-transform cursor-pointer">
                  <div className="text-5xl mb-4">🚀</div>
                  <h3 className="font-display font-bold text-xl mb-1">Risk Taker</h3>
                  <p className="text-sm font-medium">High risk, high reward.</p>
                </div>
                <div className="bg-purple-100 p-6 rounded-3xl neo-border neo-shadow transform mt-4 rotate-2 hover:scale-105 transition-transform cursor-pointer col-span-2">
                  <div className="flex items-center gap-4">
                     <div className="text-5xl">🧠</div>
                     <div>
                       <h3 className="font-display font-bold text-xl mb-1">Calculated Thinker</h3>
                       <p className="text-sm font-medium">The balanced approach.</p>
                     </div>
                  </div>
                </div>
             </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="inline-block px-4 py-1.5 rounded-full bg-black text-white font-display font-bold text-sm tracking-wider uppercase mb-6 neo-shadow rotate-1">
              Step 1: Vibe Check
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-lotus-dark uppercase leading-none mb-6">
              What kind of <span className="text-genz-blue border-b-8 border-genz-blue">investor</span> are you?
            </h2>
            <p className="text-lg font-medium text-gray-700 mb-8">
              No boring forms here. Swipe, tap, and answer fun questions to discover your investor personality. We'll match you with halal investments that fit your exact vibe.
            </p>
            <Link to="/quiz" className="neo-btn bg-genz-blue text-white hover:bg-blue-600 flex items-center justify-center gap-3 w-fit">
              <TestTube className="w-5 h-5" /> Take the Quiz
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureLearnEarn = () => {
  return (
    <section id="learn" className="py-24 bg-[#111] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-genz-pink text-lotus-dark font-display font-bold text-sm tracking-wider uppercase mb-6 neo-shadow -rotate-2">
            Learning Hub
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold uppercase leading-none mb-6">
            Level up your <br/><span className="text-genz-lime">money knowledge.</span>
          </h2>
          <p className="text-lg font-medium text-gray-400">
            Gamified lessons. Earn XP. Collect badges. Because learning about halal finance shouldn't feel like school.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Link to="/learn" className="bg-[#222] p-8 rounded-[2rem] neo-border hover:-translate-y-2 transition-transform relative group block">
            <div className="absolute top-4 right-4 bg-yellow-400 text-black font-bold px-3 py-1 rounded-full text-xs uppercase neo-border border-2">Level 1</div>
            <div className="w-16 h-16 rounded-2xl bg-white neo-border flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform">
              <span className="text-3xl">🌱</span>
            </div>
            <h3 className="font-display font-bold text-2xl mb-3">Crypto vs Halal</h3>
            <p className="text-gray-400 font-medium mb-6">Understand what makes an investment Shariah-compliant.</p>
            <div className="w-full bg-black h-3 rounded-full overflow-hidden neo-border border-white/20">
               <div className="bg-genz-lime h-full w-full"></div>
            </div>
            <p className="text-xs font-bold text-right mt-2 text-genz-lime">COMPLETED! +500 XP</p>
          </Link>

          <Link to="/learn" className="bg-[#222] p-8 rounded-[2rem] neo-border border-genz-pink hover:-translate-y-2 transition-transform relative group block">
            <div className="absolute top-4 right-4 bg-genz-pink text-black font-bold px-3 py-1 rounded-full text-xs uppercase neo-border border-2">Level 2</div>
            <div className="w-16 h-16 rounded-2xl bg-white neo-border flex items-center justify-center mb-6 transform group-hover:-rotate-12 transition-transform">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="font-display font-bold text-2xl mb-3">Mutual Funds 101</h3>
            <p className="text-gray-400 font-medium mb-6">How do they work? Why are they safer than individual stocks?</p>
            <div className="w-full bg-black h-3 rounded-full overflow-hidden neo-border border-white/20">
               <div className="bg-genz-pink h-full w-[60%]"></div>
            </div>
            <p className="text-xs font-bold text-right mt-2 text-genz-pink">IN PROGRESS</p>
          </Link>

          <Link to="/learn" className="bg-[#222] opacity-70 p-8 rounded-[2rem] neo-border hover:-translate-y-2 transition-transform relative block">
            <div className="absolute inset-0 flex items-center justify-center z-10 backdrop-blur-sm rounded-[2rem]">
              <div className="bg-black text-white px-4 py-2 font-display font-bold uppercase rounded-lg neo-border">Locked 🔒</div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white neo-border flex items-center justify-center mb-6">
              <span className="text-3xl">👑</span>
            </div>
            <h3 className="font-display font-bold text-2xl mb-3">Building a Portfolio</h3>
            <p className="text-gray-400 font-medium mb-6">Advanced strategies for long-term wealth creation.</p>
            <div className="w-full bg-black h-3 rounded-full overflow-hidden neo-border border-white/20">
               <div className="bg-gray-500 h-full w-0"></div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

const FeatureCommunity = () => {
  return (
    <section id="squad" className="py-24 bg-genz-lime relative border-b-4 border-black overflow-hidden">
      {/* Decorative stars */}
      <div className="absolute top-10 left-10 text-4xl">✨</div>
      <div className="absolute bottom-20 right-20 text-5xl">⭐️</div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-white text-black font-display font-bold text-sm tracking-wider uppercase mb-6 neo-shadow -rotate-3">
              The Squad
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-extrabold text-lotus-dark uppercase leading-[0.9] tracking-tighter mb-6">
              Don't invest <br/> <span className="bg-white px-2 neo-border inline-block mt-2 transform rotate-2">alone.</span>
            </h2>
            <p className="text-xl font-medium text-lotus-dark mb-8">
              Join the Lotus Tribe community. Ask questions, flex your badges, attend exclusive virtual events, and grow your wealth alongside thousands of others.
            </p>
            <Link to="/learn/community" className="neo-btn bg-black text-white px-8 py-4 flex items-center gap-3 w-fit text-lg">
              <MessageCircle className="w-6 h-6" /> Enter the Chat
            </Link>
          </div>

          <div className="relative">
            {/* Mock Chat UI */}
            <div className="bg-white rounded-3xl neo-border neo-shadow p-6 pointer-events-none">
              
              <div className="flex gap-4 mb-6">
                <img src="https://i.pravatar.cc/100?img=4" className="w-12 h-12 rounded-full neo-border" alt="" />
                <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 neo-border w-fit relative">
                  <p className="font-bold mb-1 text-sm">@Aisha_Invests <span className="text-xs bg-yellow-300 px-1 rounded neo-border ml-2">LVL 4</span></p>
                  <p className="font-medium text-sm">Just hit my first ₦100k in the Halal Fixed Income Fund! 🎉</p>
                </div>
              </div>

              <div className="flex gap-4 mb-6 flex-row-reverse">
                <img src="https://i.pravatar.cc/100?img=5" className="w-12 h-12 rounded-full neo-border" alt="" />
                <div className="bg-genz-blue text-white rounded-2xl rounded-tr-none p-4 neo-border w-fit">
                  <p className="font-bold mb-1 text-sm text-white/90">@You</p>
                  <p className="font-medium text-sm">Let's goooo! 🔥 Any tips on staying consistent?</p>
                </div>
              </div>

              <div className="flex gap-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Transparent.gif" className="w-12 h-12 rounded-full neo-border bg-lotus-red flex items-center justify-center relative after:content-['LC'] after:absolute after:font-display after:font-bold after:text-white" alt="Lotus Admin" />
                <div className="bg-red-50 rounded-2xl rounded-tl-none p-4 neo-border border-lotus-red w-fit">
                  <p className="font-bold mb-1 text-sm text-lotus-red">@LotusCapital <span className="text-xs bg-black text-white px-1 rounded neo-border ml-2">MOD</span></p>
                  <p className="font-medium text-sm">Pro tip: Set up auto-invests every Friday after Jumu'ah! 🕌💸</p>
                </div>
              </div>

            </div>
            
            {/* Event callout */}
            <div className="absolute -right-8 -bottom-8 bg-genz-purple neo-border neo-shadow p-4 rounded-2xl transform rotate-6 max-w-xs pointer-events-none hidden md:block">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-white text-black font-bold text-xs p-1 rounded">UPCOMING</div>
                <div className="font-bold font-display text-white">Live Webinar</div>
              </div>
              <p className="font-bold text-sm text-white/90">"Investing in your 20s" — Tomorrow @ 6PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center bg-lotus-dark p-8 md:p-12 rounded-3xl neo-border neo-shadow text-white mb-16">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h3 className="font-display font-extrabold text-4xl mb-2 uppercase">Ready to join?</h3>
            <p className="font-medium text-gray-400">Stop scrolling, start investing.</p>
          </div>
          <button className="neo-btn bg-genz-pink text-black text-xl px-10 hover:bg-white hover:text-black">
            CREATE FREE ACCOUNT
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 font-medium">
          <div>
            <div className="flex items-center gap-1 mb-6">
              <Zap className="w-5 h-5 text-lotus-red" fill="currentColor" />
              <span className="font-display font-bold text-xl tracking-tighter text-lotus-dark uppercase">
                Lotus<span className="text-lotus-red">Tribe</span>
              </span>
            </div>
            <p className="text-sm text-gray-600">
              A digital investment platform for the next generation, powered by Lotus Capital Limited.
            </p>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-lg mb-4 uppercase">Explore</h4>
            <ul className="space-y-3 text-gray-600">
              <li><Link to="/quiz" className="hover:text-black hover:underline underline-offset-4">Vibe Check Quiz</Link></li>
              <li><a href="#" className="hover:text-black hover:underline underline-offset-4">Mutual Funds</a></li>
              <li><a href="#" className="hover:text-black hover:underline underline-offset-4">Learning Hub</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-4 uppercase">Company</h4>
            <ul className="space-y-3 text-gray-600">
              <li><a href="#" className="hover:text-black hover:underline underline-offset-4">About Lotus Capital</a></li>
              <li><a href="#" className="hover:text-black hover:underline underline-offset-4">Contact the Squad</a></li>
              <li><a href="#" className="hover:text-black hover:underline underline-offset-4">Join our Team</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-lg mb-4 uppercase">Legal text</h4>
            <ul className="space-y-3 text-gray-600">
              <li><a href="#" className="hover:text-black hover:underline underline-offset-4">Terms of Play</a></li>
              <li><a href="#" className="hover:text-black hover:underline underline-offset-4">Privacy Stuff</a></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer box */}
        <div className="bg-gray-100 p-6 rounded-2xl neo-border text-xs text-gray-600 font-medium leading-relaxed mb-8">
          <p className="font-bold text-black uppercase mb-2">🚨 The Serious Stuff (read this):</p>
          <p className="mb-2">
            Lotus Tribe is a mobile-first digital investment platform owned and operated by Lotus Capital Limited, a Fund/Portfolio Manager duly licensed and regulated by the Securities and Exchange Commission (SEC), Nigeria. 
          </p>
          <p className="mb-2">
            All funds offered on the platform are Shariah-compliant and regulated by the SEC, Nigeria.
          </p>
          <p>
            <strong>Risk Warning:</strong> We don't give direct investment advice (do your own research!). The value of investments can go up or down. You might get back less than you put in. Past wins do not guarantee future wins. If unsure, talk to a real financial advisor.
          </p>
        </div>

        <div className="text-center font-bold text-sm uppercase">
          &copy; {new Date().getFullYear()} Lotus Capital Limited. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const QuizPage = () => {
  const { user, loading, refreshProfile } = useContext(AuthContext);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resultProfile, setResultProfile] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const questions = [
    {
      q: "You get ₦100,000 for your birthday. First thought?",
      options: [
        { text: "Save it in a locked account 🔒", points: 1 },
        { text: "Split it: half save, half vibe ⚖️", points: 2 },
        { text: "Yolo it into the next big crypto/stock 🚀", points: 3 }
      ]
    },
    {
      q: "Your investment portfolio drops 10% in a week. Reaction?",
      options: [
        { text: "Panic sell everything, I'm out 📉", points: 1 },
        { text: "Hold, monitor the situation 🧐", points: 2 },
        { text: "Buy the dip! Fire sale! 🔥", points: 3 }
      ]
    },
    {
      q: "When thinking about the next 5 years, what's the goal?",
      options: [
        { text: "Sleep peacefully knowing I won't lose money 😴", points: 1 },
        { text: "Beat inflation with steady growth 📈", points: 2 },
        { text: "10x my money or bust 💸", points: 3 }
      ]
    },
    {
      q: "How do you do your research?",
      options: [
        { text: "My parents or bank told me what to do 🏦", points: 1 },
        { text: "Read finance threads and use verified apps 📱", points: 2 },
        { text: "Financial advice from Tiktok & Discord 🤡", points: 3 }
      ]
    },
    {
      q: "What's an acceptable tradeoff for you?",
      options: [
        { text: "5% guaranteed profit > 30% potential profit 🛡️", points: 1 },
        { text: "10-15% profit with moderate risk 🎯", points: 2 },
        { text: "Risk losing it all for an 80% gain 🎲", points: 3 }
      ]
    },
    {
      q: "Your friend pitches a new startup idea to you.",
      options: [
        { text: "Wish them luck, keep my money ✌️", points: 1 },
        { text: "Ask to see the business plan and financials 📊", points: 2 },
        { text: "Give them seed money immediately 🤑", points: 3 }
      ]
    }
  ];

  const handleAnswer = (points: number) => {
    const newScore = score + points;
    if (currentQuestion < questions.length - 1) {
      setScore(newScore);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz(newScore);
    }
  };

  const finishQuiz = async (finalScore: number) => {
    setScore(finalScore);
    let profile = "";
    if (finalScore <= 9) profile = "Steady Saver";
    else if (finalScore <= 14) profile = "Calculated Thinker";
    else profile = "Risk Taker";
    
    setResultProfile(profile);
    setIsFinished(true);

    if (user) {
      setSaving(true);
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          riskProfile: profile,
          quizCompleted: true,
          updatedAt: serverTimestamp()
        });
        refreshProfile();
      } catch (e) {
         handleFirestoreError(e, OperationType.UPDATE, 'users');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleShare = async () => {
    const text = `I just took the LotusTribe Vibe Check and I got "${resultProfile}"! Find out your investor personality too. 💸🚀`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LotusTribe Vibe Check',
          text: text,
          url: window.location.origin
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      alert("Sharing not supported on this browser!");
    }
  };

  if (loading) {
     return <div className="min-h-screen pt-32 pb-20 flex items-center justify-center font-display font-bold text-2xl">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-3xl neo-border neo-shadow text-center max-w-md w-full">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="font-display font-bold text-3xl uppercase mb-4">Login Required</h2>
          <p className="font-medium text-gray-600 mb-8">You need to log in to take the Vibe Check and save your investor profile.</p>
          <button onClick={loginWithGoogle} className="neo-btn bg-genz-lime text-lotus-dark w-full uppercase text-xl">
            Log In with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center bg-[#fafafa]">
      
      {!isFinished ? (
        <div className="w-full max-w-2xl">
          <div className="mb-8 flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-display font-bold uppercase hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5"/> Back
            </button>
            <div className="font-display font-bold bg-white px-4 py-1.5 rounded-full neo-border shadow-sm">
              Question {currentQuestion + 1} / {questions.length}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 h-2 rounded-full mb-10 overflow-hidden">
             <motion.div 
                className="bg-genz-pink h-full" 
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
             />
          </div>

          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-8 md:p-12 rounded-3xl neo-border neo-shadow"
          >
            <h2 className="font-display font-extrabold text-3xl md:text-4xl uppercase mb-10 leading-tight">
              {questions[currentQuestion].q}
            </h2>
            <div className="flex flex-col gap-4">
              {questions[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option.points)}
                  className="text-left font-bold text-lg md:text-xl p-5 md:p-6 rounded-2xl neo-border hover:bg-genz-lime transition-all transform hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#121212] flex items-center justify-between group"
                >
                  <span>{option.text.split(' ').slice(0, -1).join(' ')}</span>
                  <span className="text-3xl group-hover:scale-125 transition-transform">{option.text.split(' ').pop()}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl text-center"
        >
          <div className="bg-white p-10 rounded-3xl neo-border neo-shadow mb-8 relative overflow-hidden">
            {/* Confetti-like bg */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#121212 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
            
            <h2 className="font-display font-bold text-2xl uppercase mb-2 text-gray-500">Your Vibe Check Result:</h2>
            <div className="text-7xl mb-6 mt-4">
              {resultProfile === 'Steady Saver' ? '🐢' : resultProfile === 'Calculated Thinker' ? '🧠' : '🚀'}
            </div>
            <h1 className="font-display font-extrabold text-5xl uppercase mb-6 text-genz-purple">
              {resultProfile}
            </h1>
            <p className="text-xl font-medium text-gray-700 mb-8 max-w-md mx-auto">
              {resultProfile === 'Steady Saver' && "You like to play it safe and steady. We've got low-risk Halal funds perfect for you."}
              {resultProfile === 'Calculated Thinker' && "You take risks but only when the math makes sense. Balanced Halal funds are your best bet."}
              {resultProfile === 'Risk Taker' && "High risk, high reward. You're ready to dive into growth-focused Shariah-compliant investments."}
            </p>

            <button onClick={handleShare} className="neo-btn bg-genz-blue text-white w-full uppercase text-xl mb-4 flex items-center justify-center gap-2">
               Share on Socials
            </button>
            <Link to="/">
               <button className="neo-btn bg-white text-lotus-dark w-full uppercase text-lg">
                 Back to Home
               </button>
            </Link>
          </div>
          {saving && <p className="font-bold text-gray-500 animate-pulse">Saving profile...</p>}
        </motion.div>
      )}
    </div>
  );
};

const HomePage = () => {
   return (
      <>
        <Hero />
        <FeatureVibeCheck />
        <FeatureLearnEarn />
        <FeatureCommunity />
      </>
   );
};

const LMSWrapper = () => {
   const { user, loading } = useContext(AuthContext);
   return <LMSLayout user={user} loading={loading} loginWithGoogle={loginWithGoogle} />;
};

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white font-sans text-lotus-dark selection:bg-genz-pink selection:text-white">
        <Navbar />
        <main>
          <Routes>
             <Route path="/" element={<HomePage />} />
             <Route path="/quiz" element={<QuizPage />} />
             
             {/* LMS Routes */}
             <Route path="/learn" element={<LMSWrapper />}>
                <Route index element={<LMSDashboard />} />
                <Route path="courses" element={<LMSCourses />} />
                <Route path="courses/:courseId" element={<LMSCoursePlayer />} />
                <Route path="community" element={<LMSCommunity />} />
                <Route path="achievements" element={<LMSAchievements />} />
             </Route>
          </Routes>
        </main>
        <Footer />
        
        <style>{`
          /* Custom animations for the blobs and marquee */
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
        `}</style>
      </div>
    </AuthProvider>
  );
}
