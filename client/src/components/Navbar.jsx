import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import supabase from "../supabase";
import Logo from "./Logo";

export default function Navbar() {
  const user = useAuth();

  return (
    <nav className="relative bg-neutral-800 px-6 py-3 shadow flex items-center">

      <div className="flex items-center">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Logo style={{ width: 32, height: 32 }} />
          <span className="text-lg font-bold text-blue-400">FocusFight</span>
        </Link>
      </div>

      {user && (
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link
            to="/dashboard"
          >
            Dashboard
          </Link>
        </div>
      )}


      <div className="ml-auto flex gap-3">
        {!user ? (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded-full bg-neutral-700 text-gray-200 hover:bg-neutral-600 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition"
            >
              Sign up
            </Link>
          </>
        ) : (
          <button
            onClick={async () => await supabase.auth.signOut()}
            className="px-4 py-2 rounded-full bg-neutral-700 text-gray-200 hover:bg-neutral-600 transition"
          >
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
}
