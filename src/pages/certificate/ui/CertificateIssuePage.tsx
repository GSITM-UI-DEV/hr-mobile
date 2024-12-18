import { Issue } from '@/features/certificate/applyTo';
import { Header, Navigation } from '@/widgets/layouts';

export const CertificateIssuePage = () => {
	return (
		<>
			<Navigation />
			<Header navActive={false} title="제증명신청발급" />
			<section className="pt-52 pl-20 pr-20">
        <Issue />
			</section>
		</>
	)
}