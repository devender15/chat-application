"use client";

import { createContext, useContext, useState, PropsWithChildren } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";


type UserAuthType = {
    user: object,
};

export const UserAuthContext = createContext<UserAuthType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
    const [user, setUser] = useState({});

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
        } else {
            setUser({});
        }
    });

    return (
        <UserAuthContext.Provider value={{ user }}>
            {children}
        </UserAuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(UserAuthContext);
