import { HandOver } from "@/features/tenure/leave"
import { Header, Navigation } from "@/widgets/layouts"

export const TenureLeaveHandOverPage = () => {
  return (
    <>
      <Navigation />
      <Header navActive={true} title="인수인계서" />
      <section className="pt-52 pl-20 pr-20">
				<HandOver />
			</section>
    </>
  )
}