import { useDateStore } from "@/app/store/authStore";
import { useAttendanceSchedule } from "@/entities/attendance";
import { useUser } from "@/entities/user/api/useUser";
import { UIDatePicker } from "@/shared/ui";
import { useState } from "react";


export const Schedule = () => {
  const {currentDate, setCurrentDate} = useDateStore();
  const toDay = currentDate.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit' });
  const [month, setMonth] = useState<string>(toDay);

  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Error: {userError.message}</p>;
  
  const { data: scheduleData, isLoading: isScheduleLoading, error: scheduleError } = useAttendanceSchedule({ searchEmplNo: userData.userId, searchEmplNameHan: userData.userNm, baseMonth: month.replace('-', '') });
  if (isScheduleLoading) return <p>Loading...</p>;
  if (scheduleError) return <p>Something went wrong!</p>;

  const handleMonth = (date: Date) => {
    setMonth(date.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit' }).replace('-', ''));
  }

  const scheduleSortData = scheduleData.sort((sortA, sortB) => {
    const sortAtype = new Date(sortA.startTime)
    const sortBtype = new Date(sortB.startTime)
    if (isNaN(sortAtype.getTime()) || isNaN(sortBtype.getTime())) {
      return isNaN(sortAtype.getTime()) ? 1 : -1;
    }
    return sortAtype.getTime() - sortBtype.getTime();
  })
  return (
    <>
      <div className="pt-10 pb-10">
        <UIDatePicker type="year-month" label="조회월" placeholder={toDay} onMonthSelect={handleMonth} />
      </div>
      <div className="pt-10 pb-10">
        <div className="count__control">
          <div className="count">총 <em>{scheduleData.length}</em> 건</div>
        </div>
        <ul className="list">
          {scheduleSortData.map((item: any, i) => 
            <li key={i}>
              <div className="list__content">
                <div className="top">
                  <div className="date">{item.startTime.split(' ')[0]}</div>
                </div>
                <div className="info">
                  <div>
                    <strong>근무조</strong>
                    <span>{item.title}</span>
                  </div>
                  <div>
                    <strong>근무시간</strong>
                    <span className="text-point-1">{item.startTime.split(' ')[1]} ~ {item.endTime.split(' ')[1]}</span>
                  </div>
                  <div>
                    <strong>근태내역</strong>
                    <span>{item.halfday ? item.halfday : "-"}</span>
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