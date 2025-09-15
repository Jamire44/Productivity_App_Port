import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import supabase from "../supabase";
import InputField from "../components/InputField";
import Button from "../components/Button";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password || !username) {
      setMessage("Please fill in all fields.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.trim(),
        },
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for a confirmation link");
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold text-blue-400">Sign Up</h1>

      <InputField
        type="text"
        value={username}
        onChange={setUsername}
        placeholder="Username"
      />

      <InputField
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="Email"
      />

      <InputField
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="Password"
      />

      <Button text="Sign Up" onClick={handleSignup} />

      <p className="mt-2 text-sm text-gray-400">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-400 underline">
          Log in
        </Link>
      </p>

      <p className="text-red-500">{message}</p>
    </div>
  );
}
