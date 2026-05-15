"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { CLINIC_INFO } from "@/lib/constants";
import { Eye, EyeOff, ShieldCheck, Lock, User, Loader2, Info } from "lucide-react";

async function createSessionCookie(idToken: string): Promise<void> {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    throw new Error("Failed to create session cookie");
  }
}

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await credential.user.getIdToken();
      await createSessionCookie(idToken);
      router.push(redirect);
    } catch (err: unknown) {
      console.error("[login] error:", err);
      const firebaseError = err as { code?: string; message?: string };
      switch (firebaseError.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("Email hoac mat khau khong dung.");
          break;
        case "auth/too-many-requests":
          setError("Tai khoan da bi tam khoa do dang nhap sai nhieu lan.");
          break;
        default:
          setError(firebaseError.message ?? "Dang nhap that bai. Vui long thu lai.");
      }
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      await createSessionCookie(idToken);
      router.push(redirect);
    } catch (err: unknown) {
      console.error("[login] Google sign-in error:", err);
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === "auth/popup-closed-by-user") {
        setError(null);
      } else if (firebaseError.code === "auth/account-exists-with-different-credential") {
        setError("Tai khoan da ton tai voi phuong thuc dang nhap khac. Vui long su dung email/mat khau.");
      } else if (firebaseError.code === "auth/network-request-failed") {
        setError("Loi mang. Vui long kiem tra ket noi internet.");
      } else {
        setError(firebaseError.message ?? "Dang nhap Google that bai. Vui long thu lai.");
      }
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl flex items-center justify-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Dang nhap he thong
        </CardTitle>
        <CardDescription className="text-center">
          Su dung tai khoan Firebase Authentication de truy cap
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 flex items-start gap-2">
            <Info className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="email@phongkham.vn"
                className="pl-10 h-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={isLoading || googleLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Mat khau
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhap mat khau"
                className="pl-10 pr-10 h-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={isLoading || googleLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full h-10" disabled={isLoading || googleLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Dang dang nhap...
              </>
            ) : (
              "Dang nhap"
            )}
          </Button>
        </form>

        <div className="relative my-4">
          <Separator />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="bg-card px-2 text-xs text-muted-foreground">hoac</span>
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full h-10"
          onClick={handleGoogleSignIn}
          disabled={isLoading || googleLoading}
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          {googleLoading ? "Dang xu ly..." : "Dang nhap bang Google"}
        </Button>

        <Separator className="mt-4" />
        <p className="text-xs text-muted-foreground text-center mt-4">
          Quyen truy cap duoc cap boi {CLINIC_INFO.name}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <span>{CLINIC_INFO.phone}</span>
          <span>{CLINIC_INFO.email}</span>
        </div>
        <Badge variant="outline" className="text-xs w-full justify-center">
          He thong v0.2.0 (Firebase Auth)
        </Badge>
      </CardFooter>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground font-bold text-2xl mb-4 shadow-lg">
            PK
          </div>
          <h1 className="text-2xl font-bold text-primary">{CLINIC_INFO.shortName}</h1>
          <p className="text-muted-foreground text-sm mt-1">{CLINIC_INFO.name}</p>
        </div>

        <Card className="shadow-xl border-0">
          <Suspense
            fallback={
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </CardContent>
            }
          >
            <LoginForm />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}
