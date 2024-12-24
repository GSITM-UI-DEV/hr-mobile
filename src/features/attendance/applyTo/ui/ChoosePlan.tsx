import { axiosInstance } from "@/app/api/axiosInstance";
import { useAuthStore, useDateStore } from "@/app/store/authStore";
import { useApprovalForm, useApprovalLine } from "@/entities/approvalLine";
import { useApprovalDocument } from "@/entities/approvalLine";
import { useAttendanceChoosePlan } from "@/entities/attendance";
import { useUser } from "@/entities/user";
import { UIAlert, UIButton, UIDatePicker, UIInput, UISelect, UIToast } from "@/shared/ui";
// import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import * as Popover from "@radix-ui/react-popover";
import { useEffect, useRef, useState } from "react";


export const ChoosePlan = () => {
  const [form, setForm] = useState({
    // files: [],
    workDays: "",
    workHour: "",
    planDays: "",
    planHour: "",
    workYymm: "",
    reqEmplNo: "",
    docNo: "",
    seqNo: "",
    statusCode: "",
    docTitlNm: "",
    formId: "",
    pgmId: "",
    mblPgmId: "",
    saveFlag: "",
    bfDocNo: "",
    reqEmplName: "",
    aprvPathOrder: "",
    // 선택근무계획
    wcplanmnthreqdtlDtoList: [],
    // 결재선
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
  const selectedForm = approvalFormData?.filter((i) => i.formId === "WM")[0]
  
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
  const toDay = currentDate.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit' });
  const [month, setMonth] = useState<string>(toDay);

  // // 선택근무 계획 항목
  const { data: choosePlanData, isLoading: isChoosePlanLoading, error: choosePlanError } = useAttendanceChoosePlan({emplNo: userData.loginUserId, workYymm: month.replace("-", "") });
  if (isChoosePlanLoading) return <p>Loading...</p>;
  if (choosePlanError) return <p>Something went wrong!</p>;
  const total = choosePlanData?.workInfo?.map((i) => i.workDays)
  const totalPlan = choosePlanData?.workInfo?.map((i) => i.workHour)

  
  useEffect(() => {
    // 결재 라인-기안서 세팅
    setForm((prev) => ({
      ...prev,
      workDays: "",
      workHour: "",
      planDays: "",
      planHour: "",
      workYymm: "",
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

      wcplanmnthreqdtlDtoList: [],


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

    
  




  const [fileField, setFileField] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  // 버튼 클릭 핸들러
  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 첨부창 열기
    }
  };
  // 파일 선택 핸들러
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setSelectedFiles(files); // 선택된 파일들을 상태로 설정
    const { data } = await axiosInstance.post('/files/upload-atchfile', files,
      { headers: { 'Content-Type' : 'multipart/form-data' } }
    );
    const fileList = Array.from(data).map((file:any, index:any) => ({
      fileSeqNo: (index + 1).toString(),
      fileSn: file.fileSn,
      atchFileId: file.atchFileId,
      fileName: file.orignlFileNm,
      url: ''
    }));

    setForm((prevForm) => ({
      ...prevForm,
      atchFileId: fileList[0].atchFileId,
      shpayreqfileList: fileList
    }));
  };
  const handleFileRemove = (indexToRemove: number) => {
    if (selectedFiles) {
      const updatedFiles = Array.from(selectedFiles).filter((_, index) => index !== indexToRemove);
      const dataTransfer = new DataTransfer();
      updatedFiles.forEach(file => dataTransfer.items.add(file));
      setSelectedFiles(dataTransfer.files);
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
      const { data } = await axiosInstance.post('/wrk/dbhdocappr/apprflex200', formData,
        // { headers: { 'Content-Type' : 'multipart/form-data' } }
      );
      if (data > 0) {
        setOpenToast({message: "결재요청이 완료되었습니다.", open: true, type: "success"});
      } else {
        setOpenToast({message: "결재요청에 이상이 있습니다.", open: true, type: "danger"});
      }
    } catch (error: any) {
      setOpenToast({message: error.response.data.message, open: true, type: "danger"});
    } finally {
      setTimeout(() => {
        setOpenToast((prev) => ({ ...prev, open: false }));
      }, 1000);
    }
  }


  const [detailData, setDetailData] = useState(false);
  const handleFetchDetail = async (params: any) => {
    setOpenToast({message: "", open: false, type: "danger"});
    try {
      const { data } = await axiosInstance.get(`/wrk/dbhdocappr/apprflex200/getwrklst?start=${params.start}&end=${params.end}&emplNo=${userData.loginUserId}`)
      if (data.length > 0) {
        setDetailData(false)
        setOpenToast({message: data[0].msg, open: true, type: "danger"});
      } else {
        setDetailData(true)
      }
    } catch (error: any) {
      // setOpenToast({message: error.response.msg, open: true, type: "danger"});
    }
  }



  return (
    <>
      <div className="pt-10 pb-10">
        <UIDatePicker label="계획월" type="year-month" readOnly placeholder={month} />
      </div>
      <div className="pt-10 pb-10 d-flex gap-10">
        <div className="d-flex">
          <UIInput label="소정(기본)근무일수" readOnly placeholder={total} />
        </div>
        <div className="d-flex">
          <UIInput label="소정(기본)근무시간" readOnly placeholder={totalPlan} />
        </div>
      </div>
      <div className="pt-10 pb-10 d-flex gap-10">
        <div className="d-flex">
          <UIInput label="계획일수" readOnly placeholder={total} />
        </div>
        <div className="d-flex">
          <UIInput label="계획시간" readOnly placeholder={totalPlan} />
        </div>
      </div>

      <div className="pt-10 pb-100">
        <ul className="list">
          {choosePlanData.calList?.map((item: any, i) =>
            <li key={i}>
              <div className="list__content">
                <div className="top"
                  onClick={() => handleFetchDetail({
                    start: item.startTime.split(' ')[0],
                    end: item.endTime.split(' ')[0],
                  })}
                >
                  <div className="date">{item.startTime.split(' ')[0]}</div>
                  <div className="icon is-arrow__right"></div>
                </div>
                <div className="info">
                  <div>
                    <strong>근무</strong>
                    <span>{item.title}</span>
                  </div>
                  <div>
                    <strong>계획 근무시간</strong>
                    <span>{item.startTime.split(' ')[1]} ~ {item.endTime.split(' ')[1]}</span>
                  </div>
                </div>
              </div>
            </li>
          )}
        </ul>
        <Popover.Root open={detailData} onOpenChange={setDetailData}>
          <Popover.Content className="d-flex align-items-cneter flex-direction-column custom__popper">
            <h4 className="p-30">근무시간 입력</h4>
            <div className="custom__popper__in d-flex pl-20 pr-20">
              <div className="d-flex pr-10">
                <UISelect
                  label="시작시간"
                  items={[
                    {label: "06시", error: false, query: "06"},
                    {label: "07시", error: false, query: "07"},
                    {label: "08시", error: false, query: "08"},
                    {label: "09시", error: false, query: "09"},
                    {label: "10시", error: false, query: "10"},
                  ]}
                  onQuerySelect={() => {
                    // handleSelectChange("", "")
                  }}
                />
              </div>
              <div className="d-flex align-items-end">
                <UISelect
                  items={[
                    {label: "00분", error: false, query: "00"},
                    {label: "30분", error: false, query: "30"},
                  ]}
                />
              </div>
            </div>
            <div className="custom__popper__in d-flex pl-20 pr-20">
              <div className="d-flex pr-10">
                <UISelect
                  label="종료시간"
                  items={[
                    {label: "15시", error: false, query: ""},
                    {label: "16시", error: false, query: ""},
                    {label: "17시", error: false, query: ""},
                    {label: "18시", error: false, query: ""},
                    {label: "19시", error: false, query: ""},
                    {label: "20시", error: false, query: ""},
                    {label: "21시", error: false, query: ""},
                    {label: "22시", error: false, query: ""},
                  ]}
                />
              </div>
              <div className="d-flex align-items-end">
                <UISelect
                  items={[
                    {label: "00분", error: false, query: "00"},
                    {label: "30분", error: false, query: "30"},
                  ]}
                />
              </div>
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
                <UIButton type="primary">저장</UIButton>
              </UIAlert>
            </div>
          </Popover.Content>
        </Popover.Root>
      </div>
      <UIToast message={openToast.message} type={openToast.type} open={openToast.open} onOpenChange={setOpenToast} />

    </>
  )
}