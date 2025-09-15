import { useState, useEffect } from "react";
import supabase from "../supabase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    // Check session once on load
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setUserLoading(false);
    });

    // Listening for login/logout or/and session changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setUserLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);       
    setUserLoading(false);
  };

  return { user, userLoading, logout };
}
