import { axiosInstance } from "@/app/api/axiosInstance";
import { useApprovalDocument, useApprovalForm, useApprovalLine } from "@/entities/approvalLine";
import { useUser } from "@/entities/user";
import { UIAlert, UIButton, UICheckbox, UIDatePicker, UIIconButton, UIInput, UISelect, UITextarea, UIToast } from "@/shared/ui"
import { useRef, useState } from "react";

export const Resignation = () => {
  const [form, setForm] = useState({
    rowStatus: "",
    emplNo: "",
    emplNameHan: "",
    orgCode: "",
    orgNameHan: "",
    positionTitleName: "",
    certiCodeKind: "",
    certiCodeType: "",
  });
  const [errors, setErrors] = useState({
    certiCodeKind: false,
  });
  const [openToast, setOpenToast] = useState({ message: "", type: "", open: false });


  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Error: {userError.message}</p>;

  const { data: approvalFormData, isLoading: isApprovalFormLoading, error: approvalFormError } = useApprovalForm();
  if (isApprovalFormLoading) return <p>Loading...</p>;
  if (approvalFormError) return <p>Something went wrong!</p>;
  const selectedForm = approvalFormData?.filter((i) => i.formId === "RT")[0] // 퇴사사직원 코드
  
  const { data: approvalLineData, isLoading: isApprovalLineLoading, error: approvalLineError } = useApprovalLine({
    formId: selectedForm?.formId,
    emplNo: userData.loginUserId,
  });
  if (isApprovalLineLoading) return <p>Loading...</p>;
  if (approvalLineError) return <p>Something went wrong!</p>;

  const { data: approvalDocumentData, isLoading: isApprovalDocumentLoading, error: approvalDocumentError } = useApprovalDocument(userData.loginUserId);
  if (isApprovalDocumentLoading) return <p>Loading...</p>;
  if (approvalDocumentError) return <p>Something went wrong!</p>;




  const validateForm = () => {
    const newErrors = {
      certiCodeKind: !form.certiCodeKind, // 공통 필수값 검증
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleApply = async () => {
    if (!validateForm()) {
      // setOpenToast({ message: "필수 값을 입력해주세요.", type: "danger", open: true });
      return;
    } else {
      const formData = new URLSearchParams();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      try {
        const response = await axiosInstance.post("/emp/dbhemprt/emprt150/docno", formData);
        if (response.status === 200 && response.data) {
          setOpenToast({ message: "결재요청이 완료되었습니다.", type: "success", open: true });
        } else {
          setOpenToast({ message: "결재요청에 실패하였습니다.", type: "danger", open: true });
        }
      } catch (error: any) {
        setOpenToast({ message: error.response?.data?.message || "오류가 발생하였습니다.", type: "danger", open: true });
      }
    }
  };

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
  
  return (
    <>
      <div className="pt-10 pb-10">
        <UIInput
          label="담당업무"
        />
      </div>
      <div className="pt-10 pb-10">
        <div className="checkbox__list">
          <UICheckbox
            label="처우"
            value="chk1"
            onChecked={(chk) => handleSelectChange("", chk ? "Y" : "")}
          />
          <UICheckbox
            label="직무/조직"
            value="chk2"
            onChecked={(chk) => handleSelectChange("", chk ? "Y" : "")}
          />
          <UICheckbox
            label="인간관계"
            value="chk3"
            onChecked={(chk) => handleSelectChange("", chk ? "Y" : "")}
          />
          <UICheckbox
            label="자기계발"
            value="chk4"
            onChecked={(chk) => handleSelectChange("", chk ? "Y" : "")}
          />
          <UICheckbox
            label="개인사정"
            value="chk5"
            onChecked={(chk) => handleSelectChange("", chk ? "Y" : "")}
          />
          <UICheckbox
            label="계약종료"
            value="chk6"
            onChecked={(chk) => handleSelectChange("", chk ? "Y" : "")}
          />
          <UICheckbox
            label="승진누락"
            value="chk7"
            onChecked={(chk) => handleSelectChange("", chk ? "Y" : "")}
          />
          <UICheckbox
            label="기타"
            value="chk8"
            onChecked={(chk) => handleSelectChange("", chk ? "Y" : "")}
          />
        </div>
      </div>
      <div className="pt-10 pb-10">
        <UITextarea label="상세사유" />
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