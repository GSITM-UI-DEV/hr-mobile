import { UIDatePicker, UIInput } from "@/shared/ui";


export const Survey = () => {
  // /edu/dbhedust/edust400
  const aa = {
    searchStartDate: '2024-08-18',
    searchEndDate: '2024-11-18',
    orgCode: '',
    orgNameHan: '',
    emplNo: '10006254',
    searchEmplNameHan: '%EB%85%B8%ED%83%9C%EA%B7%9C'
  }
  return (
    <>
      <div className="pt-10 pb-10">
        <UIDatePicker label="조회월" type="range" />
      </div>
      <div className="pt-10 pb-10">
        <div className="count__control">
          <div className="count">총 <em>3</em> 명</div>
        </div>
      </div>
    </>
  )
}