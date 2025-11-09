import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { SessionProvider } from 'next-auth/react';
import { redirect } from 'next/navigation';
import ProfileForm from './profile-form';
import Header from '@/components/shared/header';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your profile settings',
};

const Profile = async () => {
  const session = await auth();

  if (!session) redirect('/sign-in');

  return (
    <SessionProvider session={session}>
      <Header />
      <div className="max-w-md mx-auto space-y-4 py-8">
        <div className="space-y-1 mb-8 text-center">
          <h1 className="text-xl font-bold">Profile Settings</h1>
        </div>
        <ProfileForm />
      </div>
    </SessionProvider>
  );
};

export default Profile;
