import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Lazy load App.jsx
const App = lazy(() => import("./App.jsx"));

const queryClient = new QueryClient();

// 🟢 Splash Screen (Loading Screen)
const SplashScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black text-white text-2xl font-anton">
    <div className="animate-pulse">
      <h1>Teacher</h1>
      <h1>Substitution</h1>{" "}
    </div>
  </div>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* Suspense ensures App.jsx is loaded before rendering */}
      <Suspense fallback={<SplashScreen />}>
        <App />
      </Suspense>
    </QueryClientProvider>
  </StrictMode>
);
