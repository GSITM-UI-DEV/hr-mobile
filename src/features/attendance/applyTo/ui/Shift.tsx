import { axiosInstance } from "@/app/api/axiosInstance";
import { useAuthStore, useDateStore } from "@/app/store/authStore";
import { useApprovalForm, useApprovalLine, useApprovalDocument } from "@/entities/approvalLine";
import { useAttendanceShift, useAttendanceShiftType } from "@/entities/attendance";
import { useUser } from "@/entities/user/api/useUser";
import { getDaysBetweenDates } from "@/shared/lib/daysBetweenDates";
import { formatByType } from "@/shared/lib/formatByType";
import { UIAlert, UIButton, UIDatePicker, UIInput, UISelect, UIToast } from "@/shared/ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Shift = () => {
  // 글로벌 필드 설정
  const [fieldDisable, setFieldDisable] = useState(false);


  const navigate = useNavigate();
  const [form, setForm] = useState({
    statusCode: "",
    docNo: "",
    formId: "",
    reqEmplNo: "",
    reqEmplName: "",
    pgmId: "",
    mblPgmId: "",
    docTitlNm: "",
    wcwptchgreqDtoList: [
      {
        docNo: ""
      }
    ],

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
  const selectedForm = approvalFormData?.filter((i) => i.formId === "SWP")[0]
  
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
  const [day, setDay] = useState<string>(toDay);

  // 근무조
  const { data: shiftData, isLoading: isShiftLoading, error: shiftError } = useAttendanceShift({workDate: day, emplNo: userData.loginUserId});
  if (isShiftLoading) return <p>Loading...</p>;
  if (shiftError) return <p>Something went wrong!</p>;
  // console.log(shiftData);
  const shiftTarget = shiftData.map((item) => { return {label: item.shftTypeCode, error: false, query: item.workPt}})

  // 근무조 근무타입
  const { data: shiftTypeData, isLoading: isShiftTypeLoading, error: shiftTypeError } = useAttendanceShiftType({loginUserId: userData.loginUserId});
  if (isShiftTypeLoading) return <p>Loading...</p>;
  if (shiftTypeError) return <p>Something went wrong!</p>;

  
  useEffect(() => {
    if (shiftTypeData.workType === "C") {
      setDisableSave(true)
      setDisableApply(true)
      setFieldDisable(true)
    } 
    // 결재 라인-기안서 세팅
    setForm((prev) => ({
      ...prev,
      statusCode: "",
      docNo: approvalDocumentData,
      formId: selectedForm?.formId,
      reqEmplNo: userData.loginUserId,
      reqEmplName: userData.loginUserNm,
      pgmId: selectedForm?.pgmId,
      mblPgmId: "",
      docTitlNm: `${selectedForm?.formName}-${userData.loginUserNm}`,
      wcwptchgreqDtoList: [
        {
          emplNo: userData.loginUserId,
          reqEmplNo: userData.loginUserId,
          docNo: approvalDocumentData,
          docTitlNm: `${selectedForm?.formName}-${userData.loginUserNm}`,
          befWorkPt: shiftTarget[0]?.query,
          shftTypeCode: shiftTarget[0]?.label,
          // workDate: day,
          pgmId: selectedForm?.pgmId,
          formId: selectedForm?.formId,
          rowKey: "0",
          rowStatus: "C"
        }
      ],

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
  }, [userData, approvalLineData, approvalDocumentData, shiftData, shiftTypeData])

    










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


  // 근태신청(+결과값 Toast 알림)
  const [openToast, setOpenToast] = useState({
    message: "",
    type: "",
    open: false
  });
  const [disableSave, setDisableSave] = useState(false);
  const [disableApply, setDisableApply] = useState(true);
  const handleSave = async () => {
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
      const { data } = await axiosInstance.post('/wrk/dbhshft/wrksh800', formData);
      if (data > 0 || data.docNo) {
        setOpenToast({message: "임시저장이 완료되었습니다.", open: true, type: "success"});
        setTimeout(() => {
          setFieldDisable(true);
          setOpenToast((prev) => ({ ...prev, open: false }));
          setDisableSave(true);
          setDisableApply(false);
          setForm((prevForm) => ({
            ...prevForm,
            statusCode: "3",
          }));
        }, 1000);
      } else {
        setOpenToast({message: "요청에 이상이 있습니다.", open: true, type: "danger"});
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
      const { data } = await axiosInstance.post('/system/aprvlineset', formData);
      if (data === true) {
        setOpenToast({message: "신청이 완료되었습니다.", open: true, type: "success"});
        setTimeout(() => {
          setOpenToast((prev) => ({ ...prev, open: false }));
          setDisableApply(true);
          navigate('/attendance/apply-list');
        }, 1000);
      } else {
        setOpenToast({message: "요청에 이상이 있습니다.", open: true, type: "danger"});
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


  // ??????
  const handleDateSelect = (date: any) => {
    setDay(date);
    setErrorState(false);
    if ( date !== undefined && (Number(toDay.slice(-2)) - Number(date.slice(-2)) > 2) ) {
      setErrorDate(true);
      handleSelectChange("wcwptchgreqDtoList[0].workDate", "")
    }
  }

  const [errorDate, setErrorDate] = useState(false);
  const [errorState, setErrorState] = useState(false);








  return (
    <>
      {shiftTypeData.workType === "C" &&
        <div className="fs-18 text-center text-point-1">재량근무자는 신청이 불가합니다.</div>
      }
      <div className="pt-10 pb-10">
        <UIDatePicker
          label="근무일자"
          onDateSelect={handleDateSelect}
          placeholder={day}
          error={errorDate}
          hint={errorDate ? "근무일 2일 이전 일자의 근무일정 변경은 불가합니다." : ""}
          readOnly={fieldDisable}
        />
      </div>
      <div className="pt-10 pb-10">
        <UISelect
          label="변경전근무일정"
          items={shiftTarget}
          placeholder={
            shiftTarget[0]?.query === "-" ?
            "휴일(Off)"
            : shiftTarget[0]?.query === "D" ?
            "오전(Day)"
            : shiftTarget[0]?.query === "A" ?
            "ALL DAY"
            : shiftTarget[0]?.query === "O" ?
            "NORM"
            : shiftTarget[0]?.query === "S" ?
            "오후(Swing)"
            : shiftTarget[0]?.query === "N" ?
            "야간(Night)"
            : ""
          }
          readOnly
        />
      </div>
      <div className="pt-10 pb-10">
        <UISelect
          label="변경후근무일정"
          error={errorState}
          hint={errorState ? "동일한 근무일정로 변경할 수 없습니다." : ""}
          items={[
            {label: "휴일(Off)", error: false, query: "-"},
            {label: "오전(Day)", error: false, query: "D"},
            {label: "ALL DAY", error: false, query: "A"},
            {label: "NORM", error: false, query: "O"},
            {label: "오후(Swing)", error: false, query: "S"},
            {label: "야간(Night)", error: false, query: "N"},
          ]}
          onQuerySelect={(value: any) => {
            if (shiftTarget[0].query === value) {
              setErrorState(true);
              handleSelectChange("wcwptchgreqDtoList[0].chgWorkPt", "");
            } else {
              setErrorState(false);
              handleSelectChange("wcwptchgreqDtoList[0].chgWorkPt", value);
            }
          }}
          readOnly={fieldDisable}
        />
      </div>
      <div className="d-flex pt-10 pb-10">
        <UIInput label="변경사유" onChange={(e) => handleSelectChange("wcwptchgreqDtoList[0].chgRsn", e.target.value)} readOnly={fieldDisable} />
      </div>

      <div className="applyAction">
        <UIAlert
          description="저장하시겠습니까?"
          actionProps={{
            onClick: () => {
              handleSave();
            },
          }}
        >
          <UIButton type="border" disabled={disableSave}>저장</UIButton>
        </UIAlert>
        <UIAlert
          description="신청하시겠습니까?"
          actionProps={{
            onClick: () => {
              handleApply();
            },
          }}
        >
          <UIButton type="primary" disabled={disableApply}>결재요청</UIButton>
        </UIAlert>
      </div>
      <UIToast message={openToast.message} type={openToast.type} open={openToast.open} onOpenChange={setOpenToast} />
    </>
  )
}