"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { ReactNode as ReactNode2 } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import type { Role } from "@/lib/rbac";

export interface AuthUser {
  uid: string;
  email: string;
  name: string;
  title: string;
  department: string;
  employeeId: string;
  role: Role;
  isBhytDoctor: boolean;
  photoURL?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  firebaseUser: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  firebaseUser: null,
  loading: true,
  isAuthenticated: false,
  signOut: async () => {},
  logout: () => {},
});

async function fetchUserFromToken(
  firebaseUser: User
): Promise<AuthUser | null> {
  try {
    const idTokenResult = await Promise.race([
      firebaseUser.getIdTokenResult(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 5000)
      ),
    ]);

    const claims = idTokenResult.claims as {
      role?: Role;
      title?: string;
      department?: string;
      employeeId?: string;
      isBhytDoctor?: boolean;
      name?: string;
    };

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email ?? "",
      name: claims.name ?? firebaseUser.displayName ?? firebaseUser.email ?? "",
      title: claims.title ?? "",
      department: claims.department ?? "",
      employeeId: claims.employeeId ?? firebaseUser.uid,
      role: claims.role ?? "reception",
      isBhytDoctor: claims.isBhytDoctor ?? false,
      photoURL: firebaseUser.photoURL ?? undefined,
    };
  } catch {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email ?? "",
      name: firebaseUser.displayName ?? firebaseUser.email ?? "",
      title: "",
      department: "",
      employeeId: firebaseUser.uid,
      role: "reception",
      isBhytDoctor: false,
      photoURL: firebaseUser.photoURL ?? undefined,
    };
  }
}

export function AuthProvider({ children }: { children: ReactNode2 }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Start with cached user immediately — avoid waiting for network
    const cached = auth.currentUser;
    if (cached) {
      setFirebaseUser(cached);
      setUser({
        uid: cached.uid,
        email: cached.email ?? "",
        name: cached.displayName ?? cached.email ?? "",
        title: "",
        department: "",
        employeeId: cached.uid,
        role: "reception",
        isBhytDoctor: false,
        photoURL: cached.photoURL ?? undefined,
      });
      setLoading(false);
    } else {
      setLoading(false);
    }

    const timeout = setTimeout(() => setLoading(false), 5000);

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      clearTimeout(timeout);
      setFirebaseUser(fbUser);

      if (fbUser) {
        const authUser = await fetchUserFromToken(fbUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  const logout = useCallback(() => {
    firebaseSignOut(auth);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        isAuthenticated: !!user,
        signOut,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

export function useRole(): {
  role: Role | null;
  isAdmin: boolean;
  isDoctor: boolean;
  isPharmacist: boolean;
  isNurse: boolean;
  isReception: boolean;
} {
  const { user } = useAuth();
  const role = user?.role ?? null;
  return {
    role,
    isAdmin: role === "admin",
    isDoctor: role === "doctor",
    isPharmacist: role === "pharmacist",
    isNurse: role === "nurse",
    isReception: role === "reception",
  };
}
