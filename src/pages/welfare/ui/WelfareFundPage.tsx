import { Fund } from '@/features/welfare/applyTo';
import { Header, Navigation } from '@/widgets/layouts';


export const WelfareFundPage = () => {
	return (
		<>
			<Navigation />
			<Header navActive={false} title="경조금 신청" />
			<section className="pt-52 pl-20 pr-20">
        <Fund />
			</section>
		</>
	)
}