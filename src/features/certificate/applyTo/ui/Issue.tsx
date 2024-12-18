import { axiosInstance } from "@/app/api/axiosInstance";
import { useDateStore } from "@/app/store/authStore";
import { useUser } from "@/entities/user/api/useUser";
import { UIAlert, UIButton, UICheckbox, UIDatePicker, UIInput, UISelect, UIToast } from "@/shared/ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Issue = () => {
  const navigate = useNavigate();
  const { currentDate, setCurrentDate } = useDateStore();
  const toDay = currentDate.toLocaleDateString("sv-SE", { year: "numeric", month: "2-digit", day: "2-digit" });
  const [day, setDay] = useState<string>(toDay);

  const [form, setForm] = useState({
    rowStatus: "",
    emplNo: "",
    emplNameHan: "",
    orgCode: "",
    orgNameHan: "",
    positionTitleName: "",
    certiCodeKind: "",
    certiCodeType: "",
    issueUse: "",
    issueDate: "",
    reqDate: "",
    issueInd: "",
    positionEng: "",
    addressEng: "",
    jobEng: "",
    maskingInd: "N",
    issueYear: "",
    payDateFrom: "",
    payDateTo: "",

  });

  const [errors, setErrors] = useState({
    certiCodeKind: false,
    certiCodeType: false,
    issueUse: false,
    positionEng: false,
    addressEng: false,
    jobEng: false,
    payDateFrom: false,
    issueYear: false,
  });

  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
  if (isUserLoading) return <p>Loading...</p>;
  if (userError) return <p>Error: {userError.message}</p>;

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      rowStatus: "C",
      emplNo: userData.loginUserId,
      emplNameHan: userData.loginUserNm,
      orgCode: userData.loginDeptId,
      orgNameHan: userData.loginDeptName,
      positionTitleName: userData.loginPstnName,
      issueDate: day,
      reqDate: day,
    }));
  }, [userData, day]);

  const handleSelectChange = (field: string, value: any) => {
    setForm((prevForm) => ({ ...prevForm, [field]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: false })); // Clear error on change
  };


  const validateForm = () => {
    const newErrors = {
      certiCodeKind: !form.certiCodeKind, // 공통 필수값 검증
      certiCodeType: form.certiCodeKind === "1" && !form.certiCodeType, // 재직증명서 언어 검증
      issueUse: !form.issueUse, // 발급 용도 검증
      positionEng: form.certiCodeKind === "1" && form.certiCodeType === "E" && !form.positionEng, // 재직증명서(영문) - 포지션
      addressEng: form.certiCodeKind === "1" && form.certiCodeType === "E" && !form.addressEng, // 재직증명서(영문) - 주소
      jobEng: form.certiCodeKind === "1" && form.certiCodeType === "E" && !form.jobEng, // 재직증명서(영문) - 업무
      payDateFrom: form.certiCodeKind === "4" && !form.payDateFrom, // 갑근세증명서 기간 시작
      payDateTo: form.certiCodeKind === "4" && !form.payDateTo, // 갑근세증명서 기간 종료
      issueYear: form.certiCodeKind === "5" && !form.issueYear, // 원천징수영수증 연도
    };
  
    // 상태 업데이트
    setErrors(newErrors);
  
    // 오류가 없으면 true 반환
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
        const response = await axiosInstance.post("/one/picertprt/onepicertprt110", formData);
        if (response.status === 200 && response.data) {
          setOpenToast({ message: "결재요청이 완료되었습니다.", type: "success", open: true });
          navigate("/certificate/print");
        } else {
          setOpenToast({ message: "결재요청에 실패하였습니다.", type: "danger", open: true });
        }
      } catch (error: any) {
        setOpenToast({ message: error.response?.data?.message || "오류가 발생하였습니다.", type: "danger", open: true });
      }
    }

    
  };

  const getYearRange = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => ({
      label: `${start + i}`,
      error: false,
      query: `${start + i}`,
    }));
  };

  const [openToast, setOpenToast] = useState({ message: "", type: "", open: false });

  return (
    <>
      <div className="pt-10 pb-10">
        <UISelect
          label="증명서종류"
          items={[
            { label: "재직증명서", error: false, query: "1" },
            { label: "갑근세증명서", error: false, query: "4" },
            { label: "원천징수영수증", error: false, query: "5" },
          ]}
          onQuerySelect={(value) => handleSelectChange("certiCodeKind", value)}
          error={errors.certiCodeKind}
          hint={errors.certiCodeKind ? "필수값입니다." : ""}
        />
      </div>

      {form.certiCodeKind === "1" && (
        <>
          <div className="pt-10 pb-10">
            <UISelect
              label="언어"
              items={[
                { label: "국문", error: false, query: "K" },
                { label: "영문", error: false, query: "E" },
              ]}
              onQuerySelect={(value) => handleSelectChange("certiCodeType", value)}
              error={errors.certiCodeType}
              hint={errors.certiCodeType ? "필수값입니다." : ""}
            />
          </div>
          <div className="pt-10 pb-10">
            <UIDatePicker label="발급일자" placeholder={day} readOnly />
          </div>
        </>
      )}

      {form.certiCodeKind === "4" ? // 갑근세증명서
        <div className="pt-10 pb-10">
          <UIDatePicker
            label="기간"
            type="year-month"
            onMonthSelect={(month) => {
              handleSelectChange("payDateFrom", month.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit' }))
              handleSelectChange("payDateTo", month.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit' }))
            }}
            error={errors.payDateFrom}
            hint={errors.payDateFrom ? "필수값입니다." : ""}
          />
        </div>
      : form.certiCodeKind === "5" ? // 원천징수영수증
        <div className="pt-10 pb-10">
        <UISelect
          label="기간"
          items={getYearRange(2010, 2023).reverse()}
          onQuerySelect={(value) => handleSelectChange("issueYear", value)}
          error={errors.issueYear}
          hint={errors.issueYear ? "필수값입니다." : ""}
        />
      </div>
      : null}

      {form.certiCodeType === "E" ?
        <>
          <div className="pt-10 pb-10">
            <UIInput
              label="영문 포지션"
              onChange={(e) => handleSelectChange("positionEng", e.target.value)}
              error={errors.positionEng}
              hint={errors.positionEng ? "필수값입니다." : ""}
            />
          </div>
          <div className="pt-10 pb-10">
            <UIInput
              label="영문 주소"
              onChange={(e) => handleSelectChange("addressEng", e.target.value)}
              error={errors.addressEng}
              hint={errors.addressEng ? "필수값입니다." : ""}
            />
          </div>
          <div className="pt-10 pb-10">
            <UIInput
              label="담당 업무"
              onChange={(e) => handleSelectChange("jobEng", e.target.value)}
              error={errors.jobEng}
              hint={errors.jobEng ? "필수값입니다." : ""}
            />
          </div>
        </>
      : null}

      <div className="pt-10 pb-10">
        <UIInput
          label="발급용도"
          onChange={(e) => handleSelectChange("issueUse", e.target.value)}
          error={errors.issueUse}
          hint={errors.issueUse ? "필수값입니다." : ""}
        />
      </div>

      {form.certiCodeKind === "1" || form.certiCodeKind === "4" ?
        <div className="pt-10 pb-100">
          <UICheckbox
            label="주민번호 마스킹"
            value="chk1"
            onChecked={(chk) => handleSelectChange("maskingInd", chk ? "Y" : "")}
          />
        </div>
      : null}

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
      <UIToast
        message={openToast.message}
        type={openToast.type}
        open={openToast.open}
        onOpenChange={setOpenToast}
      />
    </>
  );
};