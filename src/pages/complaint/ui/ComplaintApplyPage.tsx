import { ApplyComplaint } from "@/features/complaint"
import { Header, Navigation } from "@/widgets/layouts"

export const ComplaintApplyPage = () => {
  return (
    <>
      <Navigation />
      <Header navActive={false} title="행정서비스 신청" />
      <section className="pt-52 pl-20 pr-20">
        <ApplyComplaint />
			</section>
    </>
  )
}