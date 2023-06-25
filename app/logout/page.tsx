'use client'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';

const LogOut = () => {
    const session = useSession();
    const router = useRouter();
    if (session.status === 'unauthenticated'){
        setTimeout(() => {
            router.push('/')
        }, 100)
    }

    const handleLogOut = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        signOut();
        setTimeout(() => {
            router.push('/auth');
        }, 100)
    }
    
    return (
        <>
            {
                session.status === 'authenticated' && 
                <div onClick={(e) => handleLogOut(e)} style={{color: 'white', cursor: 'pointer'}}>Log Out</div>
            }
        </>
      )
}

export default LogOut