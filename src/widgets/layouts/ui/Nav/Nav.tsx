import { useNavigationStore } from "@/app/store/authStore";
import { useUser } from "@/entities/user/api/useUser";
import { UIAvatar, UIButton, UIIconButton } from "@/shared/ui";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList
} from '@radix-ui/react-navigation-menu';
import { Link, useNavigate } from "react-router-dom";
import "./Nav.scss";
import { axiosInstance } from "@/app/api/axiosInstance";


export const Navigation = () => {
	const navigate = useNavigate();
	const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Error: {userError.message}</p>;

	const isNavOpen = useNavigationStore((state) => state.isNavOpen);
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
		<NavigationMenu className={`${isNavOpen ? "Root open" : "Root"}`}>
			{isNavOpen && (
				<div className="dim" onClick={toggleNav}></div>
			)}
			<div className="inner">
				<div className="User">
					<div>
						<UIAvatar size="large" src={'/files/'+userData.photoFileId+'/'+userData.fileSn+'/download'} fallback="/avatar.svg" />
						<strong className="text-primary"><em>{userData.loginUserNm}</em> {userData.loginPstnName}</strong>
					</div>
					<UIButton size="small" shape="square" onClick={toggleNav}>
						<div className="icon is-32 is-close"></div>
					</UIButton>
				</div>
				<div className="Menu">
					<NavigationMenuList className="MenuList">
						<NavigationMenuItem>
							<h3>근태현황</h3>
							<NavigationMenuList>
								<NavigationMenuItem>
									<Link to="/attendance/hour" onClick={toggleNav}>근무시간 조회</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/attendance/schedule" onClick={toggleNav}>근무 스케쥴 조회</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/attendance/absence" onClick={toggleNav}>부재시간 관리</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/attendance/schedule-member" onClick={toggleNav}>팀원 근무스케쥴 조회</Link>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<h3>근태신청</h3>
							<NavigationMenuList>
								<NavigationMenuItem>
									<Link to="/attendance/apply" onClick={toggleNav}>근태 신청</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/attendance/cancel" onClick={toggleNav}>근태 취소 신청</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/attendance/switch" onClick={toggleNav}>휴/복직 신청</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/attendance/chooseplan" onClick={toggleNav}>선택근무 계획 수립</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/attendance/history" onClick={toggleNav}>출/퇴근 기록 변경신청</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/attendance/overtime" onClick={toggleNav}>초과근무 신청</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/attendance/overtime-cancel" onClick={toggleNav}>초과근무 취소 신청</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/attendance/shift" onClick={toggleNav}>근무조 변경 신청</Link>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<h3>교대조신청</h3>
							<NavigationMenuList>
								<NavigationMenuItem>
									<Link to="/attendance/shift" onClick={toggleNav}>근무조 변경 신청</Link>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<h3>복리후생신청</h3>
							<NavigationMenuList>
								<NavigationMenuItem>
									<Link to="/welfare/fund" onClick={toggleNav}>경조금 신청</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/welfare/studentloan" onClick={toggleNav}>학자금 신청</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/welfare/insurance" onClick={toggleNav}>상해보험 신청</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/welfare" onClick={toggleNav}>복리후생신청 현황</Link>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<h3>입퇴사</h3>
							<NavigationMenuList>
								<NavigationMenuItem>
									<Link to="/tenure/join-apply" onClick={toggleNav}>입사정보 등록</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/tenure/attachfile" onClick={toggleNav}>입사 첨부파일</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/tenure/econtract" onClick={toggleNav}>전자계약</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/tenure/join-info" onClick={toggleNav}>입사정보 안내</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/tenure/leave-flow" onClick={toggleNav}>퇴사FLOW 목록</Link>
								</NavigationMenuItem>
								{/* <NavigationMenuItem>
									<Link to="/tenure/leave-info" onClick={toggleNav}>퇴사FLOW 입력</Link>
								</NavigationMenuItem> */}
								{/* <NavigationMenuItem>
									<Link to="/tenure/leave-survey" onClick={toggleNav}>퇴사FLOW(설문)</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/tenure/leave-resignation" onClick={toggleNav}>퇴사FLOW(사직원)</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/tenure/leave-security" onClick={toggleNav}>보안서약서</Link>
								</NavigationMenuItem> */}
							</NavigationMenuList>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<h3>증명서</h3>
							<NavigationMenuList>
								<NavigationMenuItem>
									<Link to="/certificate/issue" onClick={toggleNav}>제증명신청발급</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/certificate/print" onClick={toggleNav}>제증명출력</Link>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<h3>인사</h3>
							<NavigationMenuList>
								<NavigationMenuItem>
									<Link to="/personnel/info" onClick={toggleNav}>MY인사정보</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/personnel/inquire" onClick={toggleNav}>식수조회</Link>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<h3>행정서비스</h3>
							<NavigationMenuList>
								<NavigationMenuItem>
									<Link to="/complaint/apply" onClick={toggleNav}>행정서비스 신청</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/complaint/list" onClick={toggleNav}>행정서비스 신청 목록</Link>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<h3>급여</h3>
							<NavigationMenuList>
								<NavigationMenuItem>
									<Link to="/salary/salary" onClick={toggleNav}>급여명세서</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/salary/severance" onClick={toggleNav}>예상퇴직금조회</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/salary/annual" onClick={toggleNav}>연봉계약서</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/salary/income" onClick={toggleNav}>갑근세납세증명서</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/salary/healthins" onClick={toggleNav}>건강보험료 연말정산</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/salary/tax" onClick={toggleNav}>연말정산 결과조회</Link>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<h3>교육</h3>
							<NavigationMenuList>
								<NavigationMenuItem>
									<Link to="/education/survey" onClick={toggleNav}>사내교육 만족도 조사</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to="/education/report" onClick={toggleNav}>다솜 월별 보고서</Link>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenuItem>

					</NavigationMenuList>
				</div>

				
				<div className="Logout">
					<UIIconButton className="is-logout" onClick={logout}>로그아웃</UIIconButton>
				</div>
			</div>
		</NavigationMenu>
	);
};