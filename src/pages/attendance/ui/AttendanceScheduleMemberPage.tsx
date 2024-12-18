import { ScheduleMember } from "@/features/attendance/checkAbout";
import { Header, Navigation } from "@/widgets/layouts";

export const AttendanceScheduleMemberPage = () => {
	return (
		<>
			<Navigation />
			<Header navActive={false} title="팀원 근무스케쥴 조회" />
			<section className="pt-52 pl-20 pr-20">
				<ScheduleMember />
			</section>
		</>
	);
};