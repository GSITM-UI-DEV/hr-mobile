import { useDateStore } from "@/app/store/authStore";
import { useEducationReport } from "@/entities/education";
import { useUser } from "@/entities/user";
import { UIAlert, UIButton, UISelect, UITextarea, UIToast } from "@/shared/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/app/api/axiosInstance";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";




export const Report = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    filePath: "",
    mentorEmplNameHan: "",
    mentorOrgNameHan: "",
    mentorTitleNameHan: "",
    menteeEmplNameHan: "",
    menteeOrgNameHan: "",
    menteeTitleNameHan: "",
    startDate: "",
    finishDate: "",
    subject: "",
    act1Content: "",
    act1Comment: "",
    act2Content: "",
    act2Comment: "",
    act3Content: "",
    act3Comment: "",
    expenseComment: "",
    expense: "",
    atchFileId: "",
    resultMentee: "",
    resultMentor: "",
    feedbackMentee: "",
    feedbackMentor: "",
    remark: "",
    planId: "",
    yyyy: "",
    mm: "",
    comYnMentee: "",
    comYnMentor: "",
    menteeEmplNo: "",
    mentorEmplNo: "",
  });

  const [errors, setErrors] = useState({});
  const [openToast, setOpenToast] = useState({ message: "", type: "", open: false });

  const [disableSave, setDisableSave] = useState(false);
  const [disableApply, setDisableApply] = useState(true);
  


  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Error: {userError.message}</p>;

  const {currentDate, setCurrentDate} = useDateStore();
  const toYear = currentDate.toLocaleDateString('sv-SE', { year: 'numeric' });

  const { data: educationReportData, isLoading: isEducationReportLoading, error: educationReportError } = useEducationReport({
    baseYear: toYear,
    searchEmplNo: userData.loginUserId,
    searchEmplNameHan: userData.loginUserNm,
    isAdmin: false
  });
	if (isEducationReportLoading) return <p>Loading...</p>;
	if (educationReportError) return <p>Error: {educationReportError.message}</p>;



  const validateForm = () => {
    const newErrors = {
      // transferReason: !form.transferReason,
      // transferNote1: !form.transferNote1,
      // transferNote2: !form.transferNote2,
      // transferNote3: !form.transferNote3,
      // transferNote4: !form.transferNote4,
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
            setOpenToast((prev) => ({ ...prev, open: false }));
            setDisableSave(true);
            setDisableApply(false);
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

  }


  const handleRadioCheck = (value: any) => {
    console.log(value)
  }


  const getYearRange = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => ({
      label: `${start + i}`,
      error: false,
      query: `${start + i}`,
    }));
  };







  return (
    <>
      <div className="pt-10 pb-10">
        <UISelect
          label="기간"
          items={getYearRange(2010, 2025).reverse()}
        />
      </div>
      <div className="pt-10 pb-10">
        <div className="count__control">
          <div className="count">총 <em>{educationReportData.length}</em> 건</div>
        </div>
        <ul className="list">
          {educationReportData.map((item: any, i) =>
            <li key={i}>
              <Popover>
                {item.comYnMentee === "Y" ?
                  <PopoverTrigger asChild>
                    <div className="list__content">
                      <div className="top">
                        <div className="date">{item.yyyyMm}</div>
                        <div className="icon is-arrow__right"></div>
                      </div>
                      <div className="info">
                        <div>
                          <strong>주제</strong>
                          <span className="text-point-1">{item.subject}</span>
                        </div>
                        <div>
                          <strong>시작일 ~ 종료일</strong>
                          <span>{item.startDate} ~ {item.finishDate}</span>
                        </div>
                        <div>
                          <strong>Mentor</strong>
                          <span>{item.mentorEmplNameHan}</span>
                        </div>
                        <div>
                          <strong>Mentee</strong>
                          <span>{item.menteeEmplNameHan}</span>
                        </div>
                      </div>
                    </div>
                  </PopoverTrigger>
                :
                  <div className="list__content">
                    <div className="top">
                      <div className="date">{item.yyyyMm}</div>
                      <div>미작성</div>
                    </div>
                    <div className="info">
                      <div>
                        <strong>주제</strong>
                        <span className="text-point-1">{item.subject}</span>
                      </div>
                      <div>
                        <strong>시작일 ~ 종료일</strong>
                        <span>{item.startDate} ~ {item.finishDate}</span>
                      </div>
                      <div>
                        <strong>Mentor</strong>
                        <span>{item.mentorEmplNameHan}</span>
                      </div>
                      <div>
                        <strong>Mentee</strong>
                        <span>{item.menteeEmplNameHan}</span>
                      </div>
                    </div>
                  </div>
                }
                <PopoverContent className="d-flex align-items-cneter flex-direction-column custom__popper mt-100" style={{overflowY: "scroll"}}>
                  <h4 className="p-30">{item.subject}</h4>
                  <div className="custom__popper__in pl-20 pr-20">
                    <div className="fs-16 pt-40 pb-10">1. 월간 다솜활동 내용</div>
                    <div>
                      {item.act1Content && <UITextarea placeholder={item.act1Content} disabled />}
                      <UITextarea />
                    </div>
                  </div>
                  <div className="custom__popper__in pl-20 pr-20">
                    <div className="fs-16 pt-40 pb-10">2. 다솜활동비 사용내역</div>
                    <div>
                      <UITextarea />
                    </div>
                  </div>
                  <div className="custom__popper__in pl-20 pr-20">
                    <div className="fs-16 pt-40 pb-10">3. 자신의 월간 다솜활동을 평가한다면?</div>
                    <div>
                      <UITextarea />
                    </div>
                  </div>
                  <div className="custom__popper__in pl-20 pr-20">
                    <div className="fs-16 pt-40 pb-10">4. 요청 및 건의사항</div>
                    <div>
                      <UITextarea />
                    </div>
                  </div>
                  <div className="custom__popper__in pl-20 pr-20">
                    <div className="fs-16 pt-40 pb-10">5. 비고</div>
                    <div>
                      <UITextarea />
                    </div>
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
                </PopoverContent>
              </Popover>
              <UIToast message={openToast.message} type={openToast.type} open={openToast.open} onOpenChange={setOpenToast} />
            </li>
          )}
        </ul>
      </div>
    </>
  )
}