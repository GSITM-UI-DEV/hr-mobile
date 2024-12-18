import { axiosInstance } from "@/app/api/axiosInstance";
import { useStudentLoan } from "@/entities/welfare/api/useWelfare";
import { UIAlert, UIButton, UIDatePicker, UIIconButton, UIInput, UISelect, UIToast } from "@/shared/ui";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";


export const StudentLoan = () => {
  const navigate = useNavigate();
  
  const { data, isLoading, error } = useStudentLoan();
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;
  const studentTarget = data.map((item) => { return {label: item.familyNameHan, error: false, query: {qs1: item.resNoFamily, qs2: item.relCode}} })
  

  const getToday = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return `${year}${month}${date}`;
  }


  const [form, setForm] = useState({
    reqSeqNo: '1', // 모바일은 저장 단계없이 바로 신청
    reqDate: getToday(),
    payDate: '',
    resNoFamily: '',
    atchFileId: '',
    shpayreq: {
      schoolCodeInd: '',
      schoolKindCode: '',
      semesterCode: '',
      schoolNameHan: '',
      relCode: '',
      reqAmt: 0,
      payAmt: 0,
      schYear: '',
      reqCnt: '',
    },
    shpayreqfileList: [
      {
        fileSeqNo: '',
        fileName: '',
        fileSn: '',
        url: '',
        atchFileId: ''
      }
    ]
  });

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


  // 입력값 변경
  const handleInputChange = (field: string, value: any) => {
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





  // 신청하기 & 초기화하기
  const [openToast2, setOpenToast2] = useState<boolean>(false);
  const [openToast3, setOpenToast3] = useState<boolean>(false);
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
    const { data } = await axiosInstance.post('/wlf/wlfstuapply/wlfstuapply111/req', formData)
    if (data === 1) {
      setOpenToast2(true);
      setTimeout(() => {
        navigate('/welfare')
      }, 1000)
    } else {
      setOpenToast3(true);
    }
  }

  const handleReset = () => {
    handleSelectChange("resNoFamily", "");
    handleSelectChange("shpayreq.relCode", "");
    handleSelectChange("shpayreq.schoolKindCode", "");
    handleInputChange("shpayreq.reqAmt", 0);
    handleSelectChange("shpayreq.schoolCodeInd", "");
    handleInputChange("shpayreq.schoolNameHan", "");
    handleInputChange("shpayreq.schYear", "");
    handleSelectChange("shpayreq.semesterCode", "");
    handleInputChange("shpayreq.reqAmt", 0);
    handleSelectChange("payDate", "")
    setSelectedFiles(null);
  }

  
  return (
    <>
      <div className="pt-10 pb-10">
        <UISelect
          label="대상자(자녀)"
          items={studentTarget}
          onQuerySelect={(value: any) => {
            handleSelectChange("resNoFamily", value.qs1);
            handleSelectChange("shpayreq.relCode", value.qs2);
          }}
        />
      </div>
      <div className="pt-10 pb-10">
        <UISelect label="학자금구분" items={[
            {label: "입학축하금", error: false, query: "EN"},
            {label: "학자금", error: false, query: "ED"}
          ]}
          onQuerySelect={(value) => {
            handleSelectChange("shpayreq.schoolKindCode", value);
            handleInputChange("shpayreq.reqAmt", 300000)
            handleInputChange("shpayreq.payAmt", 300000)
          }}
        />
      </div>
      <div className="pt-10 pb-10">
        <UISelect label="학교구분" items={
          form.shpayreq.schoolKindCode === 'EN' ?
            [
              {label: "유치원", error: false, query: "CS"},
              {label: "초등학교", error: false, query: "ES"},
              {label: "중학교", error: false, query: "MS"},
              {label: "고등학교", error: false, query: "HS"}
            ]
          :
            [
              {label: "고등학교", error: false, query: "HS"},
              {label: "대학교", error: false, query: "US"},
            ]
        } onQuerySelect={(value) => handleSelectChange("shpayreq.schoolCodeInd", value)} />
      </div>
      {form.shpayreq.schoolKindCode === 'ED' &&
        <>
          <div className="pt-10 pb-10">
            <UIInput label="학교명" onChange={(e) => handleInputChange("shpayreq.schoolNameHan", e.target.value) } />
          </div>
          <div className="pt-10 pb-10 d-flex gap-8">
            <div className="d-flex">
              <UIInput label="학년" type="number" onChange={(e) => handleInputChange("shpayreq.schYear", e.target.value) } />
            </div>
            <div className="d-flex">
              <UISelect label="학기(분기)" items={[
                  {label: "1", error: false, query: "1"},
                  {label: "2", error: false, query: "2"},
                  {label: "3", error: false, query: "3"},
                  {label: "4", error: false, query: "4"},
                ]}
                onQuerySelect={(value) => handleSelectChange("shpayreq.semesterCode", value)}
              />
            </div>
          </div>
        </>
      }
      <div className="pt-10 pb-10">
        <UIInput label="신청금액" type="number"
          readOnly={form.shpayreq.schoolKindCode === 'EN'}
          value={form.shpayreq.schoolKindCode === 'EN' ? 300000 : ''}
          onChange={(e) => handleInputChange("shpayreq.reqAmt", e.target.value) }
        />
      </div>
      <div className="pt-10 pb-10">
        <UIDatePicker
          label="납부일"
          type="date"
          readOnly={form.shpayreq.schoolKindCode === 'EN'}
          onDateSelect={(value) => handleSelectChange("payDate", value)}
        />
      </div>


      <div className="pt-10 pb-10">
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
      <UIToast message="신청이 완료되었습니다." type="success" open={openToast2} onOpenChange={setOpenToast2} />
      <UIToast message="결재요청에 이상이 있습니다." type="danger" open={openToast3} onOpenChange={setOpenToast3} />
    </>
  )
}