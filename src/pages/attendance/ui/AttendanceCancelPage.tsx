import { Cancel } from "@/features/attendance/applyTo";
import { Header, Navigation } from "@/widgets/layouts";

export const AttendanceCancelPage = () => {
	return (
		<>
			<Navigation />
			<Header navActive={false} title="근태 취소 신청" />
			<section className="pt-52 pl-20 pr-20">
        <Cancel />
			</section>
		</>
	);
};