import { useDateStore } from "@/app/store/authStore";
import { useAttendanceScheduleMember } from "@/entities/attendance";
import { useUser } from "@/entities/user/api/useUser";
import { UIDatePicker } from "@/shared/ui";
import { useState } from "react";


export const ScheduleMember = () => {
  const {currentDate, setCurrentDate} = useDateStore();
  const toDay = currentDate.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit' });
  const [month, setMonth] = useState<string>(toDay);

  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Error: {userError.message}</p>;
  
  const { data: scheduleMemberData, isLoading: isScheduleMemberLoading, error: scheduleMemberError } = useAttendanceScheduleMember({ searchOrgCode: userData.loginDeptId, searchOrgNameHan: userData.loginDeptName });
  if (isScheduleMemberLoading) return <p>Loading...</p>;
  if (scheduleMemberError) return <p>Something went wrong!</p>;

  const handleMonth = (date: Date) => {
    setMonth(date.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit' }).replace('-', ''));
  }

  return (
    <>
      <div className="pt-10 pb-10">
        <UIDatePicker type="year-month" label="조회월" placeholder={toDay} onMonthSelect={handleMonth} />
      </div>
      <div className="pt-10 pb-10">
        <div className="count__control">
          <div className="count">총 <em>{scheduleMemberData.length}</em> 건</div>
        </div>
        <ul className="list">
          {scheduleMemberData.map((item: any, i) => 
            <li key={i}>
              <div className="list__content">
                <div className="top">
                  <div className="date">
                    <span>{item.attendees}</span>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <span>{item.startTime?.split(' ')[0]}</span>
                  </div>
                  {/* <div className="fs-15">{item.attendees}</div> */}
                </div>
                <div className="info">
                  <div>
                    <strong>근태</strong>
                    <span style={{color: item.colorCd}}>{item.title}</span>
                  </div>
                  <div>
                    <strong>근무조</strong>
                    <span>{item.workCodeKind}</span>
                  </div>
                  <div>
                    <strong>근무시간</strong>
                    <span>{item.startTime?.split(' ')[1]} ~ {item.endTime?.split(' ')[1]}</span>
                  </div>
                </div>
              </div>
            </li>
          )}
        </ul>
      </div>
    </>
  )
}