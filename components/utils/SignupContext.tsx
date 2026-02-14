import React, { createContext, useContext, useState } from 'react';

type SignupData = {
  email?: string;
  password?: string;
  name?: string;
  // ... 나머지 필드들
};

const SignupContext = createContext<any>(null);

export function SignupProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SignupData>({});

  const updateData = (newData: Partial<SignupData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <SignupContext.Provider value={{ data, updateData }}>
      {children}
    </SignupContext.Provider>
  );
}

export const useSignupData = () => useContext(SignupContext);