import { axiosInstance } from "@/app/api/axiosInstance";
import { useUser } from "@/entities/user/api/useUser";
import { useInsurance } from "@/entities/welfare/api/useWelfare";
import { UIAlert, UIButton, UIInput, UISelect, UIToast } from "@/shared/ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export const Insurance = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    baseYear: "",
    reqDate: "",
    emplNo: "",
    emplNameHan: "",
    insGrpSeqBef: 0,
    insGrpSeq: 0,
  });

  
  // 사용자 기본정보
  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Error: {userError.message}</p>;

  // 보험 종류
  const { data: insuranceData, isLoading: isInsuranceLoading, error: insuranceError } = useInsurance();
  if (isInsuranceLoading) return <p>Loading...</p>;
  if (insuranceError) return <p>Something went wrong!</p>;
  const insTarget = insuranceData.map((item) => { return {label: item.insName, error: false, query: {qs1: item.baseYear, qs2: item.insGrpSeq} } })

  const getToday = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return `${year}${month}${date}`;
  }

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      baseYear: "",
      reqDate: getToday().replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3'),
      emplNo: userData?userData.loginUserId:'',
      emplNameHan: userData?userData.loginUserNm:'',
      insGrpSeqBef: 0,
      insGrpSeq: 0,
    }));
  }, [userData])

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


  // 보험 신청(+결과값 Toast 알림)
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
      const { data } = await axiosInstance.post('/wlf/wlfinsurance/wlfinsurance100/save', formData);
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
        navigate('/welfare')
      }, 1000);
    }
  }

  return (
    <>
      <div className="pt-10 pb-10">
        <UISelect label="보험유형"
          items={insTarget}
          onQuerySelect={(value: any) => {
            handleInputChange("baseYear", value.qs1);
            handleInputChange("insGrpSeq", value.qs2);
          }} />
      </div>
      <div className="pt-10 pb-10">
        <UIInput label="비고" onChange={(e) => handleInputChange("", e.target.value) } />
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