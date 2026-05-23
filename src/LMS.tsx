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
  ArrowUp,
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
  ShieldAlert
} from 'lucide-react';
import { auth, loginWithGoogle, db, collection, query, getDocs, orderBy } from './lib/firebase';
import { coursesData } from './data/courses';

const defaultModules = [
  { id: 'MODULE 0', title: 'THE WAKE UP', order: 0 },
  { id: 'MODULE 1', title: 'THE ARSENAL', order: 1 },
  { id: 'MODULE 2', title: 'THE STRATEGY', order: 2 },
  { id: 'MODULE 3', title: 'ADVANCED MOVES', order: 3 },
  { id: 'MODULE 4', title: 'THE LOTUS TRIBE SPECIAL', order: 4 }
];

const useLMSData = () => {
  const [courses, setCourses] = useState<any[]>(coursesData);
  const [modules, setModules] = useState<any[]>(defaultModules);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cq = query(collection(db, 'courses'), orderBy('id'));
        const mq = query(collection(db, 'modules'), orderBy('order', 'asc'));
        
        const [cSnap, mSnap] = await Promise.all([getDocs(cq), getDocs(mq)]);
        
        if (!cSnap.empty) {
          setCourses(cSnap.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() })));
        }
        if (!mSnap.empty) {
          setModules(mSnap.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() })));
        }
      } catch (err) {
        console.error("Error fetching LMS data from DB", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { courses, modules, loading };
};

export const LMSLayout = ({ user, loading, loginWithGoogle }: any) => {
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen pt-32 pb-20 flex items-center justify-center font-display font-bold text-2xl animate-pulse text-lotus-red uppercase">Loading Tribe Data...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-genz-purple/10 px-4 font-sans">
        <div className="bg-white dark:bg-gray-900 p-10 md:p-14 rounded-[3rem] neo-border neo-shadow text-center max-w-md w-full">
          <div className="text-7xl mb-8">🎓</div>
          <h2 className="font-display font-extrabold text-4xl mb-6 uppercase tracking-tight text-lotus-dark dark:text-white">Join the Tribe</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-10 leading-relaxed text-lg">Access the learning hub, collect XP, and join a community of next-gen ethical investors.</p>
          <button onClick={loginWithGoogle} className="neo-btn bg-lotus-dark text-white w-full uppercase text-xl py-5 flex items-center justify-center gap-3">
            Get Infinite Access <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  const adminEmails = ['ibrahimdurosimi@gmail.com'];
  const isAdmin = user && adminEmails.includes(user.email || '');

  const navItems = [
    { name: 'Home', path: '/learn', icon: <LayoutDashboard className="w-5 h-5"/> },
    { name: 'Courses', path: '/learn/courses', icon: <BookOpen className="w-5 h-5"/> },
    { name: 'Achievements', path: '/learn/achievements', icon: <Award className="w-5 h-5"/> }
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin', path: '/learn/admin', icon: <ShieldAlert className="w-5 h-5 text-lotus-red"/> });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 font-sans text-lotus-dark dark:text-white mt-24">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 p-4 pointer-events-none">
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md neo-border neo-shadow rounded-3xl pointer-events-auto flex justify-between items-center px-6 py-4 border border-white/50 shadow-xl">
           <Link to="/" className="font-display font-black text-2xl uppercase italic tracking-tighter text-lotus-red hover:scale-105 transition-transform flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-lotus-red text-white flex items-center justify-center font-bold text-xs not-italic">LT</div>
             LEARN
           </Link>
           <div className="hidden md:flex items-center gap-2">
             {navItems.map(item => {
               const isActive = location.pathname === item.path || (item.path !== '/learn' && location.pathname.startsWith(item.path));
               return (
                 <Link 
                   key={item.name} 
                   to={item.path}
                   className={`flex items-center gap-2 font-display font-semibold uppercase text-xs px-5 py-2.5 rounded-full transition-all ${
                     isActive ? 'bg-lotus-dark text-white shadow-md' : 'bg-transparent text-gray-500 dark:text-gray-400 hover:text-lotus-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                   }`}
                 >
                   {item.icon} {item.name}
                 </Link>
               )
             })}
           </div>
           
           <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-genz-lime/50 border border-lotus-dark/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase">
                 🔥 7-Day 
              </div>
              <Link to="/dashboard" className="transition-transform hover:scale-110">
                <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} className="w-10 h-10 rounded-full border-2 border-lotus-red shadow-sm" alt="Avatar"/>
              </Link>
           </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-4 md:px-6 py-12 pb-32 pt-8">
        <Outlet />
      </main>
    </div>
  );
};

