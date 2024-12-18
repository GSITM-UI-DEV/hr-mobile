import './Cancel.scss';
import { useAttendanceOverTimeCancel } from "@/entities/attendance";
import { UIAlert, UIButton, UICheckbox, UIDatePicker, UIToast } from "@/shared/ui";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/entities/user";
import { useApprovalLine, useApprovalDocument, useApprovalForm, useWorkCode } from "@/entities/approvalLine";
import { axiosInstance } from '@/app/api/axiosInstance';


export const OverTimeCancel = () => {
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
    wcotmcnclreqList: [],
    aprvdetailDtoList: [
      {
        docNo: "",
        aprvSeqNo: 0,
        aprvType: "",
        aprvEmplNo: "",
        transInd: "",
        tarnsEmplNo: "",
        statusCode: 0,
      },
    ],
  });
  
  const [dateRange, setDateRange] = useState({
    fromDate: '',
    toDate: ''
  });
  const handleDateRangeChange = (range: any) => {
    setDateRange(range);
  };

  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Error: {userError.message}</p>;

  const { data: approvalFormData, isLoading: isApprovalFormLoading, error: approvalFormError } = useApprovalForm();
  if (isApprovalFormLoading) return <p>Loading...</p>;
  if (approvalFormError) return <p>Something went wrong!</p>;
  const selectedForm = approvalFormData?.filter((i) => i.formId === "OTC")[0]
  
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

  useEffect(() => {
    // 결재 라인-기안서 세팅
    setForm((prev) => ({
      ...prev,
      statusCode: "3",
      docNo: approvalDocumentData,
      docTitlNm: `${selectedForm?.formName}-${userData.loginUserNm}`,
      formId: selectedForm?.formId,
      pgmId: selectedForm?.pgmId,
      reqEmplNo: userData.loginUserId,
      reqEmplName: userData.loginUserNm,
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


  // 취소 항목 조회
  const { data: overTimeCancelData, isLoading: isOverTimeCancelLoading, error: overTimeCancelError, refetch: refetchOverTimeCancel } = useAttendanceOverTimeCancel({fromDate: dateRange.fromDate, toDate: dateRange.toDate});
  if (isOverTimeCancelLoading) return <p>Loading...</p>;
  if (overTimeCancelError) return <p>Something went wrong!</p>;


  // 취소 항목 선택
  const handleCancelUpdate = (item: any, isChecked: boolean) => {
    setForm((prev: any) => {
      // 기존 리스트에서 항목 추가 또는 제거
      const updatedList = isChecked
        ? [
            ...prev.wcotmcnclreqList,
            {
              otCode: item.otCode,
              otCodeName: item.otCodeName,
              workDate: item.workDate,
              endDate: item.endDate,
              startTime: item.startTime,
              endTime: item.endTime,
              nextDayInd: item.nextDayInd,
              befDayInd: item.befDayInd,

              reqEmplNo: userData.loginUserId,
              reqEmplName: userData.loginUserNm,
              docNo: item.docNo,
              docTitlNm: item,
              emplNo: item.emplNo,
              emplNameHan: item.emplNameHan,
              orgNameHan: item.orgNameHan,
              positionNameHan: item.positionNameHan,
              statusCode: "3",
              rowStatus: "C"
            },
          ]
        : prev.wcotmcnclreqList.filter(
            (cancelItem: any) => cancelItem.befDocNo !== item.befDocNo
          );
  
      // rowKey를 인덱스로 설정
      return {
        ...prev,
        wcotmcnclreqList: updatedList.map((entry: any, index: any) => ({
          ...entry,
          rowKey: index.toString(), // PC 테이블 row key 인덱스값
        })),
      };
    });
  };

  // 취소 신청(+결과값 Toast 알림)
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
      const { data } = await axiosInstance.post('/uhr/docappr/apprcnclovtm100', formData);
      if (data > 0) {
        setOpenToast({message: "결재요청이 완료되었습니다.", open: true, type: "success"});
        setTimeout(async () => {
          setOpenToast((prev) => ({ ...prev, open: false }));
          await refetchOverTimeCancel();
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

  

  const { data: workCodeData, isLoading: isWorkCodeLoading, error: workCodeError } = useWorkCode();
	if (isWorkCodeLoading) return <p>Loading...</p>;
	if (workCodeError) return <p>Something went wrong!</p>;
  const findMatchingCode = (data: any, value: any) => {
    const matchingCode = data?.find((code: any) => code.workCodeKind === value); 
    return matchingCode ? matchingCode.codeNameHan : null;
  };

  return (
    <>
      <div className="d-flex pt-10 pb-10">
        <UIDatePicker type="range" label="조회일" onDateRangeChange={handleDateRangeChange} />
      </div>
      <div className="pt-10 pb-10">
        <div className="count__control">
          <div className="count">총 <em>{overTimeCancelData.length}</em> 건</div>
          {/* <div className="order">오름차순</div> */}
        </div>
        <ul className="cancel__list">


          {dateRange.fromDate === '' && overTimeCancelData.length === 0 ? 
            <li className="fs-15 text-center">조회기간을 선택해주세요.</li>
          : overTimeCancelData.length === 0 ?
            <li className="fs-15 text-center">데이터가 없습니다.</li>
          :
            overTimeCancelData.map((item: any) =>
            <li key={item.docNo}>
              <div className="cancel">
                <div className="cancel__check">
                  <UICheckbox
                    label={findMatchingCode(workCodeData, item.workCodeKind)}
                    value={item.workCodeKind + '__' + item.befDocNo}
                    onChecked={(isChecked) => handleCancelUpdate(item, isChecked)}
                  />
                </div>
                <div className="cancel__info">
                  <div className="info">
                    <strong>구분</strong>
                    <span>{item.otCodeName}</span>
                  </div>
                  <div className="info">
                    <strong>출근일자</strong>
                    <span>{item.workDate}</span>
                  </div>
                  <div className="info">
                    <strong>시작/종료시간</strong>
                    <span>{item.startTime} ~ {item.endTime}</span>
                  </div>
                  <div className="info">
                    <strong>사유</strong>
                    <span>{item.otRsn}</span>
                  </div>

                </div>
              </div>
            </li>
          )}
        </ul>
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
          <UIButton type="primary">결재요청</UIButton>
        </UIAlert>
      </div>
      <UIToast message={openToast.message} type={openToast.type} open={openToast.open} onOpenChange={setOpenToast} />
    </>
  )
}