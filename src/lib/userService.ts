import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment, arrayUnion } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { User } from 'firebase/auth';
import { sendEmailNotification } from './email';

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
  kycCompleted?: boolean;
  kycTier?: 'tier1' | 'tier2' | 'tier3';
  tier1Completed?: boolean;
  tier2Completed?: boolean;
  depositLimit?: number | null;
  firstInvestmentCompleted?: boolean;
  autoInvest?: any[];
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
      
      // Send welcome email
      if (newProfile.email) {
          sendEmailNotification(newProfile.email, 'Welcome to Lotus Tribe!', `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
                  <h2 style="color: #0A0A0A; text-transform: uppercase;">Welcome to Lotus Tribe</h2>
                  <p>Hi ${newProfile.displayName},</p>
                  <p>We're thrilled to have you join Lotus Tribe! Your journey to financial wellbeing starts here.</p>
                  <p>Explore our Halal and Fixed Income funds, complete the Investor Vibe Check, and join the community.</p>
                  <p>Welcome aboard!</p>
              </div>
          `).catch(console.error); // Catch any unhandled promise rejections silently
      }

      return newProfile;
    }
    return { uid: userSnap.id, ...userSnap.data() } as UserProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'users');
    throw error;
  }
};

export const completeLesson = async (
  uid: string,
  courseId: string,
  lessonIdx: number,
  xpGained: number,
  alreadyCompleted: boolean = false
) => {
   const userRef = doc(db, 'users', uid);
   const lessonId = `${courseId}_lesson_${lessonIdx}`;
   
   try {
      const updateData: Record<string, unknown> = {
         completedLessons: arrayUnion(lessonId),
         updatedAt: serverTimestamp()
      };
      // Only increment XP if lesson wasn't previously completed
      if (!alreadyCompleted && xpGained > 0) {
         updateData.xp = increment(xpGained);
      }
      await updateDoc(userRef, updateData);
   } catch(e) {
      handleFirestoreError(e, OperationType.UPDATE, 'users');
   }
};

export const completeCourse = async (
  uid: string,
  courseId: string,
  badgeName?: string,
  bonusXp: number = 50,
  alreadyCompleted: boolean = false
) => {
   const userRef = doc(db, 'users', uid);
   try {
      const updateData: Record<string, unknown> = {
         completedCourses: arrayUnion(courseId),
         updatedAt: serverTimestamp()
      };
      if (badgeName) {
         updateData.badges = arrayUnion(badgeName);
      }
      if (!alreadyCompleted && bonusXp > 0) {
         updateData.xp = increment(bonusXp);
      }
      await updateDoc(userRef, updateData);
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
