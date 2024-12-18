import { EContract } from "@/features/tenure/join"
import { Header, Navigation } from "@/widgets/layouts"

export const TenureEcontractPage = () => {
  return (
    <>
      <Navigation />
      <Header navActive={false} title="전자계약" />
      <section className="pt-52 pl-20 pr-20">
				<EContract />
			</section>
    </>
  )
}