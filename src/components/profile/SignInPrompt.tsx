
interface SignInPromptProps {
  onSignIn: () => void;
}

const SignInPrompt = ({ onSignIn }: SignInPromptProps) => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-md mx-auto px-4 py-12 md:py-16 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Welcome to Your Profile</h1>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Sign in to manage your listings, track offers, and connect with buyers
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={onSignIn}
            className="w-full bg-orange-500 text-white px-6 py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-lg min-h-[44px]"
          >
            Sign In to Continue
          </button>
          
          <p className="text-sm text-gray-500">
            New here? Signing in will create your account automatically
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPrompt;
