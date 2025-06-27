import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Notification, NotificationType } from '@/types';
import { BellIcon } from './icons/SidebarIcons';
import { trackEvent } from '@/utils/analytics';

interface NotificationBellProps {
  className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ className = "" }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      // Simulate notifications for now
      const mockNotifications: Notification[] = [
        {
          id: '1',
          userId: currentUser.uid,
          title: 'Welcome to Medamel',
          message: 'Thank you for joining our platform!',
          type: NotificationType.INFO,
          isRead: false,
          createdAt: Date.now(),
        }
      ];
      setNotifications(mockNotifications);
    }
  }, [currentUser]);

  useEffect(() => {
    const count = notifications.filter(n => !n.isRead).length;
    setUnreadCount(count);
  }, [notifications]);

  const handleNotificationClick = async (notification: Notification) => {
    // Handle notification click
    trackEvent('notification_clicked', {
      notificationId: notification.id,
      notificationType: notification.type
    });
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
    trackEvent('notification_bell_clicked', {
      unreadCount: unreadCount,
      isOpen: !isOpen
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SUCCESS:
        return <div className="w-2 h-2 bg-green-400 rounded-full"></div>;
      case NotificationType.ERROR:
        return <div className="w-2 h-2 bg-red-400 rounded-full"></div>;
      case NotificationType.WARNING:
        return <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-blue-400 rounded-full"></div>;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* ARIA Live Region for notification updates */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {unreadCount > 0 && `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`}
      </div>

      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="relative p-2 text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-colors duration-200"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        aria-haspopup="true"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-lg border border-slate-700 z-50"
          aria-labelledby="notification-menu"
        >
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-100">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-blue-900 text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-slate-400">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors duration-200 ${
                    !notification.isRead ? 'bg-blue-900/50' : ''
                  }`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleNotificationClick(notification);
                    }
                  }}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-100">
                        {notification.title}
                      </p>
                      <p className="text-sm text-slate-300 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-4 border-t border-slate-700">
              <button className="w-full text-sm text-blue-400 hover:text-blue-300 font-medium">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 