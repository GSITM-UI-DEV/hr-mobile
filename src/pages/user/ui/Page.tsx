import { UserInquiry, UserUpdate } from '@/features/user';
import { Header, Navigation } from '@/widgets/layouts';


export const UserPage = () => {
	return (
		<>
			<Navigation />
			<Header navActive={false} />
			<section className="pt-52 pl-20 pr-20">
				<UserInquiry />
			</section>

      <section className="pt-52 pl-20 pr-20">
				<UserUpdate />
			</section>
		</>
	)
}