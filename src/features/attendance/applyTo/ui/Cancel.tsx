import './Cancel.scss';
import { useApprovalForm, useApprovalLine, useBaseCode, useWorkCode } from "@/entities/approvalLine";
import { useAttendanceCancel } from "@/entities/attendance";
import { UIAlert, UIButton, UICheckbox, UIDatePicker, UIInput, UIToast } from "@/shared/ui";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { axiosInstance } from "@/app/api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/entities/user";
import { useApprovalDocument } from "@/entities/approvalLine";


export const Cancel = () => {
  // useMutation 훅 사용
  // const mutation = useApprovalRequest();

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
    wcwrkreqCnclDtoList: [],
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
  const selectedForm = approvalFormData?.filter((i) => i.formId === "LAC")[0]
  
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
  const { data: cancelData, isLoading: isCancelLoading, error: cancelError, refetch: refetchAttendanceCancel } = useAttendanceCancel({fromDate: dateRange.fromDate, toDate: dateRange.toDate}, auth?.username);
  if (isCancelLoading) return <p>Loading...</p>;
  if (cancelError) return <p>Something went wrong!</p>;


  // 취소 항목 선택
  const handleCancelUpdate = (item: any, isChecked: boolean) => {
    setForm((prev: any) => {
      // 기존 리스트에서 항목 추가 또는 제거
      const updatedList = isChecked
        ? [
            ...prev.wcwrkreqCnclDtoList,
            {
              reqEmplNo: item.emplNo,
              reqEmplName: auth?.username,
              docNo: approvalDocumentData,
              befDocNo: item.befDocNo,
              emplNo: item.emplNo,
              days: item.days,
              startDate: item.startDate,
              startEndDate: item.startEndDate,
              workCodeKind: item.workCodeKind,
              wrkGubun: item.wrkGubun,
              statusCode: "3",
              rowStatus: "C",
            },
          ]
        : prev.wcwrkreqCnclDtoList.filter(
            (cancelItem: any) => cancelItem.befDocNo !== item.befDocNo
          );
  
      // rowKey를 인덱스로 설정
      return {
        ...prev,
        wcwrkreqCnclDtoList: updatedList.map((entry: any, index: any) => ({
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
      const { data } = await axiosInstance.post('/wrk/dbhabsappr/apprattc100', formData);
      if (data > 0) {
        setForm((prevForm) => ({
          ...prevForm,
          statusCode: "3",
        }));
        try {
          const res = await axiosInstance.post('/system/aprvlineset', formData);
          if (res.status === 200 && res.data) {
            setOpenToast({message: "결재요청이 완료되었습니다.", open: true, type: "success"});
            setTimeout(async () => {
              setOpenToast((prev) => ({ ...prev, open: false }));
              await refetchAttendanceCancel();
              navigate('/attendance/apply-list');
            }, 1000);
          }
        } catch (error: any) {
          setOpenToast({message: error.response.data.message, open: true, type: "danger"});
          setTimeout(() => {
            setOpenToast((prev) => ({ ...prev, open: false }));
          }, 1000);
        }
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
          <div className="count">총 <em>{cancelData.length}</em> 건</div>
          {/* <div className="order">오름차순</div> */}
        </div>
        <ul className="cancel__list">
          {dateRange.fromDate === '' && cancelData.length === 0 ? 
            <li className="fs-15 text-center">조회기간을 선택해주세요.</li>
          : cancelData.length === 0 ?
            <li className="fs-15 text-center">데이터가 없습니다.</li>
          :
            cancelData.map((item: any, index) =>
            <li key={index}>
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
                    <strong>신청기간</strong>
                    <span>{item.startEndDate}</span>
                  </div>
                  <div className="info">
                    <strong>시작/종료시간</strong>
                    <span>{item.days}</span>
                  </div>
                  <div className="reason d-none">
                    <strong>취소사유</strong>
                    <UIInput />
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