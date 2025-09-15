import { useState, useEffect } from "react";
import supabase from "../supabase";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button";

const API_URL = import.meta.env.VITE_API_URL;

export default function Notes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const getToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  };

  useEffect(() => {
    if (!user) return;
    fetchNotes();
  }, [user]);

  const fetchNotes = async () => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/notes`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.error("Failed to fetch notes:", await res.text());
      setNotes([]);
      return;
    }

    const data = await res.json();
    setNotes(Array.isArray(data) ? data : []);
  };

  // Add note
  const addNote = async () => {
    if (!title.trim()) return;
    const token = await getToken();
    const res = await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      const newNote = await res.json();
      setNotes([newNote, ...notes]);
      setTitle("");
      setContent("");
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/notes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setNotes(notes.filter((n) => n.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 flex justify-center p-8">
      <div className="max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-blue-400 mb-4">Notes</h2>

        {user && (
          <p className="mb-6 text-gray-400 text-sm">{user.user_metadata?.username || user.email}'s Notes</p>
        )}

        <div className="mb-6 space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-gray-100"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note..."
            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-gray-100 h-32"
          />
          <Button text="Add Note" onClick={addNote} />
        </div>

        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note.id} className="p-4 bg-neutral-800 rounded-lg shadow flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-blue-300">{note.title}</h3>
                <p className="text-gray-300">{note.content}</p>
              </div>
              <div className="flex gap-2">
                <Button text="Delete" onClick={() => deleteNote(note.id)} variant="danger" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
