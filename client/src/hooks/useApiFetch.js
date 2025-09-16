import { useState, useEffect } from "react";
import supabase from "../supabase";

const API_URL = import.meta.env.VITE_API_URL;

export function useApiFetch(endpoint, user, options = {}, retries = 3) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  };

  const fetchData = async (attempt = 0) => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
        ...options,
      });

      if (!res.ok) throw new Error("Request failed");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      if (attempt < retries) {
        setTimeout(() => fetchData(attempt + 1), 2000);
      } else {
        setError("Server is waking up… please wait.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  return { data, loading, error, refetch: fetchData };
}
