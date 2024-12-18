import { ListComplaint } from "@/features/complaint"
import { Header, Navigation } from "@/widgets/layouts"

export const ComplaintListPage = () => {
  return (
    <>
      <Navigation />
      <Header navActive={false} title="행정서비스 신청 목록" />
      <section className="pt-52 pl-20 pr-20">
        <ListComplaint />
			</section>
    </>
  )
}