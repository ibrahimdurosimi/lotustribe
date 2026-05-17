import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment, arrayUnion } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { User } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  riskProfile?: string;
  quizCompleted?: boolean;
  xp: number;
  level: number;
  completedLessons: string[];
  completedCourses: string[];
  badges: string[];
  fifBalance: number;
  halalBalance: number;
  totalInvested: number;
  createdAt: any;
  updatedAt: any;
}

export const syncUserProfile = async (user: User): Promise<UserProfile> => {
  const userRef = doc(db, 'users', user.uid);
  try {
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Investor',
        xp: 0,
        level: 1,
        completedLessons: [],
        completedCourses: [],
        badges: [],
        fifBalance: 0,
        halalBalance: 0,
        totalInvested: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    }
    return { uid: userSnap.id, ...userSnap.data() } as UserProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'users');
    throw error;
  }
};

export const completeLesson = async (uid: string, courseId: string, lessonIdx: number, xpGained: number) => {
   const userRef = doc(db, 'users', uid);
   const lessonId = `${courseId}_lesson_${lessonIdx}`;
   
   try {
      // For simplicity, we just add the lesson and the XP.
      await updateDoc(userRef, {
         completedLessons: arrayUnion(lessonId),
         xp: increment(xpGained),
         updatedAt: serverTimestamp()
      });
   } catch(e) {
      handleFirestoreError(e, OperationType.UPDATE, 'users');
   }
};

export const depositFunds = async (uid: string, amount: number, fundType: 'fif' | 'halal') => {
   const userRef = doc(db, 'users', uid);
   try {
      const updateData: any = {
         totalInvested: increment(amount),
         updatedAt: serverTimestamp()
      };
      if (fundType === 'fif') {
         updateData.fifBalance = increment(amount);
      } else {
         updateData.halalBalance = increment(amount);
      }
      await updateDoc(userRef, updateData);
   } catch(e) {
      handleFirestoreError(e, OperationType.UPDATE, 'users');
   }
};
