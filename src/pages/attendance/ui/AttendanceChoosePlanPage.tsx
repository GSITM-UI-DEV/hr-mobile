import { ChoosePlan } from "@/features/attendance/applyTo";
import { Header, Navigation } from "@/widgets/layouts";

export const AttendanceChoosePlanPage = () => {
	return (
		<>
			<Navigation />
			<Header navActive={false} title="선택근무 계획 수립" />
			<section className="pt-52 pl-20 pr-20">
        <ChoosePlan />
			</section>
		</>
	);
};