import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate, Outlet, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  MessageCircle, 
  Trophy, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  PlayCircle, 
  Check, 
  Bookmark, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  LayoutDashboard, 
  Users, 
  Award, 
  Lock, 
  Star, 
  Share2, 
  ShieldAlert,
  Search,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { auth, loginWithGoogle, db, collection, query, getDocs, orderBy } from './lib/firebase';
import { coursesData, Course, Lesson, QuizQuestion } from './data/courses';
import { completeLesson, completeCourse } from './lib/userService';
import { AuthContext } from './App';

const defaultModules = [
  { id: 'MODULE 0', title: 'THE WAKE UP', order: 0 },
  { id: 'MODULE 1', title: 'THE ARSENAL', order: 1 },
  { id: 'MODULE 2', title: 'THE STRATEGY', order: 2 },
  { id: 'MODULE 3', title: 'ADVANCED MOVES', order: 3 },
  { id: 'MODULE 4', title: 'THE LOTUS TRIBE SPECIAL', order: 4 }
];

export const useLMSData = () => {
  const [courses, setCourses] = useState<Course[]>(coursesData);
  const [modules, setModules] = useState<any[]>(defaultModules);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const cq = query(collection(db, 'courses'), orderBy('id'));
        const mq = query(collection(db, 'modules'), orderBy('order', 'asc'));
        
        const [cSnap, mSnap] = await Promise.all([getDocs(cq), getDocs(mq)]);
        
        if (isMounted) {
          if (!cSnap.empty) {
            setCourses(cSnap.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() } as unknown as Course)));
          }
          if (!mSnap.empty) {
            setModules(mSnap.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() })));
          }
        }
      } catch (err) {
        console.error("Error fetching LMS data from DB", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  return { courses, modules, loading };
};

export const LMSLayout = ({ user, loading, loginWithGoogle }: any) => {
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center font-display font-bold text-2xl animate-pulse text-[#C10202] uppercase">
        Loading Tribe Knowledge...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-genz-purple/10 px-4 font-sans">
        <div className="bg-white dark:bg-gray-900 p-10 md:p-14 rounded-[3rem] neo-border neo-shadow text-center max-w-md w-full">
          <div className="text-7xl mb-8">🎓</div>
          <h2 className="font-display font-extrabold text-4xl mb-6 uppercase tracking-tight text-lotus-dark dark:text-white">
            Join the Tribe
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-10 leading-relaxed text-lg">
            Access the learning hub, collect XP, unlock badges, and join a community of next-gen ethical investors.
          </p>
          <button 
            onClick={loginWithGoogle} 
            className="neo-btn bg-lotus-dark text-white w-full uppercase text-xl py-5 flex items-center justify-center gap-3 cursor-pointer"
          >
            Get Free Access <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  const adminEmails = ['ibrahimdurosimi@gmail.com'];
  const isAdmin = user && adminEmails.includes(user.email || '');

  const navItems = [
    { name: 'Dashboard', path: '/learn', icon: <LayoutDashboard className="w-5 h-5"/> },
    { name: 'Courses', path: '/learn/courses', icon: <BookOpen className="w-5 h-5"/> },
    { name: 'Achievements', path: '/learn/achievements', icon: <Award className="w-5 h-5"/> }
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin', path: '/learn/admin', icon: <ShieldAlert className="w-5 h-5 text-lotus-red"/> });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-lotus-dark dark:text-white mt-20 pb-20 md:pb-12">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 p-4 pointer-events-none">
        <div className="max-w-7xl mx-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-md neo-border neo-shadow rounded-2xl md:rounded-3xl pointer-events-auto flex justify-between items-center px-4 md:px-6 py-3 md:py-4 shadow-xl">
           <Link to="/" className="font-display font-black text-xl md:text-2xl uppercase italic tracking-tighter text-[#C10202] hover:scale-105 transition-transform flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-[#C10202] text-white flex items-center justify-center font-bold text-xs not-italic">LT</div>
             <span className="hidden sm:inline">LOTUS</span> LEARN
           </Link>

           {/* Desktop Nav Items */}
           <div className="hidden md:flex items-center gap-2">
             {navItems.map(item => {
               const isActive = location.pathname === item.path || (item.path !== '/learn' && location.pathname.startsWith(item.path));
               return (
                 <Link 
                   key={item.name} 
                   to={item.path}
                   className={`flex items-center gap-2 font-display font-semibold uppercase text-xs px-5 py-2.5 rounded-full transition-all ${
                     isActive 
                       ? 'bg-lotus-dark text-white shadow-md' 
                       : 'bg-transparent text-gray-600 dark:text-gray-300 hover:text-lotus-dark dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                   }`}
                 >
                   {item.icon} {item.name}
                 </Link>
               );
             })}
           </div>
           
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-genz-lime/70 dark:bg-genz-lime/30 border border-black/10 dark:border-white/10 px-3 py-1 md:py-1.5 rounded-full text-xs font-bold uppercase text-gray-900 dark:text-white">
                 🔥 <span className="hidden sm:inline">Streak:</span> 7 Days
              </div>
              <Link to="/dashboard" className="transition-transform hover:scale-110">
                <img 
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || 'User')}`} 
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-[#C10202] shadow-sm object-cover" 
                  alt="Avatar"
                />
              </Link>
           </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t-2 border-black dark:border-gray-800 px-4 py-2 flex justify-around items-center">
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (item.path !== '/learn' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-[#C10202] font-black' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export const LMSDashboard = () => {
  const { user, userProfile } = useContext(AuthContext);
  const { courses } = useLMSData();
  const firstName = user?.displayName ? user.displayName.split(' ')[0] : 'Explorer';
  const xp = userProfile?.xp || 0;
  const level = userProfile?.level || 1;
  const nextLevelXp = level * 1000;
  const xpPercentage = Math.min(100, Math.round((xp / nextLevelXp) * 100));

  const completedCourseIds = userProfile?.completedCourses || [];
  
  // Find the current active course (first incomplete course, or the first course)
  const currentResumeCourse = courses.find(c => !completedCourseIds.includes(c.id)) || courses[0] || coursesData[0];

  return (
    <div className="flex flex-col gap-10 md:gap-12">
      {/* Welcome & XP Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-block px-4 py-1.5 rounded-full bg-genz-lime text-lotus-dark dark:text-white font-display font-bold text-xs tracking-wider uppercase mb-4 shadow-sm neo-border">
            Level {level} Investor
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-7xl text-lotus-dark dark:text-white mb-3 uppercase tracking-tighter leading-[0.95]">
            Wassup, <br/>{firstName}.
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg md:text-xl max-w-md leading-relaxed">
            Ready to secure the bag? Let's level up your financial glow up.
          </p>
        </motion.div>
        
        <div className="w-full md:w-80 bg-white dark:bg-gray-900 neo-border p-6 rounded-[2.5rem] shrink-0 shadow-lg border border-gray-100 dark:border-gray-800">
           <div className="flex justify-between items-center text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-widest">
              <span>Next Level Goal</span>
              <span className="text-[#C10202] font-black">{xp} / {nextLevelXp} XP</span>
           </div>
           <div className="w-full bg-gray-100 dark:bg-gray-800 h-4 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-[#C10202] h-full"
              />
           </div>
        </div>
      </div>

      {/* Hero Lesson Card */}
      {currentResumeCourse && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-genz-purple rounded-[2.5rem] md:rounded-[3.5rem] neo-border neo-shadow flex flex-col md:flex-row overflow-hidden group shadow-2xl"
        >
           <div className="p-8 md:p-14 flex-1 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold font-display uppercase border border-white/20 mb-6 w-fit shadow-sm">
                 <PlayCircle className="w-4 h-4 text-lotus-dark dark:text-white" /> Continue Learning
              </div>
              <h2 className="font-display font-bold text-3xl md:text-5xl mb-4 text-lotus-dark dark:text-white tracking-tighter uppercase leading-[0.95]">
                {currentResumeCourse.title}
              </h2>
              <p className="text-lotus-dark/80 dark:text-gray-200 font-medium mb-8 max-w-md text-base md:text-lg leading-relaxed">
                {currentResumeCourse.lessons[0]?.title || 'Master ethical wealth creation with the tribe.'}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-auto">
                 <Link 
                   to={`/learn/courses/${currentResumeCourse.id}`} 
                   className="neo-btn bg-lotus-dark text-white px-8 py-4 uppercase flex items-center justify-center gap-3 text-base md:text-lg font-bold shadow-xl"
                 >
                   Resume Course <ArrowRight className="w-5 h-5"/>
                 </Link>
                 <span className="text-xs font-bold uppercase tracking-wider text-lotus-dark/70 dark:text-white/70">
                   +{currentResumeCourse.xp} XP on completion
                 </span>
              </div>
           </div>
           <div className="hidden md:flex w-5/12 p-8 items-center justify-center bg-white/20 backdrop-blur-sm border-l border-white/10 relative overflow-hidden">
             <div className="text-[10rem] group-hover:rotate-12 group-hover:scale-110 transition-transform duration-700 select-none drop-shadow-2xl">
               {currentResumeCourse.badgeIcon || '🌱'}
             </div>
             <div className="absolute top-0 right-0 p-8 opacity-20"><Star size={40} className="animate-pulse" /></div>
           </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
         {/* Recommended Courses */}
         <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
               <h3 className="font-display font-extrabold text-2xl md:text-3xl uppercase text-lotus-dark dark:text-white">
                 Up Next in Courses
               </h3>
               <Link to="/learn/courses" className="text-xs md:text-sm font-bold uppercase text-[#C10202] hover:underline flex items-center gap-1">
                 View all <ChevronRight className="w-4 h-4" />
               </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
               {courses.slice(0, 4).map((course) => {
                 const isCompleted = completedCourseIds.includes(course.id);
                 return (
                   <Link 
                     to={`/learn/courses/${course.id}`} 
                     key={course.id} 
                     className="bg-white dark:bg-gray-900 rounded-[2rem] neo-border neo-shadow-sm p-6 flex flex-col justify-between hover:-translate-y-2 transition-transform cursor-pointer h-full border border-gray-100 dark:border-gray-800"
                   >
                      <div className="flex justify-between items-start mb-6">
                         <div className={`w-14 h-14 rounded-2xl neo-border ${course.color} flex items-center justify-center text-3xl shadow-inner`}>
                           {course.badgeIcon}
                         </div>
                         {isCompleted ? (
                           <span className="bg-emerald-500 text-white px-3 py-1 text-[10px] font-bold uppercase rounded-full flex items-center gap-1">
                             <Check size={12} /> Done
                           </span>
                         ) : (
                           <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 text-[10px] font-bold uppercase rounded-full text-gray-500 dark:text-gray-400">
                             {course.level}
                           </span>
                         )}
                      </div>
                      <div>
                        <p className="font-bold text-[10px] text-gray-400 tracking-widest uppercase mb-2">{course.module}</p>
                        <h4 className="font-display font-bold text-xl text-lotus-dark dark:text-white mb-6 uppercase leading-tight line-clamp-2">{course.title}</h4>
                      </div>
                      <div className="flex justify-between items-center mt-auto pt-4 border-t border-dashed border-gray-100 dark:border-gray-800">
                        <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-[#C10202]"/> {course.lessons.length} Lessons
                        </span>
                        <span className="text-xs font-bold text-[#C10202] uppercase">+{course.xp} XP</span>
                      </div>
                   </Link>
                 );
               })}
            </div>
         </div>

         {/* Sidebar Stats */}
         <div className="space-y-8">
            <div className="bg-lotus-dark rounded-[2.5rem] neo-border neo-shadow p-8 text-white relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
               <div className="text-xs font-display font-bold uppercase tracking-[0.2em] text-genz-lime mb-6 flex items-center gap-2">
                 <Trophy className="w-4 h-4"/> Tribe Stats
               </div>
               <div className="flex justify-between items-end mb-8 pb-8 border-b border-white/10">
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Total XP Earned</div>
                    <div className="text-5xl font-display font-black text-white tracking-tighter">{xp}</div>
                  </div>
                  <div className="text-4xl hover:scale-125 transition-transform select-none">⚡</div>
               </div>
               <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-widest">Streak</div>
                    <div className="text-xl font-display font-bold text-white flex items-center gap-1.5">7 Days 🔥</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-widest">Courses Completed</div>
                    <div className="text-xl font-display font-bold text-white">
                      {completedCourseIds.length} / {courses.length}
                    </div>
                  </div>
               </div>
            </div>

            <div className="bg-genz-pink rounded-[2rem] neo-border neo-shadow p-6 text-lotus-dark">
                <h4 className="font-display font-bold text-base uppercase mb-2">Did You Know?</h4>
                <p className="text-xs font-medium leading-relaxed opacity-90">
                  Ethical and Halal portfolios systematically avoid high debt and volatile predatory lending, protecting capital over market cycles.
                </p>
            </div>

            {/* Badges Preview */}
            <div>
               <div className="flex justify-between items-center mb-4 border-b-2 border-black dark:border-gray-700 pb-3">
                  <h3 className="font-display font-extrabold text-xl uppercase">Badges Unlocked</h3>
                  <Link to="/learn/achievements" className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase hover:underline">
                    See all
                  </Link>
               </div>
               <div className="grid grid-cols-3 gap-3">
                  {courses.slice(0, 3).map((c) => {
                    const isUnlocked = completedCourseIds.includes(c.id);
                    return (
                      <div 
                        key={c.id} 
                        className={`rounded-2xl neo-border p-3 flex flex-col items-center justify-center text-center aspect-square transition-transform ${
                          isUnlocked 
                            ? 'bg-white dark:bg-gray-800 hover:scale-105 shadow-sm' 
                            : 'bg-gray-100 dark:bg-gray-800/50 opacity-50 grayscale border-dashed'
                        }`}
                      >
                         <div className="text-3xl mb-1">{c.badgeIcon}</div>
                         <div className="text-[10px] font-bold uppercase leading-tight font-display tracking-tight truncate w-full">
                           {c.badgeName}
                         </div>
                      </div>
                    );
                  })}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export const LMSCourses = () => {
  const { courses, modules, loading } = useLMSData();
  const { userProfile } = useContext(AuthContext);
  const [activeLevel, setActiveLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const completedCourseIds = userProfile?.completedCourses || [];
  const completedLessons = userProfile?.completedLessons || [];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const moduleSummaries: Record<string, string> = {
    "MODULE 0": "The foundation. We unlearn the lies about money and align your wealth with ethical and halal principles. It's time for the wake-up call.",
    "MODULE 1": "Building your toolkit. Understand stocks, ETFs, Sukuk, and the reality of modern markets. Everything you need to start your real investment journey.",
    "MODULE 2": "Playing the long game. Mastering compound growth, risk management, and the core Lotus philosophy of impact-first investing.",
    "MODULE 3": "Levelling up. From real estate and asset-backed leasing to navigating inflation and taxes like a pro.",
    "MODULE 4": "The final stage. Claim your investor identity and learn how to lead and grow within the Lotus Tribe community."
  };

  const filteredCourses = courses.filter((c) => {
    const matchesLevel = activeLevel === 'All' || c.level.toLowerCase() === activeLevel.toLowerCase();
    const matchesSearch = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lessons.some(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto">
       {/* Hero Banner */}
       <div className="mb-14 bg-white dark:bg-gray-900 p-8 md:p-16 rounded-[3rem] neo-border neo-shadow relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-genz-lime/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
         <div className="relative z-10">
            <div className="inline-block px-4 py-1.5 rounded-full bg-genz-lime text-lotus-dark dark:text-white font-display font-bold text-xs tracking-wider uppercase mb-6 shadow-sm neo-border">
                The Learning Hub
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl md:text-8xl text-lotus-dark dark:text-white leading-[0.9] uppercase tracking-tighter max-w-4xl mb-6">
              Welcome to the <br/><span className="text-[#C10202]">Knowledge Tribe.</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg md:text-xl max-w-3xl leading-relaxed mb-8">
              Wealth isn't just about what's in your bank; it's about what you know. Master the money game from mindset to mastery, test your knowledge with interactive quizzes, and collect XP & badges.
            </p>

            {/* Level Filters & Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-wrap gap-2">
                {levels.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setActiveLevel(lvl)}
                    className={`px-4 py-2 rounded-xl font-bold uppercase text-xs transition-all cursor-pointer neo-border ${
                      activeLevel === lvl 
                        ? 'bg-genz-lime text-black shadow-[2px_2px_0_0_#000]' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              <div className="relative max-w-md w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses, lessons, or topics..."
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-black dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#C10202] text-gray-900 dark:text-white"
                />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
         </div>
       </div>

       {/* Course Modules Grid */}
       <div className="space-y-16 md:space-y-20">
          {loading ? (
             <div className="p-20 text-center font-display font-bold text-2xl animate-pulse text-gray-400 uppercase">
               Synchronizing knowledge...
             </div>
          ) : filteredCourses.length === 0 ? (
            <div className="p-16 text-center bg-white dark:bg-gray-900 neo-border rounded-[3rem] p-8">
              <p className="font-bold text-lg text-gray-600 dark:text-gray-300 mb-2">No courses match your search.</p>
              <button 
                type="button"
                onClick={() => { setSearchQuery(''); setActiveLevel('All'); }}
                className="mt-4 px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase neo-border"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            modules.map((mod) => {
               const moduleName = `${mod.id}: ${mod.title}`;
               const modCourses = filteredCourses.filter(c => c.module === moduleName || c.module.startsWith(mod.id));
               if (modCourses.length === 0) return null;
               
               const summary = moduleSummaries[mod.id] || "";

               return (
                 <div key={mod.firestoreId || mod.id}>
                    <div className="mb-8">
                       <div className="flex items-center gap-4 mb-2">
                          <h2 className="font-display font-extrabold text-2xl md:text-4xl uppercase text-lotus-dark dark:text-white tracking-tight">
                            {moduleName}
                          </h2>
                          <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1" />
                       </div>
                       {summary && (
                         <p className="text-gray-500 dark:text-gray-400 font-medium text-sm md:text-base max-w-3xl leading-relaxed">
                            {summary}
                         </p>
                       )}
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                       {modCourses.map((course) => {
                          const isCompleted = completedCourseIds.includes(course.id);
                          const hasStarted = course.lessons.some((_, i) => completedLessons.includes(`${course.id}_lesson_${i}`));

                          return (
                            <Link to={`/learn/courses/${course.id}`} key={course.id} className="group">
                               <div className="bg-white dark:bg-gray-900 rounded-[2rem] neo-border hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full flex flex-col overflow-hidden neo-shadow border-gray-100 dark:border-gray-800 shadow-lg group-hover:shadow-2xl">
                                   <div className={`w-full h-36 ${course.color} border-b border-black/10 flex items-center justify-center text-6xl shadow-inner relative overflow-hidden`}>
                                      <motion.span whileHover={{ scale: 1.15, rotate: 10 }} className="relative z-10 drop-shadow-md">
                                        {course.badgeIcon}
                                      </motion.span>
                                      {isCompleted && (
                                        <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase shadow flex items-center gap-1">
                                          <Check size={12} /> Done
                                        </div>
                                      )}
                                   </div>
                                    <div className="p-6 flex flex-col flex-1 bg-white dark:bg-gray-900">
                                       <div className="flex justify-between items-start mb-4">
                                          <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] font-bold uppercase px-3 py-0.5 rounded-full">
                                            {course.level}
                                          </span>
                                          <span className="text-xs font-bold text-[#C10202] uppercase tracking-wider">
                                            +{course.xp} XP
                                          </span>
                                       </div>
                                       <h3 className="font-display font-bold text-xl text-lotus-dark dark:text-white mb-4 uppercase leading-snug group-hover:text-[#C10202] transition-colors line-clamp-2">
                                         {course.title}
                                       </h3>
                                       <div className="mt-auto pt-4 border-t border-dashed border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                          <span className="flex items-center gap-1.5">
                                            <BookOpen size={14} /> {course.lessons?.length || 0} lessons
                                          </span>
                                          {isCompleted ? (
                                            <span className="text-emerald-500 font-bold flex items-center gap-1">
                                              <CheckCircle size={14} /> Completed
                                            </span>
                                          ) : hasStarted ? (
                                            <span className="text-amber-500 font-bold">In Progress</span>
                                          ) : (
                                            <span className="text-gray-400">Start &rarr;</span>
                                          )}
                                       </div>
                                    </div>
                               </div>
                            </Link>
                          );
                       })}
                    </div>
                 </div>
               );
            })
          )}
       </div>
    </div>
  );
};

