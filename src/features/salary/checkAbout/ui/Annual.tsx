import { UIDatePicker, UIInput } from "@/shared/ui";


export const Annual = () => {
  return (
    <>
      <UIDatePicker type="range" label="조회일" />
      <UIDatePicker type="range" label="기간" />
      
      <UIInput label="부서" />
      <UIInput is_search />

      <UIInput label="부서" />
      <UIInput is_search />
    </>
  )
}