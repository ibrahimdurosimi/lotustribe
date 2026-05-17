import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  Search, 
  ArrowUp, 
  Calendar, 
  Trophy, 
  Users, 
  Plus, 
  HelpCircle,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  Send
} from 'lucide-react';
import { AuthContext } from './App';
import { db, collection, query, getDocs, orderBy, limit, addDoc, serverTimestamp, updateDoc, doc, increment } from './lib/firebase';

export const Community = () => {
  const { user, userProfile } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<'qna' | 'leaderboard' | 'events'>('qna');
  const [questions, setQuestions] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityData = async () => {
      setLoading(true);
      try {
        // Fetch Questions
        const qSnap = await getDocs(query(collection(db, 'questions'), orderBy('createdAt', 'desc'), limit(10)));
        setQuestions(qSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Fetch Events
        const eSnap = await getDocs(query(collection(db, 'events'), orderBy('date', 'asc')));
        setEvents(eSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Fetch Leaderboard
        const uSnap = await getDocs(query(collection(db, 'users'), orderBy('xp', 'desc'), limit(10)));
        setTopUsers(uSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        
      } catch (err) {
        console.error("Error fetching community data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunityData();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#FCFCFC] font-sans text-lotus-dark">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <header className="mb-16 text-center md:text-left">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-block px-4 py-1.5 rounded-full bg-genz-lime text-lotus-dark font-display font-bold text-xs tracking-wider uppercase mb-6 shadow-sm ring-1 ring-lotus-dark/5"
           >
             The Tribe Square
           </motion.div>
           <div className="flex flex-col md:flex-row justify-between items-end gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="font-display font-black text-6xl md:text-8xl text-lotus-dark leading-[0.85] uppercase tracking-tighter">
                  Knowledge <br/><span className="text-lotus-red italic">is power.</span>
                </h1>
                <p className="text-gray-500 font-medium text-xl max-w-2xl mt-8">
                  Connect with fellow investors, ask the elders, and level up together. No gatekeeping, just pure growth.
                </p>
              </motion.div>
              
              <div className="flex bg-white neo-border p-2 rounded-2xl shadow-sm border border-gray-100 mb-2">
                 {['qna', 'leaderboard', 'events'].map((tab) => (
                    <button
                       key={tab}
                       onClick={() => setActiveTab(tab as any)}
                       className={`px-8 py-3 rounded-xl font-display font-bold uppercase text-xs transition-all ${
                         activeTab === tab 
                           ? 'bg-lotus-dark text-white shadow-md' 
                           : 'text-gray-400 hover:text-lotus-dark hover:bg-gray-50'
                       }`}
                    >
                       {tab === 'qna' ? '💬 Q&A' : tab === 'leaderboard' ? '🏆 Leaders' : '📅 Events'}
                    </button>
                 ))}
              </div>
           </div>
        </header>

        <AnimatePresence mode="wait">
           {activeTab === 'qna' && <QNAPortal questions={questions} setQuestions={setQuestions} />}
           {activeTab === 'leaderboard' && <Leaderboard users={topUsers} />}
           {activeTab === 'events' && <EventsList events={events} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

const QNAPortal = ({ questions, setQuestions }: { questions: any[], setQuestions: any }) => {
  const { user } = useContext(AuthContext);
  const [newQuestion, setNewQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !user) return;
    setIsSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, 'questions'), {
        text: newQuestion,
        userId: user.uid,
        userName: user.displayName || user.email,
        userPhoto: user.photoURL,
        upvotes: 0,
        replies: 0,
        createdAt: serverTimestamp()
      });
      // Optionally update user XP for asking a question
      if (user.uid) {
         await updateDoc(doc(db, 'users', user.uid), {
            xp: increment(20) // Give 20 XP for asking
         });
      }
      setQuestions([{ id: docRef.id, text: newQuestion, userName: user.displayName, userPhoto: user.photoURL, upvotes: 0, replies: 0, createdAt: new Date() }, ...questions]);
      setNewQuestion("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async (qid: string) => {
    try {
      await updateDoc(doc(db, 'questions', qid), {
        upvotes: increment(1)
      });
      setQuestions(questions.map(q => q.id === qid ? { ...q, upvotes: q.upvotes + 1 } : q));
    } catch (err) { console.error(err); }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="grid lg:grid-cols-[1fr_350px] gap-12"
    >
       <div className="space-y-8">
          <form onSubmit={handleSubmit} className="bg-white neo-border p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
             <h3 className="font-display font-bold text-xl uppercase mb-6 flex items-center gap-3">
                <HelpCircle className="text-lotus-red" /> Ask the Tribe
             </h3>
             <div className="relative">
                <textarea 
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="What's bothering your wallet?"
                  className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-6 min-h-[120px] focus:outline-none focus:border-lotus-red transition-all font-medium text-lg text-lotus-dark placeholder:text-gray-300"
                />
             </div>
             <div className="flex justify-between items-center mt-6">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Keep it ethical & clean.</p>
                <button 
                  disabled={isSubmitting || !newQuestion.trim()}
                  className="neo-btn bg-lotus-red text-white px-10 py-4 uppercase text-sm flex items-center gap-3 shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Post Question'} <Send size={18} />
                </button>
             </div>
          </form>

          <div className="space-y-6">
             {questions.length === 0 ? (
               <div className="p-20 text-center bg-white neo-border rounded-[2.5rem] border-dashed text-gray-300 font-display font-bold uppercase">No questions yet. Be the first!</div>
             ) : (
               questions.map((q) => (
                 <motion.div 
                   layout
                   key={q.id}
                   className="bg-white p-8 border-[3px] border-black rounded-[2.5rem] neo-shadow-sm flex gap-6 hover:-translate-y-1 transition-transform cursor-pointer"
                 >
                    <div className="flex flex-col items-center gap-2">
                       <button 
                         onClick={(e) => { e.stopPropagation(); handleUpvote(q.id); }}
                         className="bg-gray-100 border-2 border-black rounded-xl p-2 flex flex-col items-center hover:bg-genz-lime transition-colors group"
                       >
                          <ArrowUp className="w-5 h-5 text-black font-bold group-hover:-translate-y-1 transition-transform" />
                          <span className="font-display font-bold text-black">{q.upvotes}</span>
                       </button>
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center gap-3 mb-4">
                          <img src={q.userPhoto || `https://ui-avatars.com/api/?name=${q.userName}&background=random`} className="w-8 h-8 rounded-full border-2 border-black" alt="Avatar" />
                          <span className="font-display font-bold text-sm uppercase">{q.userName || 'Tribe Member'}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">• Just now</span>
                       </div>
                       <h3 className="font-display font-extrabold text-2xl text-black mb-4 uppercase leading-tight">{q.text}</h3>
                       <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 font-bold text-[10px] text-gray-400 uppercase tracking-widest hover:text-lotus-dark">
                             <MessageCircle size={16} className="text-lotus-red/40" /> {q.replies} Replies
                          </div>
                          <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase text-gray-400">Discussion</span>
                       </div>
                    </div>
                 </motion.div>
               ))
             )}
          </div>
       </div>

       <div className="space-y-8">
          <div className="bg-white neo-border p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
             <h4 className="font-display font-extrabold uppercase text-lg mb-6 border-b border-gray-100 pb-4">Hot Topics</h4>
             <div className="space-y-4">
                {['#HalalInvesting', '#CryptoEthics', '#StudentWealth', '#LotusTribe', '#ZakatStrategy'].map(tag => (
                   <div key={tag} className="flex items-center justify-between group cursor-pointer">
                      <span className="font-bold text-gray-500 hover:text-lotus-red transition-colors">{tag}</span>
                      <TrendingUp size={14} className="text-gray-200 group-hover:text-lotus-red" />
                   </div>
                ))}
             </div>
          </div>
          
          <div className="bg-lotus-dark rounded-[2.5rem] p-10 text-white relative overflow-hidden neo-shadow">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
             <h4 className="font-display font-bold text-xl uppercase mb-4 relative z-10">Tribe Rules</h4>
             <ul className="space-y-3 text-sm text-gray-300 font-medium relative z-10">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-genz-lime rounded-full"></div> Be respectful to all.</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-genz-lime rounded-full"></div> No financial advice.</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-genz-lime rounded-full"></div> Align with halal values.</li>
             </ul>
          </div>
       </div>
    </motion.div>
  );
};

const Leaderboard = ({ users }: { users: any[] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
       <div className="bg-white neo-border p-10 md:p-16 rounded-[4rem] shadow-xl relative overflow-hidden border border-gray-100">
          <div className="absolute top-0 right-0 p-10 opacity-10"><Trophy size={120} /></div>
          
          <div className="relative z-10 text-center mb-16">
             <h2 className="font-display font-black text-5xl md:text-7xl uppercase text-lotus-dark tracking-tighter mb-4">The Top <span className="text-lotus-red italic">Slayers.</span></h2>
             <p className="text-gray-500 font-medium text-lg uppercase tracking-widest">Elite investors of the Lotus Tribe</p>
          </div>

          <div className="space-y-4">
             {users.map((u, idx) => (
                <div 
                  key={u.id}
                  className={`flex items-center gap-6 p-6 rounded-3xl transition-all duration-300 ${
                    idx === 0 ? 'bg-genz-lime border-2 border-lotus-dark/10 scale-105 shadow-xl' :
                    idx === 1 ? 'bg-genz-purple/20 border border-lotus-dark/5' :
                    idx === 2 ? 'bg-genz-pink/20 border border-lotus-dark/5' :
                    'bg-gray-50'
                  }`}
                >
                   <div className="w-12 font-display font-black text-3xl text-lotus-dark/20">{idx + 1}</div>
                   <img src={u.photoURL || `https://ui-avatars.com/api/?name=${u.displayName || u.email}&background=random`} className="w-14 h-14 rounded-full border-2 border-white shadow-md" alt="Avatar" />
                   <div className="flex-1">
                      <h4 className="font-display font-bold text-xl uppercase text-lotus-dark">{u.displayName || 'Tribe Member'}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                         {idx === 0 ? '🏆 Master Elder' : idx === 1 ? '🥇 Elite Elder' : idx === 2 ? '🥈 Elder' : 'Investment Pro'}
                      </p>
                   </div>
                   <div className="text-right">
                      <div className="font-display font-black text-2xl text-lotus-dark">{u.xp}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Total XP</div>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </motion.div>
  );
};

const EventsList = ({ events }: { events: any[] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
       {events.length === 0 ? (
         <div className="col-span-full py-32 text-center bg-white neo-border rounded-[4rem] text-gray-300 font-display font-bold text-2xl uppercase tracking-widest">
            No upcoming events yet. <br/> <span className="text-sm font-sans mt-4 block text-gray-200">Stay tuned to the square.</span>
         </div>
       ) : (
         events.map((event) => (
            <div key={event.id} className="bg-white rounded-[3rem] neo-border neo-shadow-sm flex flex-col group overflow-hidden hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-gray-100">
               <div className="h-48 bg-lotus-dark relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-lotus-dark to-transparent opacity-60"></div>
                  <div className="absolute top-6 right-6 bg-white rounded-2xl p-3 shadow-xl text-center min-w-[60px]">
                     <div className="text-lotus-red font-display font-black text-2xl leading-none">{new Date(event.date?.toDate()).getDate()}</div>
                     <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(event.date?.toDate()).toLocaleString('default', { month: 'short' })}</div>
                  </div>
                  <div className="absolute bottom-6 left-6 text-white">
                     <span className="bg-genz-lime/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-white/20">{event.category || 'Live Webinar'}</span>
                  </div>
               </div>
               <div className="p-10 flex flex-col flex-1">
                  <h3 className="font-display font-extrabold text-2xl uppercase mb-6 leading-tight group-hover:text-lotus-red transition-colors">{event.title}</h3>
                  <div className="space-y-4 mt-auto">
                     <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                        <MapPin size={18} className="text-lotus-red/40" /> {event.location || 'Zoom Square'}
                     </div>
                     <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                        <Clock size={18} className="text-lotus-red/40" /> {event.time || '6:00 PM GMT'}
                     </div>
                  </div>
                  <button className="neo-btn bg-lotus-dark text-white w-full py-4 mt-10 uppercase text-xs">Save My Spot</button>
               </div>
            </div>
         ))
       )}
    </motion.div>
  );
};
