import React, { createContext, useContext, useState } from 'react';
import { Notification } from '../components/Notification';

interface NotificationContextType {
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  showNotification: () => {}
});

export const useNotification = () => useContext(NotificationContext);

interface NotificationState {
  type: 'success' | 'error' | 'info';
  message: string;
  isVisible: boolean;
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationState>({
    type: 'info',
    message: '',
    isVisible: false
  });

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({
      type,
      message,
      isVisible: true
    });

    setTimeout(() => {
      setNotification(prev => ({
        ...prev,
        isVisible: false
      }));
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </NotificationContext.Provider>
  );
}; 