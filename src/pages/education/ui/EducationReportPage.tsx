import { Report } from "@/features/education"
import { Header, Navigation } from "@/widgets/layouts"

export const EducationReportPage = () => {
  return (
    <>
      <Navigation />
      <Header navActive={false} title="다솜 월별 보고서" />
      <section className="pt-52 pl-20 pr-20">
        <Report />
			</section>
    </>
  )
}