export const LMSCoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, userProfile, refreshProfile } = useContext(AuthContext);
  const { courses } = useLMSData();
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  
  // Interactive Quiz state
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  const course = courses.find(c => c.id === courseId) || coursesData.find(c => c.id === courseId) || coursesData[0];
  const lesson = course.lessons[activeLessonIdx] || course.lessons[0];

  const completedLessons = userProfile?.completedLessons || [];
  const completedCourses = userProfile?.completedCourses || [];
  const isCourseAlreadyCompleted = completedCourses.includes(course.id);

  const isCurrentLessonDone = completedLessons.includes(`${course.id}_lesson_${activeLessonIdx}`);

  // Mark current lesson complete and advance
  const goNext = async () => {
     if (user && !isCompleting) {
        setIsCompleting(true);
        try {
           const xpPerLesson = Math.round(course.xp / course.lessons.length);
           await completeLesson(user.uid, course.id, activeLessonIdx, xpPerLesson, isCurrentLessonDone);
           refreshProfile();
        } catch (e) {
           console.error("Error marking lesson complete:", e);
        } finally {
           setIsCompleting(false);
        }
     }
     if (activeLessonIdx < course.lessons.length - 1) {
        setActiveLessonIdx(activeLessonIdx + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
     } else if (course.quiz && course.quiz.length > 0) {
        // Move to interactive quiz upon finishing last lesson!
        setShowQuiz(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
     } else {
        handleFinalizeCourse();
     }
  };

  // Finalize course and unlock badge
  const handleFinalizeCourse = async () => {
     if (user && !isCompleting) {
        setIsCompleting(true);
        try {
           const xpPerLesson = Math.round(course.xp / course.lessons.length);
           await completeLesson(user.uid, course.id, activeLessonIdx, xpPerLesson, isCurrentLessonDone);
           await completeCourse(user.uid, course.id, course.badgeName, 50, isCourseAlreadyCompleted);
           refreshProfile();
           setShowCompletionModal(true);
        } catch(e) {
           console.error("Error finalizing course:", e);
        } finally {
           setIsCompleting(false);
        }
     } else {
        setShowCompletionModal(true);
     }
  };

  const handleSelectQuizAnswer = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateQuizScore = () => {
    if (!course.quiz) return { correct: 0, total: 0 };
    let correct = 0;
    course.quiz.forEach((q, qIdx) => {
      const selected = selectedAnswers[qIdx];
      if (selected !== undefined && q.options[selected]?.isCorrect) {
        correct++;
      }
    });
    return { correct, total: course.quiz.length };
  };

  const handleQuizSubmit = async () => {
    setQuizSubmitted(true);
    await handleFinalizeCourse();
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col lg:px-4">
      {/* Top Header */}
      <div className="mb-8 flex justify-between items-center">
        <button 
          type="button"
          onClick={() => navigate('/learn/courses')} 
          className="group inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase text-gray-500 dark:text-gray-400 hover:text-lotus-dark dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Courses
        </button>
        <div className="bg-white dark:bg-gray-800 neo-border px-4 py-1.5 rounded-full font-bold text-xs uppercase shadow-sm flex items-center gap-2">
           <span>Progress:</span>
           <span className="text-[#C10202] font-black">
             {showQuiz ? '100%' : `${Math.round(((activeLessonIdx + 1) / course.lessons.length) * 100)}%`}
           </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 items-start mt-2">
         {/* Main Content Area: Lesson Viewer or Quiz Mode */}
         <div className="order-2 lg:order-1 pt-2">
            {!showQuiz ? (
              /* LESSON VIEW */
              <>
                <div className="flex items-center gap-4 mb-8">
                   <div className={`${course.color} w-16 h-16 rounded-2xl neo-border flex items-center justify-center text-3xl shadow-inner shrink-0`}>
                     {course.badgeIcon}
                   </div>
                   <div>
                      <p className="font-bold text-[10px] text-gray-400 tracking-[0.2em] uppercase mb-1">
                        {course.title} &bull; Lesson {activeLessonIdx + 1} of {course.lessons.length}
                      </p>
                      <h1 className="font-display font-extrabold text-3xl md:text-4xl leading-tight text-lotus-dark dark:text-white uppercase tracking-tight">
                        {lesson.title}
                      </h1>
                   </div>
                </div>

                <div className="space-y-8">
                   {lesson.videoUrl && (
                      <div className="aspect-video w-full rounded-[2rem] overflow-hidden neo-border bg-black shadow-lg">
                         <iframe 
                            className="w-full h-full"
                            src={lesson.videoUrl.replace('watch?v=', 'embed/')} 
                            title="Lesson Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                         />
                      </div>
                   )}

                   {lesson.imageUrl && (
                      <div className="w-full rounded-[2rem] overflow-hidden neo-border">
                         <img src={lesson.imageUrl} className="w-full object-cover" alt="Lesson Visual" />
                      </div>
                   )}

                   {/* Styled Lesson Content */}
                   <div className="neo-border bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-14 mb-8 border border-gray-100 dark:border-gray-800 shadow-xl text-gray-900 dark:text-gray-100 leading-relaxed text-base md:text-lg">
                      <div 
                        className="markdown-body space-y-4"
                        dangerouslySetInnerHTML={{ __html: lesson.content }} 
                      />
                   </div>
                </div>

                {/* Bottom Navigation Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-16">
                   <button 
                     type="button"
                     onClick={() => {
                        if (activeLessonIdx > 0) {
                          setActiveLessonIdx(activeLessonIdx - 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                     }} 
                     disabled={activeLessonIdx === 0} 
                     className="px-6 py-3.5 border-2 border-black dark:border-gray-700 rounded-xl font-bold uppercase text-xs text-gray-600 dark:text-gray-300 disabled:opacity-30 transition-all flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
                   >
                      <ArrowLeft className="w-4 h-4" /> Previous Lesson
                   </button>
                   
                   {activeLessonIdx < course.lessons.length - 1 ? (
                     <button 
                       type="button"
                       onClick={goNext} 
                       disabled={isCompleting} 
                       className="neo-btn bg-lotus-dark text-white px-8 py-3.5 rounded-xl uppercase text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 w-full sm:w-auto shadow-xl cursor-pointer"
                     >
                        Next Lesson <ArrowRight className="w-4 h-4" />
                     </button>
                   ) : course.quiz && course.quiz.length > 0 ? (
                     <button 
                       type="button"
                       onClick={() => {
                         setShowQuiz(true);
                         window.scrollTo({ top: 0, behavior: 'smooth' });
                       }} 
                       disabled={isCompleting} 
                       className="neo-btn bg-[#C10202] text-white px-8 py-3.5 rounded-xl uppercase text-xs font-bold flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                     >
                        Take Knowledge Quiz <Trophy className="w-4 h-4" />
                     </button>
                   ) : (
                     <button 
                       type="button"
                       onClick={handleFinalizeCourse} 
                       disabled={isCompleting} 
                       className="neo-btn bg-emerald-600 text-white px-8 py-3.5 rounded-xl uppercase text-xs font-bold flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                     >
                        Complete Course <Check className="w-4 h-4" />
                     </button>
                   )}
                </div>
              </>
            ) : (
              /* INTERACTIVE QUIZ MODE */
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-12 neo-border shadow-xl">
                   <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#C10202]">
                          Interactive Quiz
                        </span>
                        <h2 className="font-display font-extrabold text-2xl md:text-4xl uppercase text-lotus-dark dark:text-white mt-1">
                          Test Your Knowledge
                        </h2>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Pass the quiz to unlock the {course.badgeName} badge and collect your XP bonus!
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowQuiz(false)}
                        className="text-xs font-bold text-gray-400 hover:text-white px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        Review Lessons
                      </button>
                   </div>

                   <div className="space-y-8">
                     {course.quiz?.map((q, qIdx) => {
                       const selectedOpt = selectedAnswers[qIdx];
                       return (
                         <div key={q.question} className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border-2 border-black/10 dark:border-white/10">
                           <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 mb-2">
                             Question {qIdx + 1} of {course.quiz.length}
                           </div>
                           <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white mb-4">
                             {q.question}
                           </h3>
                           <div className="space-y-2.5">
                             {q.options.map((opt, optIdx) => {
                               const isSelected = selectedOpt === optIdx;
                               let btnClasses = "w-full text-left p-3.5 rounded-xl border-2 font-medium text-xs md:text-sm transition-all cursor-pointer flex items-center justify-between ";
                               
                               if (quizSubmitted) {
                                 if (opt.isCorrect) {
                                   btnClasses += "bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold";
                                 } else if (isSelected && !opt.isCorrect) {
                                   btnClasses += "bg-red-100 dark:bg-red-950/60 border-red-500 text-red-800 dark:text-red-300";
                                 } else {
                                   btnClasses += "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-60";
                                 }
                               } else {
                                 if (isSelected) {
                                   btnClasses += "bg-genz-lime text-black border-black shadow-[2px_2px_0_0_#000] font-bold";
                                 } else {
                                   btnClasses += "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white text-gray-800 dark:text-gray-200";
                                 }
                               }

                               return (
                                 <button
                                   key={opt.text}
                                   type="button"
                                   onClick={() => handleSelectQuizAnswer(qIdx, optIdx)}
                                   className={btnClasses}
                                 >
                                   <span>{opt.text}</span>
                                   {quizSubmitted && opt.isCorrect && (
                                     <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                                   )}
                                 </button>
                                );
                             })}
                           </div>
                         </div>
                       );
                     })}
                   </div>

                   {/* Quiz Submit Bar */}
                   <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                     {!quizSubmitted ? (
                       <button
                         type="button"
                         onClick={handleQuizSubmit}
                         disabled={Object.keys(selectedAnswers).length < (course.quiz?.length || 0)}
                         className="w-full sm:w-auto neo-btn bg-[#C10202] text-white px-8 py-3.5 rounded-xl uppercase text-xs font-bold disabled:opacity-40 cursor-pointer shadow-xl"
                       >
                         Submit Quiz & Unlock Badge
                       </button>
                     ) : (
                       <div className="flex items-center justify-between w-full">
                         <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
                           Score: {calculateQuizScore().correct} / {calculateQuizScore().total} Correct!
                         </div>
                         <button
                           type="button"
                           onClick={() => setShowCompletionModal(true)}
                           className="neo-btn bg-emerald-600 text-white px-6 py-2.5 rounded-xl uppercase text-xs font-bold shadow"
                         >
                           View Badge Unlocked &rarr;
                         </button>
                       </div>
                     )}
                   </div>
                </div>
              </div>
            )}
         </div>

         {/* Right Sidebar: Syllabus & Course Info */}
         <div className="order-1 lg:order-2 w-full lg:sticky lg:top-28 space-y-6">
            <div className="bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-700 rounded-3xl overflow-hidden neo-shadow-sm">
               <div className="p-5 bg-gray-50 dark:bg-gray-800 border-b-2 border-black dark:border-gray-700 font-display font-extrabold uppercase text-lg text-black dark:text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-[#C10202]" /> Syllabus
                  </div>
                  <span className="text-xs font-bold text-gray-500">
                    {course.lessons.length} Lessons
                  </span>
               </div>
               
               <div className="p-3 space-y-2">
                  {course.lessons.map((l: Lesson, idx: number) => {
                    const isDone = completedLessons.includes(`${course.id}_lesson_${idx}`);
                    const isCurrent = !showQuiz && idx === activeLessonIdx;
                    return (
                      <button 
                        key={l.id} 
                        type="button"
                        onClick={() => {
                          setShowQuiz(false);
                          setActiveLessonIdx(idx);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} 
                        className={`w-full text-left p-3.5 rounded-xl transition-all border-2 relative cursor-pointer ${
                          isCurrent 
                            ? 'bg-genz-pink text-black border-black shadow-[2px_2px_0_0_#121212] -translate-y-0.5' 
                            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
                        }`}
                      >
                         <p className={`font-bold text-xs md:text-sm line-clamp-1 ${isCurrent ? 'text-black font-black' : 'text-gray-800 dark:text-gray-200'}`}>
                           {idx + 1}. {l.title}
                         </p>
                         <div className="text-[10px] font-bold uppercase mt-1.5 opacity-75 flex items-center gap-1.5">
                            {isDone ? (
                              <span className="text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3"/> Done
                              </span>
                            ) : (
                              <span className="text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3"/> {l.readTime || '3 min'}
                              </span>
                            )}
                         </div>
                      </button>
                    );
                  })}

                  {/* Syllabus Quiz item */}
                  {course.quiz && course.quiz.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowQuiz(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-full text-left p-3.5 rounded-xl transition-all border-2 relative cursor-pointer ${
                        showQuiz
                          ? 'bg-genz-lime text-black border-black shadow-[2px_2px_0_0_#121212] font-black'
                          : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <p className="font-bold text-xs md:text-sm flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-[#C10202]" /> Quiz: {course.quiz.length} Questions
                      </p>
                      <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">
                        Unlock {course.badgeName} Badge
                      </p>
                    </button>
                  )}
               </div>
            </div>

            {/* Course Rewards summary */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-5 neo-border">
              <div className="flex items-center gap-3">
                 <div className="text-3xl">{course.badgeIcon}</div>
                 <div>
                    <h5 className="font-bold text-xs uppercase text-gray-900 dark:text-white">Badge to Unlock</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{course.badgeName}</p>
                 </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-xs font-bold">
                 <span className="text-gray-500">Reward:</span>
                 <span className="text-[#C10202]">+{course.xp} XP</span>
              </div>
            </div>
         </div>
      </div>

      {/* Course Completion & Badge Unlocked Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-[2.5rem] neo-border p-8 md:p-10 max-w-md w-full text-center relative shadow-2xl"
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-genz-lime flex items-center justify-center text-5xl neo-border shadow-md animate-bounce">
                {course.badgeIcon}
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-widest mb-2">
                Course Complete!
              </div>
              <h3 className="font-display font-black text-3xl uppercase text-lotus-dark dark:text-white mb-2">
                {course.badgeName} Badge Unlocked!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-6">
                You've successfully conquered <span className="font-bold">"{course.title}"</span> and earned <span className="font-bold text-[#C10202]">+{course.xp} XP</span>.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/learn/achievements')}
                  className="neo-btn bg-genz-lime text-black font-bold uppercase text-xs py-3.5 w-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trophy size={16} /> View in Achievements
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/learn/courses')}
                  className="neo-btn bg-lotus-dark text-white font-bold uppercase text-xs py-3.5 w-full cursor-pointer"
                >
                  Explore Next Course &rarr;
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const LMSAchievements = () => {
  const { userProfile } = useContext(AuthContext);
  const { courses } = useLMSData();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  
  const completedIds = userProfile?.completedCourses || [];
  
  const allBadges = courses.map(course => ({
    id: course.id,
    title: course.badgeName,
    icon: course.badgeIcon,
    courseTitle: course.title,
    color: course.color,
    isUnlocked: completedIds.includes(course.id)
  }));

  const unlockedCount = allBadges.filter(b => b.isUnlocked).length;
  const remainingCount = allBadges.length - unlockedCount;
  const progressPercent = allBadges.length > 0 ? Math.round((unlockedCount / allBadges.length) * 100) : 0;

  const filteredBadges = allBadges.filter(b => {
    if (filter === 'unlocked') return b.isUnlocked;
    if (filter === 'locked') return !b.isUnlocked;
    return true;
  });

  const handleShare = (badge: any) => {
    const text = `I just unlocked the ${badge.title} ${badge.icon} badge on Lotus Tribe! Learning to build ethical, halal wealth. Join the tribe! 🚀`;
    const url = window.location.origin;
    
    if (navigator.share) {
      navigator.share({
        title: 'Lotus Tribe Achievement',
        text: text,
        url: url,
      }).catch(err => console.log('Error sharing', err));
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
       <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12 border-b border-gray-200 dark:border-gray-700 pb-10">
          <div className="max-w-2xl">
             <div className="inline-block px-3 py-1 rounded-full bg-genz-lime text-black font-display font-bold text-xs uppercase mb-4 neo-border">
               Trophy Room
             </div>
             <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-lotus-dark dark:text-white leading-none uppercase tracking-tighter mb-4">
               Flex your <span className="bg-genz-lime px-3 pb-1 inline-block -rotate-2 rounded-2xl shadow-sm text-black">medals.</span>
             </h1>
             <p className="text-gray-500 dark:text-gray-400 font-medium text-lg md:text-xl leading-relaxed">
               Every time you complete a course, you earn a badge. Collect them all to achieve the Full Lotus rank in the Tribe.
             </p>
          </div>
          
          <div className="flex gap-6 md:pt-4 bg-white dark:bg-gray-900 neo-border p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-md">
             <div className="text-center">
                 <div className="text-5xl font-display font-black text-lotus-dark dark:text-white mb-1 leading-none">{unlockedCount}</div>
                <div className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Collected</div>
             </div>
             <div className="w-px bg-gray-200 dark:bg-gray-800" />
             <div className="text-center">
                <div className="text-5xl font-display font-black text-gray-300 dark:text-gray-600 mb-1 leading-none">{remainingCount}</div>
                <div className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Remaining</div>
             </div>
          </div>
       </div>

       {/* Progress Bar & Filter Pills */}
       <div className="mb-10 space-y-4">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-500">
             <span>Overall Badge Progress</span>
             <span className="text-[#C10202] font-black">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 h-3 rounded-full overflow-hidden">
             <div className="bg-[#C10202] h-full transition-all duration-700" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="flex gap-2 pt-2">
            {(['all', 'unlocked', 'locked'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer neo-border ${
                  filter === tab 
                    ? 'bg-genz-lime text-black shadow-[2px_2px_0_0_#000]' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}
              >
                {tab === 'all' ? `All (${allBadges.length})` : tab === 'unlocked' ? `Unlocked (${unlockedCount})` : `Locked (${remainingCount})`}
              </button>
            ))}
          </div>
       </div>

       <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBadges.map((badge) => (
             <div 
               key={badge.id} 
               className={`bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 flex flex-col h-full items-center text-center transition-all duration-300 ${
                 badge.isUnlocked 
                   ? 'neo-border hover:-translate-y-2 cursor-pointer shadow-lg' 
                   : 'border-2 border-dashed border-gray-200 dark:border-gray-700 opacity-60 grayscale'
               }`}
             >
                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner relative ${
                  badge.isUnlocked ? badge.color + ' border border-black/10' : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                   {badge.icon}
                   {badge.isUnlocked && (
                     <div className="absolute -bottom-1 -right-1 bg-genz-pink text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase border border-black rotate-12 shadow">
                       Unlocked
                     </div>
                   )}
                </div>
                <h4 className={`font-display font-extrabold uppercase text-xl mb-1 leading-tight ${
                  badge.isUnlocked ? 'text-lotus-dark dark:text-white' : 'text-gray-400'
                }`}>
                  {badge.title}
                </h4>
                <p className={`text-xs font-medium mb-auto leading-relaxed ${
                  badge.isUnlocked ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'
                }`}>
                  {badge.courseTitle}
                </p>
                
                {badge.isUnlocked ? (
                  <button 
                    type="button"
                    onClick={() => handleShare(badge)}
                    className="mt-6 flex items-center gap-1.5 text-xs font-bold uppercase text-[#C10202] hover:underline group cursor-pointer"
                  >
                    <Share2 size={14} className="group-hover:rotate-12 transition-transform" /> Share Badge
                  </button>
                ) : (
                  <Link 
                    to={`/learn/courses/${badge.id}`}
                    className="mt-6 flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-400 hover:text-black dark:hover:text-white cursor-pointer"
                  >
                    <Lock size={12} /> Take Course &rarr;
                  </Link>
                )}
             </div>
          ))}
       </div>
    </div>
  );
};
