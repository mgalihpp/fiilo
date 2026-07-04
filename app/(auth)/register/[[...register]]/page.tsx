import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return <SignUp fallbackRedirectUrl="/" routing="path" path="/register" />;
}
