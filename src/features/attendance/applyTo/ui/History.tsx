import { axiosInstance } from "@/app/api/axiosInstance";
import { useAuthStore, useDateStore } from "@/app/store/authStore";
import { useApprovalForm, useApprovalLine, useApprovalDocument } from "@/entities/approvalLine";
import { useAttendanceHistory } from "@/entities/attendance";
import { useUser } from "@/entities/user";
import { getDaysBetweenDates } from "@/shared/lib/daysBetweenDates";
import { formatByType } from "@/shared/lib/formatByType";
import { UIAlert, UIButton, UIDatePicker, UIInput, UITimePicker, UIToast, UIToggleButton } from "@/shared/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const History = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    docNo: "",
    formId: "",
    reqEmplNo: "",
    reqEmplName: "",
    pgmId: "",
    mblPgmId: "",
    docTitlNm: "",
    statusCode: "",

    aprvPathOrder: "",
    aprvdetailDtoList: [
      {
        docNo: "",
        aprvSeqNo: 0,
        aprvType: "",
        aprvEmplNo: "",
        transInd: "",
        tarnsEmplNo: "",
        statusCode: 0
      }
    ]
  });


  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Error: {userError.message}</p>;

  const { data: approvalFormData, isLoading: isApprovalFormLoading, error: approvalFormError } = useApprovalForm();
  if (isApprovalFormLoading) return <p>Loading...</p>;
  if (approvalFormError) return <p>Something went wrong!</p>;
  const selectedForm = approvalFormData?.filter((i) => i.formName === "CH")[0]
  
  const auth = useAuthStore((state) => state.auth);
  const { data: approvalLineData, isLoading: isApprovalLineLoading, error: approvalLineError } = useApprovalLine({
    formId: selectedForm?.formId,
    emplNo: userData.loginUserId,
  });
  if (isApprovalLineLoading) return <p>Loading...</p>;
  if (approvalLineError) return <p>Something went wrong!</p>;

  const { data: approvalDocumentData, isLoading: isApprovalDocumentLoading, error: approvalDocumentError } = useApprovalDocument(userData.loginUserId);
  if (isApprovalDocumentLoading) return <p>Loading...</p>;
  if (approvalDocumentError) return <p>Something went wrong!</p>;

  // 조회일(today)
  const {currentDate, setCurrentDate} = useDateStore();
  const toDay = currentDate.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const thisMonth = currentDate.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit' });
  const [month, setMonth] = useState<string>(thisMonth);

  // 출퇴근 기록
  const { data: historyData, isLoading: isHistoryLoading, error: historyError, refetch: refetchAttendanceHistory } = useAttendanceHistory({ emplNo: userData.userId, baseMonth: month });
  if (isHistoryLoading) return <p>Loading...</p>;
  if (historyError) return <p>Something went wrong!</p>;

  const handleMonth = (date: Date) => {
    setMonth(date.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit' }));
  }


  
  useEffect(() => {
    // 결재 라인-기안서 세팅
    setForm((prev) => ({
      ...prev,
      docNo: approvalDocumentData,
      formId: selectedForm?.formId,
      reqEmplNo: userData.loginUserId,
      reqEmplName: userData.loginUserNm,
      pgmId: selectedForm?.pgmId,
      mblPgmId: "",
      docTitlNm: `${selectedForm?.formName}-${userData.loginUserNm}`,
      statusCode: "",

      aprvPathOrder: approvalLineData.map(item => item.emplNameHan).join("^"),
      aprvdetailDtoList: approvalLineData.map((item, index) => ({
        docNo: approvalDocumentData,
        aprvSeqNo: index + 1,
        aprvType: item.aprvType,
        aprvEmplNo: item.emplNo,
        transInd: "",
        tarnsEmplNo: "",
        statusCode: item.aprvDepth,
      }))
    }));
  }, [userData, approvalLineData, approvalDocumentData])





  // 선택값 변경
  const handleSelectChange = (field: string, value: any) => {
    setForm((prevForm: any) => {
      const keys = field.split(".");
      let updatedForm = { ...prevForm };
      let current: any = updatedForm;
      keys.forEach((key: any, index) => {
        // 배열 처리를 위한 검사
        if (Array.isArray(current) && !isNaN(Number(key))) {
          key = Number(key); // 인덱스를 숫자로 변환
        }
        if (index === keys.length - 1) {
          current[key] = value; // 값 설정
        } else {
          current[key] = current[key] ? { ...current[key] } : {};
          current = current[key];
        }
      });
      return updatedForm;
    });
  };

  const handleApplySetting = (historyIndex: number) => {
    setForm((prev) => ({
      ...prev,
      statusCode: "3",
      wcworktmchngreqList: [
        {
          emplNo: userData.loginUserId,
          reqEmplNo: userData.loginUserId,
          reqEmplName: userData.loginUserNm,
          docNo: approvalDocumentData,
          docTitlNm: `${selectedForm?.formName}-${userData.loginUserNm}`,
          formId: selectedForm?.formId,
          pgmId: selectedForm?.pgmId,
          workDate: historyData[historyIndex].workDate,
          startTime: historyData[historyIndex].startTime,
          endTime: historyData[historyIndex].endTime,
          workHour: historyData[historyIndex].workHour,
          workHourTotal: "",
          rowKey: "0",
          rowStatus: "C",
        }
      ]
    }))
  }


  // 출퇴근변경 신청(+결과값 Toast 알림)
  const [openToast, setOpenToast] = useState({
    message: "",
    type: "",
    open: false
  });
  const handleApply = async () => {
    const formData = new URLSearchParams();
    const appendFormData = (data: any, parentKey = '') => {
      if (typeof data === 'object' && !Array.isArray(data)) {
        Object.entries(data).forEach(([key, value]) => {
          appendFormData(value, parentKey ? `${parentKey}.${key}` : key);
        });
      } else if (Array.isArray(data)) {
        data.forEach((item, index) => {
          appendFormData(item, `${parentKey}[${index}]`);
        });
      } else {
        formData.append(parentKey, data);
      }
    };
    appendFormData(form);
    try {
      const response = await axiosInstance.post('/uhr/docappr/apprtmchng100', formData);
      if (response.status === 200 && response.data) {
        setOpenToast({message: "결재요청이 완료되었습니다.", open: true, type: "success"});
        setTimeout(async () => {
          setOpenToast((prev) => ({ ...prev, open: false }));
          await refetchAttendanceHistory();
          navigate('/attendance/apply-list');
        }, 1000);
      } else {
        setOpenToast({message: "결재요청에 이상이 있습니다.", open: true, type: "danger"});
        setTimeout(() => {
          setOpenToast((prev) => ({ ...prev, open: false }));
        }, 1000);
      }
    } catch (error: any) {
      setOpenToast({message: error.response.data.message, open: true, type: "danger"});
      setTimeout(() => {
        setOpenToast((prev) => ({ ...prev, open: false }));
      }, 1000);
    }
  }

  

  return (
    <>
      {/* <div className="pt-30 pb-10 text-right">
        <UIToggleButton group={["한달", "일주일"]} />
      </div> */}
      <div className="pt-10 pb-10">
        <UIDatePicker
          label="조회월"
          type="year-month"
          onMonthSelect={handleMonth}
        />
      </div>
      <div className="pt-10 pb-10">
        <div className="count__control border-none">
          <div className="count">총 <em>{historyData.length}</em> 건</div>
        </div>
        <ul className="list">
          {historyData.map((item: any, index) =>
            <li key={index}>
              <Popover>
                {getDaysBetweenDates(toDay, item.workDate) < -7 ? 
                <UIAlert description="7일 이전의 출/퇴근기록 변경은 불가합니다.">
                  <div className="list__content">
                    <div className="top">
                      <div className="date">{item.workDate}</div>
                      <div className="icon is-arrow__right"></div>
                    </div>
                    <div className="info">
                      <div>
                        <strong>근무시간</strong>
                        <span>{item.workHour}</span>
                      </div>
                      <div>
                        <strong>출근시간</strong>
                        <span>{item.startTime && formatByType("time", item.startTime)}</span>
                      </div>
                      <div>
                        <strong>퇴근시간</strong>
                        <span>{item.endTime && formatByType("time", item.endTime)}</span>
                      </div>
                    </div>
                  </div>
                </UIAlert>
                :
                <PopoverTrigger asChild className="list__content">
                  <div className="list__content">
                    <div className="top">
                      <div className="date">{item.workDate}</div>
                      <div className="icon is-arrow__right"></div>
                    </div>
                    <div className="info">
                      <div>
                        <strong>근무시간</strong>
                        <span>{item.workHour}</span>
                      </div>
                      <div>
                        <strong>출근시간</strong>
                        <span>{item.startTime && formatByType("time", item.startTime)}</span>
                      </div>
                      <div>
                        <strong>퇴근시간</strong>
                        <span>{item.endTime && formatByType("time", item.endTime)}</span>
                      </div>
                    </div>
                  </div>
                </PopoverTrigger>
                }
                <PopoverContent className="d-flex align-items-cneter flex-direction-column custom__popper">
                  <h4 className="p-30">출/퇴근 기록 변경 ({item.workDate})</h4>
                  <div className="custom__popper__in pl-30 pr-30">
                    <UITimePicker
                      label="출/퇴근 시간"
                      type="range"
                      start={item.startTime && formatByType("time", item.startTime)}
                      end={item.endTime && formatByType("time", item.endTime)}
                      onStartTimeChange={(start) => handleSelectChange("wcworktmchngreqList[0].chngStartTime", start ? start.replace(":", "") : item.startTime)}
                      onEndTimeChange={(end) => handleSelectChange("wcworktmchngreqList[0].chngEndTime", end ? end.replace(":", "") :  item.endTime)}
                    />
                  </div>
                  <div className="pt-10 pb-10 pl-30 pr-30">
                    <UIInput
                      label="사유"
                      onChange={(e) => handleSelectChange("wcworktmchngreqList[0].chngRsn", e.target.value)}
                    />
                  </div>

                  <div className="applyAction">
                    <UIAlert
                      description="신청하시겠습니까?"
                      actionProps={{
                        onClick: () => {
                          handleApply();
                        },
                      }}
                    >
                      <UIButton type="primary" onClick={() => handleApplySetting(index)}>결재요청</UIButton>
                    </UIAlert>
                  </div>
                </PopoverContent>
              </Popover>
            </li>
          )}
        </ul>
      </div>
      <UIToast message={openToast.message} type={openToast.type} open={openToast.open} onOpenChange={setOpenToast} />
    </>
  )
}