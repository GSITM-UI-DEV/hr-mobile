import { OverTime } from "@/features/attendance/applyTo";
import { Header, Navigation } from "@/widgets/layouts";

export const AttendanceOvertimePage = () => {
	return (
		<>
			<Navigation />
			<Header navActive={false} title="초과근무 신청" />
			<section className="pt-52 pl-20 pr-20">
				<OverTime />
			</section>
		</>
	);
};