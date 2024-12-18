import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/authStore'; // 인증 상태를 제공하는 컨텍스트

interface ProtectedRouteProps {
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectPath = '/login' }) => {
	const auth2FA = useAuthStore((state) => state.auth2FA);
  


  // const token = authStore((state) => state.jwt);
  // const localToken = localStorage.getItem('token');
  // console.log('aa: ' + token);
  // console.log('bb: ' + localToken);

  // console.log(auth?.resultCode);

  // 임시
  // console.log(auth?.sndRsltCode);
  // const authResultCode = sessionStorage.getItem('auth-storage');
  // console.log(authResultCode);


  const auth = useAuthStore((state) => state.auth);
  // console.log(auth?.resultCode)
  // if (auth2FA?.sndRsltCode !== 'S') {
  if (auth?.resultCode !== 'S') {
    return <Navigate to={redirectPath} replace />;
  }

  // if (!localToken) {
  //   return <Navigate to={redirectPath} replace />;
  // }

  return <Outlet />;
};