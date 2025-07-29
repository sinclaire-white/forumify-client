import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.init";
import { AuthContext } from "./AuthContext";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Helper: fetch role/badge from backend
  const fetchUserRoleBadge = async (email) => {
    try {
      const res = await fetch(
        `https://forum-server-ten-khaki.vercel.app/users/check-email?email=${email}`
      );
      const data = await res.json();
      if (data.exists) {
        return {
          role: data.user.role || "user",
          badge: data.user.badge || "bronze",
        };
      }
      return { role: "user", badge: "bronze" };
    } catch (error) {
      console.error("Error fetching role/badge:", error);
      return { role: "user", badge: "bronze" };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser?.email) {
        const { role, badge } = await fetchUserRoleBadge(currentUser.email);
        setUser({ ...currentUser, role, badge });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = () => {
    return signOut(auth);
  };

  const updateUserProfile = (name, photoURL) => {
    if (!auth.currentUser)
      return Promise.reject(new Error("No user logged in"));
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL || "",
    });
  };

  const userInfo = {
    user, // includes role and badge
    createUser,
    loginUser,
    signInWithGoogle,
    updateUserProfile,
    loading,
    logOut,
  };

  return <AuthContext value={userInfo}>{children}</AuthContext>;
};

export default AuthProvider;
