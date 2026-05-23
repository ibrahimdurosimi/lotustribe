import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, Search, ArrowUp, Calendar, Trophy, Users, Plus, HelpCircle,
  ChevronRight, TrendingUp, MapPin, Clock, Send, X, Smile, CheckCircle2, Shield
} from 'lucide-react';
import { AuthContext } from './App';
import { db, collection, query, getDocs, orderBy, limit, addDoc, serverTimestamp, updateDoc, doc, increment, arrayUnion, Timestamp } from './lib/firebase';
import EmojiPicker from 'emoji-picker-react';

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
        const qSnap = await getDocs(query(collection(db, 'questions'), orderBy('createdAt', 'desc'), limit(50)));
        setQuestions(qSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const eSnap = await getDocs(query(collection(db, 'events'), orderBy('date', 'asc')));
        setEvents(eSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const uSnap = await getDocs(query(collection(db, 'users'), orderBy('xp', 'desc'), limit(10)));
        setTopUsers(uSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchCommunityData();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#FCFCFC] font-sans text-lotus-dark dark:text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <header className="mb-16 text-center md:text-left">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1.5 rounded-full bg-genz-lime text-lotus-dark dark:text-white font-display font-bold text-xs tracking-wider uppercase mb-6 shadow-sm ring-1 ring-lotus-dark/5">
             The Tribe Square
           </motion.div>
           <div className="flex flex-col md:flex-row justify-between items-end gap-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h1 className="font-display font-black text-6xl md:text-8xl text-lotus-dark dark:text-white leading-[0.85] uppercase tracking-tighter">
                  Knowledge <br/><span className="text-lotus-red italic">is power.</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-xl max-w-2xl mt-8">
                  Connect with fellow investors, ask the elders, and level up together. No gatekeeping, just pure growth.
                </p>
              </motion.div>
              
              <div className="flex bg-white dark:bg-gray-900 neo-border p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-2 overflow-x-auto max-w-full">
                 {['qna', 'leaderboard', 'events'].map((tab) => (
                    <button
                       key={tab}
                       onClick={() => setActiveTab(tab as any)}
                       className={`px-6 py-3 rounded-xl font-display font-bold uppercase text-xs transition-all whitespace-nowrap ${
                         activeTab === tab ? 'bg-lotus-dark text-white shadow-md' : 'text-gray-400 hover:text-lotus-dark dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
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
           {activeTab === 'events' && <EventsList events={events} setEvents={setEvents} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

const CATEGORIES = ['General', 'Investing', 'Taxes', 'Crypto', 'Real Estate'];

const QNAPortal = ({ questions, setQuestions }: { questions: any[], setQuestions: any }) => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [answerText, setAnswerText] = useState("");
  
  const emojiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !user) return;
    setIsSubmitting(true);
    try {
      const newDoc = {
        title,
        text: description,
        category,
        userId: user.uid,
        userName: user.displayName || user.email,
        userPhoto: user.photoURL,
        upvotes: 0,
        replies: 0,
        answers: [],
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'questions'), newDoc);
      if (user.uid) await updateDoc(doc(db, 'users', user.uid), { xp: increment(20) });
      
      setQuestions([{ id: docRef.id, ...newDoc, createdAt: new Date() }, ...questions]);
      setTitle(""); setDescription(""); setCategory("General"); setShowEmojiPicker(false);
    } catch (err) { console.error(err); } 
    finally { setIsSubmitting(false); }
  };

  const handleUpvote = async (qid: string, isFromModal = false) => {
    try {
      await updateDoc(doc(db, 'questions', qid), { upvotes: increment(1) });
      
      if (isFromModal && selectedQuestion) {
         setSelectedQuestion({...selectedQuestion, upvotes: selectedQuestion.upvotes + 1});
      }
      setQuestions(questions.map(q => q.id === qid ? { ...q, upvotes: (q.upvotes || 0) + 1 } : q));
    } catch (err) { console.error(err); }
  };

  const handleAnswerSubmit = async () => {
    if (!user || !answerText.trim() || !selectedQuestion) return;
    const newAnswer = {
      id: Date.now().toString(),
      text: answerText,
      userId: user.uid,
      userName: user.displayName || user.email,
      userPhoto: user.photoURL,
      createdAt: new Date().toISOString()
    };
    try {
      await updateDoc(doc(db, 'questions', selectedQuestion.id), {
        answers: arrayUnion(newAnswer),
        replies: increment(1)
      });
      if (user.uid) await updateDoc(doc(db, 'users', user.uid), { xp: increment(20) });
      
      const updatedQ = { 
        ...selectedQuestion, 
        answers: [...(selectedQuestion.answers || []), newAnswer], 
        replies: (selectedQuestion.replies || 0) + 1 
      };
      setSelectedQuestion(updatedQ);
      setQuestions(questions.map(q => q.id === selectedQuestion.id ? updatedQ : q));
      setAnswerText("");
    } catch (err) { console.error(err); }
  };

  const filteredQuestions = questions.filter(q => 
    (filterCategory === 'All' || q.category === filterCategory) &&
    ((q.title?.toLowerCase().includes(searchQuery.toLowerCase())) || (q.text?.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid lg:grid-cols-[1fr_350px] gap-12">
       <div className="space-y-8">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 neo-border p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 relative">
             <h3 className="font-display font-bold text-xl uppercase mb-6 flex items-center gap-3">
                <HelpCircle className="text-lotus-red" /> Ask the Tribe (+20 XP)
             </h3>
             <div className="space-y-4">
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Headline: What's your question?"
                  className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-lotus-red transition-all font-bold text-lg text-lotus-dark dark:text-white placeholder:text-gray-300"
                />
                <div className="flex gap-4">
                   <select value={category} onChange={e => setCategory(e.target.value)} className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-lotus-red transition-all font-bold text-sm text-lotus-dark dark:text-white uppercase">
                     {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                   </select>
                </div>
                <div className="relative">
                   <textarea 
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     placeholder="Add details, context, or what you've already tried..."
                     className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl p-6 min-h-[120px] focus:outline-none focus:border-lotus-red transition-all font-medium text-lg text-lotus-dark dark:text-white placeholder:text-gray-300"
                   />
                   <div className="absolute bottom-4 left-4" ref={emojiRef}>
                      <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-gray-400 hover:text-lotus-red transition-colors p-2 bg-white dark:bg-gray-900 rounded-full shadow-sm neo-border border-gray-200 dark:border-gray-700">
                         <Smile size={20} />
                      </button>
                      {showEmojiPicker && (
                         <div className="absolute top-12 left-0 z-50 shadow-2xl rounded-2xl border-2 border-black overflow-hidden">
                            <EmojiPicker onEmojiClick={(em) => { setDescription(prev => prev + em.emoji); setShowEmojiPicker(false); }} />
                         </div>
                      )}
                   </div>
                </div>
             </div>
             
             <div className="flex justify-between items-center mt-6">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest hidden md:block">Keep it ethical & clean.</p>
                <button disabled={isSubmitting || !title.trim() || !description.trim()} className="neo-btn bg-lotus-red text-white px-10 py-4 uppercase text-sm flex items-center gap-3 shadow-lg disabled:opacity-50 ml-auto">
                  {isSubmitting ? 'Sending...' : 'Post Question'} <Send size={18} />
                </button>
             </div>
          </form>

          <div className="bg-white dark:bg-gray-900 neo-border p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4">
             <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions..." className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-lotus-dark font-bold text-sm"
                />
             </div>
             <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-3 focus:outline-none focus:border-lotus-dark font-bold text-sm uppercase appearance-none min-w-[150px]">
                <option value="All">All Categories</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
             </select>
          </div>

          <div className="space-y-6">
             {filteredQuestions.length === 0 ? (
               <div className="p-20 text-center bg-white dark:bg-gray-900 neo-border rounded-[2.5rem] border-dashed text-gray-300 font-display font-bold uppercase">No questions found.</div>
             ) : (
               filteredQuestions.map((q) => (
                 <motion.div layout key={q.id} onClick={() => setSelectedQuestion(q)} className="bg-white dark:bg-gray-900 p-8 border-[3px] border-black rounded-[2.5rem] neo-shadow-sm flex gap-6 hover:-translate-y-1 transition-transform cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                       <button onClick={(e) => { e.stopPropagation(); handleUpvote(q.id); }} className="bg-gray-100 dark:bg-gray-800 border-2 border-black rounded-xl p-2 flex flex-col items-center hover:bg-genz-lime transition-colors group">
                          <ArrowUp className="w-5 h-5 text-black dark:text-white font-bold group-hover:-translate-y-1 transition-transform" />
                          <span className="font-display font-bold text-black dark:text-white">{q.upvotes || 0}</span>
                       </button>
                    </div>
                    <div className="flex-1 w-full overflow-hidden">
                       <div className="flex items-center gap-3 mb-4 flex-wrap">
                          <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">{q.category || 'General'}</span>
                          <span className="font-display font-bold text-sm uppercase truncate text-gray-500 dark:text-gray-400">By {q.userName || 'Tribe Member'}</span>
                       </div>
                       <h3 className="font-display font-extrabold text-2xl text-black dark:text-white mb-3 uppercase leading-tight line-clamp-2">{q.title || q.text}</h3>
                       {q.title && <p className="text-gray-500 dark:text-gray-400 font-medium mb-4 line-clamp-2 text-sm">{q.text}</p>}
                       <div className="flex items-center gap-6 mt-4">
                          <div className="flex items-center gap-2 font-bold text-[10px] text-gray-400 uppercase tracking-widest hover:text-lotus-dark dark:text-white">
                             <MessageCircle size={16} className="text-lotus-red/40" /> {q.replies || 0} Answers
                          </div>
                       </div>
                    </div>
                 </motion.div>
               ))
             )}
          </div>
       </div>

       <div className="space-y-8 hidden lg:block">
          <div className="bg-white dark:bg-gray-900 neo-border p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
             <h4 className="font-display font-extrabold uppercase text-lg mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">Hot Topics</h4>
             <div className="space-y-4">
                {['#HalalInvesting', '#CryptoEthics', '#StudentWealth', '#LotusTribe', '#ZakatStrategy'].map(tag => (
                   <div key={tag} className="flex items-center justify-between group cursor-pointer">
                      <span className="font-bold text-gray-500 dark:text-gray-400 hover:text-lotus-red transition-colors">{tag}</span>
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

       {/* Question Modal */}
       <AnimatePresence>
         {selectedQuestion && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-lotus-dark/60 backdrop-blur-sm overflow-y-auto">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-[3rem] neo-border shadow-2xl my-auto relative flex flex-col max-h-[90vh]">
                <button onClick={() => setSelectedQuestion(null)} className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-full transition-colors z-10"><X size={24} /></button>
                
                <div className="p-8 md:p-12 overflow-y-auto w-full">
                  <div className="flex gap-4 border-b border-gray-100 dark:border-gray-800 pb-8 mb-8">
                     <button onClick={() => handleUpvote(selectedQuestion.id, true)} className="mt-2 shrink-0 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl w-14 h-14 flex flex-col items-center justify-center hover:border-black hover:bg-genz-lime transition-all">
                        <ArrowUp size={20} className="font-bold mb-1" />
                        <span className="font-display font-bold">{selectedQuestion.upvotes || 0}</span>
                     </button>
                     <div>
                        <div className="flex items-center gap-3 mb-4">
                           <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400">{selectedQuestion.category || 'General'}</span>
                           <span className="font-display font-bold text-sm uppercase text-gray-400">By {selectedQuestion.userName}</span>
                        </div>
                        <h2 className="font-display font-black text-3xl md:text-4xl text-lotus-dark dark:text-white uppercase leading-tight mb-6">{selectedQuestion.title || selectedQuestion.text}</h2>
                        {selectedQuestion.title && <div className="text-gray-600 dark:text-gray-300 font-medium text-lg whitespace-pre-wrap">{selectedQuestion.text}</div>}
                     </div>
                  </div>

                  <div className="mb-10">
                     <h4 className="font-display font-bold text-xl uppercase mb-6">{selectedQuestion.replies || 0} Answers</h4>
                     <div className="space-y-6">
                        {(selectedQuestion.answers || []).map((ans: any) => (
                           <div key={ans.id} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                              <div className="flex items-center gap-3 mb-4">
                                 <img src={ans.userPhoto || `https://ui-avatars.com/api/?name=${ans.userName}&background=random`} className="w-8 h-8 rounded-full border border-gray-300" alt="Avatar" />
                                 <span className="font-display font-bold text-sm uppercase text-lotus-dark dark:text-white">{ans.userName}</span>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 font-medium whitespace-pre-wrap">{ans.text}</p>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
                     <h4 className="font-display font-bold text-lg uppercase mb-4 text-lotus-dark dark:text-white">Your Answer (+20 XP)</h4>
                     <textarea 
                        value={answerText}
                        onChange={e => setAnswerText(e.target.value)}
                        placeholder="Share your wisdom..."
                        className="w-full bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl p-4 min-h-[100px] mb-4 focus:outline-none focus:border-lotus-red font-medium"
                     />
                     <button onClick={handleAnswerSubmit} disabled={!answerText.trim()} className="neo-btn bg-lotus-dark text-white px-8 py-3 uppercase text-xs disabled:opacity-50">Post Answer</button>
                  </div>
                </div>
             </motion.div>
           </div>
         )}
       </AnimatePresence>
    </motion.div>
  );
};

const Leaderboard = ({ users }: { users: any[] }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto">
       <div className="bg-white dark:bg-gray-900 neo-border p-10 md:p-16 rounded-[4rem] shadow-xl relative overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="absolute top-0 right-0 p-10 opacity-10"><Trophy size={120} /></div>
          
          <div className="relative z-10 text-center mb-16">
             <h2 className="font-display font-black text-5xl md:text-7xl uppercase text-lotus-dark dark:text-white tracking-tighter mb-4">The Top <span className="text-lotus-red italic">Slayers.</span></h2>
             <p className="text-gray-500 dark:text-gray-400 font-medium text-lg uppercase tracking-widest">Elite investors of the Lotus Tribe</p>
          </div>

          <div className="space-y-4">
             {users.map((u, idx) => (
                <div key={u.id} className={`flex items-center gap-6 p-6 rounded-3xl transition-all duration-300 ${idx === 0 ? 'bg-genz-lime border-2 border-lotus-dark/10 scale-105 shadow-xl' : idx === 1 ? 'bg-genz-purple/20 border border-lotus-dark/5' : idx === 2 ? 'bg-genz-pink/20 border border-lotus-dark/5' : 'bg-gray-50 dark:bg-gray-800'}`}>
                   <div className="w-12 font-display font-black text-3xl text-lotus-dark/20">{idx + 1}</div>
                   <img src={u.photoURL || `https://ui-avatars.com/api/?name=${u.displayName || u.email}&background=random`} className="w-14 h-14 rounded-full border-2 border-white shadow-md" alt="Avatar" />
                   <div className="flex-1">
                      <h4 className="font-display font-bold text-xl uppercase text-lotus-dark dark:text-white">{u.displayName || 'Tribe Member'}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{idx === 0 ? '🏆 Master Elder' : idx === 1 ? '🥇 Elite Elder' : idx === 2 ? '🥈 Elder' : 'Investment Pro'}</p>
                   </div>
                   <div className="text-right">
                      <div className="font-display font-black text-2xl text-lotus-dark dark:text-white">{u.xp || 0}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Total XP</div>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </motion.div>
  );
};

const EventsList = ({ events, setEvents }: { events: any[], setEvents: any }) => {
  const { user } = useContext(AuthContext);
  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', location: '', category: 'Live Webinar', description: '' });

  const handleCreateEvent = async () => {
    if (!user || !newEvent.title || !newEvent.date) return;
    try {
      const docData = {
         ...newEvent,
         date: Timestamp.fromDate(new Date(newEvent.date)),
         organizerId: user.uid,
         organizerName: user.displayName || user.email,
         attendees: [],
         createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'events'), docData);
      setEvents(prev => [...prev, { id: docRef.id, ...docData, date: docData.date }].sort((a,b) => a.date.seconds - b.date.seconds));
      setIsCreating(false);
      setNewEvent({ title: '', date: '', time: '', location: '', category: 'Live Webinar', description: '' });
      if (user.uid) await updateDoc(doc(db, 'users', user.uid), { xp: increment(50) }); // Host bonus XP!
    } catch(err) { console.error(err); }
  };

  const handleRSVP = async (event: any) => {
    if (!user) return;
    
    // Check if already attending
    if (event.attendees && event.attendees.includes(user.uid)) return;

    try {
       await updateDoc(doc(db, 'events', event.id), {
          attendees: arrayUnion(user.uid)
       });
       if (user.uid) await updateDoc(doc(db, 'users', user.uid), { xp: increment(30) }); // Attendee bonus XP!
       
       setEvents(events.map(e => e.id === event.id ? {...e, attendees: [...(e.attendees || []), user.uid]} : e));
    } catch(err) { console.error(err); }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full">
       <div className="flex justify-between items-center mb-8">
          <h2 className="font-display font-extrabold text-2xl uppercase">Upcoming Sessions</h2>
          <button onClick={() => setIsCreating(true)} className="neo-btn bg-genz-lime text-lotus-dark dark:text-white px-6 py-3 uppercase font-bold text-xs flex items-center gap-2 border-2 border-black">
             <Plus size={16} /> Host Event
          </button>
       </div>

       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.length === 0 ? (
            <div className="col-span-full py-32 text-center bg-white dark:bg-gray-900 neo-border rounded-[4rem] text-gray-300 font-display font-bold text-2xl uppercase tracking-widest">
               No upcoming events yet.
            </div>
          ) : (
            events.map((event) => {
               const isAttending = user && event.attendees && event.attendees.includes(user.uid);
               let evDate = event.date;
               if (evDate && evDate.toDate) evDate = evDate.toDate();
               else if (typeof evDate === 'string') evDate = new Date(evDate);
               else evDate = new Date();

               return (
                  <div key={event.id} className="bg-white dark:bg-gray-900 rounded-[3rem] neo-border neo-shadow-sm flex flex-col group overflow-hidden hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-gray-100 dark:border-gray-800 relative">
                     <div className="h-48 bg-lotus-dark relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute top-6 right-6 bg-white dark:bg-gray-900 rounded-2xl p-3 shadow-xl text-center min-w-[60px] z-10">
                           <div className="text-lotus-red font-display font-black text-2xl leading-none">{evDate.getDate()}</div>
                           <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{evDate.toLocaleString('default', { month: 'short' })}</div>
                        </div>
                        <div className="absolute bottom-6 left-6 text-white z-10 space-y-2">
                           <span className="bg-genz-lime/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-white/20 inline-block">{event.category || 'Live Webinar'}</span>
                           <h3 className="font-display font-extrabold text-2xl uppercase leading-tight group-hover:text-genz-lime transition-colors">{event.title}</h3>
                        </div>
                     </div>
                     <div className="p-8 flex flex-col flex-1 bg-white dark:bg-gray-900">
                        <p className="text-gray-500 dark:text-gray-400 font-medium mb-6 line-clamp-2 text-sm">{event.description}</p>
                        <div className="space-y-4 mt-auto mb-8">
                           <div className="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                              <MapPin size={16} className="text-lotus-red/60" /> {event.location || 'Zoom'}
                           </div>
                           <div className="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                              <Clock size={16} className="text-lotus-red/60" /> {event.time || 'TBD'}
                           </div>
                           <div className="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                              <Users size={16} className="text-lotus-red/60" /> {(event.attendees || []).length} Attending
                           </div>
                        </div>
                        {isAttending ? (
                           <button disabled className="w-full py-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 font-bold uppercase text-xs flex items-center justify-center gap-2">
                              <CheckCircle2 size={16} /> Spot Secured
                           </button>
                        ) : (
                           <button onClick={(e) => { e.stopPropagation(); handleRSVP(event); }} className="neo-btn bg-lotus-dark text-white w-full py-4 uppercase text-xs shadow-lg flex items-center justify-center gap-2">
                              RSVP (+30 XP)
                           </button>
                        )}
                     </div>
                  </div>
               )
            })
          )}
       </div>

       <AnimatePresence>
          {isCreating && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lotus-dark/80 backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[3rem] p-10 neo-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
                   <button onClick={() => setIsCreating(false)} className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-full transition-colors"><X size={24} /></button>
                   <h2 className="font-display font-black text-3xl uppercase mb-8">Host a Tribe Event</h2>
                   
                   <div className="space-y-6">
                      <div>
                         <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2">Event Title</label>
                         <input value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 font-bold focus:border-lotus-dark focus:outline-none" placeholder="E.g., Crypto AMA" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2">Date</label>
                            <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-4 font-bold text-sm focus:border-lotus-dark focus:outline-none" />
                         </div>
                         <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2">Time</label>
                            <input type="time" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-4 font-bold text-sm focus:border-lotus-dark focus:outline-none" />
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2">Location/URL</label>
                            <input value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} placeholder="Zoom link or city" className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 font-bold focus:border-lotus-dark focus:outline-none" />
                         </div>
                         <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2">Category</label>
                            <select value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 font-bold focus:border-lotus-dark focus:outline-none">
                               <option>Live Webinar</option>
                               <option>Physical Meetup</option>
                               <option>Workshop</option>
                               <option>Casual Chat</option>
                            </select>
                         </div>
                      </div>
                      <div>
                         <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2">Description</label>
                         <textarea value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} placeholder="What's this event about?" className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl p-6 min-h-[100px] font-medium focus:border-lotus-dark focus:outline-none" />
                      </div>
                      <button onClick={handleCreateEvent} disabled={!newEvent.title || !newEvent.date} className="w-full neo-btn bg-genz-lime text-lotus-dark dark:text-white py-5 rounded-2xl font-black uppercase text-sm border-2 border-black mt-4 disabled:opacity-50">Create Event (+50 XP)</button>
                   </div>
                </motion.div>
             </div>
          )}
       </AnimatePresence>
    </motion.div>
  );
};
