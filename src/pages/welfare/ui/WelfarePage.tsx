import { Welfare } from '@/features/welfare/checkAbout';
import { Header, Navigation } from '@/widgets/layouts';


export const WelfarePage = () => {
	return (
		<>
			<Navigation />
			<Header navActive={false} title="복리후생 신청 현황" />
			<section className="pt-52 pl-20 pr-20">
        <Welfare />
			</section>
		</>
	)
}