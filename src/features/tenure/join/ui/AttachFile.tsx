import { UIButton, UIInput, UIRadio, UISelect, UITabs } from "@/shared/ui";


export const AttachFile = () => {
  return (
    <>
      <div className="pt-10 pb-10">
        <UITabs tabsData={[]} />
      </div>
      <div className="pt-10 pb-10">
        <UIInput label="성명(한글)" />
      </div>
      <div className="pt-10 pb-10">
        <div className="d-flex">
          <UIInput label="성명(한자)" />
        </div>
        <div className="d-flex">
          <UIInput label="성명(한자)" />
        </div>
      </div>
      <div className="pt-10 pb-10">
        <div className="d-flex">
          <UIInput label="성명(한자)" />
        </div>
        <div className="d-flex">
          <UIInput label="성명(한자)" />
        </div>
      </div>
      <div className="pt-10 pb-10">
        <UIRadio items={[]} onItemSelect={(): void => {}} />
      </div>
      <div className="pt-10 pb-10">
        <div className="d-flex">
          <UIInput label="이메일" />
        </div>
        <div className="d-flex">
          <UISelect items={[]} />
        </div>
      </div>


      <div className="applyAction">
        <UIButton type="border" onClick={() => {}}>임시저장</UIButton>
        <UIButton type="primary" onClick={() => {}}>결재요청</UIButton>
      </div>
    </>
  )
}