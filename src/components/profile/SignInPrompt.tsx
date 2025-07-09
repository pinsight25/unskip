
interface SignInPromptProps {
  onSignIn: () => void;
}

const SignInPrompt = ({ onSignIn }: SignInPromptProps) => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 xl:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
        <p className="text-gray-600 mb-8">Please sign in to access your profile</p>
        <button
          onClick={onSignIn}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignInPrompt;
