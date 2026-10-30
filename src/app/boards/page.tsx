'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import SignOutButton from '@/components/boards/SignOutButton';
import CreateBoardForm from '@/components/boards/CreateBoardForm';
import BoardList from '@/components/boards/BoardList'

export default function BoardsPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const [boardKey, setBoardKey] = useState(0)

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      }
      setLoading(false);
    }
    checkUser();
  }, []);

  if (loading) return <div>Loading...</div>;

return (
  <div className="min-h-screen bg-gray-950 p-8">
    <header className="flex items-center justify-between mb-10 border-b border-white/10 pb-4">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-500 text-white font-bold text-lg px-3 py-1 rounded-lg">
          K
        </div>
        <span className="text-white font-bold text-xl tracking-tight">KanFlow</span>
      </div>
      <div className="flex items-center gap-4">
        <p className="text-white/50 text-sm">Your boards</p>
        <SignOutButton />
      </div>
    </header>
    <CreateBoardForm onBoardCreated={() => setBoardKey(prev => prev + 1)} />
    <BoardList key={boardKey} />
  </div>
);
}