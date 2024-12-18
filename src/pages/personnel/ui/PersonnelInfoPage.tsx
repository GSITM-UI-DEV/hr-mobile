import { Info } from "@/features/personnel"
import { Header, Navigation } from "@/widgets/layouts"

export const PersonnelInfoPage = () => {
  return (
    <>
      <Navigation />
      <Header navActive={false} title="MY인사정보" />
      <section className="pt-52 pl-20 pr-20">
        <Info />
			</section>
    </>
  )
}