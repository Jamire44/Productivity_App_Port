import { useState, useEffect } from "react";
import supabase from "../supabase";

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // check once when loading
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // listen for login/logout
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  return user;
}
