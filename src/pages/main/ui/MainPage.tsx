import { Main } from "@/features/main"
import { Header, Navigation } from "@/widgets/layouts"

export const MainPage = () => {
  return (
    <>
      <Navigation />
      <Header navActive={false} title="" />
      <section className="pt-52 pl-20 pr-20">
        <Main />
			</section>
    </>
  )
}