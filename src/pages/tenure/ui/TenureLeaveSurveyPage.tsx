import { Survey } from "@/features/tenure/leave"
import { Header, Navigation } from "@/widgets/layouts"
import { useParams } from "react-router-dom";

export const TenureLeaveSurveyPage = () => {
  const detail = useParams();
  // console.log(detail);
  return (
    <>
      <Navigation />
      <Header navActive={true} title="퇴사FLOW(설문)" />
      <section className="pt-52 pl-20 pr-20">
				<Survey />
			</section>
    </>
  )
}