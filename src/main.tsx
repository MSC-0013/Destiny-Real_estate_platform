import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeStorage } from "./utils/localStorageHelpers";

// Initialize demo data
initializeStorage();

createRoot(document.getElementById("root")!).render(<App />);
