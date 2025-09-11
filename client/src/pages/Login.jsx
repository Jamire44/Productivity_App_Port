import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import supabase from "../supabase";
import InputField from "../components/InputField";
import Button from "../components/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("✅ Logged in!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Log In</h1>
      <InputField type="email" value={email} onChange={setEmail} placeholder="Email" />
      <InputField type="password" value={password} onChange={setPassword} placeholder="Password" />
      <Button text="Log In" onClick={handleLogin} color="blue" />
      <p className="mt-2 text-sm">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-green-600 underline">Sign up</Link>
      </p>
      <p className="text-red-500">{message}</p>
    </div>
  );
}
