import { axiosInstance } from "@/app/api/axiosInstance";
import { useAuthStore, useDateStore } from "@/app/store/authStore";
import { useApprovalLine, useApprovalDocument, useApprovalForm } from "@/entities/approvalLine";
import { useAttendanceSwitch } from "@/entities/attendance";
import { useUser } from "@/entities/user/api/useUser";
import { UIAlert, UIButton, UIDatePicker, UIIconButton, UIInput, UISelect, UIToast } from "@/shared/ui";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";


export const Switch = () => {
  // 글로벌 필드 설정
  const [fieldDisable, setFieldDisable] = useState(false);


  const navigate = useNavigate();
  const [form, setForm] = useState({
    // files: [],
    filePath: "",
    emplNo: "",
    emplNameHan: "",
    orgNameHan: "",
    gradeNameHan: "",
    stopCode: "",
    stopDateFrom: "",
    stopDateTo: "",
    stopDays: "",
    stopRsn: "",
    remark: "",
    atchFileId: "",
    fileItemCheck0: "",
    reqEmplNo: "",
    docNo: "",
    seqNo: "",
    statusCode: "0",
    docTitlNm: "",
    formId: "",
    pgmId: "",
    mblPgmId: "",
    saveFlag: "",
    bfDocNo: "",
    reqEmplName: "",
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
  const selectedForm = approvalFormData?.filter((i) => i.formId === "ST")[0]
  
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

  // 휴/복직 항목
  const { data: switchData, isLoading: isSwitchLoading, error: switchError } = useAttendanceSwitch({baseDate:day, workCode:"S"});
  if (isSwitchLoading) return <p>Loading...</p>;
  if (switchError) return <p>Something went wrong!</p>;
  const switchTarget = switchData.map((item) => { return {label: item.codeNameHan, error: false, query: item.workCodeKind}})

  useEffect(() => {
    // 결재 라인-기안서 세팅
    setForm((prev) => ({
      ...prev,
      files: [],
      filePath: "SYSTEM,PGMG",
      emplNo: userData.loginUserId,
      emplNameHan: userData.loginUserNm,
      orgNameHan: userData.loginDeptName,
      gradeNameHan: userData.loginTitleName,
      stopCode: "",
      stopDateFrom: "",
      stopDateTo: "",
      stopDays: "",
      stopRsn: "",
      remark: "",
      atchFileId: "",
      fileItemCheck0: "",
      reqEmplNo: userData.loginUserId,
      docNo: approvalDocumentData,
      seqNo: "",
      statusCode: "1",
      docTitlNm: `${selectedForm?.formName}-${userData.loginUserNm}`,
      formId: selectedForm?.formId,
      pgmId: selectedForm?.pgmId,
      mblPgmId: "",
      saveFlag: "",
      bfDocNo: "",
      reqEmplName: userData.loginUserNm,
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
  }, [userData, approvalLineData, approvalDocumentData])

    
  



  const [fileField, setFileField] = useState<boolean>(false);
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
      setErrorFileState(false);
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


  // 휴/복직 신청(+결과값 Toast 알림)
  const [openToast, setOpenToast] = useState({
    message: "",
    type: "",
    open: false
  });

  
  const [fileState, setErrorFileState] = useState(false);
  const [stopReason, setErrorStopReason] = useState(false);

  const [disableSave, setDisableSave] = useState(false);
  const [disableApply, setDisableApply] = useState(true);



  
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
    // // FormData 확인 (디버깅용)
    // for (const [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);  
    //   if (`${key}` !== 'files[0]') {
    //     setErrorFileState(true)
    //   }
    //   if (`${key}` === 'stopRsn') {
    //     setErrorStopReason(true)
    //   }
    // }
    let stopRsnValue = false;
    let filesValue = false;
    for (const [key, value] of formData.entries()) {
      if (key === 'stopRsn') stopRsnValue = !!value; // stopRsn 값 체크
      if (key.startsWith('files')) filesValue = !!value; // files 값 체크
      if (stopRsnValue && filesValue) break; // 둘 다 확인되면 루프 종료
    }
    // 상태 업데이트
    setErrorStopReason(!stopRsnValue); // stopRsn 값이 없으면 true
    setErrorFileState(!filesValue);    // files 값이 없으면 true


    
    try {
      const response = await axiosInstance.post('/wrk/dbhabsappr/apprstopemp100', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // 바이너리 데이터 전송에 적합
        },
      });
  
      if (response.status === 200 && response.data) {
        setOpenToast({ message: "임시저장이 완료되었습니다.", open: true, type: "success" });
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
        setOpenToast({ message: "요청에 이상이 있습니다.", open: true, type: "danger" });
        setTimeout(() => {
          setOpenToast((prev) => ({ ...prev, open: false }));
        }, 1000);
      }
    } catch (error: any) {
      setOpenToast({ message: error.response.data.message, open: true, type: "danger" });
      setTimeout(() => {
        setOpenToast((prev) => ({ ...prev, open: false }));
      }, 1000);
    }
  };


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
  



  const calculateDateDifference = (fromDate: string, toDate: string) => {
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    return differenceInDays + 1;
  }



  const handleSelectKind = async (code: any) => {
    // 필드 초기화
    setForm((prev) => ({
      ...prev,
      stopCode: "",
      stopDateFrom: "",
      stopDateTo: "",
      stopDays: "",
      stopRsn: "",
    }))


    // 결재라인 변경
    if (code === "S4" || code === "S1") {
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

  };










  


  return (
    <>
      <div className="pt-10 pb-10">
        <UISelect
          label="휴/복직구분"
          items={switchTarget}
          onQuerySelect={(value: any) => {
            handleSelectChange("stopCode", value);
            handleSelectKind(value);
          }}
          readOnly={fieldDisable}
        />
      </div>
      <div className="pt-10 pb-10">
        <UIDatePicker
          label="휴직기간"
          type="range"
          onDateRangeChange={(stop) => {
            handleSelectChange("stopDateFrom", stop.fromDate);
            handleSelectChange("stopDateTo", stop.toDate);
            handleSelectChange("stopDays", calculateDateDifference(stop.fromDate, stop.toDate));
          }}
          readOnly={fieldDisable}
        />
      </div>
      <div className="d-flex pt-10 pb-10">
        <UIInput label="일수" placeholder={form.stopDays} readOnly />
      </div>
      <div className="d-flex pt-10 pb-10">
        <UIInput
          label="상세사유"
          onChange={(e) => { handleSelectChange("stopRsn", e.target.value); setErrorStopReason(false) }}
          error={stopReason}
          hint={stopReason ? "필수값입니다." : ""}
          readOnly={fieldDisable}
        />
      </div>

      

      {!fileField &&
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
              <UIInput label="첨부파일" placeholder="증빙서류첨부" disabled error={fileState} hint={fileState ? "필수값입니다." : ""} />
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