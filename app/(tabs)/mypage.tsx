import React, { useState } from 'react';
import MyPage from '../../components/MyPage/MyPage';
import UserRegisterPage from '../../components/UserRegisterPage/UserRegisterPage';

export default function My() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  if (!isLoggedIn) {
    return (
      <UserRegisterPage 
        //onFinish={() => setIsLoggedIn(true)} 
      />
    );
  }
  return <MyPage />;
}