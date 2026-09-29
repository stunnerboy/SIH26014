import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bell, Info, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { getUserNotifications } from '../../utils/userLand';
import Card, { CardBody } from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Notifications() {
  const { user } = useOutletContext();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) setNotifications(getUserNotifications(user.id));
  }, [user]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'Alert': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'Success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Update': return <Clock className="h-5 w-5 text-blue-500" />;
      default: return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationBg = (type, read) => {
    if (read) return 'bg-white border-gray-200';
    switch (type) {
      case 'Alert': return 'bg-red-50 border-red-200';
      case 'Success': return 'bg-green-50 border-green-200';
      case 'Update': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="mt-1 text-gray-600">Updates regarding your land records and applications.</p>
      </div>

      {notifications.length === 0 ? (
        <EmptyState 
          icon={Bell}
          title="No notifications"
          description="You're all caught up! There are no new notifications for your profile."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map(notif => (
            <Card key={notif.id} className={cn("transition-colors", getNotificationBg(notif.type, notif.read))}>
              <CardBody className="p-4 flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className={cn("text-sm font-bold", notif.read ? "text-gray-700" : "text-gray-900")}>
                      {notif.title}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{notif.date}</span>
                  </div>
                  <p className={cn("text-sm mt-1", notif.read ? "text-gray-500" : "text-gray-700")}>
                    {notif.message}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
