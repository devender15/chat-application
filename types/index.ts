import { User as FirebaseUser } from "firebase/auth";
import { type Dispatch } from "react";


export type UserAuthContextType = [
    FirebaseUser | null,
    Dispatch<React.SetStateAction<FirebaseUser | null>>
  ];