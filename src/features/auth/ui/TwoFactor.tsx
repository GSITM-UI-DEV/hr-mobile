// src/features/auth/LoginForm.tsx
import { axiosInstance } from '@/app/api/axiosInstance';
import { useAuthStore, useNavigationStore } from '@/app/store/authStore';
import { UIButton, UIInput } from '@/shared/ui';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useCookies } from 'react-cookie';





export const TwoFactor = () => {
	// const [cookies, setCookie, removeCookie] = useCookies();
	const { auth, setAuth2FA } = useAuthStore();
	// const [confirmKey, setConfirmKey] = useState(auth?.sndConfirmKey);
	const [confirmKey, setConfirmKey] = useState("");
	const navigate = useNavigate();
	const coCode = auth?.coCode;
	const username = auth?.username;
	const toggleNav = useNavigationStore((state) => state.toggleNav);
	
	const handleLogin = async () => {
		try {
			const { data } = await axiosInstance.post('/msndfactorconfirm', 
				{ confirmKey, coCode, username },
				{ headers: { 'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8' } }
			);
			
			if(data.sndRsltCode !== 'S') {
				alert('인증코드를 확인해주세요.');
				navigate('/login');
			} else {
				setAuth2FA(data);
				navigate('/home');
			}
			// localStorage.setItem('authResultCode', data["sndRsltCode"]);
			// console.log(data.headers['set-cookie']);
			// console.log(headers.get('set-cookie'));
			// axiosInstance.defaults.headers.common['Cookie'] = {}
			// console.log(axiosInstance.defaults);
			// navigate('/attendance');
			// const aa = getCookie();
			// console.log(cookies);
		} catch (e: any) {
			alert(`${e.response.status} error`);
		}
	}

	return (
		<div className="loginForm">
			<div className="pt-124 fs-18 text-center">
				2차 인증
			</div>
			<div className="pt-30 pb-30">
				{/* <UIInput type="text" placeholder="ABCDEFG" value={confirmKey} onChange={(e) => setConfirmKey(e.target.value)} /> */}
				<UIInput type="text" placeholder="인증코드를 입력해주세요." onChange={(e) => setConfirmKey(e.target.value)} />
			</div>
			<div className="d-flex justify-content-center">
				<UIButton type="primary" onClick={() => {
					handleLogin();
					toggleNav();
				}}>인증하기</UIButton>
			</div>
		</div>
	);
};