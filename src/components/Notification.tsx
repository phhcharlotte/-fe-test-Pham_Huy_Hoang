import React, { createContext, useContext, useCallback } from 'react';
import { notification } from 'antd';

interface NotifContextValue {
  notify: (text: string, type?: 'success' | 'error') => void;
}

const NotifContext = createContext<NotifContextValue>({ notify: () => {} });
export const useNotify = () => useContext(NotifContext);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [api, contextHolder] = notification.useNotification();

  const notify = useCallback((text: string, type: 'success' | 'error' = 'success') => {
    api[type]({
      message: text,
      placement: 'topRight',
      duration: 2.5,
      style: { borderRadius: 12 },
    });
  }, [api]);

  return (
    <NotifContext.Provider value={{ notify }}>
      {contextHolder}
      {children}
    </NotifContext.Provider>
  );
}
