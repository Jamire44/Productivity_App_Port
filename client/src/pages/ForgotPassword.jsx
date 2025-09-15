import { useState } from "react";
import supabase from "../supabase";
import InputField from "../components/InputField";
import Button from "../components/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`, 
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the password reset link.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold text-blue-400">Reset Password</h1>
      <InputField
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="Enter your email"
      />
      <Button text="Send Reset Link" onClick={handleReset} />
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}
