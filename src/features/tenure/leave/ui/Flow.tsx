import { useDateStore } from "@/app/store/authStore";
import { useTenureLeaveFlow } from "@/entities/tenure";
import { useUser } from "@/entities/user";
import { UIBadge, UIDatePicker, UISelect } from "@/shared/ui";
import { useState } from "react";
import { Link } from "react-router-dom";


export const Flow = () => {
  const [dateRange, setDateRange] = useState({ fromDate: '', toDate: ''});
  const [completeYn, setCompleteYn] = useState('');
  const {currentDate, setCurrentDate} = useDateStore();
  const toDay = currentDate.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const [day, setDay] = useState<string>(toDay);
  const checkDate = new Date();
  const threeMonthAgo = new Date(checkDate.setMonth(checkDate.getMonth() - 3));
  const threeMonthDay = threeMonthAgo.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });

  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Error: {userError.message}</p>;


  const { data: tenureLeaveFlowData, isLoading: isTenureLeaveFlowLoading, error: tenureLeaveFlowError } = useTenureLeaveFlow({
    fromDate: dateRange.fromDate ? dateRange.fromDate : threeMonthDay,
    toDate: dateRange.toDate,
    rEmplNo: userData.loginUserId,
    rEmplNameHan: userData.loginUserNm,
    sComplYn: completeYn,
    role: '2',
  });
	if (isTenureLeaveFlowLoading) return <p>Loading...</p>;
	if (tenureLeaveFlowError) return <p>Error: {tenureLeaveFlowError.message}</p>;


  // 쿼리되는 값에 따라서, 레포트, 동적필드, 사직원, 설문조사 - 설정확인(팝업/프로그램 - 화면, 본인확인/담당자확인 - 동적필드, 레포트)

  






  return (
    <>
      <div className="pt-10 pb-10">
        <UIDatePicker
          type="range"
          label="퇴직희망일자"
          onDateRangeChange={(range) => setDateRange(range)}
        />
      </div>
      <div className="pt-10 pb-10">
        <UISelect
          label="완료여부"
          items={[
            {label: "전체", error: false, query: ""},
            {label: "완료", error: false, query: "Y"},
            {label: "미완료", error: false, query: "N"},
          ]}
          onQuerySelect={(value) => setCompleteYn(value)}
        />
      </div>
      <div className="pt-10 pb-100">
        <div className="count__control">
          <div className="count">총 <em>{tenureLeaveFlowData.length}</em> 건</div>
        </div>
        <ul className="list">
          {tenureLeaveFlowData.length === 0 ?
            <li className="fs-15 text-center">데이터가 없습니다.</li>
          : tenureLeaveFlowData.map((item: any, i) =>
            <li key={i}>
              <div className="list__content">
                {item.statusCode === "N" ?
                  <Link to={item.rtflowId === "A01" ? `/tenure/leave-survey/${item.lastWorkDate}` // 퇴직설문
                      : item.rtflowId === "A08" ? `/tenure/leave-resignation/${item.lastWorkDate}`
                      : item.rtflowId === "A09" ? `/tenure/leave-handover/${item.lastWorkDate}`
                      : item.rtflowId === "D01" ? "https://hrmreport.dbhitek.com"
                      : `/tenure/leave-flow/${item.rtflowId}-${item.reqDate}-${item.emplNo}-${item.lastWorkDate}`
                    }
                    className="top pb-20"
                  >
                    <div className="date">기한: {item.returnDate}</div>
                    <div className="icon is-arrow__right"></div>
                  </Link>
                :
                  <div className="top pb-20">
                    <div className="date">기한: {item.returnDate}</div>
                  </div>
                }
                <div className="info">
                  <div>
                    <strong>상태</strong>
                    <span>
                      {item.statusName === "미완료" ?
                        <UIBadge type="border" shape="square" color="red">{item.statusName}</UIBadge>
                      :
                        <UIBadge type="border" shape="square" color="green">{item.statusName}</UIBadge>
                      }
                    </span>
                  </div>
                  <div>
                    <strong>사번</strong>
                    <span>{item.mngEmpNo}</span>
                  </div>
                  <div>
                    <strong>성명</strong>
                    <span>{item.mngEmpNm}</span>
                  </div>
                  <div>
                    <strong>최종근무일</strong>
                    <span>{item.retireReqDate}</span>
                  </div>
                  <div>
                    <strong>퇴직FLOW명</strong>
                    <span>{item.rtflowNm}</span>
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