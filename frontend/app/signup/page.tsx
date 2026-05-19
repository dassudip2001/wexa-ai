import { SignupForm } from "@/components/signup-form";

export default function SignUp() {
  return (
    <>
      <div className="flex h-screen w-full items-center justify-center p-6 md:p-10">
        <SignupForm />
      </div>
    </>
  );
}