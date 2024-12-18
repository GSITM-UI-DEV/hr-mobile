import { AttachFile } from "@/features/tenure/join"
import { Header, Navigation } from "@/widgets/layouts"

export const TenureAttachfilePage = () => {
  return (
    <>
      <Navigation />
      <Header navActive={false} title="입사 첨부파일" />
      <section className="pt-52 pl-20 pr-20">
				<AttachFile />
			</section>
    </>
  )
}