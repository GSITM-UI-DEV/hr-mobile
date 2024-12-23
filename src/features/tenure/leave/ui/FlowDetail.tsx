import { axiosInstance } from "@/app/api/axiosInstance";
import { useTenureLeaveDetail } from "@/entities/tenure";
import { formatByType } from "@/shared/lib/formatByType";
import { UIAlert, UIButton, UICheckbox, UIDatePicker, UIIconButton, UIInput, UISelect, UIText, UIToast } from "@/shared/ui";
import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";

export const FlowDetail = () => {
  const [openToast, setOpenToast] = useState({ message: "", type: "", open: false });
  const [form, setForm] = useState<Record<string, any>>({}); // 필드를 동적으로 받을 수 있도록 초기 상태 빈 객체
  const [errors, setErrors] = useState<Record<string, boolean>>({}); // 에러 메시지 관리

  const qs: string = useOutletContext();
  const params = new URLSearchParams(qs);
  const { data: tenureLeaveDetailData, isLoading: isTenureLeaveDetailLoading, error: tenureLeaveDetailError } = useTenureLeaveDetail(qs);
	if (isTenureLeaveDetailLoading) return <p>Loading...</p>;
	if (tenureLeaveDetailError) return <p>Error: {tenureLeaveDetailError.message}</p>;
  
  useEffect(() => {
    const dynamicForm = tenureLeaveDetailData.reduce((acc: Record<string, any>, field: any, index: number) => {
      if (["TEXT", "COMBO", "DATE", "CHECK", "NUMBER"].includes(field.type)) {
        acc[`host${index + 1}Val`] = "";
      }
      return acc;
    }, {});

    setForm(dynamicForm)
    setForm((prev) => ({
      ...prev,
      atchFileId: "",
      emplNo: params.get("emplNo"),
      rtflowId: params.get("rtflowId"),
      retireReqDate: params.get("lastWorkDate"),
    }))
  }, [params])


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
    const ignoredEmptyFields = ["atchFileId", "host1Val"];
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
    
    console.log(formData)
    try {
      const response = await axiosInstance.post("/emp/dbhemprt/emprt140", formData);
      if (response.status === 200 && response.data) {
        setOpenToast({ message: "결재요청이 완료되었습니다.", type: "success", open: true });
      } else {
        setOpenToast({ message: "결재요청에 실패하였습니다.", type: "danger", open: true });
      }
    } catch (error: any) {
      setOpenToast({ message: error.response?.data?.message || "오류가 발생하였습니다.", type: "danger", open: true });
    }
  };



  return (
    <>
      {tenureLeaveDetailData.map((item, index) =>
        <div className="pt-10 pb-10" key={index}>
          {item.name === "HOST_NOTE" ?
            <div className="fs-16 text-point-1">{item.type}</div>
          : item.type === "INFO" ?
            <UIInput
              label={item.name}
              placeholder={item.info}
              readOnly
            />
          : item.type === "TEXT" ?
            <UIInput
              label={item.name}
              onChange={(e) => handleSelectChange(`host${index + 1}Val`, e.target.value)}
              error={!!errors[`host${index + 1}Val`]}
              hint={errors[`host${index + 1}Val`] ? "필수값입니다." : ""}
            />
          : item.type === "COMBO" ?
            <UISelect
              label={item.name}
              items={[
                {label: "여", error: false, query: "A1911"},
                {label: "부", error: false, query: "A1912"}
              ]}
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
              // onChecked={() => handleSelectChange(`host${index + 1}Val`, "Y")}
              onChange={(e) => {
                const checked = e.target.checked; // 체크 여부 가져오기
                handleSelectChange(`host${index + 1}Val`, checked ? "Y" : "N");
              }}
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