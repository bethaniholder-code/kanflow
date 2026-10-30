 'use client'

import { useState } from "react";
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const supabase = createClient();
  const router = useRouter();
  

   async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError('');

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    setError(error.message);
    return;
  }
  
  window.location.href = '/boards';
}
return (
  <div className="flex min-h-screen items-center justify-center bg-gray-950">
    <div className="w-full max-w-sm rounded-xl bg-gray-900 p-8 border border-white/10">
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-indigo-500 text-white font-bold text-lg px-3 py-1 rounded-lg">K</div>
        <span className="text-white font-bold text-xl">KanFlow</span>
      </div>
      <h1 className="mb-6 text-xl font-semibold text-gray-100">Welcome back</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-lg bg-gray-800 px-3 py-2 text-gray-100 outline-none border border-white/10 focus:border-indigo-400 text-sm"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-lg bg-gray-800 px-3 py-2 text-gray-100 outline-none border border-white/10 focus:border-indigo-400 text-sm"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-500 hover:bg-indigo-600 py-2 font-medium text-white text-sm mt-1"
        >
          Login
        </button>
        <p className="mt-2 text-sm text-gray-500">
          No account?{' '}
          <a href="/signup" className="text-indigo-400 hover:underline">Sign up</a>
        </p>
      </form>
    </div>
  </div>
)
}
