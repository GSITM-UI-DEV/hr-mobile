import { UIDatePicker, UISelect } from "@/shared/ui";


export const Security = () => {
  return (
    <>
      <div className="pt-10 pb-10">
        <UISelect items={[]} />
      </div>
      <div className="pt-10 pb-10">
        <UIDatePicker type="range" label="기간" />
      </div>
    </>
  )
}