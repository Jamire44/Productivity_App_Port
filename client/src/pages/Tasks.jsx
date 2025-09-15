import { useState, useEffect } from "react";
import supabase from "../supabase";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button";

const API_URL = import.meta.env.VITE_API_URL;

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, loading: userLoading } = useAuth();

  // get access token
  const getToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  };

  // Load tasks
  useEffect(() => {
    if (!user) {
      <h1>Not loggwd in</h1>
    }

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch(`${API_URL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  // Add task
  const addTask = async () => {
    if (!newTask.trim() || !user) return;
    const token = await getToken();
    if (!token) return;

    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTask }),
    });

    if (res.ok) {
      const task = await res.json();
      setTasks([task, ...tasks]);
      setNewTask("");
    }
  };

  // Toggle
  const toggleTask = async (id) => {
    const token = await getToken();
    if (!token) return;
    const res = await fetch(`${API_URL}/tasks/${id}/toggle`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const updated = await res.json();
      setTasks(tasks.map((t) => (t.id === id ? updated : t)));
    }
  };

  // Delete
  const deleteTask = async (id) => {
    const token = await getToken();
    if (!token) return;
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  // Prevent the flash while checking auth
  if (userLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-gray-200">
        <p className="animate-pulse">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 flex justify-center p-8">
      <div className="max-w-md w-full bg-neutral-800 p-6 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">Your Tasks</h2>

        {user ? (
          <p></p>
        ) : (
          <p className="mb-6 text-gray-400 text-sm">
            You’re in demo mode.{" "}
            <a href="/signup" className="text-blue-400 underline">
              Sign up
            </a>{" "}
            to save tasks.
          </p>
        )}

        {loading && <p className="text-gray-400">Loading tasks...</p>}

        {user && (
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="New task..."
              className="flex-1 border border-neutral-600 bg-neutral-700 text-gray-100 p-2 rounded-lg"
            />
            <Button text="Add" onClick={addTask} />
          </div>
        )}

        <ul className="space-y-2 max-h-[400px] overflow-y-auto">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center p-3 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition"
            >
              <span
                className={task.completed ? "line-through text-gray-500" : ""}
              >
                {task.title}
              </span>
              {user && (
                <div className="flex gap-2">
                  <Button
                    text={task.completed ? "Undo" : "Done"}
                    onClick={() => toggleTask(task.id)}
                    variant="secondary"
                  />
                  <Button
                    text="Delete"
                    onClick={() => deleteTask(task.id)}
                    variant="danger"
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
