import { useState, useEffect } from "react";
import supabase from "../supabase";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button";

const API_URL = import.meta.env.VITE_API_URL;

export default function Calendar() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const getToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  };

  useEffect(() => {
    if (!user) return;
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/calendar`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      console.error("Failed to fetch events:", await res.text());
      setEvents([]);
      return;
    }
    const data = await res.json();
    setEvents(Array.isArray(data) ? data : []);
  };

  const addEvent = async () => {
    if (!title.trim() || !date) return;
    const token = await getToken();
    const res = await fetch(`${API_URL}/calendar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, event_date: date }),
    });
    if (res.ok) {
      const newEvent = await res.json();
      setEvents([newEvent, ...events]);
      setTitle("");
      setDescription("");
      setDate("");
    }
  };

  const deleteEvent = async (id) => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/calendar/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setEvents(events.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 flex justify-center p-8">
      <div className="max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-blue-400 mb-4">Calendar</h2>

        <div className="mb-6 space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-gray-100"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Event description (optional)"
            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-gray-100 h-20"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-gray-100"
          />
          <Button text="Add Event" onClick={addEvent} />
        </div>

        <ul className="space-y-3">
          {events.map((event) => (
            <li
              key={event.id}
              className="p-4 bg-neutral-800 rounded-lg shadow flex justify-between items-start"
            >
              <div>
                <h3 className="text-lg font-semibold text-blue-300">{event.title}</h3>
                <p className="text-gray-400">{event.description}</p>
                <p className="text-gray-500 text-sm">📅 {event.event_date}</p>
              </div>
              <Button
                text="Delete"
                onClick={() => deleteEvent(event.id)}
                variant="danger"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
