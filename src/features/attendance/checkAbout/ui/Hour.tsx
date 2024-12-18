import { useDateStore } from "@/app/store/authStore";
import { useAttendanceHour } from "@/entities/attendance";
import { useUser } from "@/entities/user/api/useUser";
import { formatByType } from "@/shared/lib/formatByType";
import { UIDatePicker } from "@/shared/ui";
import { useState } from "react";
import { Link } from "react-router-dom";


export const Hour = () => {
  const {currentDate, setCurrentDate} = useDateStore();
  const toDay = currentDate.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit' });
  const [month, setMonth] = useState<string>(toDay);

  

  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Error: {userError.message}</p>;

  const { data: hourData, isLoading: isHourLoading, error: hourError } = useAttendanceHour({ emplNo: userData.userId, emplNameHan: userData.userNm, baseMonth: month });
  if (isHourLoading) return <p>Loading...</p>;
  if (hourError) return <p>Something went wrong!</p>;


  
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
          <div className="count">총 <em>{hourData.length}</em> 건</div>
        </div>
        <ul className="list">
          {hourData.length === 0 ?
            <li className="fs-15 text-center">데이터가 없습니다.</li>
          : hourData.map((item: any, i) =>
            <li key={i}>
              {item.nwkDayHour ?
                <Link to={`${item.workDate}-${item.emplNo}-${item.emplNameHan}-${item.workName}`} className="list__content">
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
        {/* <ul className="list">
          {hourData.map((item: any, i) => 
            <li key={i}>
              <div className="list__content">
                <div className="top">
                  <div className="date">
                    {item.workDate} [
                      {item.sStartTime.slice(0,2)}:{item.sStartTime.slice(2)}
                      &nbsp;~&nbsp;
                      {item.sEndTime.slice(0,2)}:{item.sEndTime.slice(2)}
                    ]
                  </div>
                  {item.nwkDayHour ? <div className="icon is-arrow__right"></div> : null }
                </div>
                <div className="info info_horizon">
                  <div>
                    <strong>기본근무</strong>
                    <span>{item.realWorkHour}</span>
                  </div>
                  <div>
                    <strong>초과근무</strong>
                    <span>{item.otRealWorkHour}</span>
                  </div>
                </div>
              </div>
            </li>
          )}
        </ul> */}
      </div>
    </>
  )
}

export const Item = ({ data }: { data: any }) => (
  <>
    <div className="top">
      {/* <div className="date">
        {data.workDate}
      </div> */}
      <div className="date">
        {formatByType("date", data.workDate)}

        {data.sStartTime || data.sEndTime? 
        <span className="text-point-1">
          &nbsp;[
            {formatByType("time", data.sStartTime)}
            &nbsp;~&nbsp;
            {formatByType("time", data.sEndTime)}
          ]
        </span>
        : null}
      </div>
      {data.nwkDayHour ? <div className="icon is-arrow__right"></div> : null }
    </div>
    <div className="info info_horizon">
      <div>
        <strong>기본근무</strong>
        <span>{formatByType("time", data.realWorkHour)}</span>
      </div>
      <div>
        <strong>초과근무</strong>
        <span>{formatByType("time", data.otRealWorkHour)}</span>
      </div>
    </div>
  </>
)