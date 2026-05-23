import React, { useState, useEffect, useContext } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  ChevronDown, 
  ChevronUp, 
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  AlertCircle,
  Video,
  Image as ImageIcon,
  CheckCircle,
  HelpCircle,
  Calendar
} from 'lucide-react';
import { 
  db, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  getDocs, 
  orderBy, 
  Timestamp,
  doc
} from './lib/firebase';
import { coursesData } from './data/courses';
import { AuthContext } from './App';
import { motion, AnimatePresence } from 'motion/react';

const Notification = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-10 right-10 z-[200] px-6 py-4 rounded-2xl shadow-xl border-2 flex items-center gap-3 font-bold uppercase text-sm ${
        type === 'success' ? 'bg-genz-lime border-black text-lotus-dark dark:text-white' : 'bg-red-500 border-white text-white'
      }`}
    >
      {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      {message}
    </motion.div>
  );
};

export const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingModule, setIsEditingModule] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<any>(null);
  const [currentModule, setCurrentModule] = useState<any>(null);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState<'courses' | 'modules' | 'events'>('courses');

  // Admin emails
  const adminEmails = ['ibrahimdurosimi@gmail.com']; 
  const isAdmin = user && adminEmails.includes(user.email || '');

  useEffect(() => {
    if (isAdmin) {
      fetchData();
      
      // Handle auto-bootstrap from LMS link
      const params = new URLSearchParams(window.location.search);
      if (params.get('action') === 'bootstrap') {
         handleBootstrap();
         // Clean URL
         window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [isAdmin]);

  const [events, setEvents] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cq = query(collection(db, 'courses'), orderBy('id'));
      const mq = query(collection(db, 'modules'), orderBy('order', 'asc'));
      const eq = query(collection(db, 'events'), orderBy('date', 'asc'));
      
      const [cSnap, mSnap, eSnap] = await Promise.all([
        getDocs(cq), 
        getDocs(mq),
        getDocs(eq)
      ]);
      
      setCourses(cSnap.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() })));
      setModules(mSnap.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() })));
      setEvents(eSnap.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
      notify("Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  const notify = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const handleBootstrap = async () => {
    setLoading(true);
    try {
      // 1. Clean existing modules/courses to prevent duplicates if user wants a fresh start
      // Note: In a real app we might just skip existing ones, but here we want to "Restore"
      
      // Bootstrap Modules
      const defaultModules = [
        { id: 'MODULE 0', title: 'THE WAKE UP', order: 0 },
        { id: 'MODULE 1', title: 'THE ARSENAL', order: 1 },
        { id: 'MODULE 2', title: 'THE STRATEGY', order: 2 },
        { id: 'MODULE 3', title: 'ADVANCED MOVES', order: 3 },
        { id: 'MODULE 4', title: 'THE LOTUS TRIBE SPECIAL', order: 4 }
      ];

      for (const m of defaultModules) {
        // Check if exists
        const exists = modules.find(existing => existing.id === m.id);
        if (!exists) {
          await addDoc(collection(db, 'modules'), { ...m, createdAt: Timestamp.now() });
        }
      }

      // Bootstrap Courses
      for (const course of coursesData) {
        const exists = courses.find(existing => existing.id === course.id);
        if (!exists) {
          await addDoc(collection(db, 'courses'), {
            ...course,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          });
        }
      }

      // Bootstrap Sample Event
      await addDoc(collection(db, 'events'), {
        title: 'Tribe Welcome Webinar',
        date: Timestamp.fromDate(new Date(Date.now() + 86400000 * 7)),
        time: '7:00 PM GMT',
        location: 'Zoom',
        category: 'Live Webinar',
        createdAt: Timestamp.now()
      });

      notify("Tribe Knowledge Restored!", "success");
      fetchData();
    } catch (err) {
      console.error(err);
      notify("Restore failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (col: string, id: string) => {
    try {
      await deleteDoc(doc(db, col, id));
      notify("Deleted successfully", "success");
      fetchData();
    } catch (err) {
      notify("Delete failed", "error");
    }
  };

  const startEdit = (course: any) => {
    setCurrentCourse(course);
    setIsEditing(true);
  };

  const startNew = () => {
    const defaultModule = modules.length > 0 ? `${modules[0].id}: ${modules[0].title}` : 'MODULE 0: THE WAKE UP';
    setCurrentCourse({
        id: '',
        title: '',
        module: defaultModule,
        level: 'Beginner',
        xp: 100,
        badgeName: '',
        badgeIcon: '📂',
        color: 'bg-gray-100 dark:bg-gray-800',
        accent: 'bg-gray-50 dark:bg-gray-8000',
        lessons: [{ id: 'lesson-1', title: 'New Lesson', readTime: '5 minutes', content: '<p>Content here...</p>', videoUrl: '', imageUrl: '' }],
        quiz: [{ question: 'Sample Question?', options: ['Option 1', 'Option 2', 'Option 3'], correctAnswer: 0 }]
    });
    setIsEditing(true);
  };

  const startNewModule = () => {
    setCurrentModule({ id: '', title: '', order: modules.length });
    setIsEditingModule(true);
  };

  const saveCourse = async () => {
    if (!currentCourse.id || !currentCourse.title) {
        notify("ID and Title are required.", "error");
        return;
    }
    setLoading(true);
    try {
      if (currentCourse.firestoreId) {
        const { firestoreId, ...data } = currentCourse;
        await updateDoc(doc(db, 'courses', firestoreId), { ...data, updatedAt: Timestamp.now() });
        notify("Course updated!", "success");
      } else {
        await addDoc(collection(db, 'courses'), { ...currentCourse, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
        notify("Course published!", "success");
      }
      setIsEditing(false);
      setCurrentCourse(null);
      fetchData();
    } catch (err) {
      notify("Failed to save.", "error");
    } finally {
      setLoading(false);
    }
  };

  const saveModule = async () => {
    if (!currentModule.id || !currentModule.title) {
      notify("ID and Title are required.", "error");
      return;
    }
    try {
      if (currentModule.firestoreId) {
        const { firestoreId, ...data } = currentModule;
        await updateDoc(doc(db, 'modules', firestoreId), { ...data });
        notify("Module updated!", "success");
      } else {
        await addDoc(collection(db, 'modules'), { ...currentModule, createdAt: Timestamp.now() });
        notify("Module created!", "success");
      }
      setIsEditingModule(false);
      setCurrentModule(null);
      fetchData();
    } catch (err) {
      notify("Failed to save module.", "error");
    }
  };

  const saveEvent = async () => {
    if (!currentEvent.title || !currentEvent.date) {
      notify("Title and Date are required.", "error");
      return;
    }
    try {
      const data = {
        title: currentEvent.title,
        date: typeof currentEvent.date === 'string' ? Timestamp.fromDate(new Date(currentEvent.date)) : currentEvent.date,
        time: currentEvent.time,
        location: currentEvent.location,
        category: currentEvent.category,
        updatedAt: Timestamp.now()
      };

      if (currentEvent.firestoreId) {
        await updateDoc(doc(db, 'events', currentEvent.firestoreId), data);
        notify("Event updated!", "success");
      } else {
        await addDoc(collection(db, 'events'), { ...data, createdAt: Timestamp.now() });
        notify("Event created!", "success");
      }
      setIsEditingEvent(false);
      setCurrentEvent(null);
      fetchData();
    } catch (err) {
      notify("Failed to save event.", "error");
    }
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900 rounded-3xl neo-border neo-shadow max-w-md mx-auto mt-24">
        <div className="text-6xl mb-6">🚫</div>
        <h2 className="text-3xl font-display font-black uppercase text-lotus-dark dark:text-white mb-4">Access Denied</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 font-medium mb-8">This portal is for Lotus Tribe elders only. Please return to the training grounds.</p>
        <button onClick={() => window.location.href = '/learn'} className="neo-btn bg-lotus-dark text-white px-8 py-3 uppercase">Back to Hub</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pt-8 pb-20">
      <AnimatePresence>
        {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
          <div className="inline-block px-4 py-1.5 rounded-full bg-genz-purple text-white font-display font-bold text-xs tracking-wider uppercase mb-6 shadow-sm">
             Architect Mode
          </div>
          <h1 className="font-display font-black text-5xl md:text-7xl text-lotus-dark dark:text-white leading-none uppercase tracking-tighter">
            Curate <span className="text-lotus-red">Knowledge.</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl flex gap-1">
             <button onClick={() => setActiveTab('courses')} className={`px-6 py-3 rounded-xl font-bold uppercase text-xs transition-all ${activeTab === 'courses' ? 'bg-white dark:bg-gray-900 shadow-sm text-lotus-dark dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:text-gray-300'}`}>Courses</button>
             <button onClick={() => setActiveTab('modules')} className={`px-6 py-3 rounded-xl font-bold uppercase text-xs transition-all ${activeTab === 'modules' ? 'bg-white dark:bg-gray-900 shadow-sm text-lotus-dark dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:text-gray-300'}`}>Modules</button>
             <button onClick={() => setActiveTab('events')} className={`px-6 py-3 rounded-xl font-bold uppercase text-xs transition-all ${activeTab === 'events' ? 'bg-white dark:bg-gray-900 shadow-sm text-lotus-dark dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:text-gray-300'}`}>Events</button>
          </div>
          {activeTab === 'courses' ? (
            <button onClick={startNew} className="neo-btn bg-lotus-dark text-white px-8 py-4 uppercase flex items-center gap-3 font-bold shadow-xl">
              <Plus size={20} /> New Course
            </button>
          ) : activeTab === 'modules' ? (
            <button onClick={startNewModule} className="neo-btn bg-lotus-dark text-white px-8 py-4 uppercase flex items-center gap-3 font-bold shadow-xl">
              <Plus size={20} /> New Module
            </button>
          ) : (
            <button onClick={() => { setCurrentEvent({ title: '', date: '', time: '6:00 PM', location: 'Zoom', category: 'Live Webinar' }); setIsEditingEvent(true); }} className="neo-btn bg-lotus-dark text-white px-8 py-4 uppercase flex items-center gap-3 font-bold shadow-xl">
              <Plus size={20} /> New Event
            </button>
          )}
        </div>
      </div>

      {activeTab === 'courses' ? (
        <div className="grid gap-6">
          {(loading && courses.length === 0) ? (
            <div className="p-20 text-center font-display font-bold text-2xl animate-pulse text-gray-300 uppercase">Indexing Courses...</div>
          ) : courses.length > 0 ? (
            courses.map(course => (
              <div key={course.firestoreId} className="bg-white dark:bg-gray-900 rounded-[2.5rem] neo-border neo-shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-8 hover:-translate-y-1 transition-transform border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-8 w-full md:w-auto">
                  <div className={`w-20 h-20 rounded-3xl ${course.color} flex items-center justify-center text-5xl shadow-inner shrink-0`}>
                      {course.badgeIcon}
                  </div>
                  <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{course.module}</p>
                      <h3 className="font-display font-bold text-2xl text-lotus-dark dark:text-white uppercase leading-tight">{course.title}</h3>
                      <div className="flex gap-4 mt-2">
                        <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded font-bold uppercase">{course.level}</span>
                        <span className="text-[10px] text-lotus-red font-bold uppercase">{course.lessons?.length || 0} Lessons • {course.quiz?.length || 0} Quiz Qs</span>
                      </div>
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={() => startEdit(course)} className="flex-1 md:flex-none py-3 px-6 bg-white dark:bg-gray-900 border-2 border-lotus-dark rounded-xl font-bold uppercase text-xs flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Edit2 size={16} /> Edit
                    </button>
                    <button onClick={() => handleDelete('courses', course.firestoreId)} className="flex-1 md:flex-none py-3 px-6 bg-red-50 text-red-600 border-2 border-red-100 rounded-xl font-bold uppercase text-xs flex items-center justify-center gap-2 hover:bg-red-100">
                      <Trash2 size={16} /> Delete
                    </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-24 text-center bg-white dark:bg-gray-900 neo-border rounded-[4rem] border-dashed border-4 border-gray-100 dark:border-gray-800">
               <div className="text-6xl mb-8">📭</div>
               <h3 className="font-display font-black text-3xl uppercase text-lotus-dark dark:text-white mb-4">No Knowledge Found</h3>
               <p className="text-gray-400 font-bold uppercase text-xs mb-10">You have no courses in the database. Restore original data to begin.</p>
               <button onClick={handleBootstrap} className="neo-btn bg-genz-lime text-lotus-dark dark:text-white px-10 py-4 uppercase font-bold text-sm shadow-xl border-2 border-black">
                  Restore Tribe Data
               </button>
            </div>
          )}
        </div>
      ) : activeTab === 'modules' ? (
        <div className="grid gap-6">
          {modules.map(mod => (
            <div key={mod.firestoreId} className="bg-white dark:bg-gray-900 rounded-[2rem] neo-border neo-shadow-sm p-6 flex items-center justify-between gap-6 border border-gray-100 dark:border-gray-800">
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center font-black text-xl text-gray-400">
                    {mod.order}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{mod.id}</p>
                    <h3 className="font-display font-bold text-xl uppercase">{mod.title}</h3>
                  </div>
               </div>
               <div className="flex gap-2">
                  <button onClick={() => { setCurrentModule(mod); setIsEditingModule(true); }} className="p-3 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"><Edit2 size={16}/></button>
                  <button onClick={() => handleDelete('modules', mod.firestoreId)} className="p-3 bg-red-50 text-red-600 border-2 border-red-100 rounded-xl hover:bg-red-100"><Trash2 size={16}/></button>
               </div>
            </div>
          ))}
          <button onClick={startNewModule} className="p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[2rem] text-gray-400 font-bold uppercase hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-3">
             <Plus size={20} /> Add New Module
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
           {events.map(event => (
              <div key={event.firestoreId} className="bg-white dark:bg-gray-900 rounded-[2rem] neo-border neo-shadow-sm p-6 flex items-center justify-between gap-6 border border-gray-100 dark:border-gray-800">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-lotus-red/10 rounded-2xl flex items-center justify-center text-lotus-red">
                       <Calendar size={28} />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{event.category} • {event.time}</p>
                       <h3 className="font-display font-bold text-xl uppercase">{event.title}</h3>
                       <p className="text-xs font-bold text-gray-400 uppercase">{event.location}</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => { setCurrentEvent(event); setIsEditingEvent(true); }} className="p-3 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete('events', event.firestoreId)} className="p-3 bg-red-50 text-red-600 border-2 border-red-100 rounded-xl hover:bg-red-100"><Trash2 size={16}/></button>
                 </div>
              </div>
           ))}
           <button onClick={() => { setCurrentEvent({ title: '', date: '', time: '6:00 PM', location: 'Zoom', category: 'Live Webinar' }); setIsEditingEvent(true); }} className="p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[2rem] text-gray-400 font-bold uppercase hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-3">
              <Plus size={20} /> Create New Event
           </button>
        </div>
      )}

      {/* Module Editor Modal */}
      <AnimatePresence>
        {isEditingModule && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-lotus-dark/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[3rem] p-8 neo-border neo-shadow">
               <h2 className="font-display font-black text-3xl uppercase mb-8">Manage Module</h2>
               <div className="space-y-6 mb-10">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2">Module ID (e.g. MODULE 0)</label>
                    <input value={currentModule.id} onChange={e => setCurrentModule({...currentModule, id: e.target.value.toUpperCase()})} className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2">Title</label>
                    <input value={currentModule.title} onChange={e => setCurrentModule({...currentModule, title: e.target.value.toUpperCase()})} className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2">Order (Sorting)</label>
                    <input type="number" value={currentModule.order} onChange={e => setCurrentModule({...currentModule, order: parseInt(e.target.value)})} className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 font-bold" />
                  </div>
               </div>
               <div className="flex gap-3">
                  <button onClick={saveModule} className="flex-1 py-4 bg-genz-lime rounded-2xl font-black uppercase text-sm border-2 border-black">Save Module</button>
                  <button onClick={() => setIsEditingModule(false)} className="px-6 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold uppercase text-xs">Cancel</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Event Editor Modal */}
      <AnimatePresence>
        {isEditingEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-lotus-dark/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[3rem] p-8 neo-border neo-shadow">
               <h2 className="font-display font-black text-3xl uppercase mb-8">Manage Event</h2>
               <div className="space-y-4 mb-10">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2">Event Title</label>
                    <input value={currentEvent.title} onChange={e => setCurrentEvent({...currentEvent, title: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2">Date</label>
                      <input type="date" value={currentEvent.date instanceof Timestamp ? currentEvent.date.toDate().toISOString().split('T')[0] : currentEvent.date} onChange={e => setCurrentEvent({...currentEvent, date: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-4 font-bold text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2">Time</label>
                      <input value={currentEvent.time} onChange={e => setCurrentEvent({...currentEvent, time: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-4 font-bold text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2">Location/URL</label>
                    <input value={currentEvent.location} onChange={e => setCurrentEvent({...currentEvent, location: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2">Category</label>
                    <select value={currentEvent.category} onChange={e => setCurrentEvent({...currentEvent, category: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 font-bold appearance-none cursor-pointer">
                       <option>Live Webinar</option>
                       <option>Physical Meetup</option>
                       <option>Workshop</option>
                    </select>
                  </div>
               </div>
               <div className="flex gap-3">
                  <button onClick={saveEvent} className="flex-1 py-4 bg-genz-lime rounded-2xl font-black uppercase text-sm border-2 border-black">Save Event</button>
                  <button onClick={() => setIsEditingEvent(false)} className="px-6 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold uppercase text-xs">Cancel</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-lotus-dark/40 backdrop-blur-sm">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="bg-white dark:bg-gray-900 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] neo-border neo-shadow-sm p-8 md:p-12 relative"
            >
               <button onClick={() => setIsEditing(false)} className="absolute top-8 right-8 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                  <X size={28} />
               </button>

               <h2 className="font-display font-black text-4xl uppercase mb-10 text-lotus-dark dark:text-white">
                  {currentCourse.firestoreId ? 'Edit Course' : 'Create Course'}
               </h2>

               <div className="grid md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-6">
                     <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2 tracking-widest pl-1">Course Title</label>
                        <input 
                           type="text" 
                           value={currentCourse.title}
                           onChange={(e) => setCurrentCourse({...currentCourse, title: e.target.value})}
                           className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-lotus-dark font-display font-bold text-lg"
                        />
                     </div>
                     <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2 tracking-widest pl-1">Module</label>
                        <select 
                           value={currentCourse.module}
                           onChange={(e) => setCurrentCourse({...currentCourse, module: e.target.value})}
                           className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-lotus-dark font-bold appearance-none cursor-pointer"
                        >
                           {modules.length > 0 ? (
                             modules.map(mod => <option key={mod.id} value={`${mod.id}: ${mod.title}`}>{mod.id}: {mod.title}</option>)
                           ) : (
                             <>
                               <option>MODULE 0: THE WAKE UP</option>
                               <option>MODULE 1: THE ARSENAL</option>
                             </>
                           )}
                        </select>
                     </div>
                     <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2 tracking-widest pl-1">Level</label>
                        <select 
                           value={currentCourse.level}
                           onChange={(e) => setCurrentCourse({...currentCourse, level: e.target.value})}
                           className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-lotus-dark font-bold appearance-none"
                        >
                           <option>Beginner</option>
                           <option>Intermediate</option>
                           <option>Advanced</option>
                        </select>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2 tracking-widest pl-1">Badge Name</label>
                           <input 
                              type="text" 
                              value={currentCourse.badgeName}
                              onChange={(e) => setCurrentCourse({...currentCourse, badgeName: e.target.value})}
                              className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 font-bold"
                           />
                        </div>
                        <div>
                           <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2 tracking-widest pl-1">Icon (Emoji)</label>
                           <input 
                              type="text" 
                              value={currentCourse.badgeIcon}
                              onChange={(e) => setCurrentCourse({...currentCourse, badgeIcon: e.target.value})}
                              className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-center text-2xl"
                           />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2 tracking-widest pl-1">XP</label>
                           <input type="number" value={currentCourse.xp} onChange={e => setCurrentCourse({...currentCourse, xp: parseInt(e.target.value)})} className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 font-bold" />
                        </div>
                        <div>
                           <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2 tracking-widest pl-1">ID Slug</label>
                           <input value={currentCourse.id} onChange={e => setCurrentCourse({...currentCourse, id: e.target.value.toLowerCase().replace(/ /g, '-')})} className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 font-mono text-sm" />
                        </div>
                     </div>
                  </div>
               </div>

               {/* Lessons Editor */}
               <div className="mb-12">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="font-display font-bold text-xl uppercase text-gray-400">Lessons</h3>
                     <button 
                        onClick={() => {
                           const lessons = [...(currentCourse.lessons || [])];
                           lessons.push({ id: `lesson-${lessons.length + 1}`, title: 'New Lesson', readTime: '5 minutes', content: '', videoUrl: '', imageUrl: '' });
                           setCurrentCourse({...currentCourse, lessons});
                        }}
                        className="text-sm font-bold uppercase text-lotus-red flex items-center gap-2 border-b-2 border-lotus-red pb-1"
                     >
                        <PlusCircle size={16} /> Add Lesson
                     </button>
                  </div>
                  
                  <div className="space-y-6">
                     {currentCourse.lessons?.map((lesson: any, idx: number) => (
                        <div key={idx} className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8">
                           <div className="flex justify-between items-start mb-6">
                              <span className="bg-white dark:bg-gray-900 border-2 border-black w-10 h-10 rounded-full flex items-center justify-center font-black text-sm">{idx + 1}</span>
                              <button onClick={() => {
                                 const lessons = currentCourse.lessons.filter((_: any, i: number) => i !== idx);
                                 setCurrentCourse({...currentCourse, lessons});
                              }} className="text-red-400 hover:text-red-600"><Trash2 size={24} /></button>
                           </div>
                           
                           <div className="grid md:grid-cols-2 gap-4 mb-6">
                              <input placeholder="Title" value={lesson.title} onChange={e => {
                                 const lessons = [...currentCourse.lessons]; lessons[idx].title = e.target.value; setCurrentCourse({...currentCourse, lessons});
                              }} className="w-full bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-3 font-bold" />
                              <input placeholder="Read Time (e.g. 5m)" value={lesson.readTime} onChange={e => {
                                 const lessons = [...currentCourse.lessons]; lessons[idx].readTime = e.target.value; setCurrentCourse({...currentCourse, lessons});
                              }} className="w-full bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-3" />
                           </div>

                           <div className="grid md:grid-cols-2 gap-4 mb-6">
                              <div className="relative">
                                 <Video className="absolute left-4 top-4 text-gray-300" size={18} />
                                 <input placeholder="Video URL (Youtube/Vimeo)" value={lesson.videoUrl} onChange={e => {
                                    const lessons = [...currentCourse.lessons]; lessons[idx].videoUrl = e.target.value; setCurrentCourse({...currentCourse, lessons});
                                 }} className="w-full bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl pl-12 pr-6 py-3 text-sm" />
                              </div>
                              <div className="relative">
                                 <ImageIcon className="absolute left-4 top-4 text-gray-300" size={18} />
                                 <input placeholder="Image URL" value={lesson.imageUrl} onChange={e => {
                                    const lessons = [...currentCourse.lessons]; lessons[idx].imageUrl = e.target.value; setCurrentCourse({...currentCourse, lessons});
                                 }} className="w-full bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl pl-12 pr-6 py-3 text-sm" />
                              </div>
                           </div>

                           <textarea placeholder="Lesson Content (HTML allowed)" value={lesson.content} onChange={e => {
                              const lessons = [...currentCourse.lessons]; lessons[idx].content = e.target.value; setCurrentCourse({...currentCourse, lessons});
                           }} className="w-full bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 font-mono text-xs h-40" />
                        </div>
                     ))}
                  </div>
               </div>

               {/* Quiz Editor */}
               <div className="mb-12 border-t pt-12 border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="font-display font-bold text-xl uppercase text-gray-400 flex items-center gap-2"><HelpCircle /> Final Quiz</h3>
                     <button 
                        onClick={() => {
                           const quiz = [...(currentCourse.quiz || [])];
                           quiz.push({ question: 'New Question', options: ['', '', ''], correctAnswer: 0 });
                           setCurrentCourse({...currentCourse, quiz});
                        }}
                        className="text-sm font-bold uppercase text-lotus-red flex items-center gap-2 border-b-2 border-lotus-red pb-1"
                     >
                        <PlusCircle size={16} /> Add Question
                     </button>
                  </div>
                  
                  <div className="space-y-6">
                     {currentCourse.quiz?.map((q: any, qIdx: number) => (
                        <div key={qIdx} className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8">
                           <div className="flex justify-between items-center mb-6">
                              <span className="font-black text-xs uppercase tracking-widest text-gray-400">Question {qIdx + 1}</span>
                              <button onClick={() => {
                                 const quiz = currentCourse.quiz.filter((_: any, i: number) => i !== qIdx);
                                 setCurrentCourse({...currentCourse, quiz});
                              }} className="text-red-400"><Trash2 size={20} /></button>
                           </div>
                           <input value={q.question} onChange={e => {
                              const quiz = [...currentCourse.quiz]; quiz[qIdx].question = e.target.value; setCurrentCourse({...currentCourse, quiz});
                           }} className="w-full bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 font-bold mb-4" />
                           
                           <div className="space-y-3">
                              {q.options.map((opt: string, oIdx: number) => (
                                 <div key={oIdx} className="flex gap-3 items-center">
                                    <input type="radio" checked={q.correctAnswer === oIdx} onChange={() => {
                                       const quiz = [...currentCourse.quiz]; quiz[qIdx].correctAnswer = oIdx; setCurrentCourse({...currentCourse, quiz});
                                    }} />
                                    <input value={opt} onChange={e => {
                                       const quiz = [...currentCourse.quiz]; quiz[qIdx].options[oIdx] = e.target.value; setCurrentCourse({...currentCourse, quiz});
                                    }} className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm" placeholder={`Option ${oIdx + 1}`} />
                                 </div>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="flex gap-4">
                  <button onClick={saveCourse} disabled={loading} className="flex-1 neo-btn bg-genz-lime text-lotus-dark dark:text-white py-5 uppercase font-black text-xl flex items-center justify-center gap-3">
                     {loading ? 'Processing...' : <><Save size={24} /> Publish Everything</>}
                  </button>
                  <button onClick={() => setIsEditing(false)} className="px-10 py-5 bg-gray-100 dark:bg-gray-800 rounded-3xl font-bold uppercase text-gray-500 dark:text-gray-400 hover:bg-gray-200">Cancel</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
