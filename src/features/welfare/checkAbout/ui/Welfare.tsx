import { useDateStore } from "@/app/store/authStore";
import { useUser } from "@/entities/user";
import { useWelfare } from "@/entities/welfare/api/useWelfare";
import { UIDatePicker, UISelect } from "@/shared/ui";
import { useState } from "react";


export const Welfare = () => {
  const {currentDate, setCurrentDate} = useDateStore();
  const toDay = currentDate.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit' });
  const [month, setMonth] = useState<string>(toDay);
  
  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Error: {userError.message}</p>;

  const { data: welfareData, isLoading: isWelfareLoading, error: welfareError } = useWelfare({
    emplNo: userData.loginUserId,
    loginCoId: userData.loginCoId,
    yyyyMm: '202411',
  });
  if (isWelfareLoading) return <p>Loading...</p>;
  if (welfareError) return <p>Something went wrong!</p>;

  const handleMonth = (date: Date) => {
    setMonth(date.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit' }));
  }


  return (
    <>
      <div className="pt-10 pb-10">
        <UIDatePicker
          label="조회기간"
          type="year-month"
          onMonthSelect={handleMonth}
        />
      </div>
      <div className="pt-10 pb-10">
        <ul className="list">
          <li>
            <div className="list__content">
              <div className="top">
                <div className="date"></div>
              </div>
              <div className="info">
                <div>
                  <strong>근무</strong>
                  <span></span>
                </div>
                <div>
                  <strong>계획 근무시간</strong>
                  <span></span>
                </div>
              </div>
            </div>
          </li>   
        </ul>
      </div>
    </>
  )
}