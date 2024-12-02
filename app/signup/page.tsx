import SignUp from '../components/SignUp';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8">Sign up for Pin Poster</h1>
      <SignUp />
    </div>
  );
}

