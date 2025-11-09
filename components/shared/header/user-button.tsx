'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserIcon } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const UserButton = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    // Sign out without redirect
    await signOut({ redirect: false });
    // Then manually navigate (no flash)
    router.push('/');
    router.refresh();
  };

  if (!session) {
    return (
      <Button
        asChild
        variant="ghost"
        className=" bg-white text-black hover:bg-[#D87D4A] hover:text-white"
      >
        <Link href="/sign-in" className="flex items-center gap-2">
          <UserIcon className="w-5 h-5" />
          Sign In
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button
              variant={'ghost'}
              className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-white text-black font-bold hover:bg-[#D87D4A] hover:text-white"
            >
              {firstInitial}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <Link href="/user/profile" className="w-full">
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="p-0 mb-1">
            <Button
              onClick={handleSignOut}
              className="w-full py-4 px-2 h-4 justify-start"
              variant="ghost"
            >
              Sign Out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
