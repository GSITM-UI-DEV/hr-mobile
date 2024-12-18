import { axiosInstance } from "@/app/api/axiosInstance";
import { useAuthStore, useDateStore } from "@/app/store/authStore";
import { useApprovalForm, useApprovalLine } from "@/entities/approvalLine";
import { useApprovalDocument } from "@/entities/approvalLine";
import { useAttendanceKind, useAttendanceRemain } from "@/entities/attendance";
import { useUser } from "@/entities/user";
import { getDaysBetweenDates } from "@/shared/lib/daysBetweenDates";
import { formatByType } from "@/shared/lib/formatByType";
import { UIAlert, UIButton, UIDatePicker, UIIconButton, UIInput, UISelect, UITimePicker, UIToast } from "@/shared/ui";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";


export const Attendance = () => {
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
  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Error: {userError.message}</p>;

  const { data: approvalFormData, isLoading: isApprovalFormLoading, error: approvalFormError } = useApprovalForm();
  if (isApprovalFormLoading) return <p>Loading...</p>;
  if (approvalFormError) return <p>Something went wrong!</p>;
  const selectedForm = approvalFormData?.filter((i) => i.formId === "LAP")[0]
  
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

  // 잔여연차
  const { data: attendanceRemain, isLoading: isAttendanceRemainLoading, error: attendanceRemainError } = useAttendanceRemain({
    emplNo: userData.loginUserId,
    emplNameHan: userData.loginUserNm,
    orgNameHan: userData.loginDeptName,
    positionNameHan: userData.loginPstnName,
    titleNameHan: userData.loginTitleName,
    reqEmplNo: userData.loginUserId,
    reqEmplName: userData.loginUserNm,
    entranceDate: userData.loginEntranceDate,

    startDate: day,
    endDate: day,
    cncDay: day,
    startHour: "00",
    startMin: "00",
    endHour: "00",
    endMin: "00",
  })
  if (isAttendanceRemainLoading) return <p>Loading...</p>;
  if (attendanceRemainError) return <p>Something went wrong!</p>;
  // console.log(attendanceRemain);
  
  // 근태종류
  const { data: attendanceKind, isLoading: isAttendanceKindLoading, error: attendanceKindError } = useAttendanceKind();
  if (isAttendanceKindLoading) return <p>Loading...</p>;
  if (attendanceKindError) return <p>Something went wrong!</p>;
  const attendanceTarget = attendanceKind.map((item) => { return {label: item.codeNameHan, error: false, query: item.workCodeKind}})

  const [gubun, setGubun] = useState<string>();
  const [grantField, setGrantField] = useState<boolean>(false);
  const [calcField, setCalcField] = useState<boolean>(false);

  const [optionField, setOptionField] = useState<boolean>(false);
  const [dayField, setDayField] = useState<boolean>(false);
  const [timeField, setTimeField] = useState<boolean>(false);
  const [fileField, setFileField] = useState<boolean>(false);

  const [womanField, setWomanField] = useState<boolean>(false);
  const [familyField, setFamilyField] = useState<boolean>(false);
  const [familyEvent, setFamilyEvent] = useState();
  const [familyEventTarget, setFamilyEventTarget] = useState();
  


  

  const handleSelectKind = async (code: any) => {
    setDateRangeCalcError(false)
    setDateCalcError(false)
    setTimeCalcError(false)
    // 필드 초기화
    setForm((prev) => ({
      ...prev,
      holidays: "",
      startDate: "",
      endDate: "",
      wrkGubun: "",
      startHour: "",
      startMin: "",
      endHour: "",
      endMin: "",
      hours: "",
      fullDay: "",
      workCodeKind: "",
      cncCode: "",
      lveCnt: "",
      startTime: "",
      endTime: "",
      chkStartTime: "",
      chkEndTime: "",
    }))

    // 결재라인 변경
    if (code === "LB5" || code === "LB1") {
      const { data } = await axiosInstance.get(`/system/aprvlineset/default?formId=${selectedForm?.formId}&emplNo=${userData.loginUserId}&stopCode=${code}`)
      setForm((prev) => ({
        ...prev,
        aprvPathOrder: data.map((item: any) => item.emplNameHan).join("^"),
        aprvdetailDtoList: data.map((item: any, index: any) => ({
          docNo: approvalDocumentData,
          aprvSeqNo: index + 1,
          aprvType: item.aprvType,
          aprvEmplNo: item.emplNo,
          transInd: "",
          tarnsEmplNo: "",
          statusCode: item.aprvDepth,
        }))
      }))
    }



    


















    if (code === "LB5" || code === "LB1" || code === "LMR" || code === "LB3" || code === "LB") {
      setCalcField(false)
      setGrantField(false)
      setDayField(false)
      setOptionField(false)

      setWomanField(true)
      setFileField(true)
    } else if (code === "LI") {
      setCalcField(false)
      setGrantField(false)
      setDayField(false)
      setOptionField(false)

      setFamilyField(true)
      setFileField(true)
      try {
        const { data } = await axiosInstance.get(`/wrk/dbhabsappr/apprattd100/cncCode`);
        const famEvent = data.map((famItem: any) => { return {label: famItem.cncCodeNameHan, error: false, query: famItem.cncCode}})
        setFamilyEvent(famEvent);
      } catch (error) {
        console.log(error)
      }
    } else {
      setCalcField(false)
      setWomanField(false)
      setFamilyField(false)
      try {
        const { data } = await axiosInstance.get(`/wrk/dbhabsappr/apprattd100/showoptions?workCodeKind=${code}`);
        if (data.length === 0 || code ==="LC") {
          setGrantField(true); // 부여시간 필드
          setGubun(""); // 부여시간은 시작일자로 표기
          
          const grantData = await axiosInstance.get(`/wrk/dbhabsappr/apprattd100/wrkLveCnt?emplNo=${userData.loginUserId}&startDate=${day}&endDate=${day}&workCodeKind=${code}`);
          setForm((prev) => ({
            ...prev,
            holidays: grantData.data
          })) // 부여날짜 호출
          
  
          setDayField(true)
          setOptionField(false)
          setTimeField(false)
          setFileField(false)
          setCalcField(false)
        } else {
          setGrantField(false)
          // console.log(data);
          data.forEach((field: any) => {
            if (field === 'timeInd') {
              setOptionField(true)
              setDayField(false)
              setTimeField(false)
              setFileField(false)
              setCalcField(true)
            }
  
            if (field === 'atchInd') {
              setOptionField(false)
              setDayField(false)
              setTimeField(false)
              setFileField(true)
            }
  
            if (field === 'rsnInd') {
              setOptionField(false)
              setDayField(false)
              setTimeField(false)
              setFileField(false)
            }
  
            if (field === 'rsnInd' && field === 'atchInd') {
              setDayField(true)
              setFileField(true)
            }
          })
        }
      } catch (error) {
        console.log(error)
        // resetAllField();
      }
    }
  }

  const resetAllField = () => {
    setOptionField(false)
    setDayField(false)
    setTimeField(false)
    setFileField(false)
    setGrantField(false)
    setCalcField(false)
  }

  const [form, setForm] = useState({
    statusCode: "1",
    startDate: "",
    endDate: "",
    workCodeKind: "",
    wrkGubun: "",
    fullDay: "",
    startHour: "",
    startMin: "",
    endHour: "",
    endMin: "",
    hours: "",
    startTime: "",
    endTime: "",
    days: 0,
    chkStartTime: "",
    chkEndTime: "",
    workPt: "",
    workTime: "",
    shftPt: "",
    holIncYn: "",
    holidays: "",
    cncCode: "",
    relCode: "",
    lveCnt: "",
    maternityCode: "",
    periodCode: "",
    periodDays: "",
    reqRsn: "",
    atchFileId: "",
    mblPgmId: "",
    saveFlag: "",
    bfDocNo: "",
    rangeDays: "",
    checkEndDate: "",
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


  useEffect(() => {
    // 결재 라인-기안서 세팅
    setForm((prev) => ({
      ...prev,
      files: [],
      filePath: "SYSTEM,PGMG",
      startHour: "00",
      startMin: "00",
      endHour: "00",
      endMin: "00",

      cncDay: day,
      docTitlNm: `${selectedForm?.formName}-${userData.loginUserNm}`,
      formId: selectedForm?.formId,
      pgmId: selectedForm?.pgmId,
      reqEmplNo: userData.loginUserId,
      reqEmplName: userData.loginUserNm,
      entranceDate: userData.loginEntranceDate,
      emplNo: userData.loginUserId,
      emplNameHan: userData.loginUserNm,
      orgNameHan: userData.loginDeptName,
      positionNameHan: userData.loginPstnName,
      titleNameHan: userData.loginTitleName,
      lyLveDays: attendanceRemain.lyLveDays,
      lyUseDays: attendanceRemain.lyUseDays,
      rmnLve: attendanceRemain.rmnLve,
      docNo: approvalDocumentData,
      aprvPathOrder: approvalLineData.map(item => item.emplNameHan).join("^"),
      aprvdetailDtoList: approvalLineData.map((item, index) => ({
        docNo: approvalDocumentData,
        // aprvSeqNo: index + 1,
        aprvSeqNo: index + 1,
        aprvType: item.aprvType,
        aprvEmplNo: item.emplNo,
        transInd: "",
        tarnsEmplNo: "",
        statusCode: item.aprvDepth,
      }))
    }));
  }, [userData, approvalLineData, approvalDocumentData, attendanceRemain])


  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: ""
  });
  const handleDateRangeChange = async (range: any) => {
    setDateRange(range);
    // 휴가 구분(전일 일 때 계산) - wrkGubun: 01
    const { data: calcDayTimeRange } = await axiosInstance.get(`/wrk/dbhabsappr/apprattd100/findCalc?emplNo=${userData.loginUserId}&startDate=${range.fromDate}&endDate=${range.toDate}&wrkGubun=01`);
    const { data: checkWorkTypeRange } = await axiosInstance.get(`/wrk/dbhabsappr/apprattd100/chkTimeInd?emplNo=${userData.loginUserId}&startDate=${range.fromDate}`);
    const cDay = getDaysBetweenDates(range.fromDate, range.toDate) - calcDayTimeRange.holidayList;

    setForm((prev) => ({
      ...prev,
      chkStartTime: checkWorkTypeRange[0].startTime,
      chkEndTime: checkWorkTypeRange[0].endTime,
      startTime: checkWorkTypeRange[0].startTime,
      endTime: checkWorkTypeRange[0].endTime,
      hours: checkWorkTypeRange[0].workTime,
      // 기간 선택시 근무조 설정
      workPt: checkWorkTypeRange[0].workPt,
      workTime: checkWorkTypeRange[0].workTime,
      shftPt: checkWorkTypeRange[0].shftPt,
      fullDay: `${calcDayTimeRange.sumHourList}시간 / ${cDay}일 `,
      days: cDay,
    }))



    if (form.holidays !== "" && (cDay > Number(form.holidays))) {
      alert("부여된 일수를 초과할 수 없습니다.")
      setForm((prev) => ({
        ...prev,
        startDate: "",
        endDate: "",
        chkStartTime: "",
        chkEndTime: "",
        startTime: "",
        endTime: "",
        hours: "",
        shftPt: "",
        fullDay: "",
        days: cDay
      }))
    }
  };


  const handleDateSelect = async (selected: any) => {
    // 휴가 구분(시간 일 때 계산) - wrkGubun: TM
    const { data: calcDayTime } = await axiosInstance.get(`/wrk/dbhabsappr/apprattd100/findCalc?emplNo=${userData.loginUserId}&startDate=${selected}&endDate=${selected}&wrkGubun=TM`);
    // 해당일자에 근무조(스케쥴)
    const { data: checkWorkType } = await axiosInstance.get(`/wrk/dbhabsappr/apprattd100/chkTimeInd?emplNo=${userData.loginUserId}&startDate=${selected}`);

    if (calcDayTime.holidayList === 1) {
      alert("휴무가 존재합니다.")
      setForm((prev) => ({
        ...prev,
        hours: "",
        fullDay: "",
        workPt: "",
        workTime: "",
        shftPt: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
      }))
    } else {
      setForm((prev) => ({
        ...prev,
        hours: checkWorkType[0].workTime,
        fullDay: `${checkWorkType[0].workTime}시간 / 1일 `,
        workPt: checkWorkType[0].workPt,
        workTime: checkWorkType[0].workTime,
        shftPt: checkWorkType[0].shftPt,
        nextDayInd: checkWorkType[0].nextDayInd,
        coCode: checkWorkType[0].nextDayInd,
        endDate: checkWorkType[0].nextDayInd,
        chkStartTime: checkWorkType[0].startTime,
        chkEndTime: checkWorkType[0].endTime,
        emplNo: checkWorkType[0].emplNo,
        wcDate: checkWorkType[0].wcDate,
      }))
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  // 버튼 클릭 핸들러
  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 첨부창 열기
    }
  };
  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(files); // 상태 업데이트
      setForm((prevForm) => ({
        ...prevForm,
        files: Array.from(files)
      }));
    }
  };

  const handleFileRemove = (indexToRemove: number) => {
    if (selectedFiles) {
      const updatedFilesArray = Array.from(selectedFiles).filter((_, index) => index !== indexToRemove);
      const dataTransfer = new DataTransfer();
      updatedFilesArray.forEach((file) => dataTransfer.items.add(file));
      const updatedFiles = dataTransfer.files;
      setSelectedFiles(updatedFiles);
      setForm((prevForm) => ({
        ...prevForm,
        files: Array.from(updatedFiles),
      }));
    }
  };

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



  const [fileState, setErrorFileState] = useState(false);
  const [dateCalcError, setDateCalcError] = useState(false);
  const [dateRangeCalcError, setDateRangeCalcError] = useState(false);
  const [timeCalcError, setTimeCalcError] = useState(false);


  // 글로벌 필드 설정
  const [fieldDisable, setFieldDisable] = useState(false);

  const handleSave = async () => {
    const formData = new FormData();
    const appendFormData = (data: any, parentKey = '') => {
      if (typeof data === 'object' && !Array.isArray(data) && !(data instanceof File)) {
        // 객체 처리
        Object.entries(data).forEach(([key, value]) => {
          appendFormData(value, parentKey ? `${parentKey}.${key}` : key);
        });
      } else if (Array.isArray(data)) {
        // 배열 처리
        data.forEach((item, index) => {
          appendFormData(item, `${parentKey}[${index}]`);
        });
      } else {
        // 기본 데이터 또는 File 처리
        formData.append(parentKey, data);
      }
    };
    appendFormData(form);
    let startDateValue;
    let endDateValue;
    let startTimeValue;
    let endTimeValue;
    let chkStartTimeValue;
    let chkEndTimeValue;
    for (const [key, value] of formData.entries()) {
      if (key === 'startDate') {
        startDateValue = value; // 값 체크
      }
      if (key === 'endDate') {
        endDateValue = value; // 값 체크
      }
      if (key === 'startTime') {
        startTimeValue = value; // 값 체크
      }
      if (key === 'endTime') {
        endTimeValue = value; // 값 체크
      }
      if (key === 'chkStartTime') {
        chkStartTimeValue = value; // 값 체크
      }
      if (key === 'chkEndTime') {
        chkEndTimeValue = value; // 값 체크
      }
      if (startDateValue && endDateValue && startTimeValue && endTimeValue && chkStartTimeValue && chkEndTimeValue) break; // 다 확인되면 루프 종료
    }
    // 상태 업데이트
    const twoDayAgo = getDaysBetweenDates(toDay, startDateValue)
    if (twoDayAgo < -1) {
      alert("근무일 기준으로 2일 이전의 근태는 신청할 수 없습니다.")
    } else if (Number(chkStartTimeValue) > Number(startTimeValue) || Number(chkEndTimeValue) < Number(endTimeValue)) {
      alert(`근태신청은 근무스케줄 내에서 등록 가능합니다.\n${chkStartTimeValue} ~ ${chkEndTimeValue}`)
    } else {
      try {
        const headers = fileField ? { "Content-Type": "multipart/form-data" } : {};
        const {data } = await axiosInstance.post('/wrk/dbhabsappr/apprattd100', formData, { headers });
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


  console.log();



  
  return (
    <>
      <div className="pt-10 pb-10 d-flex">
        <div className="d-flex">
          <UIInput label="발생연차" value={attendanceRemain.lyLveDays} readOnly />
        </div>
        <div className="d-flex pl-20">
          <UIInput label="사용연차" value={attendanceRemain.lyUseDays} readOnly />
        </div>
      </div>
      <div className="pt-10 pb-10">
        <UIInput label="잔여연차" value={attendanceRemain.rmnLve} readOnly />
      </div>


      {grantField &&
        <div className="pt-10 pb-10">
          <UIInput label="부여휴가일수" readOnly value={form.holidays} />
        </div>
      }

      {gubun === "01" && !grantField  && !familyField?
        <div className="pt-10 pb-10">
          <UIInput label="총합시간" readOnly value={form.fullDay} />
        </div>
      : null}

      {gubun === "TM" && form.workCodeKind !== "" ?
        <div className="pt-10 pb-10">
          <UIInput label="합계시간" readOnly value={form.hours < "0" ? "0" : form.hours} />
        </div>
      : null}


      {/* ************* 고정 ************* */}
      <div className="pt-10 pb-10">
        <UISelect
          label="근태종류"
          items={attendanceTarget}
          onQuerySelect={(value: any) => {
            // setForm((prev) => ({
            //   ...prev,
            //   workCodeKind: "",
            //   cncCode: "",
            //   lveCnt: "",
            //   wrkGubun: "",
            //   startDate: "",
            //   endDate: "",
            //   startTime: "",
            //   endTime: "",
            //   fullDay: "",
            // }))
            handleSelectKind(value)
            handleSelectChange("workCodeKind", value)
            handleSelectChange("wrkGubun", "")
          }}
          readOnly={fieldDisable}
        />
      </div>


      {womanField &&
        <>
          <div className="pt-10 pb-10">
            <UIInput label="발생일수" value={form.lveCnt} readOnly />
          </div>
          <div className="pt-10 pb-10">
            <UISelect
              label="임신기간"
              items={[
                {label: "11주 이내", error: false, query: "01"},
                {label: "12주 ~ 15주", error: false, query: "02"},
                {label: "16주 ~ 21주", error: false, query: "03"},
                {label: "22주 ~ 27주", error: false, query: "04"},
                {label: "28주 이상", error: false, query: "05"},
              ]}
              onQuerySelect={(value) => handleSelectChange("periodCode", value)}
              readOnly={fieldDisable}
            />
          </div>
          <div className="pt-10 pb-10">
            <UISelect
              label="태아"
              items={[
                {label: "단태아", error: false, query: "01"},
                {label: "다태아", error: false, query: "02"}
              ]}
              onQuerySelect={(value) => handleSelectChange("maternityCode", value)}
              readOnly={fieldDisable}
            />
          </div>
        </>
      }
      {familyField &&
        <>
          <div className="pt-10 pb-10">
            <UIInput label="발생일수" value={form.lveCnt} readOnly />
          </div>
          <div className="pt-10 pb-10">
            <UISelect
              label="경조사유"
              items={familyEvent}
              onQuerySelect={ async(query) => {
                try {
                  const { data } = await axiosInstance.get(`/wrk/dbhabsappr/apprattd100/relCode?cncCode=${query}`)
                  const famEventTarget = data.map((relItem: any) => { return {label: relItem.relCodeNameHan, error: false, query: relItem.relCode}})
                  setFamilyEventTarget(famEventTarget)
                  handleSelectChange("cncCode", query)
                } catch (error) {
                  console.log(error)
                }
              }}
              readOnly={fieldDisable}
            />
          </div>
          <div className="pt-10 pb-10">
            <UISelect
              label="관계"
              items={familyEventTarget}
              onQuerySelect={ async(query) => {
                try {
                  const { data } = await axiosInstance.get(`/wrk/dbhabsappr/apprattd100/accruedYear?cncCode=${form.cncCode}&relCode=${query}`)
                  handleSelectChange("lveCnt", data)
                  handleSelectChange("relCode", query)
                } catch (error) {
                  console.log(error)
                }
              }}
              readOnly={fieldDisable}
            />
          </div>
          <div className="pt-10 pb-10">
            <UIDatePicker
              label="발생일자"
              onDateSelect={(value) => {
                handleSelectChange("startDate", value)
                handleSelectChange("endDate", value)
              }}
              readOnly={fieldDisable}
            />
          </div>
        </>
      }
      {optionField &&
        <div className="pt-10 pb-10">
          <UISelect
            label="구분"
            items={[
              {label: "전일", error: false, query: "01"},
              {label: "시간", error: false, query: "TM"},
            ]}
            onQuerySelect={(value) => {
              handleSelectChange("wrkGubun", value);
              setGubun(value);
              setDayField(true);
              if (value === "TM") setTimeField(true);
              if (value === "01") setTimeField(false);
            }}
            readOnly={fieldDisable}
          />
        </div>
      }
      {dayField &&
        <div className="pt-10 pb-10">
          <UIDatePicker
            type={gubun === "TM" ? "date" : "range"}
            label={gubun === "TM" ? "일자" : "기간"}
            onDateRangeChange={(value) => {
              handleDateRangeChange(value);
              handleSelectChange("startDate", formatByType("date", value.fromDate));
              handleSelectChange("endDate", formatByType("date", value.toDate));
            }}
            onDateSelect={(value) => {
              handleSelectChange("startDate", formatByType("date", value));
              handleSelectChange("endDate", formatByType("date", value));
              handleDateSelect(value);
            }}
            error={dateRangeCalcError}
            hint={dateRangeCalcError ? "기간을 확인해주세요" : ""}
            readOnly={fieldDisable}
          />
        </div>
      }


      {timeField &&
        <>
          <div className="pt-10 pb-10 d-flex gap-10">
            <div className="d-flex">
              <UISelect
                label="시작시간"
                items={hourValue}
                readOnly={fieldDisable}
                onQuerySelect={(hour) => {
                  handleSelectChange("startHour", hour)
                  handleSelectChange("startTime", hour + form.startMin)
                  // handleSelectChange("hours", Number(form.endHour) - Number(hour))
                  let exceptLunch;
                  if ((form.shftPt === "A" || form.shftPt === "C") && (form.startHour <= "12" && form.endHour >= "13")) {
                    exceptLunch = Number(form.endHour) - Number(hour) - 1; // 점심시간빼기
                  } else {
                    exceptLunch = Number(form.endHour) - Number(hour);
                  }
                  handleSelectChange("hours", exceptLunch)
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
                readOnly={fieldDisable}
                onQuerySelect={(hour) => {
                  handleSelectChange("endHour", hour)
                  handleSelectChange("endTime", hour + form.endMin)
                  let exceptLunch;
                  if ((form.shftPt === "A" || form.shftPt === "C") && (form.startHour <= "12" && form.endHour >= "13")) {
                    exceptLunch = Number(hour) - Number(form.startHour) - 1; // 점심시간빼기
                  } else {
                    exceptLunch = Number(hour) - Number(form.startHour);
                  }
                  handleSelectChange("hours", exceptLunch)
                }}
              />
            </div>
            <div className="d-flex align-items-end">
              <UISelect
                placeholder={`${form.endMin}분`}
                items={[
                  {label: "00분", error: false, query: "00"},
                  {label: "30분", error: false, query: "30"},
                ]}
                readOnly
              />
            </div>
          </div>
        </>
      }

      {fileField &&
        <>
          <div className="pt-10 pb-180">
            <div className="attach__file">
              <input
                type="file"
                ref={fileInputRef} // useRef로 파일 입력 요소 참조
                style={{ display: "none" }} // 화면에 보이지 않게 숨김
                onChange={handleFileChange}
                multiple // multiple 속성 추가
              />
              <UIInput label="첨부파일" placeholder="증빙서류첨부" disabled />
              <UIIconButton onClick={handleFileClick} className="is-file has-pressed-action" />
            </div>
            {selectedFiles && (
              <ul className="attach__file__list">
                {Array.from(selectedFiles).map((file, index) => (
                  <li key={index}>
                    <UIInput value={file.name} readOnly />
                    <div className="icon is-delete mt-10 ml-10 mr-10" onClick={() => handleFileRemove(index)}></div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      }


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