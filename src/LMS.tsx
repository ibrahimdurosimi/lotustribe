import React, { useContext } from 'react';
import { Routes, Route, Link, useLocation, Navigate, Outlet, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  LayoutDashboard, 
  MessageCircle, 
  Trophy, 
  Flame, 
  Clock, 
  Target, 
  ChevronRight,
  PlayCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { auth, loginWithGoogle } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { coursesData } from './data/courses';

// Add the AuthContext import or create a placeholder if it's exported from App.tsx
// To avoid circular dependency, we might need to pass down user as prop, or we can export AuthContext from App.tsx. 
// Better yet, let's just use firebase auth directly or we will export AuthContext from App.tsx.

// Let's create a responsive layout
export const LMSLayout = ({ user, loading, loginWithGoogle }: any) => {
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen pt-32 pb-20 flex items-center justify-center font-display font-bold text-2xl">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-[#fafafa] px-4">
        <div className="bg-white p-8 rounded-3xl neo-border neo-shadow text-center max-w-md w-full">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="font-display font-bold text-3xl uppercase mb-4">Login Required</h2>
          <p className="font-medium text-gray-600 mb-8">Join the Tribe to access courses, track your learning, and earn badges!</p>
          <button onClick={loginWithGoogle} className="neo-btn bg-genz-lime text-lotus-dark w-full uppercase text-xl">
            Log In with Google
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/learn', icon: <LayoutDashboard className="w-6 h-6" /> },
    { name: 'Courses', path: '/learn/courses', icon: <BookOpen className="w-6 h-6" /> },
    { name: 'Community', path: '/learn/community', icon: <MessageCircle className="w-6 h-6" /> },
    { name: 'Achievements', path: '/learn/achievements', icon: <Trophy className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-20 md:pb-0 font-sans text-lotus-dark flex justify-center">
      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-8 mt-8">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 h-[calc(100vh-140px)] sticky top-32">
          <div className="bg-white rounded-3xl neo-border neo-shadow p-6 flex-1 flex flex-col gap-2">
            <h2 className="font-display font-bold text-xl uppercase mb-6 text-gray-500">Learning Hub</h2>
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all ${
                  (location.pathname === item.path || (item.path !== '/learn' && location.pathname.startsWith(item.path)))
                    ? 'bg-genz-lime neo-border shadow-[2px_2px_0_0_#121212] translate-y-[-2px]' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-black'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}

            <div className="mt-auto bg-gray-50 rounded-2xl p-4 border-2 border-dashed border-gray-200">
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 bg-genz-pink rounded-xl flex items-center justify-center neo-border">
                   <Flame className="w-6 h-6 text-white" />
                 </div>
                 <div>
                   <div className="font-bold text-sm">3 Day Streak!</div>
                   <div className="text-xs text-gray-500 font-medium">Keep it up 🔥</div>
                 </div>
               </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-full overflow-hidden mb-16 md:mb-0">
          <Outlet />
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-white neo-border neo-shadow rounded-2xl p-2 z-50 flex justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/learn' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  isActive ? 'bg-genz-lime text-black border-2 border-black' : 'text-gray-500'
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-bold uppercase">{item.name}</span>
              </Link>
            );
          })}
        </nav>

      </div>
    </div>
  );
};

