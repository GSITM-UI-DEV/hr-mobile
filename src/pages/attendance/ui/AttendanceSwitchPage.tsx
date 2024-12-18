import { Switch } from "@/features/attendance/applyTo";
import { Header, Navigation } from "@/widgets/layouts";

export const AttendanceSwitchPage = () => {
	return (
		<>
			<Navigation />
			<Header navActive={false} title="휴/복직 신청" />
			<section className="pt-52 pl-20 pr-20">
				<Switch />
			</section>
		</>
	);
};