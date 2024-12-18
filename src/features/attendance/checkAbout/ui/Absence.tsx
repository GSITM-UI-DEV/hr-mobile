import { useDateStore } from "@/app/store/authStore";
import { useAttendanceAbsence } from "@/entities/attendance";
import { useUser } from "@/entities/user/api/useUser";
import { UIDatePicker } from "@/shared/ui";
import { useState } from "react";
import { Link } from "react-router-dom";



export const Absence = () => {
  const {currentDate, setCurrentDate} = useDateStore();
  const toDay = currentDate.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit' });
  const [month, setMonth] = useState<string>(toDay);


  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Error: {userError.message}</p>;

  const { data: absenceData, isLoading: isAbsenceLoading, error: absenceError } = useAttendanceAbsence({ baseMonth: month, orgCode: userData.loginDeptId, orgNameHan: userData.loginDeptName });
  if (isAbsenceLoading) return <p>Loading...</p>;
  if (absenceError) return <p>Something went wrong!</p>;



  const handleMonth = (date: Date) => {
    setMonth(date.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit' }));
  }

  return (
    <>
      <div className="pt-10 pb-10">
        <UIDatePicker type="year-month" label="조회월" placeholder={toDay} onMonthSelect={handleMonth} />
      </div>
      <div className="pt-10 pb-10">
        <div className="count__control">
          <div className="count">총 <em>{absenceData.length}</em> 명</div>
        </div>
        <ul className="list">
          {absenceData.map((item: any, i) =>
            <li key={i}>
              {item.nwkDayHour ?
                <Link to={`${item.workDate}-${item.emplNo}-${item.emplNameHan}`} className="list__content">
                  <Item data={item} />
                </Link>
                :
                <div className="list__content">
                  <Item data={item} />
                </div>
              }
            </li>
          )}
        </ul>
      </div>
    </>
  )
}

export const Item = ({ data }: { data: any }) => (
  <>
    <div className="top">
      <div className="date">
        {data.workDate}
      </div>
      {data.nwkDayHour ? <div className="icon is-arrow__right"></div> : null }
    </div>
    <div className="info">
      <div>
        <strong>사번</strong>
        <span>{data.emplNo}</span>
      </div>
      <div>
        <strong>성명</strong>
        <span>{data.emplNameHan}</span>
      </div>
      <div>
        <strong>부서</strong>
        <span>{data.orgNameHan}</span>
      </div>
      <div>
        <strong>총 부재시간</strong>
        <span>{data.nwkDayHour ? data.nwkDayHour : "-"}</span>
      </div>
      {/* <div>
        <strong>총 인정시간</strong>
        <span>{data.nwkDayHour}</span>
      </div>
      <div>
        <strong>총 비업무(기본)</strong>
        <span>{data.nwkDayHour}</span>
      </div>
      <div>
        <strong>총 비업무(연장)</strong>
        <span>{data.nwkDayHour}</span>
      </div> */}
    </div>
  </>
)