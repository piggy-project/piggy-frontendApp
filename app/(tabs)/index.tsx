import { registerForPushNotificationsAsync } from '@/components/utils/NotificationHelper';
import React, { useEffect } from 'react';
import MainDashBoardPage from "../../components/MainDashBoardPage/MainDashBoardPage";

export default function DashboardTab() {
  
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
      <MainDashBoardPage />
  );
}