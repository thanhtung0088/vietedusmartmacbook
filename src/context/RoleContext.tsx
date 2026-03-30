"use client";
import React, { createContext, useState, ReactNode, useContext } from 'react';

// Đã đơn giản hóa Roles, chỉ giữ lại để tránh lỗi code cũ
export type UserRole = 'guest' | 'standard' | 'pro';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isLoading: boolean;
}

// Đặt giá trị mặc định là 'guest' và isLoading 'false'
const RoleContext = createContext<RoleContextType | undefined>({
    role: 'guest',
    setRole: () => {},
    isLoading: false
});

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Mặc định cho mọi người là Pro hoặc Standard để Thầy dễ test
  const [role, setRole] = useState<UserRole>('guest');
  const [isLoading] = useState(false); // Bỏ hiệu ứng loading

  return (
    <RoleContext.Provider value={{ role, setRole, isLoading }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    // throw new Error('useRole must be used within a RoleProvider'); 
    // Trả về guest để an toàn nếu dùng sai Context
    return { role: 'guest' as UserRole, setRole: () => {}, isLoading: false };
  }
  return context;
};