import { AuthContext } from './App';

export const LMSDashboard = () => {
  const { user, userProfile } = useContext(AuthContext);
  const { courses } = useLMSData();
  const firstName = user?.displayName ? user.displayName.split(' ')[0] : 'Explorer';
  const xp = userProfile?.xp || 0;
  const level = userProfile?.level || 1;
  const nextLevelXp = level * 1000;
  const xpPercentage = Math.min(100, Math.round((xp / nextLevelXp) * 100));

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-block px-4 py-1.5 rounded-full bg-genz-lime text-lotus-dark dark:text-white font-display font-bold text-xs tracking-wider uppercase mb-6 shadow-sm">
            Level {level} Investor
          </div>
          <h1 className="font-display font-extrabold text-5xl md:text-7xl text-lotus-dark dark:text-white mb-4 uppercase tracking-tighter leading-[0.95]">Wassup, <br/>{firstName}.</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-xl max-w-md leading-relaxed">Ready to secure the bag? Let's keep that financial glow up going.</p>
        </motion.div>
        
        <div className="w-full md:w-80 bg-white dark:bg-gray-900 neo-border p-6 rounded-[2.5rem] shrink-0 shadow-lg border border-gray-100 dark:border-gray-800">
           <div className="flex justify-between items-center text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-widest">
              <span>Next Level Goal</span>
              <span className="text-lotus-red">{xp} / {nextLevelXp} XP</span>
           </div>
           <div className="w-full bg-gray-100 dark:bg-gray-800 h-4 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-lotus-red h-full"
              ></motion.div>
           </div>
        </div>
      </div>

      {/* Hero Lesson Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="bg-genz-purple rounded-[3.5rem] neo-border neo-shadow flex flex-col md:flex-row overflow-hidden group border-white/50 shadow-2xl"
      >
         <div className="p-10 md:p-16 flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-white/50 dark:bg-black/20 backdrop-blur-sm px-5 py-2 rounded-full text-xs font-bold font-display uppercase border border-white/20 mb-10 w-fit shadow-sm">
               <PlayCircle className="w-4 h-4 text-lotus-dark dark:text-white" /> Continue Learning
            </div>
            <h2 className="font-display font-bold text-4xl md:text-6xl mb-6 text-lotus-dark dark:text-white tracking-tighter uppercase leading-[0.9] group-hover:tracking-tight transition-all duration-500">Your Money <br/> Glow Up</h2>
            <p className="text-lotus-dark/70 font-medium mb-10 max-w-md text-xl leading-relaxed">
              Why 'Rich' is boring. 'Wealthy' is freedom. Learn the 3-Bucket Principle.
            </p>
            <div className="flex flex-wrap items-center gap-6 mt-auto">
               <Link to="/learn/courses/your-money-glow-up" className="neo-btn bg-lotus-dark text-white px-10 py-5 uppercase flex items-center justify-center gap-3 text-lg">
                 Resume Course <ArrowRight className="w-5 h-5"/>
               </Link>
            </div>
         </div>
         <div className="hidden md:flex w-5/12 p-10 items-center justify-center bg-white/20 backdrop-blur-sm border-l border-white/10 relative overflow-hidden">
           <div className="text-[12rem] group-hover:rotate-12 group-hover:scale-110 transition-transform duration-700 select-none drop-shadow-2xl">🌱</div>
           <div className="absolute top-0 right-0 p-8 opacity-20"><Star size={40} className="animate-pulse" /></div>
         </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
         {/* Recommended Courses */}
         <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-10 border-b border-gray-100 dark:border-gray-800 pb-6">
               <h3 className="font-display font-extrabold text-3xl uppercase text-lotus-dark dark:text-white">Up Next</h3>
               <Link to="/learn/courses" className="text-sm font-bold uppercase text-lotus-red hover:underline flex items-center gap-1">
                 View all <ChevronRight className="w-4 h-4" />
               </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
               {courses.slice(1, 4).map((course, idx) => (
                 <Link to={`/learn/courses/${course.id}`} key={course.id} className={`bg-white dark:bg-gray-900 rounded-[2.5rem] neo-border neo-shadow-sm p-8 flex flex-col justify-between hover:-translate-y-2 transition-transform cursor-pointer h-full border border-gray-100 dark:border-gray-800`}>
                    <div className="flex justify-between items-start mb-8">
                       <div className={`w-16 h-16 rounded-[1.25rem] neo-border ${course.color} flex items-center justify-center text-4xl shadow-inner border-lotus-dark/5`}>{course.badgeIcon}</div>
                       <span className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 px-4 py-1 text-[10px] font-bold uppercase rounded-full text-gray-400">Explore</span>
                    </div>
                    <div>
                      <p className="font-bold text-[10px] text-gray-400 tracking-widest uppercase mb-3 px-1">{course.module}</p>
                      <h4 className="font-display font-bold text-2xl text-lotus-dark dark:text-white mb-8 uppercase leading-tight line-clamp-2 px-1">{course.title}</h4>
                    </div>
                    <div className="flex justify-between items-center mt-auto pt-6 border-t border-dashed border-gray-100 dark:border-gray-800">
                      <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 px-1"><BookOpen className="w-4 h-4 text-lotus-red/40"/> {course.lessons.length} Lessons</span>
                      <span className="text-xs font-bold text-lotus-red uppercase">+{course.xp} XP</span>
                    </div>
                 </Link>
               ))}
            </div>
         </div>

         {/* Sidebar Stats */}
         <div className="space-y-10">
            <div className="bg-lotus-dark rounded-[3rem] neo-border neo-shadow p-10 text-white relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
               <div className="text-xs font-display font-bold uppercase tracking-[0.2em] text-genz-lime mb-8 flex items-center gap-3"><Trophy className="w-5 h-5"/> Tribe Stats</div>
               <div className="flex justify-between items-end mb-10 pb-10 border-b border-white/10">
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">Total XP Earned</div>
                    <div className="text-6xl font-display font-black text-white line-clamp-1 tracking-tighter">{xp}</div>
                  </div>
                  <div className="text-5xl hover:scale-125 hover:rotate-12 transition-transform select-none">⚡</div>
               </div>
               <div className="grid grid-cols-2 gap-y-10 gap-x-6">
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase mb-3 tracking-widest">Daily Streak</div>
                    <div className="text-2xl font-display font-bold text-white flex items-center gap-2">1 Day <span className="animate-pulse">🔥</span></div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase mb-3 tracking-widest">Modules Done</div>
                    <div className="text-2xl font-display font-bold text-white">{userProfile?.completedCourses?.length || 0} / 14</div>
                  </div>
               </div>
            </div>

            <div className="bg-genz-pink rounded-[2.5rem] neo-border neo-shadow p-8 border-lotus-dark/5">
                <h4 className="font-display font-bold text-lg uppercase mb-4 text-lotus-dark dark:text-white">Quick Tip</h4>
                <p className="text-lotus-dark/60 text-sm font-medium leading-relaxed">
                  Did you know? Ethical investors outperform the market over 10-year periods by avoiding high-debt volatility.
                </p>
            </div>

            <div>
               <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-4">
                  <h3 className="font-display font-extrabold text-2xl uppercase">Badges</h3>
                  <Link to="/learn/achievements" className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase hover:text-black dark:text-white hover:underline underline-offset-4">See all</Link>
               </div>
               <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] neo-border p-4 flex flex-col items-center justify-center text-center aspect-square shadow-sm hover:scale-105 transition-transform cursor-pointer border-[3px]">
                     <div className="text-3xl mb-2">🌱</div>
                     <div className="text-[10px] font-bold uppercase leading-tight font-display tracking-tight">Seedling</div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] neo-border p-4 flex flex-col items-center justify-center text-center aspect-square shadow-sm hover:scale-105 transition-transform cursor-pointer border-[3px]">
                     <div className="text-3xl mb-2">🔥</div>
                     <div className="text-[10px] font-bold uppercase leading-tight font-display tracking-tight">7-Day<br/>Streak</div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-[1.5rem] neo-border p-4 flex flex-col items-center justify-center text-center aspect-square opacity-60 grayscale border-dashed border-2">
                     <div className="text-3xl mb-2">🐻</div>
                     <div className="text-[10px] font-bold uppercase leading-tight font-display tracking-tight text-gray-500 dark:text-gray-400">Locked</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export const LMSCourses = () => {
  const { courses, modules, loading } = useLMSData();
  const moduleSummaries: Record<string, string> = {
    "MODULE 0": "The foundation. We unlearn the lies about money and align your wealth with ethical and halal principles. It's time for the wake-up call.",
    "MODULE 1": "Building your toolkit. Understand stocks, ETFs, and the reality of the crypto world. Everything you need to start your real investment journey.",
    "MODULE 2": "Playing the long game. Mastering compound interest, risk management, and the core Lotus philosophy of impact-first investing.",
    "MODULE 3": "Levelling up. From real estate for renters to navigating the complexities of taxes and market analysis like a pro.",
    "MODULE 4": "The final stage. Claim your identity and learn how to lead and grow within the Lotus Tribe community."
  };

  return (
    <div className="max-w-7xl mx-auto">
       <div className="mb-20 bg-white dark:bg-gray-900 p-12 md:p-20 rounded-[4rem] neo-border neo-shadow border-gray-100 dark:border-gray-800 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-genz-lime/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div className="relative z-10">
            <div className="inline-block px-4 py-1.5 rounded-full bg-genz-lime text-lotus-dark dark:text-white font-display font-bold text-xs tracking-wider uppercase mb-8 shadow-sm">
                The Learning Hub
            </div>
            <h1 className="font-display font-black text-6xl md:text-8xl text-lotus-dark dark:text-white leading-[0.9] uppercase tracking-tighter max-w-4xl mb-8">
              Welcome to the <br/><span className="text-lotus-red">Knowledge Tribe.</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-xl max-w-3xl leading-relaxed mb-10">
              Wealth isn't just about what's in your bank; it's about what you know. Master the money game from mindset to mastery. 
              Collect badges and XP while learning exactly how to build enduring, halal wealth from our ethical tribe masters.
            </p>
         </div>
       </div>

       <div className="space-y-24">
          {loading ? (
             <div className="p-20 text-center font-display font-bold text-2xl animate-pulse text-gray-400 uppercase">Synchronizing knowledge...</div>
          ) : modules.length > 0 ? (
            modules.map((mod) => {
               const moduleName = `${mod.id}: ${mod.title}`;
               const modCourses = courses.filter(c => c.module === moduleName || c.module.startsWith(mod.id));
               if (modCourses.length === 0) return null;
               
               const summary = moduleSummaries[mod.id] || "";

               return (
                 <div key={mod.firestoreId || mod.id}>
                    <div className="mb-12">
                       <div className="flex items-center gap-6 mb-4">
                          <h2 className="font-display font-extrabold text-3xl md:text-5xl uppercase text-lotus-dark dark:text-white tracking-tighter shrink-0">{moduleName}</h2>
                          <div className="h-px bg-gray-200 flex-1"></div>
                       </div>
                       <p className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-3xl leading-relaxed">
                          {summary}
                       </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                       {modCourses.map((course) => (
                          <Link to={`/learn/courses/${course.id}`} key={course.firestoreId || course.id} className="group">
                             <div className={`bg-white dark:bg-gray-900 rounded-[2.5rem] neo-border hover:-translate-y-2 transition-all duration-500 cursor-pointer h-full flex flex-col overflow-hidden neo-shadow border-gray-100 dark:border-gray-800 shadow-xl group-hover:shadow-2xl`}>
                                 <div className={`w-full h-44 ${course.color} border-b border-lotus-dark/5 flex items-center justify-center text-7xl shadow-inner relative overflow-hidden`}>
                                    <motion.span whileHover={{ scale: 1.2, rotate: 12 }} className="relative z-10 drop-shadow-lg">{course.badgeIcon}</motion.span>
                                 </div>
                                  <div className="p-10 flex flex-col flex-1 bg-white dark:bg-gray-900">
                                     <div className="flex justify-between items-start mb-6">
                                        <span className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase px-4 py-1 rounded-full shadow-sm">{course.level}</span>
                                        <span className="text-xs font-bold text-lotus-red uppercase tracking-wider">{course.xp} XP</span>
                                     </div>
                                     <h3 className="font-display font-bold text-2xl text-lotus-dark dark:text-white mb-6 uppercase leading-tight group-hover:text-lotus-red transition-colors">{course.title}</h3>
                                     <div className="mt-auto pt-8 border-t border-dashed border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-2"><BookOpen size={16} /> {course.lessons?.length || 0} lessons</span>
                                        <CheckCircle2 size={16} />
                                     </div>
                                  </div>
                             </div>
                          </Link>
                       ))}
                    </div>
                 </div>
               )
            })
          ) : (
            <div className="p-20 text-center bg-white dark:bg-gray-900 neo-border rounded-[4rem] border-dashed border-2 border-gray-100 dark:border-gray-800 flex flex-col items-center">
               <div className="text-6xl mb-8">🏗️</div>
               <h3 className="font-display font-black text-3xl uppercase text-lotus-dark dark:text-white mb-4">The Library is currently empty.</h3>
               <p className="text-gray-500 dark:text-gray-400 font-medium max-w-md mx-auto mb-10">You've successfully switched to a dynamic database! To see your original courses, you just need to initialize them in the Admin panel.</p>
               <div className="flex gap-4">
                  <Link to="/learn/admin" className="neo-btn bg-lotus-dark text-white px-10 py-4 rounded-2xl uppercase font-bold text-sm shadow-xl">
                     Go to Admin Panel
                  </Link>
                  <button onClick={() => window.location.href='/learn/admin?action=bootstrap'} className="neo-btn bg-genz-lime text-lotus-dark dark:text-white px-10 py-4 rounded-2xl uppercase font-bold text-sm border-2 border-black">
                     Restore Originals Now
                  </button>
               </div>
            </div>
          )}
       </div>
    </div>
  );
};

