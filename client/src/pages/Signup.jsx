import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import supabase from "../supabase";
import InputField from "../components/InputField";
import Button from "../components/Button";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for a confirmation link");
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      <InputField type="email" value={email} onChange={setEmail} placeholder="Email" />
      <InputField type="password" value={password} onChange={setPassword} placeholder="Password" />
      <Button text="Sign Up" onClick={handleSignup}/>
      <p className="mt-2 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 underline">Log in</Link>
      </p>
      <p className="text-red-500">{message}</p>
    </div>
  );
}