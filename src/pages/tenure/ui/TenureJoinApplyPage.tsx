import { InfoApply } from "@/features/tenure/join"
import { Header, Navigation } from "@/widgets/layouts"

export const TenureJoinApplyPage = () => {
  return (
    <>
      <Navigation />
      <Header navActive={false} title="입사정보 등록" />
      <section className="pt-52 pl-20 pr-20">
				<InfoApply />
			</section>
    </>
  )
}