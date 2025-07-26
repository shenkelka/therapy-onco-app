import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { notificationService } from "./lib/notifications";

// Initialize notifications on app start
notificationService.initialize().then(success => {
  if (success) {
    console.log('Notifications initialized successfully');
    // Clean up old reminders
    notificationService.clearOldReminders();
  }
}).catch(error => {
  console.warn('Failed to initialize notifications:', error);
});

createRoot(document.getElementById("root")!).render(<App />);
