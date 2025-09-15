import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase";
import InputField from "../components/InputField";
import Button from "../components/Button";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleUpdate = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold text-blue-400">Set New Password</h1>
      <InputField
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="New password"
      />
      <Button text="Update Password" onClick={handleUpdate} />
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}
