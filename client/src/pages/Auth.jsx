import { useNavigate } from "react-router-dom";
import { useState } from "react";
import supabase from "../supabase"

export default function Auth(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    
    const handleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if(error){
            setMessage(error);
        } else{
            setMessage("Logged in successfully!");
            navigate("/dashboard");
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6">
            <h1 className="text-2xl font-bold">FocusFight Auth</h1>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded" placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 rounded" placeholder="Password" />
            <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">Log In</button>
            <p>{message}</p>
        </div>
    )
}