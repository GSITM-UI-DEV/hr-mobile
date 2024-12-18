import { Print } from '@/features/certificate/applyTo';
import { Header, Navigation } from '@/widgets/layouts';

export const CertificatePrintPage = () => {
	return (
		<>
			<Navigation />
			<Header navActive={false} title="제증명출력" />
			<section className="pt-52 pl-20 pr-20">
        <Print />
			</section>
		</>
	)
}