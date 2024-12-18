import { Inquire } from "@/features/personnel"
import { Header, Navigation } from "@/widgets/layouts"

export const PersonnelInquirePage = () => {
  return (
    <>
      <Navigation />
      <Header navActive={false} title="식수조회" />
      <section className="pt-52 pl-20 pr-20">
        <Inquire />
			</section>
    </>
  )
}