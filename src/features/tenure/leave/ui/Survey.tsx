import { axiosInstance } from "@/app/api/axiosInstance";
import { useTenureLeaveSurvey } from "@/entities/tenure";
import { useUser } from "@/entities/user";
import { UIAlert, UIButton, UICheckbox, UISelect, UITextarea, UIToast } from "@/shared/ui";
import { useState } from "react";


export const Survey = () => {
  const [form, setForm] = useState({
    emprt140Pop01List: [
      {
        retireReqDate: "",
        surveyNo: "",
        emplNo: "",
        ans1: "",
        ans2: "",
        ans3: "",
      }
    ]
  });
  const [errors, setErrors] = useState({
    emprt140Pop01List: []
  });
  const [openToast, setOpenToast] = useState({ message: "", type: "", open: false });


  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Error: {userError.message}</p>;

  
  const { data: tenureLeaveSurveyData, isLoading: isTenureLeaveSurveyLoading, error: tenureLeaveSurveyError } = useTenureLeaveSurvey({
    emplNo: userData.loginUserId,
    retireReqDate: "20241127",
    rtflowId: "A01",
  });
	if (isTenureLeaveSurveyLoading) return <p>Loading...</p>;
	if (tenureLeaveSurveyError) return <p>Error: {tenureLeaveSurveyError.message}</p>;
  console.log(tenureLeaveSurveyData);



  const validateForm = () => {
    const newErrors = {
      emprt140Pop01List: [],
    };
    // setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleApply = async () => {
    if (!validateForm()) {
      // setOpenToast({ message: "필수 값을 입력해주세요.", type: "danger", open: true });
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
        const response = await axiosInstance.post("/one/picertprt/onepicertprt110", formData);
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
        <h3 className="fs-15 mt-15 mb-5">1. 귀하가 퇴사를 고민하게 된 주된 원인은 무엇인가요?(복수응답 가능)</h3>
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
        <h3 className="fs-15 mt-15 mb-5">2. 퇴직 후 계획하고 있는 진로는 무엇인가요?</h3>
        <UISelect
          label=""
          items={[
            {label: "동종업계 이직", error: false, query: "1"},
            {label: "이종업계 이직", error: false, query: "2"},
            {label: "사업", error: false, query: "3"},
            {label: "가사", error: false, query: "4"},
            {label: "이민", error: false, query: "5"},
            {label: "진학", error: false, query: "6"},
            {label: "요양", error: false, query: "7"},
            {label: "그룹사전출", error: false, query: "8"},
            {label: "기타(직접입력)", error: false, query: "9"},
          ]}
        />
      </div>
      <div className="pt-10 pb-10">
        <h3 className="fs-15 mt-15 mb-5">3. "이런 부분이 개선되었다면, 퇴사하지 않았을 것이다."에 대한 의견을 자유롭게 작성해주시기 바랍니다.</h3>
        <UITextarea
        />
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