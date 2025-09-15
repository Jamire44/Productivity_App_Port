import { useState, useEffect } from "react";
import supabase from "../supabase";
import { useAuth } from "../hooks/useAuth";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

const COLORS = ["#60a5fa", "#34d399", "#f87171", "#fbbf24"];

export default function Analytics() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  const getToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  };

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const token = await getToken();
      const res = await fetch(`${API_URL}/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const stats = await res.json();
      setData(stats);
    };
    fetchData();
  }, [user]);

  if (!data) {
    return (
      <div className="min-h-screen bg-neutral-900 text-gray-100 flex justify-center items-center">
        <p>Loading analytics...</p>
      </div>
    );
  }

  const taskData = [
    { name: "Completed", value: parseInt(data.tasks.completed, 10) },
    { name: "Pending", value: parseInt(data.tasks.pending, 10) },
  ];

  const eventData = [
    { name: "Upcoming", value: parseInt(data.events.upcoming, 10) },
    { name: "Past", value: parseInt(data.events.past, 10) },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-800 text-gray-100 px-3 py-2 rounded-lg shadow">
          <p className="text-sm font-semibold">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 p-8">
      <h2 className="text-3xl font-bold text-blue-400 mb-8 text-center">📊 Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie chart */}
        <div className="bg-neutral-800 p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-blue-300">Tasks</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={taskData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                {taskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip content={CustomTooltip} cursor={{ fill: "transparent" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-neutral-800 p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-blue-300">Events</h3>
          <ResponsiveContainer width="100%" height={250}>
          <BarChart data={eventData}>
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis allowDecimals={false} stroke="#9ca3af" />
            <Tooltip
                contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "0.5rem",
                color: "#f9fafb",
                }}
                cursor={{ fill: "transparent" }}
            />
            <Bar dataKey="value" fill="#60a5fa" />
            </BarChart>

          </ResponsiveContainer>
        </div>

        {/* Notes Counter */}
        <div className="bg-neutral-800 p-6 rounded-2xl shadow col-span-1 md:col-span-2 text-center">
          <h3 className="text-lg font-semibold mb-4 text-blue-300">Notes</h3>
          <p className="text-4xl font-bold text-green-400">{data.notes.total_notes}</p>
          <p className="text-gray-400">Total notes created</p>
        </div>
      </div>
    </div>
  );
}
