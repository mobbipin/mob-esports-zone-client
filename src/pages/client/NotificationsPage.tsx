import React, { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import toast from "react-hot-toast";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { BellIcon, CheckIcon, TrashIcon } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await apiFetch<any>("/notifications");
      setNotifications(res.data || []);
    } catch (error) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: "PUT" }, true, false, false);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await apiFetch(`/notifications/${id}`, { method: "DELETE" }, true, false, false);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1e] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton height={40} width={200} className="mb-8" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} height={100} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-gray-400">Stay updated with your latest activities</p>
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-8 text-center">
                <BellIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No notifications</h3>
                <p className="text-gray-400">You're all caught up! Check back later for updates.</p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`bg-[#15151a] border-[#292932] ${!notification.isRead ? 'border-l-4 border-l-[#f34024]' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <BellIcon className={`w-5 h-5 ${notification.isRead ? 'text-gray-500' : 'text-[#f34024]'}`} />
                        <h3 className={`font-semibold ${notification.isRead ? 'text-gray-400' : 'text-white'}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <span className="px-2 py-1 bg-[#f34024] text-white text-xs rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                        <span>{new Date(notification.createdAt).toLocaleTimeString()}</span>
                        {notification.type && (
                          <span className="px-2 py-1 bg-gray-700 rounded">
                            {notification.type}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500 text-green-400 hover:bg-green-600 hover:text-white"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckIcon className="w-4 h-4 mr-1" />
                          Mark Read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-400 hover:bg-red-600 hover:text-white"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              className="border-[#292932] text-gray-400 hover:bg-[#292932]"
              onClick={fetchNotifications}
            >
              Refresh Notifications
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage; 