import { auth } from "@/auth";
import { SignInButton } from "@/components/sign-in-button";
import { SignOutButton } from "@/components/sign-out-button";
import { getSubjects } from '../lib/api';
import Link from 'next/link';

export default async function HomePage() {
  // This part runs on the server
  const session = await auth();
  
  // If no session, show login page
  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-8">Welcome to KaTuripu</h1>
        <p className="text-lg mb-4">Please sign in to access your subjects.</p>
        <SignInButton />
      </div>
    );
  }
  
  // Fetch subjects on the server for authenticated users
  const subjects = await getSubjects();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Welcome to KaTuripu</h1>
        <SignOutButton />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Link href={`/subjects/${subject.subjectId}`} key={subject.subjectId}>
            <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-2xl font-semibold">{subject.subjectName}</h2>
            </div>
          </Link>
        ))}
      </div>
      
      {subjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl">No subjects available at the moment.</p>
        </div>
      )}
    </div>
  );
}