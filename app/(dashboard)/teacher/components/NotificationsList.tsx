"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, MessageSquare, AlertCircle, Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

interface NotificationsListProps {
  initialNotifications: Notification[];
  userId: string;
}

export default function NotificationsList({ initialNotifications, userId }: NotificationsListProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const supabase = createClient();
  const router = useRouter();

  const filteredNotifications = filter === "all"
    ? notifications
    : notifications.filter(n => !n.read);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);

    if (!error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      router.refresh();
    }
  };

  const markAllAsRead = async () => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      router.refresh();
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'writing': return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'task': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'system': return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="rounded-full px-6"
          >
            Tutte
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            onClick={() => setFilter("unread")}
            className="rounded-full px-6 flex gap-2"
          >
            Non lette
            {notifications.filter(n => !n.read).length > 0 && (
              <Badge className="bg-white text-primary hover:bg-white">{notifications.filter(n => !n.read).length}</Badge>
            )}
          </Button>
        </div>

        {notifications.some(n => !n.read) && (
          <Button variant="ghost" onClick={markAllAsRead} className="text-primary hover:text-primary-dark font-bold">
            Segna tutte come lette
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`border-none shadow-sm transition-all hover:shadow-md cursor-pointer ${!notification.read ? 'bg-white ring-1 ring-primary/20' : 'bg-gray-50/50'}`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className={`p-3 rounded-2xl flex-shrink-0 ${!notification.read ? 'bg-primary/10' : 'bg-gray-100'}`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-bold ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <p className={`text-sm ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 pt-2">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: it })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed border-2 bg-transparent py-20">
            <CardContent className="text-center">
              <Bell className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">Non ci sono notifiche da mostrare.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
