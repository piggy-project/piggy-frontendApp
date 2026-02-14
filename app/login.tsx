import { useRouter } from 'expo-router';
import React from 'react';
import LoginPage from '../components/LoginPage/LoginPage';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <LoginPage 
      onBack={() => router.back()} 
      onLoginSuccess={() => {
         router.replace('/(tabs)/mypage'); 
      }}
    />
  );
}