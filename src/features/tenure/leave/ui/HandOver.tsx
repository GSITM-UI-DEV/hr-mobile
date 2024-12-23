import { axiosInstance } from "@/app/api/axiosInstance";
import { useApprovalDocument, useApprovalForm, useApprovalLine } from "@/entities/approvalLine";
import { useUser } from "@/entities/user";
import { UIAlert, UIButton, UIInput, UITextarea, UIToast } from "@/shared/ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export const HandOver = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    transferReason: "",
    transferNote1: "",
    transferNote2: "",
    transferNote3: "",
    transferNote4: "",
    recvEmplNo: "00000115",
    recvEmplNameHan: "장순욱",
    statusCode: "1",
  });

  const [errors, setErrors] = useState({
    transferReason: false,
    transferNote1: false,
    transferNote2: false,
    transferNote3: false,
    transferNote4: false,
  });
  const [openToast, setOpenToast] = useState({ message: "", type: "", open: false });

  const [fieldDisable, setFieldDisable] = useState(false);
  const [disableSave, setDisableSave] = useState(false);
  const [disableApply, setDisableApply] = useState(true);


  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Error: {userError.message}</p>;

  const { data: approvalFormData, isLoading: isApprovalFormLoading, error: approvalFormError } = useApprovalForm();
  if (isApprovalFormLoading) return <p>Loading...</p>;
  if (approvalFormError) return <p>Something went wrong!</p>;
  const selectedForm = approvalFormData?.filter((i) => i.formId === "TS")[0] // 인수인계서(코드)
  
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
















  const validateForm = () => {
    const newErrors = {
      transferReason: !form.transferReason,
      transferNote1: !form.transferNote1,
      transferNote2: !form.transferNote2,
      transferNote3: !form.transferNote3,
      transferNote4: !form.transferNote4,
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };


  const handleSave = async () => {
    if (!validateForm()) {
      return;
    } else {
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
        const response = await axiosInstance.post("/emp/dbhemprt/emprt170", formData);
        if (response.status === 200 && response.data) {
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
          setOpenToast({ message: "결재요청에 실패하였습니다.", type: "danger", open: true });
        }
      } catch (error: any) {
        setOpenToast({ message: error.response?.data?.message || "오류가 발생하였습니다.", type: "danger", open: true });
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
          navigate("/tenure/leave-flow");
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

  const handleSelectChange = (field: string, value: any) => {
    setForm((prevForm) => ({ ...prevForm, [field]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: false })); // Clear error on change
  };
  

  return (
    <>
      <div className="pt-10 pb-10">
        <UIInput
          label="인계사유"
          onChange={(e) => handleSelectChange("transferReason", e.target.value)}
          error={errors.transferReason}
          hint={errors.transferReason ? "필수값입니다." : ""}
          readOnly={fieldDisable}
        />
      </div>
      <div className="pt-10 pb-10">
        <UITextarea
          label="인수인계 업무사항"
          onChange={(e) => handleSelectChange("transferNote1", e.target.value)}
          error={errors.transferNote1}
          hint={errors.transferNote1 ? "필수값입니다." : ""}
          readOnly={fieldDisable}
        />
      </div>
      <div className="pt-10 pb-10">
        <UITextarea
          label="진행 및 미결사항"
          onChange={(e) => handleSelectChange("transferNote2", e.target.value)}
          error={errors.transferNote2}
          hint={errors.transferNote2 ? "필수값입니다." : ""}
          readOnly={fieldDisable}
        />
      </div>
      <div className="pt-10 pb-10">
        <UIInput
          label="서류 및 비품"
          onChange={(e) => handleSelectChange("transferNote3", e.target.value)}
          error={errors.transferNote3}
          hint={errors.transferNote3 ? "필수값입니다." : ""}
          readOnly={fieldDisable}
        />
      </div>
      <div className="pt-10 pb-10">
        <UIInput
          label="예산 및 자금"
          onChange={(e) => handleSelectChange("transferNote4", e.target.value)}
          error={errors.transferNote4}
          hint={errors.transferNote4 ? "필수값입니다." : ""}
          readOnly={fieldDisable}
        />
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