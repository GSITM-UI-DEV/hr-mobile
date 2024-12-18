import { Salary } from "@/features/salary/checkAbout"
import { Header, Navigation } from "@/widgets/layouts"

export const SalaryPage = () => {
  return (
    <>
      <Navigation />
      <Header navActive={false} title="급여명세서" />
      <section className="pt-52 pl-20 pr-20">
        <Salary />
			</section>
    </>
  )
}