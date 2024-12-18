import { Survey } from "@/features/education"
import { Header, Navigation } from "@/widgets/layouts"

export const EducationSurveyPage = () => {
  return (
    <>
      <Navigation />
      <Header navActive={false} title="사내교육 만족도 조사" />
      <section className="pt-52 pl-20 pr-20">
        <Survey />
			</section>
    </>
  )
}