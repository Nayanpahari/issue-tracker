"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Track logged-in user
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserEmail(user.email);
      console.log("Logged in user:", user.email);
    } else {
      setUserEmail(null);
    }
  });

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful!");
    } catch (err: any) {
      alert("Signup error: " + err.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
    } catch (err: any) {
      alert("Login error: " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white gap-4">
      <h1 className="text-2xl font-bold">Login / Signup</h1>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded w-72"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded w-72"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex gap-4">
        <button onClick={handleLogin} className="bg-blue-600 px-4 py-2 rounded text-white">Login</button>
        <button onClick={handleSignup} className="bg-green-600 px-4 py-2 rounded text-white">Signup</button>
      </div>

      {userEmail && <p>Logged in as: {userEmail}</p>}
    </div>
  );
}
