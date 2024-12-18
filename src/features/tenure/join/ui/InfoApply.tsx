import { UIButton, UIInput, UIRadio, UISelect, UITabs } from "@/shared/ui";


export const InfoApply = () => {
  const tabsData = [
    { value: "tab1", label: "One", content: <div>11111</div>, disabled: true },
    { value: "tab2", label: "Two", content: <div>22222</div> },
    { value: "tab3", label: "Three", content: <div>33333</div> },
    { value: "tab4", label: "Four", content: <div>44444</div> },
    { value: "tab5", label: "Five", content: <div>55555</div> },
    { value: "tab6", label: "Six", content: <div>66666</div> },
    { value: "tab7", label: "Seven", content: <div>77777</div> },
    { value: "tab8", label: "Eight", content: <div>88888</div> },
    { value: "tab9", label: "Nine", content: <div>99999</div> },
    { value: "tab10", label: "Ten", content: <div>101010</div> },
  ];
  const radioItems = [
    { label: "남자", value: "value1" },
    { label: "여자", value: "value2" },
  ];

  return (
    <>
      <div className="pt-10 pb-10">
        <UITabs tabsData={tabsData} />
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
        <UIRadio items={radioItems} onItemSelect={(): void => {}} />
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