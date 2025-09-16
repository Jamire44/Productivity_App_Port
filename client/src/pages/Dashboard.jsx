import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user, userLoading } = useAuth();

  if (userLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-gray-200">
        <p className="animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 flex justify-center p-10">
      <div className="max-w-2xl w-full text-center">
        <h2 className="text-4xl font-bold text-blue-400 mb-4">
          Welcome to Focus
        </h2>

        {user ? (
          <p className="mb-6 text-gray-400 text-sm">
            Glad to have you back,{" "}
            <span className="font-semibold">
              {user?.user_metadata?.username || user?.email}
            </span>
            !
          </p>
        ) : (
          <p className="text-gray-300 mb-8">
            Manage your tasks and boost productivity.  
            <br />
            <Link
              to="/signup"
              className="inline-block mt-4 px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-500 transition"
            >
              Get Started
            </Link>
          </p>
        )}

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/tasks"
            className="p-6 bg-neutral-800 rounded-2xl shadow hover:shadow-xl hover:bg-neutral-700 transition block"
          >
            <h3 className="text-lg font-semibold text-blue-400">Tasks ✅</h3>
            <p className="text-sm text-gray-400">
              Organize your tasks and stay productive.
            </p>
          </Link>

          <Link
            to="/notes"
            className="p-6 bg-neutral-800 rounded-2xl shadow hover:shadow-xl hover:bg-neutral-700 transition block"
          >
            <h3 className="text-lg font-semibold text-blue-400">Notes 📝</h3>
            <p className="text-sm text-gray-400">
              Write and manage your notes in one place.
            </p>
          </Link>

          <Link
            to="/calendar"
            className="p-6 bg-neutral-800 rounded-2xl shadow hover:shadow-xl hover:bg-neutral-700 transition block"
          >
            <h3 className="text-lg font-semibold text-blue-400">Calendar 📅</h3>
            <p className="text-sm text-gray-400">
              Plan your days with a built-in calendar.
            </p>
          </Link>

          <Link
            to="/analytics"
            className="p-6 bg-neutral-800 rounded-2xl shadow hover:shadow-xl hover:bg-neutral-700 transition block"
          >
            <h3 className="text-lg font-semibold text-blue-400">Analytics 📊</h3>
            <p className="text-sm text-gray-400">
              Track your productivity over time.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
