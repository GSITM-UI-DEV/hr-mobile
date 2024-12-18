import { Info } from "@/features/tenure/join"
import { Header, Navigation } from "@/widgets/layouts"

export const TenureJoinInfoPage = () => {
  return (
    <>
      <Navigation />
      <Header navActive={false} title="입사정보 안내" />
      <section className="pt-52 pl-20 pr-20">
				<Info />
			</section>
    </>
  )
}