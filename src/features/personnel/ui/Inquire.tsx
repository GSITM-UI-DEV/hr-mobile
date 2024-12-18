import { UIDatePicker } from "@/shared/ui"


export const Inquire = () => {
  // /one/dbhempmeal/empmeal100?fromMonth=2024-01&toMonth=2024-11
  const aa = {
    fromMonth: '2024-01',
    toMonth: '2024-11'
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