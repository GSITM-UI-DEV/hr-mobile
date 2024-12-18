import { axiosInstance } from "@/app/api/axiosInstance";
import { useAuthStore, useDateStore } from "@/app/store/authStore";
import { useApprovalForm, useApprovalLine, useApprovalDocument } from "@/entities/approvalLine";
import { useAttendanceOverTime } from "@/entities/attendance";
import { useUser } from "@/entities/user";
import { UIAlert, UIButton, UIDatePicker, UIInput, UISelect, UITimePicker, UIToast } from "@/shared/ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export const OverTime = () => {
  // 글로벌 필드 설정
  const [fieldDisable, setFieldDisable] = useState(false);

  const hourValue = [
    {label: "00시", error: false, query: "00"},
    {label: "01시", error: false, query: "01"},
    {label: "02시", error: false, query: "02"},
    {label: "03시", error: false, query: "03"},
    {label: "04시", error: false, query: "04"},
    {label: "05시", error: false, query: "05"},
    {label: "06시", error: false, query: "06"},
    {label: "07시", error: false, query: "07"},
    {label: "08시", error: false, query: "08"},
    {label: "09시", error: false, query: "09"},
    {label: "10시", error: false, query: "10"},
    {label: "11시", error: false, query: "11"},
    {label: "12시", error: false, query: "12"},
    {label: "13시", error: false, query: "13"},
    {label: "14시", error: false, query: "14"},
    {label: "15시", error: false, query: "15"},
    {label: "16시", error: false, query: "16"},
    {label: "17시", error: false, query: "17"},
    {label: "18시", error: false, query: "18"},
    {label: "19시", error: false, query: "19"},
    {label: "20시", error: false, query: "20"},
    {label: "21시", error: false, query: "21"},
    {label: "22시", error: false, query: "22"},
    {label: "23시", error: false, query: "23"},
  ]
  

  const navigate = useNavigate();
  // 조회일(today)
  const {currentDate, setCurrentDate} = useDateStore();
  const toDay = currentDate.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const [day, setDay] = useState<string>(toDay);

  const [form, setForm] = useState({
    filePath: "SYSTEM,PGMG",
    emplNo: "",
    emplNameHan: "",
    orgNameHan: "",
    positionNameHan: "",
    titleNameHan: "",
    otCode: "",
    workDate: day,
    nextDayInd: "",
    endDate: "",
    startHour: "",
    startMin: "",
    endHour: "",
    endMin: "",
    otTime: "",
    reqRsnCode: "",
    befDayInd: "",
    otRsn: "",
    atchFileId: "",
    reqEmplNo: "",
    reqEmplName: "",
    reqDate: "",
    docNo: "",
    statusCode: "",
    docTitlNm: "",
    formId: "",
    pgmId: "",
    mblPgmId: "",
    saveFlag: "",
    bfDocNo: "",
    workCode: "",
    workPt: "",
    realWorkPt: "",
    befDay: "",
    startTime: "",
    endTime: "",
    shftPt: "",
    jobGroupCode: "",
    otKind: "",
    aprvPathOrder: "",
    aprvdetailDtoList: [
      {
        docNo: "",
        aprvType: "",
        aprvEmplNo: "",
        transInd: "",
        tarnsEmplNo: "",
        aprvSeqNo: 0,
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
  const selectedForm = approvalFormData?.filter((i) => i.formId === "OW")[0]
  
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

  

  // 초과근무 관련 세팅값
  const { data: overTimeData, isLoading: isOverTimeLoading, error: overTimeError } = useAttendanceOverTime({
    emplNo: userData.loginUserId,
    workDate: form.workDate
  });
  if (isOverTimeLoading) return <p>Loading...</p>;
  if (overTimeError) return <p>Something went wrong!</p>;
  // console.log(overTimeData)



  useEffect(() => {
    // 결재 라인-기안서 세팅
    setForm((prev) => ({
      ...prev,
      files: [],
      filePath: "SYSTEM,PGMG",
      emplNo: userData.loginUserId,
      emplNameHan: userData.loginUserNm,
      orgNameHan: userData.loginDeptName,
      positionNameHan: userData.loginPstnName,
      titleNameHan: userData.loginTitleName,
      // otKind: "",
      // otCode: "D1",
      // workDate: overTimeData[0],
      // startHour: "19",
      // startMin: "00",
      // endHour: "22",
      // endMin: "00",
      otTime: "3",
      // reqRsnCode: "1",
      // befDayInd: "",
      // otRsn: "",
      // atchFileId: "",
      // reqDate: "",
      // mblPgmId: "",
      // saveFlag: "",
      // bfDocNo: "",
      // befDay: "20241128",
      // startTime: "1900",
      // endTime: "2200",
      nextDayInd: overTimeData[0]?.nextDayInd,
      endDate: overTimeData[0]?.endDate,
      workCode: overTimeData[0]?.workCode,
      realWorkPt: overTimeData[0]?.realWorkPt,
      shftPt: overTimeData[0]?.shftPt,
      jobGroupCode: overTimeData[0]?.jobGroupCode,
      workPt: overTimeData[0]?.workPt,
      reqEmplNo: userData.loginUserId,
      reqEmplName: userData.loginUserNm,
      docNo: approvalDocumentData,
      statusCode: "1",
      docTitlNm: `${selectedForm?.formName}-${userData.loginUserNm}`,
      formId: selectedForm?.formId,
      pgmId: selectedForm?.pgmId,
      
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
  }, [userData, approvalLineData, approvalDocumentData, overTimeData])


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



  // 초과근무 신청(+결과값 Toast 알림)
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
      const { data } = await axiosInstance.post('/uhr/docappr/approvtm200', formData);
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






  return (
    <>
      <div className="pt-10 pb-10">
        <UIDatePicker
          label="근무일"
          onDateSelect={(value) => handleSelectChange("workDate", value)}
          placeholder={day}
          readOnly={fieldDisable}
        />
      </div>
      <div className="pt-10 pb-10">
        <UISelect
          label="근무구분"
          placeholder={form.realWorkPt === "O" ? "연장근무" : form.realWorkPt === "-" ? "휴일근무" : "근무"}
          readOnly
        />
      </div>
      <div className="pt-10 pb-10 d-flex gap-10">
        <div className="d-flex">
          <UISelect
            label="시작시간"
            items={hourValue}
            readOnly={fieldDisable}
            onQuerySelect={(hour) => {
              handleSelectChange("startHour", hour)
              handleSelectChange("startTime", hour + form.startMin)
            }}
          />
        </div>
        <div className="d-flex align-items-end">
          <UISelect
            items={[
              {label: "00분", error: false, query: "00"},
              {label: "30분", error: false, query: "30"},
            ]}
            onQuerySelect={(minute) => {
              handleSelectChange("startMin", minute)
              handleSelectChange("endMin", minute)
              handleSelectChange("startTime", form.startHour + minute)
            }}
            readOnly={fieldDisable}
          />
        </div>
      </div>
      <div className="pt-10 pb-10 d-flex gap-10">
        <div className="d-flex">
          <UISelect
            label="종료시간"
            items={hourValue}
            onQuerySelect={(hour) => {
              handleSelectChange("endHour", hour)
              handleSelectChange("endTime", hour + form.endMin)
            }}
            readOnly={fieldDisable}
          />
        </div>
        <div className="d-flex align-items-end">
          <UISelect
            placeholder={form.endMin ? `${form.endMin}분` : '00분'}
            onQuerySelect={(hour) => {
              handleSelectChange("endHour", hour)
              handleSelectChange("endTime", hour + form.endMin)
            }}
            readOnly
          />
        </div>
      </div>
      <div className="pt-10 pb-10">
        <UIInput label="초과시간" readOnly value={(Number(form.endHour) - Number(form.startHour)) > 0 ? (Number(form.endHour) - Number(form.startHour)) : 0} />
      </div>
      <div className="pt-10 pb-10">
        <UISelect
          label="신청사유"
          items={[
            {label: "장비에러 대응", error: false, query: 1},
            {label: "결원인원 업무대응", error: false, query: 2},
            {label: "긴급고객대응", error: false, query: 3},
            {label: "긴급개발과제", error: false, query: 4},
            {label: "긴급업무대응", error: false, query: 5},
            {label: "주말당직근무", error: false, query: 6},
            {label: "기타", error: false, query: 7}
          ]}
          onQuerySelect={(value: any) => {
            handleSelectChange("reqRsnCode", value);
          }}
          readOnly={fieldDisable}
        />
      </div>
      <div className="pt-10 pb-10">
        <UIInput label="상세사유" onChange={(e) => handleSelectChange("otRsn", e.target.value) } readOnly={fieldDisable} />
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