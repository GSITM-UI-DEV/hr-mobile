import { Insurance } from '@/features/welfare/applyTo';
import { Header, Navigation } from '@/widgets/layouts';


export const WelfareInsurancePage = () => {
	return (
		<>
			<Navigation />
			<Header navActive={false} title="상해보험 신청" />
			<section className="pt-52 pl-20 pr-20">
        <Insurance />
			</section>
		</>
	)
}