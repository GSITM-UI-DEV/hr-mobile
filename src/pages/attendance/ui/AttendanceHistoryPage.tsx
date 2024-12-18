import { History } from "@/features/attendance/applyTo";
import { Header, Navigation } from "@/widgets/layouts";

export const AttendanceHistoryPage = () => {
	return (
		<>
			<Navigation />
			<Header navActive={false} title="출/퇴근 기록 변경신청" />
			<section className="pt-52 pl-20 pr-20">
				<History />
			</section>
		</>
	);
};