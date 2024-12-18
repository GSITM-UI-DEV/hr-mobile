import { useDateStore } from "@/app/store/authStore";
import { useComplaintList } from "@/entities/complaint";
import { useUser } from "@/entities/user/api/useUser";
import { UIBadge, UIDatePicker, UISelect } from "@/shared/ui";
import { useState } from "react";


export const ListComplaint = () => {
  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: ""
  });
  const handleDateRangeChange = (range: any) => {
    setDateRange(range);
  };


  const checkDate = new Date();
  const threeMonthAgo = new Date(checkDate.setMonth(checkDate.getMonth() - 3));
  const threeMonthDay = threeMonthAgo.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });

  const {currentDate, setCurrentDate} = useDateStore();
  const toDay = currentDate.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });

  
  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Error: {userError.message}</p>;


  const { data: complaintListData, isLoading: isComplaintListLoading, error: complaintListError } = useComplaintList({
    fromDate: dateRange.fromDate ? dateRange.fromDate : threeMonthDay,
    toDate: dateRange.toDate ? dateRange.toDate : toDay
  });
  if (isComplaintListLoading) return <p>Loading...</p>;
  if (complaintListError) return <p>Something went wrong!</p>;

  // console.log(complaintListData);


  
  return (
    <>
      <div className="pt-10 pb-10">
        <UIDatePicker
          label="조회월"
          type="range"
          onDateRangeChange={handleDateRangeChange}
          // placeholder={toDay}
        />
      </div>
      <div className="pt-10 pb-10">
        <div className="count__control">
          <div className="count">총 <em>{complaintListData.length}</em> 건</div>
        </div>
        <ul className="list">
          {complaintListData.length === 0 ?
            <li className="fs-15 text-center">데이터가 없습니다.</li>
          : complaintListData.map((item: any, index) =>
            <li key={index}>
              <div className="list__content">
                <div className="top">
                  <div className="date">{item.wfNm}</div>
                </div>
                <div className="info">
                  <div>
                    <strong>신청일</strong>
                    <span>{item.reqDate}</span>
                  </div>
                  <div>
                    <strong>결재일</strong>
                    <span>{item.appDate}</span>
                  </div>
                  <div>
                    <strong>결재의견</strong>
                    <span>{item.opinion}</span>
                  </div>
                  <div>
                    <strong>상태</strong>
                    {item.statusName === "승인" ?
                      <UIBadge type="border" shape="square" color="green">{item.statusName}</UIBadge>
                    : item.statusName === "신청" ?
                      <UIBadge type="border" shape="square" color="blue">{item.statusName}</UIBadge>
                    : item.statusName === "저장" ?
                      <UIBadge type="border" shape="square" color="yellow">{item.statusName}</UIBadge>
                    : item.statusName === "반려" ?
                      <UIBadge type="border" shape="square" color="red">{item.statusName}</UIBadge>
                    : null}
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