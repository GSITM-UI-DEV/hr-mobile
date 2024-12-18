import { Absence } from "@/features/attendance/checkAbout";
import { Header, Navigation } from "@/widgets/layouts";
import { Outlet, useParams } from "react-router-dom";

export const AttendanceAbsencePage = () => {
	const detail = useParams();
	const [baseDate, emplNo, emplNameHan] = detail.id ? detail.id.split("-") : '';
	const queryString = `baseDate=${baseDate}&emplNo=${emplNo}&emplNameHan=${encodeURIComponent(emplNameHan)}`;
 

	// console.log(detail)
	return (
		<>
			<Navigation />
			{detail.id ?
				<>
					<Header navActive={true} title="부재시간 관리 상세(부재소명)" />
					<section className="pt-52 pl-20 pr-20">
						<Outlet context={queryString}/>
					</section>
				</>
			:
				<>
					<Header navActive={false} title="부재시간 관리" />
					<section className="pt-52 pl-20 pr-20">
						<Absence />
					</section>
				</>
			}
		</>
	);
};