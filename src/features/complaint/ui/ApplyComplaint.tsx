import { axiosInstance } from "@/app/api/axiosInstance";
import { useBaseCode } from "@/entities/approvalLine";
import { useComplaintField, useComplaintKind } from "@/entities/complaint";
import { formatByType } from "@/shared/lib/formatByType";
import { UIAlert, UIButton, UICheckbox, UIDatePicker, UIIconButton, UIInput, UISelect, UIToast } from "@/shared/ui";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";


export const ApplyComplaint = () => {
  const navigate = useNavigate();
  const [openToast, setOpenToast] = useState({ message: "", type: "", open: false });

  const { data: complaintKindData, isLoading: isComplaintKindLoading, error: complaintKindError } = useComplaintKind();
  if (isComplaintKindLoading) return <p>Loading...</p>;
  if (complaintKindError) return <p>Something went wrong!</p>;
  const complaintKindTarget = complaintKindData.filter((item) => item.useYn === "Y").map((item) => { return {label: item.wfNm, error: false, query: item.wfCode}})

  const [complaintCode, setComplaintCode] = useState<string>("");
  const { data: complaintFieldData, isLoading: isComplaintFieldLoading, error: complaintFieldError } = useComplaintField(complaintCode);
  if (isComplaintFieldLoading) return <p>Loading...</p>;
  if (complaintFieldError) return <p>Something went wrong!</p>;
  
  const complaintFieldIndex = complaintFieldData.findIndex((field) => field.type === "COMBO") + 1;
  const fieldIndex = complaintCode + complaintFieldIndex;
  const parameters = {
    baseCodList: [
      { "patternCode": fieldIndex, "effDateYn": true, "companyYn": true },
    ]
  }

  const { data: baseCodeData, isLoading: isBaseCodeLoading, error: baseCodeError } = useBaseCode(parameters);
	if (isBaseCodeLoading) return <p>Loading...</p>;
	if (baseCodeError) return <p>Something went wrong!</p>;
  const codeData = baseCodeData && baseCodeData.map((code: any) =>
    code.cdbaseList.map((cd: any) => (
      {codeKey : cd.baseCode, codeName: cd.codeNameHan}
    ))
  )
  const complaintCodeData = codeData[0];
  const complaintCodeDataTarget = complaintCodeData?.map((codeItem: any) => { return {label: codeItem.codeName, error: false, query: codeItem.codeKey}})



  const [form, setForm] = useState<Record<string, any>>({}); // 필드를 동적으로 받을 수 있도록 초기 상태 빈 객체
  const [errors, setErrors] = useState<Record<string, boolean>>({}); // 에러 메시지 관리


  useEffect(() => {
    const dynamicForm = complaintFieldData.reduce((acc: Record<string, any>, field: any, index: number) => {
      if (["TEXT", "COMBO", "DATE", "CHECK", "NUMBER"].includes(field.type)) {
        acc[`host${index + 1}Val`] = "";
      }
      return acc;
    }, {});

    setForm(dynamicForm)
    setForm((prev) => ({
      ...prev,
      wfCode: complaintCode,
      seqNo: "9",
      atchFileId: "",
      zipCode: "",
      addr: "",
      addrDtl: "",
      relCode: "",
      resNo: "",
    }))
  }, [complaintCode, complaintFieldData])


  const handleQuerySelect = (cd: string) => {
    setComplaintCode(cd)
  }
  

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

  
  // // 선택값 변경
  // const handleSelectChange = (field: string, value: any) => {
  //   setForm((prevForm: any) => {
  //     const keys = field.split(".");
  //     let updatedForm = { ...prevForm };
  //     let current: any = updatedForm;
  //     keys.forEach((key: any, index) => {
  //       // 배열 처리를 위한 검사
  //       if (Array.isArray(current) && !isNaN(Number(key))) {
  //         key = Number(key); // 인덱스를 숫자로 변환
  //       }
  //       if (index === keys.length - 1) {
  //         current[key] = value; // 값 설정
  //       } else {
  //         current[key] = current[key] ? { ...current[key] } : {};
  //         current = current[key];
  //       }
  //     });
  //     return updatedForm;
  //   });
  // };
  const handleSelectChange = (field: string, value: any) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: false, // 값이 변경되면 에러 해제
    }));
  };





  const handleApply = async () => {
    const formData = new URLSearchParams();
    let hasError = false;
    // 에러를 무시할 필드 목록
    const ignoredEmptyFields = ["atchFileId", "zipCode", "addr", "addrDtl", "relCode", "resNo"];
    Object.entries(form).forEach(([key, value]) => {
      if (!value && !ignoredEmptyFields.includes(key)) {
        hasError = true; // 에러 플래그 설정
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: true, // 에러 상태 업데이트
        }));
      } else {
        formData.append(key, String(value)); // 값이 있을 때만 추가
      }
    });
    // 에러가 있으면 서버 요청을 중단
    if (hasError) {
      return;
    }

    
    try {
      const { data } = await axiosInstance.post('/wlf/welfaremng/welfaremng110/mobile', formData);
      if (data > 0) {
        setOpenToast({message: "결재요청이 완료되었습니다.", open: true, type: "success"});
        setTimeout(() => {
          setOpenToast((prev) => ({ ...prev, open: false }));
          navigate("/complaint/list");
        }, 1000);
      } else {
        setOpenToast({message: "결재요청에 이상이 있습니다.", open: true, type: "danger"});
      }
    } catch (error: any) {
      setOpenToast({message: error.response.data.message, open: true, type: "danger"});
    }
  }


  return (
    <>
      <div className="pt-10 pb-10">
        <UISelect
          label="신청구분"
          items={complaintKindTarget}
          onQuerySelect={handleQuerySelect}
        />
      </div>
      {complaintFieldData.map((item, index) =>
        <div className="pt-10 pb-10" key={index}>
          {item.type === "TEXT" ?
            <UIInput
              label={item.name}
              onChange={(e) => handleSelectChange(`host${index + 1}Val`, e.target.value)}
              error={!!errors[`host${index + 1}Val`]}
              hint={errors[`host${index + 1}Val`] ? "필수값입니다." : ""}
            />
          : item.type === "COMBO" ?
            <UISelect
              label={item.name}
              items={complaintCodeDataTarget}
              onQuerySelect={(data) => handleSelectChange(`host${index + 1}Val`, data)}
              error={!!errors[`host${index + 1}Val`]}
              hint={errors[`host${index + 1}Val`] ? "필수값입니다." : ""}
            />
          : item.type === "DATE" ?
            <UIDatePicker
              label={item.name}
              onDateSelect={(data) => handleSelectChange(`host${index + 1}Val`, formatByType("date", data))}
              error={!!errors[`host${index + 1}Val`]}
              hint={errors[`host${index + 1}Val`] ? "필수값입니다." : ""}
            />
          : item.type === "CHECK" ?
            <UICheckbox
              label={item.name}
            />
          : item.type === "NUMBER" ?
            <UIInput
              label={item.name}
              type="number"
              error={!!errors[`host${index + 1}Val`]}
              hint={errors[`host${index + 1}Val`] ? "필수값입니다." : ""}
            />
          : item.type === "Y" && item.name === "ATTACH_IND" ?
            <>
              <div className="attach__file">
                <input
                  type="file"
                  ref={fileInputRef} // useRef로 파일 입력 요소 참조
                  style={{ display: "none" }} // 화면에 보이지 않게 숨김
                  onChange={handleFileChange}
                  multiple // multiple 속성 추가
                />
                <UIInput
                  label="첨부파일"
                  placeholder="증빙서류첨부"
                  disabled
                />
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
            </>
          : null}
        </div>
      )}

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