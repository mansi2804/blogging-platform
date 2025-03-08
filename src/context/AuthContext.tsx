// AuthContext.tsx
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.ts';

export type Role = 'faculty' | 'student' | 'staff' | 'moderator' | 'administrator' | null;

interface IAuthContext {
  currentUser: User | null;
  userRole: Role;
  loading: boolean;
}

const defaultAuthContext: IAuthContext = {
  currentUser: null,
  userRole: null,
  loading: true,
};

export const AuthContext = createContext<IAuthContext>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<Role>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as { role?: Role; disabled?: boolean };

          if (data.disabled) {
            alert('Your account has been disabled by the administrator.');
            await signOut(auth);
            setCurrentUser(null);
            setUserRole(null);
          } else {
            setCurrentUser(user);
            setUserRole(data.role ?? null);
          }
        } else {
          setUserRole(null);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: IAuthContext = {
    currentUser,
    userRole,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
