'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
export default function SignOutButton() {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <button 
        onClick={handleSignOut}
        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
        >
            Sign Out
        </button>
    )
}
