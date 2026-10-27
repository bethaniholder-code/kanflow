//signup page
 'use client'

 import {useState} from "react";
 import {createClient} from '@/lib/supabase/client';
 import { useRouter } from 'next/navigation';

 export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] =useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const supabase = createClient();
    const router = useRouter();
 
    async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  }         
    if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="w-full max-w-sm rounded-lg bg-gray-900 p-8 text-center">
          <h1 className="mb-2 text-xl font-semibold text-gray-100">Check your email</h1>
          <p className="text-sm text-gray-400">
            We sent a confirmation link to {email}. Click it, then log in.
          </p>
          <a href="/login" className="mt-4 inline-block text-sm text-indigo-400 hover:underline">
            Back to login
          </a>
        </div>
      </div>
    );
  } 

return (
  <div className="flex min-h-screen items-center justify-center bg-gray-950">
   <div className="w-full max-w-sm rounded-lg bg-gray-900 p-8">
    <h1 className="mb-6 text-xl font-semibold text-gray-100">Sign up for KanFlow</h1>
     <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="w-full rounded-md bg-gray-800 px-3 py-2 text-gray-100 outline-none ring-1 ring-gray-700 focus:ring-indigo-500"
        />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full rounded-md bg-gray-800 px-3 py-2 text-gray-100 outline-none ring-1 ring-gray-700 focus:ring-indigo-500"
        />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full rounded-md bg-gray-800 px-3 py-2 text-gray-100 outline-none ring-1 ring-gray-700 focus:ring-indigo-500"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
        type="submit"
        className="w-full rounded-md bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-500"
        > 
         Sign Up 
        </button>

    <p className="mt-4 text-sm text-gray-500">
        Already have an account? {' '}
        <a href="/login" className="text-indigo-400 hover:underline"> Log in</a>
        </p>
    </form>
  </div>
 </div>
);
}          
