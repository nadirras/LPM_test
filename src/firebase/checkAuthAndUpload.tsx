import { onAuthStateChanged } from "firebase/auth";
import { auth, storage } from "./firebaseConfig";
import { ref, uploadBytes } from "firebase/storage";

export const checkAuthAndUpload = async (file: File | null) => {
  return new Promise<string>((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Your file upload logic here
          const fileRef = ref(storage, `uploads/${user.uid}/${file?.name}`);
          await uploadBytes(fileRef, file);
          resolve(fileRef.fullPath); // Return file path or URL
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error("User is not authenticated"));
      }
      unsubscribe();
    });
  });
};

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const provider = new GoogleAuthProvider();

const loginWithGoogle = async () => {
  try {
    await signInWithPopup(auth, provider);
    console.log("User logged in with Google");
  } catch (error) {
    console.error("Google login error:", error);
  }
};

loginWithGoogle();

const checkAuthState = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User authenticated:", user);
    } else {
      console.log("No user authenticated");
    }
  });
};

checkAuthState(); // Call this function to check auth state
