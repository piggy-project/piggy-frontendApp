import React from 'react';
import MyPage from '../../components/MyPage/MyPage';
import { useAuth } from '../../components/utils/AuthContext';
import SignupWelcome from '../signup/index';

export default function My() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return <SignupWelcome />;
  }

  return <MyPage />;
}