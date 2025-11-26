import * as dotenv from 'dotenv';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, Auth, UserInfo } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, Firestore } from 'firebase/firestore';
import { User, UserPreferences, SubscriptionTier, AIProvider } from '../../../shared/types/user'; // Using direct relative path

dotenv.config();

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthService {
  private auth: Auth;
  private firestore: Firestore;
  private firebaseApp: FirebaseApp;

  constructor() {
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    };

    this.firebaseApp = initializeApp(firebaseConfig);
    this.auth = getAuth(this.firebaseApp);
    this.firestore = getFirestore(this.firebaseApp);
  }

  async signInWithGoogle(): Promise<{ user: User; token: string }> {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');

    try {
      const result = await signInWithPopup(this.auth, provider);
      const user = await this.createOrUpdateUserProfile(result.user);
      const token = await result.user.getIdToken();

      return { user, token };
    } catch (error: any) {
      console.error("Firebase Sign-In Error:", error);
      throw new AuthenticationError(error.message || 'Failed to sign in with Google');
    }
  }

  private async createOrUpdateUserProfile(firebaseUser: UserInfo): Promise<User> {
    const userRef = doc(this.firestore, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    let user: User;

    if (userSnap.exists()) {
      user = { ...userSnap.data(), id: firebaseUser.uid } as User;
      // Update lastActiveAt on existing user
      user.lastActiveAt = new Date();
      await setDoc(userRef, { lastActiveAt: user.lastActiveAt }, { merge: true });
    } else {
      user = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.displayName || 'Anonymous',
        avatar: firebaseUser.photoURL,
        level: 'novice', // Default level
        preferences: this.getDefaultPreferences(),
        subscription: this.getDefaultSubscription(),
        createdAt: new Date(),
        lastActiveAt: new Date()
      };

      await setDoc(userRef, user);
    }

    return user;
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        browser: true
      },
      defaultAIProvider: 'gemini', // Default AI provider
      autoSave: true
    };
  }

  private getDefaultSubscription(): SubscriptionTier {
    return {
      type: 'free',
      features: ['basic_templates', '1_ai_model'],
      limits: {
        promptsPerMonth: 50,
        aiRequestsPerMonth: 100,
        storageGB: 0.1,
        teamMembers: 1
      }
    };
  }
}
