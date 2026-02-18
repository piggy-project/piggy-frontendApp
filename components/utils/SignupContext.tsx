import React, { createContext, useContext, useState } from 'react';

type SignupData = {
  email?: string;
  password?: string;
  name?: string;
  
  birth?: string;
  phoneNum?: string;
  nickname?: string;
  
  provider?: string;
  providerId?: string | null; 
};
interface SignupContextType {
  data: SignupData;
  updateData: (newData: Partial<SignupData>) => void;
}

const SignupContext = createContext<SignupContextType | null>(null);

export function SignupProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SignupData>({
  });

  const updateData = (newData: Partial<SignupData>) => {
    console.log('데이터 업데이트:', newData);
    setData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <SignupContext.Provider value={{ data, updateData }}>
      {children}
    </SignupContext.Provider>
  );
}

export const useSignupData = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error('useSignupData must be used within a SignupProvider');
  }
  return context;
};