import { Hour } from "@/features/attendance/checkAbout";
import { Header, Navigation } from "@/widgets/layouts";
import { Outlet, useParams } from "react-router-dom";

export const AttendanceHourPage = () => {
	const detail = useParams();
	const [baseDate, emplNo, emplNameHan, workName] = detail.id ? detail.id.split("-") : '';
	const queryString = `baseDate=${baseDate}&emplNo=${emplNo}&emplNameHan=${encodeURIComponent(emplNameHan)}&workName=${workName}`;
	
	// console.log(detail)
	return (
		<>
			<Navigation />
			{detail.id ?
				<>
					<Header navActive={true} title="근무시간 조회 상세(부재소명)" />
					<section className="pt-52 pl-20 pr-20">
						<Outlet context={queryString} />
					</section>
				</>
			:
				<>
					<Header navActive={false} title="근무시간 조회" />
					<section className="pt-52 pl-20 pr-20">
						<Hour />
					</section>
				</>
			}
		</>
	);
};