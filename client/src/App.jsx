import { useEffect, useState } from 'react';
import './App.css'

export default function App(){

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}`);
        if(!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setMessage(data);
      } catch (err) {
        console.error(err);
        setError("Failed to connect to backend");
      }
    };
    fetchMessage();
  }, []);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
      <div className="p-6 bg-white shadow-2xl rounded-2xl">
        <h1 className="text-2xl font-bold mb-4">Focus Fight</h1>
        {error ? (<p className="text-red-600">{error}</p>) : (<p>Backend says: {message || "Loading..."}</p>)}
      </div>
    </div>
  );

}