export const LMSDashboard = () => {
  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Welcome & Stats Row */}
      <div className="bg-genz-purple text-white p-8 rounded-3xl neo-border neo-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-8xl opacity-20 transform rotate-12 pointer-events-none">🎓</div>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl uppercase mb-2">Welcome Back!</h1>
        <p className="font-medium text-white/90 text-lg mb-8">Ready to level up your financial IQ today?</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center">
             <div className="text-3xl mb-1">🔥</div>
             <div className="font-display font-bold text-2xl">3</div>
             <div className="text-xs uppercase font-bold text-white/80 tracking-wider">Day Streak</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center">
             <div className="text-3xl mb-1">⏱️</div>
             <div className="font-display font-bold text-2xl">12</div>
             <div className="text-xs uppercase font-bold text-white/80 tracking-wider">Hrs Studied</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center">
             <div className="text-3xl mb-1">🏆</div>
             <div className="font-display font-bold text-2xl">4</div>
             <div className="text-xs uppercase font-bold text-white/80 tracking-wider">Badges</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center">
             <div className="text-3xl mb-1">📈</div>
             <div className="font-display font-bold text-2xl">LVL 4</div>
             <div className="text-xs uppercase font-bold text-white/80 tracking-wider">Invest Rank</div>
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      <div>
        <h2 className="font-display font-bold text-2xl uppercase mb-4 flex items-center gap-2">
          <PlayCircle className="w-6 h-6 text-genz-pink" /> Jump Back In
        </h2>
        <Link to="/learn/courses/your-money-glow-up" className="bg-white rounded-3xl p-6 neo-border neo-shadow flex flex-col md:flex-row items-center gap-6 cursor-pointer hover:-translate-y-1 transition-transform group block">
           <div className="w-full md:w-48 h-32 bg-gray-100 rounded-2xl neo-border flex items-center justify-center shrink-0 relative overflow-hidden">
             <div className="absolute inset-0 bg-green-500 opacity-20"></div>
             <span className="text-5xl relative z-10">🌱</span>
           </div>
           <div className="flex-1 w-full">
             <div className="flex justify-between items-start mb-2">
               <div>
                  <div className="inline-block px-3 py-1 bg-gray-100 text-gray-800 font-bold text-xs uppercase rounded-full border border-gray-200 mb-2">
                    Beginner
                  </div>
                  <h3 className="font-display font-bold text-xl md:text-2xl mb-1">Your Money Glow Up</h3>
               </div>
               <span className="font-bold text-gray-500 text-sm">33%</span>
             </div>
             <p className="text-gray-600 font-medium text-sm mb-4">Why "Rich" is boring and "Wealthy" is freedom.</p>
             <div className="w-full bg-gray-100 h-3 rounded-full neo-border overflow-hidden">
               <div className="bg-green-500 h-full w-[33%]"></div>
             </div>
           </div>
           <div className="hidden md:flex w-12 h-12 rounded-full bg-black text-white items-center justify-center neo-border shadow-sm transform group-hover:scale-110 transition-transform">
             <ChevronRight className="w-6 h-6" />
           </div>
        </Link>
      </div>

      {/* Recent Badges & Community Highlights Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
           <h2 className="font-display font-bold text-xl uppercase mb-4">Recent Badges</h2>
           <div className="bg-white rounded-3xl p-6 neo-border neo-shadow flex gap-4 overflow-x-auto">
              <div className="text-center min-w-[80px]">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-green-100 neo-border shadow-sm flex items-center justify-center mb-2">
                   <Target className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-xs font-bold leading-tight">First<br/>Steps</div>
              </div>
              <div className="text-center min-w-[80px]">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-yellow-100 neo-border shadow-sm flex items-center justify-center mb-2">
                   <Trophy className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="text-xs font-bold leading-tight">Quiz<br/>Master</div>
              </div>
              <div className="text-center min-w-[80px]">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mb-2 opacity-50">
                   <Lock className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-xs font-bold text-gray-400 leading-tight">Pro<br/>Investor</div>
              </div>
           </div>
        </div>

        <div>
           <h2 className="font-display font-bold text-xl uppercase mb-4">Community Highlights</h2>
           <div className="bg-genz-lime rounded-3xl p-6 neo-border neo-shadow">
             <div className="flex gap-3 mb-4">
               <img src="https://i.pravatar.cc/100?img=12" className="w-10 h-10 rounded-full neo-border" alt="" />
               <div className="bg-white rounded-xl p-3 neo-border text-sm font-medium">
                 <p className="font-bold text-xs mb-1">@Zara_trades</p>
                 Should I invest in Sukuk or Halal Equity right now?
               </div>
             </div>
             <Link to="/learn/community" className="block text-center font-bold text-sm bg-black text-white py-2 rounded-xl neo-border hover:bg-gray-800 transition-colors">
               View Discussion
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export const LMSCourses = () => {
  const [filter, setFilter] = React.useState('all');

  return (
    <div className="pb-10">
      <h1 className="font-display font-extrabold text-4xl uppercase mb-8">Course Hub</h1>
      
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-none">
         <button onClick={() => setFilter('all')} className={`${filter === 'all' ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-gray-600 hover:bg-gray-100'} font-bold py-2 px-6 rounded-xl neo-border transition-colors whitespace-nowrap`}>All Courses</button>
         <button onClick={() => setFilter('beginner')} className={`${filter === 'beginner' ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-gray-600 hover:bg-gray-100'} font-bold py-2 px-6 rounded-xl neo-border transition-colors whitespace-nowrap`}>Beginner</button>
         <button onClick={() => setFilter('intermediate')} className={`${filter === 'intermediate' ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-gray-600 hover:bg-gray-100'} font-bold py-2 px-6 rounded-xl neo-border transition-colors whitespace-nowrap`}>Intermediate</button>
      </div>

      <div className="grid gap-6">
        {coursesData.filter(c => filter === 'all' || c.level.toLowerCase() === filter).map((course) => (
          <div key={course.id} className="bg-white rounded-3xl p-6 neo-border neo-shadow flex flex-col md:flex-row items-center gap-6 transition-transform hover:-translate-y-1">
            <div className={`w-20 h-20 rounded-2xl ${course.color} neo-border flex items-center justify-center shrink-0 text-4xl`}>
              {course.badgeIcon}
            </div>
            
            <div className="flex-1 w-full text-center md:text-left">
               <div className="flex flex-col justify-center items-center md:items-start mb-2">
                 <div className="inline-block px-3 py-1 bg-gray-100 font-bold text-xs uppercase rounded-full border border-gray-200 mb-2 text-gray-600">
                    {course.level} • {course.xp} XP
                 </div>
                 <h3 className="font-display font-bold text-2xl mb-1">{course.title}</h3>
                 <p className="text-gray-500 font-medium text-sm">{course.module}</p>
               </div>
            </div>

            <Link to={`/learn/courses/${course.id}`} className={`w-full md:w-auto text-center block neo-btn bg-genz-lime text-black hover:bg-green-400`}>
              Start Course
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LMSCommunity = () => {
  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="font-display font-extrabold text-4xl uppercase">The Squad</h1>
        <button className="neo-btn bg-genz-lime text-black w-full md:w-auto">Ask a Question</button>
      </div>

      <div className="bg-genz-blue text-white rounded-3xl p-8 neo-border neo-shadow mb-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 transform translate-x-4 rotate-12">🎪</div>
         <div className="inline-block bg-white text-black text-xs font-bold uppercase px-3 py-1 rounded-lg neo-border mb-4">Upcoming Event</div>
         <h2 className="font-display font-bold text-3xl mb-2">Live Q&A: Navigating market pullbacks</h2>
         <p className="font-medium mb-6 max-w-xl">Join our lead portfolio managers as they discuss Shariah-compliant strategies during economic downturns.</p>
         <button className="neo-btn bg-white text-black">RSVP Now</button>
      </div>

      <div className="flex flex-col gap-6">
         {/* Post 1 */}
         <div className="bg-white rounded-3xl p-6 neo-border neo-shadow">
            <div className="flex items-center gap-3 mb-4">
              <img src="https://i.pravatar.cc/100?img=12" className="w-12 h-12 rounded-full neo-border" alt="" />
              <div>
                <div className="font-bold">Zara_trades</div>
                <div className="text-xs text-gray-500 font-medium">2 hours ago</div>
              </div>
              <div className="ml-auto bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full neo-border">
                Mutual Funds
              </div>
            </div>
            <h3 className="font-display font-bold text-xl mb-2">Should I invest in Sukuk or Halal Equity right now?</h3>
            <p className="text-gray-600 font-medium mb-4 text-sm leading-relaxed">
              I have some spare cash this month and I'm torn between the Fixed Income Fund and the pure Equity Fund. I'm a "Calculated Thinker". What's the squad doing?
            </p>
            <div className="flex gap-4 border-t-2 border-gray-100 pt-4">
              <button className="flex items-center gap-2 font-bold text-sm text-gray-500 hover:text-lotus-red transition-colors">
                 <Flame className="w-5 h-5" /> 24
              </button>
              <button className="flex items-center gap-2 font-bold text-sm text-gray-500 hover:text-black transition-colors">
                 <MessageCircle className="w-5 h-5" /> 8 Replies
              </button>
            </div>
         </div>

         {/* Post 2 */}
         <div className="bg-white rounded-3xl p-6 neo-border neo-shadow">
            <div className="flex items-center gap-3 mb-4">
              <img src="https://i.pravatar.cc/100?img=33" className="w-12 h-12 rounded-full neo-border" alt="" />
              <div>
                <div className="font-bold">Ahmed_Hustle</div>
                <div className="text-xs text-gray-500 font-medium">5 hours ago</div>
              </div>
              <div className="ml-auto bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full neo-border">
                Celebration
              </div>
            </div>
            <h3 className="font-display font-bold text-xl mb-2">Just got my "Pro Investor" badge! 🎉🏆</h3>
            <p className="text-gray-600 font-medium mb-4 text-sm leading-relaxed">
              Finished all the advanced modules today. Seriously, understanding Portfolio Diversification basically leveled up my whole perspective on money. Let's goooo!
            </p>
            <div className="flex gap-4 border-t-2 border-gray-100 pt-4">
              <button className="flex items-center gap-2 font-bold text-sm text-lotus-red">
                 <Flame className="w-5 h-5 fill-current" /> 112
              </button>
              <button className="flex items-center gap-2 font-bold text-sm text-gray-500 hover:text-black transition-colors">
                 <MessageCircle className="w-5 h-5" /> 15 Replies
              </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export const LMSAchievements = () => {
  const badges = [
    { title: 'First Steps', icon: '👶', earned: true, date: 'May 10', bg: 'bg-blue-100' },
    { title: 'Quiz Master', icon: '🧠', earned: true, date: 'May 12', bg: 'bg-purple-100' },
    { title: '7-Day Streak', icon: '🔥', earned: false, bg: 'bg-orange-100' },
    { title: 'Bookworm', icon: '📚', earned: false, bg: 'bg-green-100', progress: '3/5 Courses' },
    { title: 'Pro Investor', icon: '👑', earned: false, bg: 'bg-yellow-100' },
    { title: 'Community Pillar', icon: '🤝', earned: false, bg: 'bg-pink-100' },
  ];

  return (
    <div className="pb-10">
      <h1 className="font-display font-extrabold text-4xl uppercase mb-8">Trophy Room</h1>
      
      <div className="bg-white rounded-3xl p-8 neo-border neo-shadow mb-12 flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 rounded-full bg-genz-pink neo-border flex items-center justify-center shrink-0">
           <Trophy className="w-16 h-16 text-white" />
        </div>
        <div className="text-center md:text-left flex-1">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Current Status</p>
          <h2 className="font-display font-bold text-4xl mb-2">Level 4 <span className="text-gray-400">/ 10</span></h2>
          <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden neo-border border-gray-300 mt-4 mb-2">
            <div className="bg-genz-pink h-full w-[45%]"></div>
          </div>
          <p className="font-bold text-sm text-gray-500 text-right">450 / 1000 XP to Level 5</p>
        </div>
      </div>

      <h3 className="font-display font-bold text-2xl uppercase mb-6">Your Badges</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
         {badges.map((badge, idx) => (
           <div key={idx} className={`bg-white rounded-3xl p-6 text-center ${badge.earned ? 'neo-border neo-shadow' : 'border-2 border-dashed border-gray-300 opacity-60'} flex flex-col items-center justify-center min-h-[220px]`}>
              <div className={`w-20 h-20 rounded-2xl ${badge.bg} ${badge.earned && 'neo-border'} flex items-center justify-center text-4xl mb-4 relative`}>
                {badge.icon}
                {!badge.earned && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Lock className="w-8 h-8 text-gray-600" />
                  </div>
                )}
              </div>
              <h4 className="font-display font-bold text-lg mb-1 leading-tight">{badge.title}</h4>
              {badge.earned ? (
                <p className="text-xs font-bold text-green-500 uppercase tracking-wide mt-auto">Earned {badge.date}</p>
              ) : (
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-auto">
                  {badge.progress ? badge.progress : 'Locked'}
                </p>
              )}
           </div>
         ))}
      </div>
    </div>
  );
};

