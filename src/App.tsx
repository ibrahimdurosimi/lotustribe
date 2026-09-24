import { Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
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
  Shield,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Share2,
  Sun,
  Moon
} from 'lucide-react';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { auth, loginWithGoogle, logout, db, handleFirestoreError, OperationType } from './lib/firebase';
import { syncUserProfile, UserProfile } from './lib/userService';
import html2canvas from 'html2canvas';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { LMSLayout, LMSDashboard, LMSCourses, LMSCoursePlayer, LMSAchievements } from './LMS';
import { Community } from './Community';
import { ScrollToTop } from './components/ScrollToTop';
import { AdminDashboard } from './Admin';
import { sendEmailNotification } from './lib/email';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { OfflineIndicator } from './components/OfflineIndicator';

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  loading: boolean;
  userProfile: UserProfile | null;
  refreshProfile: () => void;
}
export const AuthContext = createContext<AuthContextType>({ user: null, loading: true, userProfile: null, refreshProfile: () => {} });

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (currentUser: User) => {
    try {
      const profile = await syncUserProfile(currentUser);
      setUserProfile(profile);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, userProfile, refreshProfile: () => user && fetchProfile(user) }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, userProfile } = useContext(AuthContext);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme from localStorage or system preference
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const location = useLocation();
  const isLearnRoute = location.pathname.startsWith('/learn');

  if (isLearnRoute) return null;

  return (
    <nav className="fixed w-full z-50 p-4 pointer-events-none">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 neo-border neo-shadow rounded-2xl pointer-events-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer group">
          <img src="/lotus-logo.png" alt="Lotus Tribe Logo" className="h-8 md:h-10 transform group-hover:-rotate-2 group-hover:scale-105 transition-all" />
        </Link>
        
        {/* Theme Toggle Mobile */}
        <button onClick={toggleTheme} className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors ml-auto mr-2" aria-label="Toggle theme">
          {isDark ? <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 font-display font-semibold">
          <div className="relative group perspective-1000">
            <Link to="/invest" className="hover:text-genz-pink transition-colors cursor-pointer inline-block">Invest <ChevronRight className="inline w-4 h-4 transform group-hover:rotate-90 transition-transform" /></Link>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-900 neo-border neo-shadow-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left -rotate-x-12 group-hover:rotate-x-0">
              <Link to="/invest/fif" className="block px-4 py-3 hover:bg-genz-lime hover:font-bold border-b-2 border-black/5 last:border-b-0 transition-colors">Low Risk (FIF)</Link>
              <Link to="/invest/halal" className="block px-4 py-3 hover:bg-genz-pink hover:font-bold transition-colors">Moderate Risk (Halal)</Link>
            </div>
          </div>
          <Link to="/learn" className="hover:text-genz-purple transition-colors hover:-translate-y-0.5 inline-block transform duration-150">Learn</Link>
          <Link to="/community" className="hover:text-genz-pink transition-colors hover:-translate-y-0.5 inline-block transform duration-150">Community</Link>
          
          <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" aria-label="Toggle theme">
            {isDark ? <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
          </button>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-4 group cursor-pointer hover:opacity-80 transition-opacity">
                <div className="flex flex-col text-right leading-tight transform group-hover:-translate-x-1 transition-transform">
                  <span className="text-sm font-bold">{user.displayName}</span>
                  {userProfile?.riskProfile && (
                    <span className="text-[10px] font-bold text-white bg-[#8213F4] px-2 rounded uppercase tracking-wider">{userProfile.riskProfile}</span>
                  )}
                </div>
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} className="w-10 h-10 rounded-full neo-border transform group-hover:scale-105 transition-transform" alt="Avatar"/>
              </Link>
              <button onClick={logout} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ml-2" title="Log Out">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={loginWithGoogle} className="hover:underline font-bold text-sm uppercase">Log In</button>
              <button onClick={loginWithGoogle} className="neo-btn bg-[#C10202] text-white px-6 py-2 text-sm uppercase translate-y-0">
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 neo-border rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-genz-lime transition-colors"
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
          className="md:hidden absolute top-24 left-4 right-4 bg-white dark:bg-gray-900 neo-border neo-shadow rounded-2xl p-6 flex flex-col gap-4 pointer-events-auto"
        >
          <div className="flex flex-col gap-2">
            <span className="font-display font-bold text-xl uppercase py-2 border-b-2 border-black text-[#C10202]">Invest</span>
            <Link to="/invest/fif" className="pl-4 font-display font-bold text-lg uppercase py-1" onClick={() => setIsOpen(false)}>Low Risk (FIF)</Link>
            <Link to="/invest/halal" className="pl-4 font-display font-bold text-lg uppercase py-1" onClick={() => setIsOpen(false)}>Moderate Risk (Halal)</Link>
          </div>
          <Link to="/learn" className="font-display font-bold text-xl uppercase py-2 border-b-2 border-black" onClick={() => setIsOpen(false)}>Learn</Link>
          <Link to="/community" className="font-display font-bold text-xl uppercase py-2 border-b-2 border-black" onClick={() => setIsOpen(false)}>Community</Link>
          {user ? (
             <div className="flex items-center justify-between pt-4">
               <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                 <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} className="w-12 h-12 rounded-full neo-border" alt="Avatar"/>
                 <div>
                   <div className="font-bold">{user.displayName}</div>
                   {userProfile?.riskProfile && <div className="text-[10px] font-bold text-white bg-[#8213F4] px-2 rounded uppercase tracking-wider inline-block mt-1">{userProfile.riskProfile}</div>}
                 </div>
               </Link>
               <button onClick={() => { logout(); setIsOpen(false); }} className="p-2 bg-red-100 text-red-600 rounded-lg neo-border shadow-sm">
                 <LogOut className="w-5 h-5" />
               </button>
             </div>
          ) : (
            <button onClick={() => { loginWithGoogle(); setIsOpen(false); }} className="neo-btn bg-genz-lime text-lotus-dark dark:text-white w-full mt-4 uppercase text-lg">
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
    <section className="relative pt-48 pb-28 overflow-hidden bg-[#1A1A1A] dark:bg-[#0a0a0a]">
      {/* Financial Pattern Background */}
      <div 
        className="absolute inset-0 z-0 opacity-100 pointer-events-none" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ctext x='15' y='35' font-size='28' font-family='sans-serif' font-weight='bold'%3E%26%238358%3B%3C/text%3E%3Ctext x='75' y='85' font-size='24' font-family='sans-serif' font-weight='bold'%3E%25%3C/text%3E%3Cpath d='M30,90 L40,75 L50,85 L65,60 L75,70 L90,40' stroke='%23ffffff' stroke-width='3' stroke-opacity='0.05' fill='none' /%3E%3Ccircle cx='90' cy='40' r='3' fill='%23ffffff' fill-opacity='0.04' /%3E%3Ccircle cx='60' cy='30' r='10' stroke='%23ffffff' stroke-width='2' stroke-opacity='0.05' fill='none' /%3E%3Ccircle cx='60' cy='30' r='4' fill='%23ffffff' fill-opacity='0.04' /%3E%3Cpath d='M100,100 L100,80 L110,80 L110,100 Z' fill='%23ffffff' fill-opacity='0.04' /%3E%3Cpath d='M85,100 L85,90 L95,90 L95,100 Z' fill='%23ffffff' fill-opacity='0.04' /%3E%3Cpath d='M70,100 L70,85 L80,85 L80,100 Z' fill='%23ffffff' fill-opacity='0.04' /%3E%3C/g%3E%3C/svg%3E")` }}
      ></div>
      
      {/* Accent glow overlay to blend */}
      <div className="absolute inset-0 bg-[#1A1A1A]/20 backdrop-blur-[2px] z-0 pointer-events-none"></div>
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#C10202] rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#C10202] text-white font-display font-bold text-sm tracking-wider uppercase mb-6 neo-shadow-sm rotate-2">
              🔥 Built for the Future
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[0.9] tracking-tighter mb-6 uppercase">
              Investing <br/> <span className="text-[#C10202] inline-block -rotate-2">Redefined</span> for <br/> your generation.
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg font-medium">
              Halal, SEC-regulated investing that actually makes sense. Level up your financial literacy, track your portfolio, and build enduring wealth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/quiz">
                <button className="neo-btn w-full bg-[#C10202] text-white text-lg flex items-center justify-center gap-2 group">
                  Take the Vibe Check 🎯
                </button>
              </Link>
              <Link to="/invest">
                <button className="neo-btn w-full bg-white dark:bg-gray-900 text-lotus-dark dark:text-white text-lg flex items-center justify-center">
                  Explore Funds
                </button>
              </Link>
            </div>
            
            <div className="mt-10 flex items-center gap-4 bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10 inline-flex shadow-xl">
              <div className="flex -space-x-4">
                <img className="w-10 h-10 rounded-full border-2 border-[#1A1A1A] object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                <img className="w-10 h-10 rounded-full border-2 border-[#1A1A1A] object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="avatar" />
                <img className="w-10 h-10 rounded-full border-2 border-[#1A1A1A] object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Buster" alt="avatar" />
              </div>
              <div className="font-display font-bold text-sm text-white">
                +10,000 Next-Gen Investors <br/> already joined!
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-[550px] w-full flex items-center justify-center perspective-1000"
          >
            {/* Dashboard Mockup */}
            <div className="w-[450px] h-[320px] bg-white dark:bg-gray-900 rounded-xl neo-border neo-shadow p-0 relative z-20 overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
               {/* header */}
               <div className="bg-gray-50 dark:bg-gray-800 border-b border-black/10 py-3 px-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-md bg-[#C10202] text-white flex items-center justify-center font-bold text-[10px]">LT</div>
                     <span className="font-display font-bold text-sm">Portfolio Overview</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-xs font-bold text-gray-500 dark:text-gray-400">₦150,450.00</span>
                     <div className="w-6 h-6 rounded-full bg-genz-lime neo-border text-xs flex items-center justify-center">+</div>
                  </div>
               </div>
               {/* body */}
               <div className="p-4 grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                     <p className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider">Halal Eq.</p>
                     <p className="text-lg font-bold">₦120k</p>
                     <div className="mt-2 h-1 w-full bg-blue-200 rounded-full overflow-hidden"><div className="w-3/4 h-full bg-blue-500"></div></div>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                     <p className="text-xs font-bold text-green-600 mb-1 uppercase tracking-wider">Fixed Inc.</p>
                     <p className="text-lg font-bold">₦30k</p>
                     <div className="mt-2 h-1 w-full bg-green-200 rounded-full overflow-hidden"><div className="w-1/4 h-full bg-green-500"></div></div>
                  </div>
               </div>
               {/* chart area */}
               <div className="px-4">
                  <div className="w-full h-24 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-800 flex items-end px-2 gap-2 pt-4">
                     {/* Fake chart bars */}
                     {[30, 40, 35, 50, 45, 60, 75, 65, 80, 95].map((h, i) => (
                        <div key={i} className="flex-1 bg-[#C10202]/20 rounded-t-sm" style={{ height: `${h}%` }}></div>
                     ))}
                  </div>
               </div>
            </div>

            {/* LMS / Module Mockup (Floating behind) */}
            <div className="absolute -bottom-10 -right-4 w-[280px] h-[200px] bg-white dark:bg-gray-900 rounded-xl neo-border neo-shadow-sm p-4 z-30 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
               <div className="flex gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-genz-pink text-lotus-dark dark:text-white flex items-center justify-center">
                     <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm leading-tight">Module 3</h4>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Ethical Investing</p>
                  </div>
               </div>
               <div className="bg-gray-100 dark:bg-gray-800 w-full h-2 rounded-full mb-2"><div className="bg-[#C10202] h-full w-1/2 rounded-full"></div></div>
               <p className="text-[10px] uppercase font-bold text-right text-gray-400 mb-4">50% Completed</p>
               <button className="w-full neo-btn py-2 text-xs bg-genz-lime">Continue Lesson</button>
            </div>

            {/* Floating assets */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-10 -left-6 bg-white dark:bg-gray-900 neo-border neo-shadow px-4 py-3 rounded-xl z-30 transform -rotate-12 flex items-center gap-2"
            >
              <Award className="w-5 h-5 text-[#C10202]" />
              <span className="font-display font-bold text-xs uppercase tracking-tight">Level 5 Investor</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

import { coursesData } from './data/courses';

const FeatureLearnEarn = () => {
  const [activeLevel, setActiveLevel] = useState<string>('All');
  const [showCount, setShowCount] = useState<number>(14);

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  
  const filteredCourses = coursesData.filter(c => 
    activeLevel === 'All' ? true : c.level === activeLevel
  );

  return (
    <section id="learn" className="py-32 bg-[#111] dark:bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-5 py-2 rounded-full bg-genz-pink text-lotus-dark dark:text-white font-display font-bold text-sm tracking-wider uppercase mb-8 neo-shadow -rotate-2">
            Learning Hub
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-extrabold uppercase leading-none mb-8">
            Create Wealth <br/><span className="text-genz-lime">Improve Intelligence.</span>
          </h2>
          <p className="text-xl font-medium text-gray-400">
            Gamified lessons. Earn XP. Collect badges. Discover halal investments and build a wealthy mindset with the LOTUS Tribe.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
           {levels.map(level => (
              <button
                 key={level}
                 onClick={() => setActiveLevel(level)}
                 className={`px-6 py-2 rounded-2xl font-bold font-display uppercase tracking-wide transition-all ${activeLevel === level ? 'bg-genz-lime text-black dark:text-white border-2 border-black shadow-[4px_4px_0_0_#000] transform -translate-y-1' : 'bg-[#222] dark:bg-[#1a1a1a] text-gray-400 border-2 border-transparent hover:border-gray-600'}`}
              >
                 {level}
              </button>
           ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
          <AnimatePresence>
          {filteredCourses.slice(0, showCount).map((course, idx) => (
             <motion.div 
               key={course.id}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9 }}
               transition={{ delay: idx * 0.1 }}
             >
               <Link to={`/learn/courses/${course.id}`} className={`bg-[#222] dark:bg-[#1a1a1a] p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] neo-border hover:-translate-y-3 transition-transform relative group block h-full flex flex-col ${idx % 3 === 2 ? 'border-pink-400' : ''}`}>
                 <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-white dark:bg-gray-900 text-black dark:text-white font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs uppercase neo-border border-2 shadow-sm">
                   {course.level}
                 </div>
                 <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl ${course.color} ${course.accent.replace('bg-', 'text-')} neo-border flex items-center justify-center mb-6 md:mb-8 transform group-hover:rotate-12 transition-transform shadow-inner`}>
                   <span className="text-3xl md:text-4xl">{course.badgeIcon}</span>
                 </div>
                 <h3 className="font-display font-bold text-xl md:text-3xl mb-3 md:mb-4 text-white leading-tight">{course.title}</h3>
                 
                 {/* Preview Snippet */}
                 <p className="text-gray-400 font-medium mb-6 md:mb-8 text-xs md:text-lg flex-1 line-clamp-3">
                   {course.lessons[0]?.content.replace(/<[^>]*>?/gm, '').substring(0, 80)}...
                 </p>
                 
                 <div className="mt-auto">
                   <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1 md:gap-0 mb-2">
                     <span className="text-[11px] md:text-sm font-bold text-gray-500 dark:text-gray-400">{course.lessons.length} Lessons</span>
                     <span className={`text-[11px] md:text-sm font-bold ${course.accent.replace('bg-', 'text-')}`}>+ {course.xp} XP</span>
                   </div>
                   <div className="w-full bg-black h-2 md:h-3 rounded-full overflow-hidden neo-border border-white/20">
                      <div className={`${course.accent} h-full w-0 group-hover:w-1/3 transition-all duration-700`}></div>
                   </div>
                 </div>
               </Link>
             </motion.div>
          ))}
          </AnimatePresence>
        </div>

        {filteredCourses.length > showCount && (
           <div className="text-center mt-16">
              <button onClick={() => setShowCount(prev => prev + 6)} className="neo-btn bg-white dark:bg-gray-900 text-black dark:text-white text-lg">
                 Load More Courses
              </button>
           </div>
        )}
      </div>
    </section>
  );
};

const FeatureCommunity = () => {
  return (
    <section id="squad" className="py-32 bg-genz-lime relative border-b-4 border-black overflow-hidden">
      {/* Decorative stars */}
      <div className="absolute top-10 left-10 text-4xl hidden lg:block">✨</div>
      <div className="absolute bottom-20 right-20 text-5xl hidden lg:block">⭐️</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-5 py-2 rounded-full bg-white dark:bg-gray-900 text-black dark:text-white font-display font-bold text-sm tracking-wider uppercase mb-8 neo-shadow -rotate-3">
              The Squad
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-extrabold text-lotus-dark dark:text-white uppercase leading-[0.9] tracking-tighter mb-8">
              Don't invest <br/> <span className="bg-white dark:bg-gray-900 px-2 neo-border inline-block mt-2 transform rotate-2">alone.</span>
            </h2>
            <p className="text-2xl font-medium text-lotus-dark dark:text-white mb-10 max-w-lg">
              Join the Lotus Tribe community. Ask questions, flex your badges, attend exclusive virtual events, and grow your wealth alongside thousands of others.
            </p>
            <Link to="/learn/community" className="neo-btn bg-black text-white px-10 py-5 flex items-center gap-3 w-fit text-xl">
              <MessageCircle className="w-7 h-7" /> Enter the Chat
            </Link>
          </div>

          <div className="relative mt-12 md:mt-0 lg:ml-12">
            {/* Mock Chat UI */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl neo-border neo-shadow p-6 pointer-events-none">
              
              <div className="flex gap-4 mb-6">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha" className="w-12 h-12 rounded-full neo-border object-cover bg-gray-100 dark:bg-gray-800" alt="Aisha" />
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none p-4 neo-border w-fit relative">
                  <p className="font-bold mb-1 text-sm">@Aisha_Invests <span className="text-xs bg-yellow-300 px-1 rounded neo-border ml-2">LVL 4</span></p>
                  <p className="font-medium text-sm">Just hit my first ₦100k in the Halal Fixed Income Fund! 🎉</p>
                </div>
              </div>

              <div className="flex gap-4 mb-6 flex-row-reverse">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" className="w-12 h-12 rounded-full neo-border object-cover bg-gray-100 dark:bg-gray-800" alt="You" />
                <div className="bg-genz-blue text-lotus-dark dark:text-white rounded-2xl rounded-tr-none p-4 neo-border w-fit">
                  <p className="font-bold mb-1 text-sm text-white/90 dark:text-gray-200">@You</p>
                  <p className="font-medium text-sm">Omo, that's huge! 🔥 Any tips on staying consistent?</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full neo-border bg-[#C10202] text-white flex items-center justify-center font-display font-bold text-lg shrink-0">LT</div>
                <div className="bg-red-50 rounded-2xl rounded-tl-none p-4 neo-border border-[#C10202] w-fit">
                  <p className="font-bold mb-1 text-sm text-[#C10202]">@LotusTribe <span className="text-xs bg-black text-white px-1 rounded neo-border ml-2">MOD</span></p>
                  <p className="font-medium text-sm">Pro tip: Set up automated deductions on payday! 💸🚀</p>
                </div>
              </div>

            </div>
            
            {/* Event callout */}
            <div className="absolute -right-8 -bottom-8 bg-genz-purple neo-border neo-shadow p-4 rounded-2xl transform rotate-6 max-w-xs pointer-events-none hidden md:block">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-white dark:bg-gray-900 text-black dark:text-white font-bold text-xs p-1 rounded">UPCOMING</div>
                <div className="font-bold font-display text-white">Live Webinar</div>
              </div>
              <p className="font-bold text-sm text-white/90 dark:text-gray-200">"Investing in your 20s" — Tomorrow @ 6PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center bg-lotus-dark p-10 md:p-16 rounded-[2.5rem] neo-border neo-shadow text-white mb-20">
          <div className="mb-10 md:mb-0 text-center md:text-left">
            <h3 className="font-display font-extrabold text-5xl mb-4 uppercase">Ready to join?</h3>
            <p className="font-medium text-gray-400 text-xl">Stop scrolling, start investing.</p>
          </div>
          <button className="neo-btn bg-genz-pink text-black dark:text-white text-2xl px-12 py-5 hover:bg-white dark:bg-gray-900 hover:text-black dark:text-white">
            CREATE FREE ACCOUNT
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 font-medium">
          <div>
            <div className="flex items-center gap-1 mb-8">
              <img src="/lotus-logo.png" alt="Lotus Tribe Logo" className="h-10" />
            </div>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              A digital investment platform for the next generation, powered by Lotus Capital Limited.
            </p>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-lg mb-4 uppercase">Explore</h4>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li><Link to="/quiz" className="hover:text-black dark:text-white hover:underline underline-offset-4">Vibe Check Quiz</Link></li>
              <li><a href="#" className="hover:text-black dark:text-white hover:underline underline-offset-4">Mutual Funds</a></li>
              <li><a href="#" className="hover:text-black dark:text-white hover:underline underline-offset-4">Learning Hub</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-4 uppercase">Company</h4>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li><a href="#" className="hover:text-black dark:text-white hover:underline underline-offset-4">About Lotus Capital</a></li>
              <li><a href="#" className="hover:text-black dark:text-white hover:underline underline-offset-4">Contact the Squad</a></li>
              <li><a href="#" className="hover:text-black dark:text-white hover:underline underline-offset-4">Join our Team</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-lg mb-4 uppercase">Legal text</h4>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li><a href="#" className="hover:text-black dark:text-white hover:underline underline-offset-4">Terms of Play</a></li>
              <li><a href="#" className="hover:text-black dark:text-white hover:underline underline-offset-4">Privacy Stuff</a></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer box */}
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl neo-border text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-8">
          <p className="font-bold text-gray-700 dark:text-gray-200 uppercase mb-2">Legal Disclaimer</p>
          <p className="mb-2">
            Lotus Tribe is a mobile-first digital investment platform owned and operated by Lotus Capital Limited, a Fund/Portfolio Manager duly licensed and regulated by the Securities and Exchange Commission (SEC), Nigeria. Lotus Tribe is a distribution platform that provides access to Lotus Capital’s mutual funds, including the Lotus Halal Investment Fund and the Lotus Fixed Income Fund (FIF). All funds offered on the platform are Shariah-compliant and regulated by the SEC, Nigeria.
          </p>
          <p>
            Lotus Tribe is designed to make ethical investing accessible to a new generation of investors by providing simple access to investments, financial education resources, and a community-driven approach to wealth building. The platform does not provide investment advice, and investors are responsible for their own investment decisions. The value of investments may go up or down, and investors may receive back less than the amount originally invested. If in doubt, please seek advice from an independent financial adviser.
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
  const [answers, setAnswers] = useState<number[]>([]);
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
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = points;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = async (finalAnswers: number[]) => {
    const finalScore = finalAnswers.reduce((a, b) => a + b, 0);
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

        // Send Email Notification
        if (user.email) {
            sendEmailNotification(user.email, 'Investor Vibe Check Completed - Lotus Tribe', `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
                    <h2 style="color: #0A0A0A; text-transform: uppercase;">Vibe Check Complete!</h2>
                    <p>Hi,</p>
                    <p>You've successfully completed the Investor Vibe Check.</p>
                    <p>Your unique investor profile is: <strong>${profile}</strong></p>
                    <p>Based on your profile, we recommend getting started with your personalized investment journey on Lotus Tribe.</p>
                </div>
            `).catch(console.error);
        }
      } catch (e) {
         handleFirestoreError(e, OperationType.UPDATE, 'users');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleShare = async () => {
    const certificateElement = document.getElementById('vibe-certificate');
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

  if (loading) {
     return <div className="min-h-screen pt-32 pb-20 flex items-center justify-center font-display font-bold text-2xl">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 px-4">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl neo-border neo-shadow text-center max-w-md w-full">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="font-display font-bold text-3xl uppercase mb-4">Login Required</h2>
          <p className="font-medium text-gray-600 dark:text-gray-300 mb-8">You need to log in to take the Vibe Check and save your investor profile.</p>
          <button onClick={loginWithGoogle} className="neo-btn bg-genz-lime text-lotus-dark dark:text-white w-full uppercase text-xl">
            Log In with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center bg-[#fafafa] dark:bg-[#111]">
      
      {!isFinished ? (
        <div className="w-full max-w-2xl">
          <div className="mb-8 flex items-center justify-between">
            <button 
               onClick={() => currentQuestion > 0 ? setCurrentQuestion(currentQuestion - 1) : navigate(-1)} 
               className="flex items-center gap-2 font-display font-bold uppercase hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5"/> Back
            </button>
            <div className="font-display font-bold bg-white dark:bg-gray-900 px-4 py-1.5 rounded-full neo-border shadow-sm">
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
            className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-3xl neo-border neo-shadow"
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
          className="w-full max-w-3xl text-center"
        >
          <div id="vibe-certificate" className="bg-white dark:bg-gray-900 p-2 rounded-3xl neo-shadow mb-8 border-4 border-black inline-block w-full">
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
               
               <div className="relative z-10">
                 <h2 className="font-display font-black text-3xl md:text-5xl uppercase text-lotus-dark dark:text-white mb-2 tracking-widest">
                   Certificate of Vibe
                 </h2>
                 <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs mb-8">Official Lotus Tribe Assessment</p>
                 
                 <div className="text-7xl mb-6">
                   {resultProfile === 'Steady Saver' ? '🐢' : resultProfile === 'Calculated Thinker' ? '🧠' : '🚀'}
                 </div>
                 
                 <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl mb-8 border border-gray-200 dark:border-gray-700">
                    <p className="font-display font-bold text-xl md:text-2xl text-lotus-dark dark:text-white leading-relaxed">
                       Dear <span className="text-lotus-red border-b-2 border-lotus-red px-2">{user?.displayName || 'Tribe Member'}</span>, <br/><br/>
                       This is to certify that you have successfully completed your Lotus Tribe Investment Vibe Check. Your investment personality is formally recognized as:
                    </p>
                    <h1 className="font-display font-black text-4xl md:text-5xl uppercase mt-6 mb-4 text-lotus-dark dark:text-white bg-genz-lime inline-block px-4 py-2 transform -rotate-1 shadow-md border-2 border-black">
                      {resultProfile}
                    </h1>
                    <p className="text-lg md:text-xl font-bold text-gray-700 dark:text-gray-200 mt-2">
                       You are on course to be a {resultProfile === 'Steady Saver' ? 'low-risk' : resultProfile === 'Calculated Thinker' ? 'calculated' : 'high-risk'} Billionaire investor. 🥂
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
          
          <div className="max-w-xl mx-auto space-y-6 mt-10">
             <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border-2 border-black neo-shadow text-left">
                <h3 className="font-display font-bold text-xl uppercase mb-2">Our Recommendation</h3>
                <p className="text-gray-600 dark:text-gray-300 font-medium mb-4">
                  Based on your vibe check, we recommend you start building your wealth with the 
                  <span className="font-bold text-lotus-dark dark:text-white"> {resultProfile === 'Risk Taker' || resultProfile === 'Calculated Thinker' ? 'Lotus Halal Investment Fund' : 'Lotus Fixed Income Fund'}</span>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Link to={'/invest/onboarding'} state={{ fund: resultProfile === 'Risk Taker' || resultProfile === 'Calculated Thinker' ? 'halal' : 'fif' }} className="flex-1">
                    <button className="neo-btn bg-genz-lime text-lotus-dark dark:text-white w-full uppercase text-sm py-4 shadow-md hover:-translate-y-1 transition-transform">
                      Accept & Continue to KYC
                    </button>
                  </Link>
                  <Link to={'/invest/onboarding'} state={{ fund: resultProfile === 'Risk Taker' || resultProfile === 'Calculated Thinker' ? 'fif' : 'halal' }} className="flex-1">
                    <button className="neo-btn bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 w-full uppercase text-xs py-4 border-2 border-gray-300 hover:border-black hover:text-black dark:text-white hover:-translate-y-1 transition-all">
                      Choose {resultProfile === 'Risk Taker' || resultProfile === 'Calculated Thinker' ? 'FIF (Low Risk)' : 'Halal (Moderate Risk)'} Instead
                    </button>
                  </Link>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <button onClick={handleShare} className="neo-btn bg-lotus-dark text-white w-full uppercase text-xs py-4 flex items-center justify-center gap-2 shadow-xl hover:-translate-y-1 transition-transform">
                  Download Certificate <Share2 className="w-4 h-4"/>
               </button>
               <button onClick={() => { setIsFinished(false); setCurrentQuestion(0); setAnswers([]); }} className="neo-btn bg-white dark:bg-gray-900 text-lotus-dark dark:text-white w-full uppercase text-xs py-4 border-2 border-black hover:-translate-y-1 transition-transform">
                 Retake Vibe Check
               </button>
             </div>
             
             <div className="pt-4">
               <Link to="/">
                  <button className="text-gray-500 dark:text-gray-400 font-bold uppercase text-xs hover:text-black dark:text-white hover:underline underline-offset-4 transition-all">
                    Skip to Homepage
                  </button>
               </Link>
             </div>
          </div>
          {saving && <p className="font-bold text-gray-500 dark:text-gray-400 animate-pulse mt-4">Saving profile...</p>}
        </motion.div>
      )}
    </div>
  );
};

import { Calculator, InvestFIF, InvestHalal } from './Funds';

export const FeatureProducts = () => {
  return (
    <section id="funds" className="py-32 bg-[#fafafa] dark:bg-[#111] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-block px-5 py-2 rounded-full bg-lotus-dark text-white font-display font-bold text-sm tracking-wider uppercase mb-8 neo-shadow-sm rotate-2">
            The Funds
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-extrabold uppercase leading-none mb-8 text-black dark:text-white">
            Grow your <span className="text-lotus-red border-b-8 border-lotus-red pb-1">wealth.</span>
          </h2>
          <p className="text-xl font-medium text-gray-700 dark:text-gray-200">
            Halal investment products structured for your goals. Start with ₦5,000. Regulated, transparent, and built for the next generation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* FIF Fund Card */}
          <div className="bg-genz-lime p-10 md:p-12 rounded-[2.5rem] neo-border neo-shadow flex flex-col justify-between group hover:-translate-y-2 transition-transform">
             <div>
                <div className="flex justify-between items-start mb-8">
                   <div className="bg-white dark:bg-gray-900 px-4 py-1.5 rounded-full font-bold text-sm uppercase neo-border border-2">Low Risk</div>
                   <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-2xl neo-border flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                     <Shield className="w-8 h-8 text-black dark:text-white" />
                   </div>
                </div>
                <h3 className="font-display font-bold text-4xl mb-4 text-black dark:text-white uppercase leading-tight">Lotus Non-Interest Fixed Income Fund</h3>
                <p className="font-medium text-lg text-black/80 dark:text-gray-200 mb-8">Short & medium term goals. Quarterly payouts. Protect your capital while beating inflation.</p>
             </div>
             
             <div className="space-y-4">
                <div className="bg-white/50 dark:bg-black/20 p-4 rounded-xl font-medium flex justify-between items-center neo-border border-2 border-black/20 dark:border-white/20 text-black dark:text-white">
                   <span>FY 2025 Return</span>
                   <span className="font-bold text-xl">15.00%</span>
                </div>
                <Link to="/invest/fif" className="neo-btn bg-black text-white w-full uppercase flex items-center justify-center gap-2 text-lg">
                   Explore FIF <ArrowRight size={20} />
                </Link>
             </div>
          </div>

          {/* Halal Fund Card */}
          <div className="bg-genz-pink p-10 md:p-12 rounded-[2.5rem] neo-border neo-shadow flex flex-col justify-between group hover:-translate-y-2 transition-transform">
             <div>
                <div className="flex justify-between items-start mb-8">
                   <div className="bg-white dark:bg-gray-900 px-4 py-1.5 rounded-full font-bold text-sm uppercase neo-border border-2">Moderate Risk</div>
                   <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-2xl neo-border flex items-center justify-center transform group-hover:-rotate-12 transition-transform">
                     <TrendingUp className="w-8 h-8 text-black dark:text-white" />
                   </div>
                </div>
                <h3 className="font-display font-bold text-4xl mb-4 text-black dark:text-white uppercase leading-tight">Lotus Halal Investment Fund</h3>
                <p className="font-medium text-lg text-black/80 dark:text-gray-200 mb-8">Long term growth. Diversified portfolio. Create sustained wealth for the future.</p>
             </div>
             
             <div className="space-y-4">
                <div className="bg-white/50 dark:bg-black/20 p-4 rounded-xl font-medium flex justify-between items-center neo-border border-2 border-black/20 dark:border-white/20 text-black dark:text-white">
                   <span>FY 2025 Return</span>
                   <span className="font-bold text-xl">36.76%</span>
                </div>
                <Link to="/invest/halal" className="neo-btn bg-black text-white w-full uppercase flex items-center justify-center gap-2 text-lg">
                   Explore Halal Fund <ArrowRight size={20} />
                </Link>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureBenefits = () => {
  const benefits = [
    { title: "Investor Personality", desc: "Understand your investor behaviour through our unique profiling process.", icon: "🎯" },
    { title: "Automated Investments", desc: "Set up your personalized account and enjoy convenient and flexible automated investments.", icon: "⚡" },
    { title: "Financial Freedom", desc: "Grow your wealth with Lotus Tribe and fulfil your financial aspirations effectively.", icon: "🚀" },
    { title: "Community", desc: "Join our community, share insights and support one another in your investment journeys.", icon: "🤝" },
    { title: "Financial Literacy", desc: "Be a part of the tribe and gain access to financial intelligence and Halal finance knowledge.", icon: "📚" },
    { title: "Halal Investments", desc: "Access to Lotus Capital Halal investment options that ensures investments are in line with your values.", icon: "☪️" }
  ];

  return (
    <section className="py-24 bg-lotus-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-extrabold uppercase mb-4">
            Why Join the <span className="text-[#C10202]">Tribe?</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Everything you need to build enduring wealth, aligned with your values.</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="bg-white/5 neo-border border-white/10 p-4 md:p-6 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4">{benefit.icon}</div>
              <h3 className="font-display font-bold text-sm md:text-xl uppercase mb-2 leading-tight">{benefit.title}</h3>
              <p className="text-gray-400 leading-relaxed text-[11px] md:text-sm">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureMoreThanAnApp = () => {
  return (
    <section className="py-24 bg-white dark:bg-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 text-center md:text-left">
          <p className="text-[#C10202] font-bold text-sm tracking-[0.2em] uppercase mb-4">More than an app</p>
          <h2 className="text-5xl md:text-7xl font-display font-extrabold uppercase leading-none text-black dark:text-white">
            Learn. Invest. Belong.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-24">
          
          <div className="bg-genz-lime rounded-3xl p-8 neo-border neo-shadow-sm flex flex-col items-start hover:-translate-y-1 transition-transform border-[3px] border-black h-full">
            <div className="flex justify-between items-start w-full mb-8">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="bg-white dark:bg-gray-900 text-black dark:text-white font-bold text-[10px] sm:text-xs uppercase px-3 py-1.5 rounded-full mt-1">
                VIBE CHECK
              </div>
            </div>
            <h3 className="font-display font-bold text-2xl mb-4 leading-tight">Find your investor archetype</h3>
            <p className="text-black/80 dark:text-gray-200 font-medium text-sm leading-relaxed mt-auto">
              A 60-second quiz that maps your goals, risk appetite, and values to a personalised fund mix.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 neo-border neo-shadow-sm flex flex-col items-start hover:-translate-y-1 transition-transform border-[3px] border-black h-full">
            <div className="flex justify-between items-start w-full mb-8">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-bold text-[10px] sm:text-xs uppercase px-3 py-1.5 rounded-full mt-1 border border-gray-200 dark:border-gray-700 shadow-sm">
                LEARNING HUB
              </div>
            </div>
            <h3 className="font-display font-bold text-2xl mb-4 leading-tight">Bite-sized money modules</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium text-sm leading-relaxed mt-auto">
              Earn badges as you master halal investing principles, market basics, and wealth strategy.
            </p>
          </div>

          <div className="bg-genz-pink rounded-3xl p-8 neo-border neo-shadow-sm flex flex-col items-start hover:-translate-y-1 transition-transform border-[3px] border-black h-full">
            <div className="flex justify-between items-start w-full mb-8">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div className="bg-white dark:bg-gray-900 text-black dark:text-white font-bold text-[10px] sm:text-xs uppercase px-3 py-1.5 rounded-full mt-1">
                COMMUNITY
              </div>
            </div>
            <h3 className="font-display font-bold text-2xl mb-4 leading-tight">Built with the tribe</h3>
            <p className="text-black/80 dark:text-gray-200 font-medium text-sm leading-relaxed mt-auto">
              Join live AMAs with Shariah advisors, swap strategies, and grow with thousands of peers.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Getting Started', 'Halal & Ethics', 'Money & Returns', 'Safety & Tech'];

  const faqs = [
    {
      category: 'Getting Started',
      q: "What makes Lotus different from other investing apps?",
      a: "We blend financial education with real, SEC-regulated investment opportunities—specifically focusing on Halal, ethical products. Plus, we've gamified the experience with XP, badges, interactive courses, and a thriving community squad so you never have to navigate wealth-building alone."
    },
    {
      category: 'Getting Started',
      q: "How much money do I actually need to get started?",
      a: "No gatekeeping here! You can kickstart your wealth-building journey with as little as ₦5,000 in our mutual funds. Start small, set up recurring monthly contributions on payday, and watch your compounding take off."
    },
    {
      category: 'Getting Started',
      q: "I'm a complete beginner. Will I get overwhelmed?",
      a: "Not at all. We built Lotus Tribe specifically to kill financial jargon. Start by taking our 2-minute 'Vibe Check' quiz to discover your investor archetype, then explore bite-sized 3-minute gamified lessons in our Learning Hub to earn XP while you learn."
    },
    {
      category: 'Halal & Ethics',
      q: "What does 'Halal Investing' actually mean?",
      a: "Halal investing means your money is deployed strictly into ethical, socially responsible ventures governed by Islamic jurisprudence. That means zero interest (riba), zero gambling (maysir), zero deceptive speculation (gharar), and strict exclusions of harmful industries like alcohol, tobacco, weapons, and adult entertainment."
    },
    {
      category: 'Halal & Ethics',
      q: "Do I have to be Muslim to invest with Lotus Tribe?",
      a: "Not at all! Ethical finance is universal. Anyone who values financial transparency, tangible asset backing, and socially conscious wealth creation is warmly welcomed in the Lotus Tribe squad."
    },
    {
      category: 'Halal & Ethics',
      q: "How do I earn returns if interest (riba) is forbidden?",
      a: "Instead of earning interest from debt, your returns come from real economic activity: profits from leasing high-grade equipment/real estate (Ijarah), rental income from Sovereign and Corporate Sukuk bonds, and profit-sharing partnerships (Mudarabah/Musharakah) in vetted ethical businesses."
    },
    {
      category: 'Money & Returns',
      q: "Can I withdraw my money at any time?",
      a: "Absolutely. Our mutual funds offer competitive liquidity. You can request a withdrawal right from your dashboard anytime, and funds are disbursed straight to your verified Nigerian bank account within standard settlement timeframes (typically 2 to 3 business days)."
    },
    {
      category: 'Money & Returns',
      q: "Are there hidden charges or surprise exit fees?",
      a: "Zero hidden surprises. What you see on your dashboard is your genuine net asset value. Management fees are regulated by the SEC and already built transparently into the fund's published NAV, with no penal traps for withdrawing your hard-earned cash."
    },
    {
      category: 'Money & Returns',
      q: "How and when do I get paid my investment yields?",
      a: "Depending on your selected fund, distributions occur on a periodic schedule (quarterly for our Fixed Income Fund, or semi-annually/annually for equities). You can choose to automatically reinvest your returns to accelerate compound growth, or have them paid out to your bank."
    },
    {
      category: 'Safety & Tech',
      q: "Is Lotus Capital regulated and is my money safe?",
      a: "Yes! Lotus Capital Limited is fully registered, licensed, and regulated as a Fund/Portfolio Manager by the Securities and Exchange Commission (SEC) of Nigeria. All investor assets are held independently by an accredited third-party custodian bank, ensuring your capital is safeguarded."
    },
    {
      category: 'Safety & Tech',
      q: "Can I install Lotus Tribe as an app on my phone?",
      a: "Yes! Lotus Tribe is built as a next-gen Progressive Web App (PWA). Simply tap the 'Install' button on our floating banner (or 'Add to Home Screen' in Safari on iOS) to install Lotus Tribe directly to your launcher without hogging your device's memory."
    },
    {
      category: 'Safety & Tech',
      q: "What happens if I lose my phone or change devices?",
      a: "Your funds and records are safely stored on the cloud with bank-grade encryption—not locally on your physical device. Simply log back into your Lotus Tribe account on any phone or computer with your credentials to regain instant access."
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesQuery = 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <section className="py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block px-5 py-2 rounded-full bg-gray-100 dark:bg-gray-800 font-bold uppercase text-xs tracking-wider mb-4 border border-gray-200 dark:border-gray-700">
            Got Questions? We Got Answers
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold uppercase">
            Frequently Asked <span className="text-[#C10202]">Vibes</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Everything you need to know about ethical investing, Halal returns, SEC security, and building wealth with the Tribe.
          </p>
        </div>

        {/* Category Filter Pills & Search */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIndex(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold uppercase transition-all cursor-pointer neo-border ${
                  activeCategory === cat
                    ? 'bg-genz-lime text-black shadow-[2px_2px_0_0_#000]'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Search Bar */}
          <div className="relative max-w-md mx-auto w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenIndex(null);
              }}
              placeholder="Search questions (e.g. halal, minimum, withdraw, safe)..."
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm border-2 border-black dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#C10202] text-gray-900 dark:text-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        
        {/* FAQ Accordion List */}
        <div className="flex flex-col gap-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl neo-border p-6">
              <p className="text-gray-500 dark:text-gray-400 font-bold mb-2">No matching vibes found!</p>
              <p className="text-xs text-gray-400">Try searching for something else or reset your filter.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-black text-white text-xs font-bold neo-border"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => (
              <div 
                key={faq.q} 
                className={`p-5 md:p-6 rounded-2xl neo-border cursor-pointer transition-all ${
                  openIndex === idx ? 'bg-genz-lime neo-shadow-sm' : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750'
                }`}
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/70 dark:bg-black/30 text-gray-700 dark:text-gray-300 border border-black/10 inline-block mb-1.5">
                      {faq.category}
                    </span>
                    <h3 className="font-display font-bold text-lg md:text-xl text-gray-900 dark:text-white leading-snug">
                      {faq.q}
                    </h3>
                  </div>
                  <div className={`transform transition-transform mt-1 ${openIndex === idx ? 'rotate-180' : ''}`}>
                    <ChevronRight className="w-5 h-5 rotate-90 text-gray-700 dark:text-gray-200" />
                  </div>
                </div>
                {openIndex === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="mt-4 text-gray-800 dark:text-gray-200 font-medium leading-relaxed text-sm md:text-base border-t border-black/10 dark:border-white/10 pt-3">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 font-bold mb-4 uppercase tracking-widest text-xs">Still have questions?</p>
          <button 
            onClick={() => {
              const el = document.getElementById('squad');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="neo-btn bg-lotus-dark text-white w-full sm:w-auto px-8 py-4 uppercase text-sm shadow-xl hover:-translate-y-1 transition-transform cursor-pointer"
          >
            Ask the Tribe
          </button>
        </div>
      </div>
    </section>
  );
};

const FeatureUnleash = () => {
  return (
    <section className="bg-[#C10202] text-white py-24 md:py-32 relative overflow-visible" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative order-2 md:order-1 h-[400px] md:h-[500px]">
             <img src="/lotus-guy.png" className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 md:translate-x-0 md:-left-10 lg:-left-20 w-[120%] max-w-[600px] md:max-w-[700px] lg:max-w-[1000px] object-contain drop-shadow-2xl z-20 pointer-events-none" alt="Lotus Guy" />
          </div>
          <div className="space-y-6 order-1 md:order-2 relative z-30">
            <h2 className="text-5xl md:text-7xl font-display font-extrabold uppercase leading-[0.9] tracking-tighter">
              Unleash Your <br/>Inner Investor – <br/>the Halal way
            </h2>
            <p className="text-xl font-medium text-white/90 dark:text-gray-200 leading-relaxed">
               Create Wealth and improve your financial intelligence with LOTUS Tribe the digital first investment App powered by LOTUS Capital.
            </p>
            <p className="text-lg text-white/80 dark:text-gray-300 leading-relaxed">
               At LOTUS Tribe, we believe in the digital first approach towards creating wealth. We have therefore created this fun, flexible and secure platform for your investing activities. Our team of experts are also like the "financial bodyguards" ensuring that your investments are managed responsibly and ethically.
            </p>
            <div className="pt-6">
               <button className="bg-white dark:bg-gray-900 text-[#C10202] font-bold uppercase px-8 py-4 rounded-xl text-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-1 active:translate-x-1">
                 Join the Tribe | Invest Right
               </button>
               <p className="mt-4 font-display font-bold text-sm uppercase opacity-90 tracking-widest">
                 powered by Lotus Capital
               </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HomePage = () => {
   return (
      <div className="overflow-x-hidden">
        <Hero />
        <FeatureUnleash />
        <FeatureBenefits />
        <div className="bg-[#fafafa] dark:bg-[#111]">
          <FeatureProducts />
          <div className="pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-10 relative z-20">
            <Calculator />
          </div>
        </div>
        <FeatureMoreThanAnApp />
        <FeatureLearnEarn />
        <FeatureCommunity />
        <FAQSection />
      </div>
   );
};

const LMSWrapper = () => {
   const { user, loading } = useContext(AuthContext);
   return <LMSLayout user={user} loading={loading} loginWithGoogle={loginWithGoogle} />;
};

import { InvestLanding } from './Invest';
import { InvestOnboarding } from './InvestOnboarding';
import { InvestDashboard } from './Dashboard';

export default function App() {
  useEffect(() => {
    // Check initial theme globally
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <AuthProvider>
      <ScrollToTop />
      <div className="min-h-screen bg-white dark:bg-gray-900 font-sans text-lotus-dark dark:text-white selection:bg-genz-pink selection:text-lotus-dark dark:text-white">
        <Navbar />
        <main>
          <Routes>
             <Route path="/" element={<HomePage />} />
             <Route path="/quiz" element={<QuizPage />} />
             <Route path="/invest" element={<InvestLanding />} />
             <Route path="/community" element={<Community />} />
             <Route path="/invest/onboarding" element={<InvestOnboarding />} />
             <Route path="/dashboard" element={<InvestDashboard />} />
             <Route path="/invest/fif" element={<InvestFIF />} />
             <Route path="/invest/halal" element={<InvestHalal />} />
             
             <Route path="/admin" element={<AdminDashboard />} />
             
             {/* LMS Routes */}
             <Route path="/learn" element={<LMSWrapper />}>
                <Route index element={<LMSDashboard />} />
                <Route path="courses" element={<LMSCourses />} />
                <Route path="lessons" element={<LMSCoursePlayer />} />
                <Route path="courses/:courseId" element={<LMSCoursePlayer />} />
                <Route path="achievements" element={<LMSAchievements />} />
                <Route path="admin" element={<AdminDashboard />} />
             </Route>
          </Routes>
        </main>
        <Footer />
        <PWAInstallBanner />
        <OfflineIndicator />
        
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
