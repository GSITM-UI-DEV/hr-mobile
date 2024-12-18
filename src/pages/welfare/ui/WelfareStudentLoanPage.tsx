import { StudentLoan } from '@/features/welfare/applyTo';
import { Header, Navigation } from '@/widgets/layouts';


export const WelfareStudentLoanPage = () => {
	return (
		<>
			<Navigation />
			<Header navActive={false} title="학자금 신청" />
			<section className="pt-52 pl-20 pr-20 apply__page">
        <StudentLoan />
			</section>
		</>
	)
}