export const LMSCoursePlayer = () => {
  const { courseId } = useParams();
  const [currentLessonIdx, setCurrentLessonIdx] = React.useState(0);
  const [showQuiz, setShowQuiz] = React.useState(false);
  const [quizAnswers, setQuizAnswers] = React.useState<{ [key: number]: boolean }>({});
  const [quizScore, setQuizScore] = React.useState<number | null>(null);

  const course = coursesData.find(c => c.id === courseId);

  if (!course) {
    return <div className="p-10 font-display text-2xl font-bold bg-white neo-border">Course not found.</div>;
  }

  const lesson = course.lessons[currentLessonIdx];

  const handleNext = () => {
    if (currentLessonIdx < course.lessons.length - 1) {
      setCurrentLessonIdx(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowQuiz(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuizAnswer = (qIdx: number, isCorrect: boolean) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: isCorrect }));
  };

  const submitQuiz = () => {
    const score = course.quiz.reduce((acc, _, idx) => acc + (quizAnswers[idx] ? 1 : 0), 0);
    setQuizScore(score);
  };

  if (showQuiz) {
    return (
      <div className="pb-10">
        <div className="mb-6 flex items-center justify-between">
          <button onClick={() => setShowQuiz(false)} className="text-gray-500 font-bold hover:text-black flex items-center gap-2">
            &larr; Back to Lessons
          </button>
        </div>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 neo-border neo-shadow mb-8">
          {quizScore === null ? (
            <>
              <div className="flex items-center gap-3 mb-8">
                <div className={`w-12 h-12 rounded-xl ${course.color} neo-border flex items-center justify-center text-2xl`}>{course.badgeIcon}</div>
                <h1 className="font-display font-extrabold text-3xl md:text-5xl uppercase">Quiz: {course.title}</h1>
              </div>
              
              <div className="space-y-12">
                {course.quiz.map((q, idx) => (
                  <div key={idx}>
                    <h3 className="font-bold text-xl mb-4">{idx + 1}. {q.question}</h3>
                    <div className="space-y-3">
                      {q.options.map((opt, oIdx) => (
                        <label key={oIdx} className="flex items-center gap-3 p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                          <input 
                            type="radio" 
                            name={`q-${idx}`} 
                            className="w-5 h-5 text-lotus-red focus:ring-lotus-red"
                            onChange={() => handleQuizAnswer(idx, opt.isCorrect)}
                          />
                          <span className="font-medium">{opt.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <button onClick={submitQuiz} className="neo-btn bg-genz-blue text-white w-full md:w-auto uppercase">
                  Submit Quiz & Earn XP
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <div className="text-8xl mb-6">🏆</div>
              <h2 className="font-display font-extrabold text-4xl uppercase mb-4 text-genz-purple">Quiz Completed!</h2>
              <p className="text-2xl font-bold mb-2">You scored {quizScore} out of {course.quiz.length}</p>
              
              {quizScore === course.quiz.length ? (
                <>
                  <p className="text-gray-600 font-medium mb-8">Flawless victory! You earned the <strong>{course.badgeName}</strong> badge and {course.xp} XP.</p>
                  <Link to="/learn/courses" className="neo-btn bg-genz-lime text-black uppercase block max-w-sm mx-auto">
                    Back to Courses
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-gray-600 font-medium mb-8">Good try, but you need a perfect score to earn the badge. Review the material and try again!</p>
                  <button onClick={() => { setQuizScore(null); setQuizAnswers({}); setShowQuiz(false); setCurrentLessonIdx(0); }} className="neo-btn bg-gray-100 text-black uppercase block max-w-sm mx-auto">
                    Retake Course
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/learn/courses" className="text-gray-500 font-bold hover:text-black flex items-center gap-2">
          &larr; Back to Courses
        </Link>
        <div className="font-bold text-sm bg-genz-pink text-white px-3 py-1 rounded-full neo-border">
          Lesson {currentLessonIdx + 1} of {course.lessons.length}
        </div>
      </div>
      
      <div className="bg-white rounded-3xl p-8 md:p-12 neo-border neo-shadow mb-8">
        <h1 className="font-display font-extrabold text-3xl md:text-5xl uppercase mb-4">{lesson.title}</h1>
        <div className="flex items-center gap-2 text-gray-500 font-bold text-sm mb-8 uppercase tracking-wider">
          <Clock className="w-4 h-4" /> {lesson.readTime} read
        </div>

        <div className="prose prose-lg max-w-none font-medium text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: lesson.content }} />

        <div className="mt-12 flex justify-between items-center border-t-2 border-gray-100 pt-8">
           <button 
             onClick={() => { if(currentLessonIdx > 0) { setCurrentLessonIdx(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
             className={`font-bold uppercase tracking-wide text-gray-500 hover:text-black transition-colors ${currentLessonIdx === 0 ? 'invisible' : ''}`}
           >
             &larr; Previous Lesson
           </button>
           
           <button onClick={handleNext} className="neo-btn bg-black text-white gap-2 flex items-center shadow-none transform translate-y-1">
             {currentLessonIdx < course.lessons.length - 1 ? 'Next Lesson' : 'Take Quiz'} <ChevronRight className="w-5 h-5"/>
           </button>
        </div>
      </div>
    </div>
  );
};
