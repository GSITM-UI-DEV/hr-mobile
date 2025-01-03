import { Reinstatement } from "@/features/attendance/applyTo";
import { Header, Navigation } from "@/widgets/layouts";

export const AttendanceReinstatementPage = () => {
	return (
		<>
			<Navigation />
			<Header navActive={false} title="초과근무 취소 신청" />
			<section className="pt-52 pl-20 pr-20">
				<Reinstatement />
			</section>
		</>
	);
};