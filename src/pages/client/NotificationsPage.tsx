import React, { useEffect, useState } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { lastMessage } = useWebSocket(localStorage.getItem("token"));

  useEffect(() => {
    if (lastMessage && lastMessage.type === "notification") {
      setNotifications((n) => [lastMessage.notification, ...n]);
    }
  }, [lastMessage]);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((n, i) => (
          <li key={i}>{n?.title || JSON.stringify(n)}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPage; 