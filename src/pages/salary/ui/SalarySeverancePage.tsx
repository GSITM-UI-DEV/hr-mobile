import { Severance } from "@/features/salary/checkAbout"
import { Header, Navigation } from "@/widgets/layouts"

export const SalarySeverancePage = () => {
  return (
    <>
      <Navigation />
      <Header navActive={false} title="예상퇴직금조회" />
      <section className="pt-52 pl-20 pr-20">
        <Severance />
			</section>
    </>
  )
}