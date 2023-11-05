"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type Dispatch
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { User as FirebaseUser } from "firebase/auth";

type UserAuthType = [
  FirebaseUser | null,
  Dispatch<React.SetStateAction<FirebaseUser | null>>
]


const UserAuthContext = createContext<UserAuthType>([null, () => {}]);

export const AuthProvider = ({ children }: { children : React.ReactNode}) => { 
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  }, []);

  return (
    <UserAuthContext.Provider value={[currentUser, setCurrentUser]}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(UserAuthContext);
