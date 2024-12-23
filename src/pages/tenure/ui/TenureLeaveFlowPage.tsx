import { Flow } from "@/features/tenure/leave"
import { Header, Navigation } from "@/widgets/layouts"
import { Outlet, useParams } from "react-router-dom";




export const TenureLeaveFlowPage = () => {
	const detail = useParams();
	const [rtflowId, reqDate, emplNo, lastWorkDate] = detail.id ? detail.id.split("-") : '';
	const queryString = `rtflowId=${rtflowId}&reqDate=${reqDate}&emplNo=${emplNo}&lastWorkDate=${lastWorkDate}`;

	return (
		<>
			<Navigation />
			{detail.id ?
				<>
					<Header navActive={true} title="퇴사FLOW 입력" />
					<section className="pt-52 pl-20 pr-20">
						<Outlet context={queryString} />
					</section>
				</>
			:
				<>
					<Header navActive={false} title="퇴사FLOW 목록" />
					<section className="pt-52 pl-20 pr-20">
						<Flow />
					</section>
				</>
			}
		</>
	);
};