import { useState, useEffect } from "react";
import supabase from "../supabase";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button";

const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const user = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);

  // get access token for API calls
  const getToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  };

  // Load tasks when user logs in
  useEffect(() => {
    if (!user) {
      // demo mode
      setTasks([
        { id: 1, title: "Example task (not saved)", completed: false },
        { id: 2, title: "Sign up to save tasks!", completed: false },
      ]);
      return;
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

  // Toggle complete
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

  // Delete task
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

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 flex items-start justify-center p-6">
      <div className="max-w-lg w-full bg-neutral-800 p-8 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-blue-400 mb-4">Dashboard</h2>
        {user ? (
          <p className="mb-6 text-gray-300">Logged in as <span className="font-semibold">{user?.email}</span></p>
        ) : (
          <p className="mb-6 text-gray-300">
            You're in demo mode.{" "}
            <a href="/signup" className="text-green-600 underline">
              Sign up
            </a>{" "}
            to save tasks.
          </p>
        )}

        {loading && <p className="text-gray-400">Loading tasks...</p>}

        {user && (
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="New task..."
              className="border p-2 rounded w-full text-black"
            />
            <Button text="Add" onClick={addTask} variant="primary" />
          </div>
        )}

        <ul className="space-y-2 mb-4">
          {tasks.map((task) => (
            <li
            key={task.id}
            className="flex justify-between items-center p-3 bg-neutral-700 rounded-lg shadow transition hover:shadow-md"
          >
            <span className={task.completed ? "line-through text-gray-500" : ""}>
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

        {user && (
          <Button
            text="Log Out"
            onClick={async () => await supabase.auth.signOut()}
            variant="secondary"
          />
        )}
      </div>
    </div>
  );
}