import { completeLesson } from './lib/userService';

export const LMSCoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { courses, loading } = useLMSData();
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  
  const course = courses.find(c => c.id === courseId) || coursesData[0];
  const lesson = course.lessons[activeLessonIdx];

  const goNext = async () => {
     if (user && !isCompleting) {
        setIsCompleting(true);
        try {
           const xpPerLesson = Math.round(course.xp / course.lessons.length);
           await completeLesson(user.uid, course.id, activeLessonIdx, xpPerLesson);
        } catch (e) { console.error(e); } finally { setIsCompleting(false); }
     }
     if (activeLessonIdx < course.lessons.length - 1) setActiveLessonIdx(activeLessonIdx + 1);
  };
  
  const finishCourse = async () => {
     if (user && !isCompleting) {
        setIsCompleting(true);
        try {
           const xpPerLesson = Math.round(course.xp / course.lessons.length);
           await completeLesson(user.uid, course.id, activeLessonIdx, xpPerLesson);
        } catch(e) { console.error(e); } finally { setIsCompleting(false); }
     }
     navigate('/learn/courses');
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col lg:px-4">
      <div className="mb-10 flex justify-between items-center">
        <button onClick={() => navigate('/learn/courses')} className="group inline-flex items-center gap-3 text-sm font-bold uppercase text-gray-400 hover:text-lotus-dark dark:text-white transition-colors">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform"/> Back to Library
        </button>
        <div className="bg-white dark:bg-gray-900 neo-border px-6 py-2 rounded-full font-bold text-xs uppercase shadow-sm">
           Progress: {Math.round(((activeLessonIdx + 1) / course.lessons.length) * 100)}%
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start mt-4">
         <div className="order-2 lg:order-1 pt-2">
            <div className="flex items-center gap-6 mb-10">
               <div className={`${course.color} w-20 h-20 rounded-[1.5rem] border border-lotus-dark/5 flex items-center justify-center text-4xl shadow-inner shrink-0`}>{course.badgeIcon}</div>
               <div>
                  <p className="font-bold text-[10px] text-gray-400 tracking-[0.2em] uppercase mb-1">{course.title}</p>
                  <h1 className="font-display font-extrabold text-4xl md:text-5xl leading-none text-lotus-dark dark:text-white uppercase tracking-tight">{lesson.title}</h1>
               </div>
            </div>

            <div className="space-y-12">
               {lesson.videoUrl && (
                  <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden neo-border neo-shadow-sm bg-black">
                     <iframe 
                        className="w-full h-full"
                        src={lesson.videoUrl.replace('watch?v=', 'embed/')} 
                        title="Lesson Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                     ></iframe>
                  </div>
               )}

               {lesson.imageUrl && (
                  <div className="w-full rounded-[2.5rem] overflow-hidden neo-border neo-shadow-sm">
                     <img src={lesson.imageUrl} className="w-full object-cover" alt="Lesson Visual" />
                  </div>
               )}

               <div className="neo-border neo-shadow bg-white dark:bg-gray-900 rounded-[3rem] p-10 md:p-16 mb-12 prose prose-lg max-w-none border border-gray-100 dark:border-gray-800 shadow-2xl">
                  <div className="markdown-body" dangerouslySetInnerHTML={{ __html: lesson.content }} />
               </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-20">
               <button onClick={() => activeLessonIdx > 0 && setActiveLessonIdx(activeLessonIdx - 1)} disabled={activeLessonIdx === 0} className="px-8 py-5 border border-gray-200 dark:border-gray-700 rounded-full font-bold uppercase text-gray-400 hover:text-lotus-dark dark:text-white disabled:opacity-30 transition-all flex items-center gap-3 w-full sm:w-auto justify-center">
                  <ArrowLeft className="w-5 h-5" /> Previous
               </button>
               {activeLessonIdx < course.lessons.length - 1 ? (
                 <button onClick={goNext} disabled={isCompleting} className="neo-btn bg-lotus-dark text-white px-10 py-5 rounded-full uppercase flex items-center justify-center gap-3 disabled:opacity-50 w-full sm:w-auto shadow-xl">
                    Next Lesson <ArrowRight className="w-5 h-5" />
                 </button>
               ) : (
                 <button onClick={finishCourse} disabled={isCompleting} className="neo-btn bg-lotus-red text-white px-10 py-5 rounded-full uppercase flex items-center justify-center gap-3 shadow-xl">
                    Finish Course <Trophy className="w-5 h-5" />
                 </button>
               )}
            </div>
         </div>

         <div className="order-1 lg:order-2 w-full lg:sticky lg:top-32 space-y-6">
            <div className="bg-white dark:bg-gray-900 border-[3px] border-black rounded-[2rem] overflow-hidden neo-shadow-sm">
               <div className="p-6 bg-gray-50 dark:bg-gray-800 border-b-2 border-black font-display font-extrabold uppercase text-xl text-black dark:text-white flex items-center gap-2">
                  <Bookmark className="w-5 h-5" /> Syllabus
               </div>
               <div className="p-4 space-y-2">
                  {course.lessons.map((l: any, idx: number) => (
                    <button key={l.id} onClick={() => setActiveLessonIdx(idx)} className={`w-full text-left p-4 rounded-xl transition-all border-2 relative ${idx === activeLessonIdx ? 'bg-genz-pink text-black dark:text-white border-black shadow-[4px_4px_0_0_#121212] -translate-y-1' : 'bg-white dark:bg-gray-900 border-transparent'}`}>
                       <p className={`font-bold ${idx === activeLessonIdx ? 'text-black dark:text-white' : 'text-gray-400 text-sm'}`}>{idx + 1}. {l.title}</p>
                       <p className="text-[10px] font-bold uppercase mt-2 opacity-70 flex items-center gap-1">
                          {idx < activeLessonIdx ? <CheckCircle2 className="w-3 h-3"/> : <Clock className="w-3 h-3"/>} {l.readTime}
                       </p>
                    </button>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export const LMSAchievements = () => {
  const { userProfile } = useContext(AuthContext);
  const { courses } = useLMSData();
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
      // Fallback: Twitter
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
       <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-20 border-b border-gray-200 dark:border-gray-700 pb-12">
          <div className="max-w-2xl">
             <h1 className="font-display font-black text-5xl md:text-7xl text-lotus-dark dark:text-white leading-none uppercase tracking-tighter mb-6">
               Flex your <span className="bg-genz-lime px-4 pb-2 inline-block -rotate-2 rounded-2xl shadow-sm">medals.</span>
             </h1>
             <p className="text-gray-500 dark:text-gray-400 font-medium text-xl leading-relaxed">
               Every time you complete a course, you earn a badge. Collect them all to reach the Full Lotus rank and join the elite elders of the tribe.
             </p>
          </div>
          <div className="flex gap-8 md:pt-6 bg-white dark:bg-gray-900 neo-border neo-shadow p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800">
             <div className="text-center">
                 <div className="text-6xl font-display font-black text-lotus-dark dark:text-white mb-2 leading-none">{unlockedCount}</div>
                <div className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Collected</div>
             </div>
             <div className="w-px bg-gray-100 dark:bg-gray-800"></div>
             <div className="text-center">
                <div className="text-6xl font-display font-black text-gray-200 mb-2 leading-none">{remainingCount}</div>
                <div className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Remaining</div>
             </div>
          </div>
       </div>

       <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {allBadges.map((badge) => (
             <div 
               key={badge.id} 
               className={`bg-white dark:bg-gray-900 rounded-[3rem] p-10 flex flex-col h-full items-center text-center transition-all duration-500 ${
                 badge.isUnlocked 
                   ? 'neo-border neo-shadow hover:-translate-y-2 cursor-pointer border-gray-100 dark:border-gray-800 shadow-xl' 
                   : 'border-2 border-dashed border-gray-200 dark:border-gray-700 opacity-60 grayscale scale-95'
               }`}
             >
                <div className={`w-28 h-28 rounded-full flex items-center justify-center text-6xl mb-8 shadow-inner relative ${badge.isUnlocked ? badge.color + ' border border-lotus-dark/5' : 'bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800'}`}>
                   {badge.icon}
                   {badge.isUnlocked && (
                     <div className="absolute -bottom-2 -right-2 bg-genz-pink text-lotus-dark dark:text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase border border-lotus-dark/10 rotate-12 shadow-md">Unlocked</div>
                   )}
                </div>
                <h4 className={`font-display font-extrabold uppercase text-2xl mb-2 leading-tight ${badge.isUnlocked ? 'text-lotus-dark dark:text-white' : 'text-gray-400'}`}>{badge.title}</h4>
                <p className={`text-sm font-bold mb-auto leading-relaxed ${badge.isUnlocked ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 opacity-60'}`}>{badge.courseTitle}</p>
                
                {badge.isUnlocked ? (
                  <button 
                    onClick={() => handleShare(badge)}
                    className="mt-8 flex items-center gap-2 text-xs font-bold uppercase text-lotus-red hover:underline group"
                  >
                    <Share2 size={16} className="group-hover:rotate-12 transition-transform" /> Share Achievement
                  </button>
                ) : (
                  <div className="mt-8 flex items-center gap-2 opacity-30">
                    <Lock size={16} />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Keep Learning</span>
                  </div>
                )}
             </div>
          ))}
       </div>
    </div>
  );
};
