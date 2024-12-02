import SignIn from '../components/SignIn';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8">Log in to Pin Poster</h1>
      <SignIn />
    </div>
  );
}

