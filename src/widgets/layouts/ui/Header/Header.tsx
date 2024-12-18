import { UIButton, UIIconButton } from "@/shared/ui";
import { Link, useNavigate } from "react-router-dom";
import "./Header.scss";
import { useNavigationStore } from "@/app/store/authStore";
import { axiosInstance } from "@/app/api/axiosInstance";

type HeaderProps = {
	title?: string;
	link?: string;
	navActive: boolean;
}

export const Header = (props: HeaderProps) => {
	const navigate = useNavigate();
	
	const toggleNav = useNavigationStore((state) => state.toggleNav);
	const logout = async () => {
		try {
			// useAuthStore((state) => state.logout);
			const { data } = await axiosInstance.post('/mlogout');
			if (data.logoutStatus !== 'S') {
				alert('로그아웃에 실패하였습니다.');
			} else {
				sessionStorage.clear();
				navigate('/login');
			}
		} catch (e: any) {
			console.log(`ERROR Code: ${e.response.status}`);
		}
	}

	
	return (
		<header>
			<div>
				{!props.navActive ?
					<UIButton size="small" shape="square" onClick={toggleNav}>
						<div className="icon is-32 is-menu"></div>
					</UIButton>
				:
					<UIButton size="small" shape="square" onClick={() => navigate(-1)}>
						<div className="icon is-arrow__left"></div>
					</UIButton>
				}
			</div>
			<div>
				<h1>{props.title ? props.title : ""}</h1>
			</div>
			<div className="right">
				<Link to="/home">
					<UIButton>
						<img src="/home.svg" />
					</UIButton>
				</Link>
				{/* {!props.navActive ?
					<UIIconButton className="is-logout" onClick={logout} />
				: null} */}
			</div>
		</header>
	)
}