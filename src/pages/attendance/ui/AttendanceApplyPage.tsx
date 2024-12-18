import { Attendance } from "@/features/attendance/applyTo";
import { Header, Navigation } from "@/widgets/layouts";

export const AttendanceApplyPage = () => {
	return (
		<>
			<Navigation />
			<Header navActive={false} title="근태 신청" />
			<section className="pt-52 pl-20 pr-20 pb-200 mb-50">
        <Attendance />
			</section>
		</>
	);
};