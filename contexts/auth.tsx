"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

type UserAuthType = {
  currentUser: any
};

const UserAuthContext = createContext<UserAuthType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children : React.ReactNode}) => { 
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser({});
      }
    });
  }, []);

  return (
    <UserAuthContext.Provider value={{ currentUser }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(UserAuthContext);
