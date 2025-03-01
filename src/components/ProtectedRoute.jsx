import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";

function ProtectedRoute({ element }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : undefined;
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        localStorage.setItem("user", JSON.stringify(session.user));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
      setLoading(false);
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          localStorage.setItem("user", JSON.stringify(session.user));
        } else {
          localStorage.removeItem("user");
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center text-2xl font-anton z-50 h-[100dvh] w-[100vw] bg-backgroundc text-textc">
        <div className="animate-pulse">
          <h1>Teacher</h1>
          <h1>Substitution</h1>
        </div>
      </div>
    );
  }

  return user ? element : <Navigate to="/" />;
}

export default ProtectedRoute;
