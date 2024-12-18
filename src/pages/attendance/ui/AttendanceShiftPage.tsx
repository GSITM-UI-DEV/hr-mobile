import { Shift } from '@/features/attendance/applyTo';
import { Header, Navigation } from '@/widgets/layouts';

export const AttendanceShiftPage = () => {
	return (
		<>
			<Navigation />
			<Header navActive={false} title="근무조 변경 신청" />
			<section className="pt-52 pl-20 pr-20">
        <Shift />
			</section>
		</>
	)
}