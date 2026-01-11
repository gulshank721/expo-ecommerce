import { SignIn } from '@clerk/clerk-react';

export const LoginPage = () => {
  return (
    <div className="h-screen hero">
      <SignIn />
    </div>
  );
};
