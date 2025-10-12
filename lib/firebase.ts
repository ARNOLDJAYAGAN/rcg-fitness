import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Only read env vars in the browser
const firebaseConfig = {
  apiKey: typeof window !== "undefined" ? process.env.NEXT_PUBLIC_FIREBASE_API_KEY : "",
  authDomain: typeof window !== "undefined" ? process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN : "",
  projectId: typeof window !== "undefined" ? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID : "",
  storageBucket: typeof window !== "undefined" ? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET : "",
  messagingSenderId: typeof window !== "undefined" ? process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID : "",
  appId: typeof window !== "undefined" ? process.env.NEXT_PUBLIC_FIREBASE_APP_ID : "",
}

let app: FirebaseApp | undefined

if (typeof window !== "undefined") {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]
}

// ✅ Tell TypeScript this is definitely not undefined in the browser
export const auth = typeof window !== "undefined" ? getAuth(app!) : null
export const db = typeof window !== "undefined" ? getFirestore(app!) : null
