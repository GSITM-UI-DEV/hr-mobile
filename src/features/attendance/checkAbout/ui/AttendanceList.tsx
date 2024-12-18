import { axiosInstance } from "@/app/api/axiosInstance";
import { useDateStore } from "@/app/store/authStore";
import { useAttendanceForm, useAttendanceList } from "@/entities/attendance";
import { useUser } from "@/entities/user/api/useUser";
import { UIBadge, UIDatePicker, UIInput, UISelect } from "@/shared/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { useState } from "react";


export const AttendanceList = () => {
  const [dateRange, setDateRange] = useState({ fromDate: '', toDate: ''});
  const [formId, setFormId] = useState('');
  const [statusCode, setStatusCode] = useState('');


  const {currentDate, setCurrentDate} = useDateStore();
  const toDay = currentDate.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const [day, setDay] = useState<string>(toDay);

  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Error: {userError.message}</p>;

  const { data: attendanceFormData, isLoading: isAttendanceFormLoading, error: attendanceFormError } = useAttendanceForm({
    searchEmplNo: userData.loginUserId,
    reqDateFrom: dateRange.fromDate ? dateRange.fromDate : day,
    reqDateTo: dateRange.toDate ? dateRange.toDate : day,
    formId: formId,
    statusCode: statusCode,
  });
	if (isAttendanceFormLoading) return <p>Loading...</p>;
	if (attendanceFormError) return <p>Error: {attendanceFormError.message}</p>;
  const attendanceFormTarget = attendanceFormData.map((item) => { return {label: item.formName, error: false, query: item.formId}})



  const { data: attendanceListData, isLoading: isAttendanceListLoading, error: attendanceListError } = useAttendanceList({
    searchEmplNo: userData.loginUserId,
    reqDateFrom: dateRange.fromDate ? dateRange.fromDate : day,
    reqDateTo: dateRange.toDate ? dateRange.toDate : day,
    formId: formId,
    statusCode: statusCode,
  });
	if (isAttendanceListLoading) return <p>Loading...</p>;
	if (attendanceListError) return <p>Error: {attendanceListError.message}</p>;



  const [detailData, setDetailData] = useState();
  const handleFetchDetail = async (params: any) => {
    const { data } = await axiosInstance.get(`/uhr/docappr/apprtmchng100?docNo=${params.docNo}&emplNameHan=${params.emplNameHan}&orgNameHan=${params.orgNameHan}&statusCode=${params.statusCode}&reCd=`)
    console.log(data[0]);
    setDetailData(data[0]);
  }

  return (
    <>
      <div className="pt-10 pb-10">
        <UIDatePicker
          label="신청일"
          type="range"
          onDateRangeChange={(range) => setDateRange(range)}
          placeholder={day}
        />
      </div>
      <div className="pt-10 pb-10">
        <UISelect
          label="신청서종류"
          defaultValue="신청서 종류"
          items={attendanceFormTarget}
          onQuerySelect={(value) => setFormId(value)}
        />
      </div>
      <div className="pt-10 pb-10">
        <UISelect
          label="진행상태"
          items={[
            {label: "임시저장", error: false, query: "1"},
            {label: "결재요청", error: false, query: "3"}
          ]}
          onQuerySelect={(value) => setStatusCode(value)}
        />
      </div>
      <div className="pt-10 pb-10">
        <div className="count__control">
          <div className="count">총 <em>{attendanceListData.length}</em> 건</div>
        </div>
        <ul className="list">
          {attendanceListData.length === 0 ?
            <li className="fs-15 text-center">데이터가 없습니다.</li>
          : attendanceListData.map((item: any, i) => 
            <li key={i}>
              <div className="list__content">
                <div className="top">
                  <div className="date">{item.reqstDate}</div>
                </div>
                <div className="info">
                  <div className="pb-20 pt-20">
                    <strong>신청서종류</strong>
                    <span className="font-bold">{item.formName}</span>
                  </div>
                  <div className="pb-20">
                    <strong>진행상태</strong>
                    {item.statusName === "임시저장" ?
                      <UIBadge type="border" shape="square" color="blue">{item.statusName}</UIBadge>
                    :
                      <UIBadge type="border" shape="square" color="green">{item.statusName}</UIBadge>
                    }
                  </div>
                  <div className="pb-20">
                    <strong>문서번호</strong>
                    <span className="text-point-1">{item.docNo}</span>
                  </div>
                </div>
              </div>
            </li>
            // <li key={i}>
            //   <Popover>
            //     <PopoverTrigger asChild className="list__content"
            //       onClick={() => handleFetchDetail({
            //         docNo: item.docNo,
            //         emplNameHan: item.reqEmplName,
            //         orgNameHan: item.orgNameHan,
            //         statusCode: item.statusCode
            //         })}
            //       >
            //       <div className="list__content">
            //         <div className="top">
            //           <div className="date">{item.reqstDate}</div>
            //           <div className="icon is-arrow__right"></div>
            //         </div>
            //         <div className="info">
            //           <div className="pb-20 pt-20">
            //             <strong>신청서종류</strong>
            //             <span className="font-bold">{item.formName}</span>
            //           </div>
            //           <div className="pb-20">
            //             <strong>진행상태</strong>
            //             {item.statusName === "임시저장" ?
            //               <UIBadge type="border" shape="square" color="blue">{item.statusName}</UIBadge>
            //             :
            //               <UIBadge type="border" shape="square" color="green">{item.statusName}</UIBadge>
            //             }
            //           </div>
            //           <div className="pb-20">
            //             <strong>문서번호</strong>
            //             <span className="text-point-1">{item.docNo}</span>
            //           </div>
            //         </div>
            //       </div>
            //     </PopoverTrigger>
            //     <PopoverContent className="d-flex align-items-cneter flex-direction-column custom__popper">
            //       <h4 className="p-30"></h4>
            //       <div className="pt-10 pb-10 pl-30 pr-30">
            //         <UIInput label="사유" readOnly/>
            //       </div>
            //       <div className="pt-10 pb-10 pl-30 pr-30">
            //         <UIInput label="사유" readOnly />
            //       </div>
            //     </PopoverContent>
            //   </Popover>
            // </li>
          )}
        </ul>
      </div>
    </>
  )
}