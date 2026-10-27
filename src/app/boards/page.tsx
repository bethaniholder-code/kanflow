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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-100">Your boards</h1>
        <SignOutButton />
      </div>
      <CreateBoardForm />
      <BoardList />
    </div>
  );
}