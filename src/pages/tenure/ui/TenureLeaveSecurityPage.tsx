import { Security } from "@/features/tenure/leave"
import { Header, Navigation } from "@/widgets/layouts"

export const TenureLeaveSecurityPage = () => {
  return (
    <>
      <Navigation />
      <Header navActive={false} title="보안서약서" />
      <section className="pt-52 pl-20 pr-20">
				<Security />
			</section>
    </>
  )
}