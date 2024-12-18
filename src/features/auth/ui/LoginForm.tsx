// src/features/auth/LoginForm.tsx
import { axiosInstance } from '@/app/api/axiosInstance';
import { useAuthStore } from '@/app/store/authStore';
import { UIButton, UICheckbox, UIInput } from '@/shared/ui';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
	const { setAuth, saveUsername, clearUsername } = useAuthStore();
	const savedUser = useAuthStore((state) => state.savedUser);
	const [remeberUser, setRememberUser] = useState<boolean>(!!savedUser);

	const [username, setUsername] = useState<string>(savedUser || '');;
	const [password, setPassword] = useState<string>();
	const [gubun, setGubun] = useState('login');
	const [error, setError] = useState<string>();
	const navigate = useNavigate();



	const handleLogin = async () => {
		if (!username && !password) {
			setUsername('');
			setPassword('');
		} else if (!username) {
			setUsername('');
		} else if(!password) {
			setPassword('');
		} else {
			try {
				const { data } = await axiosInstance.post('/mlogin',
					{ username, password, gubun },
					{ headers: { 'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8' } }
				);
				
				
				if (data.resultCode === 'F') {
					setError('로그인 정보를 확인해주세요.');
				} else {
					setAuth(data);

					if (remeberUser) {
						saveUsername(username);
					} else {
						clearUsername();
					}


					if (data.username === 'admin') {
						navigate('/home');
					} else {
						navigate('/twofactor');
					}
				}
			} catch (e: any) {
				console.log(`ERROR Code: ${e.response.status}`);
				setError('네트워크 오류가 발생했습니다. 잠시후 다시 시도해주세요.');
			}
		}
	}

	return (
		<div className="loginForm">
			<div className="text-center pt-124 pb-40">
				<img src="/logo_hitek.svg" />
			</div>
			<div>
				<div className="pt-6 pb-6">
					<UIInput
						type="text"
						placeholder="아이디(사번)"
						value={username}
						onChange={(e) => { setUsername(e.target.value); setError(''); }}
						hint={username === '' ? "아이디(사번)을 확인해주세요." : undefined}
						error={username === ''}
					/>
				</div>
				<div className="pt-6 pb-6">
					<UIInput
						type="password"
						placeholder="비밀번호"
						value={password}
						onChange={(e) => { setPassword(e.target.value); setError(''); }}
						hint={password === '' ? "비밀번호를 확인해주세요." : undefined}
						error={password === ''}
					/>
				</div>
				{error && ( 
					<div className="hint__box is-error">
						<div className="icon is-system is-danger"></div>
						<p>{error}</p>
					</div>
				)}
			</div>
			<div className="d-flex justify-content-center mt-40">
				<UIButton type="primary" onClick={handleLogin}>로그인</UIButton>
			</div>
			<div className="d-flex justify-content-between pt-40">
				<UICheckbox
					label="아이디 저장"
					value="check"
					checked={remeberUser}
					onChecked={(checkUser) => setRememberUser(checkUser)}
				/>
			</div>
			<div className="text-center copyright">
				Copyright © DBHiTek Corp. All rights reserved.
			</div>
		</div>
	);
};

