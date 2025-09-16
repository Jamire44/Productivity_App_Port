import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import supabase from "../supabase";
import { useState } from "react";
import { Settings } from "lucide-react";
import Logo from "./Logo";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDeleteAccount = async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;
  
    if (!confirm("⚠️ Are you sure you want to delete your account? This cannot be undone.")) {
      return;
    }
  
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/account`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to delete account");
  
      alert("Your account has been deleted.");
      await logout();
      window.location.href = "/";
    } catch (err) {
      console.error("Delete account error:", err);
      alert("Something went wrong while deleting your account.");
    }
  };
  
  return (
    <nav className="relative bg-neutral-800 px-6 py-3 shadow flex items-center">
      {/* Left: Logo and name */}
      <div className="flex items-center">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Logo style={{ width: 32, height: 32 }} />
          <span className="text-lg font-bold text-blue-400">FocusFight</span>
        </Link>
      </div>

      {/* Center: Dashboard link (only when logged in) */}
      {user && (
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-full bg-neutral-700 text-gray-200 hover:bg-neutral-600 transition"
          >
            Dashboard
          </Link>
        </div>
      )}

      {/* Right side for log in and sign up when logged out*/}
      <div className="ml-auto flex items-center gap-3">
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
          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 rounded-full bg-neutral-700 hover:bg-neutral-600 transition"
            >
              <Settings size={20} className="text-gray-200" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg text-left">
                <button
                  onClick={handleDeleteAccount}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-700 rounded-t-lg"
                >
                  Delete Account
                </button>
                <button
                  onClick={async () => {
                    await logout();
                    window.location.href = "/";
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-neutral-700 rounded-b-lg"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
