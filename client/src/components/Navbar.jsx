import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <h1 className="text-xl font-bold">Focus</h1>
      <div className="flex gap-4">
        <Link to="/login" className="hover:underline">Login</Link>
        <Link to="/signup" className="hover:underline">Sign up</Link>
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
      </div>
    </nav>
  );
}
