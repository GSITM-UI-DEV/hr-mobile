import { AttendanceList } from "@/features/attendance/checkAbout";
import { Header, Navigation } from "@/widgets/layouts";

export const AttendanceListPage = () => {
	return (
		<>
			<Navigation />
			<Header navActive={false} title="근태 신청 현황" />
			<section className="pt-52 pl-20 pr-20">
        <AttendanceList />
			</section>
		</>
	);
};