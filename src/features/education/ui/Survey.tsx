import { useDateStore } from "@/app/store/authStore";
import { useEducationSurvey } from "@/entities/education";
import { useUser } from "@/entities/user";
import { UIAlert, UIButton, UIDatePicker, UIRadio, UITextarea, UIToast } from "@/shared/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Popover from "@radix-ui/react-popover";
import { axiosInstance } from "@/app/api/axiosInstance";


export const Survey = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    examSeq: 0,
    examTypeCd: 0,
    edust400DtoList: [{
      examSeq: "",
      orderNo: "",
      answer: "",
      questionTypeCd: "",
      paperQuestionSeq: "",
      examQuestionSeq: "",
    }]
  });

  const [errors, setErrors] = useState({});
  const [openToast, setOpenToast] = useState({ message: "", type: "", open: false });

  const [disableSave, setDisableSave] = useState(false);
  const [disableApply, setDisableApply] = useState(true);
  





  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Error: {userError.message}</p>;

  const {currentDate, setCurrentDate} = useDateStore();
  const toDay = currentDate.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });

  const checkDate = new Date();
  const threeMonthAgo = new Date(checkDate.setMonth(checkDate.getMonth() - 3));
  const threeMonthDay = threeMonthAgo.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });

  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: ""
  });
  const handleDateRangeChange = (range: any) => {
    setDateRange(range);
  };

  const { data: educationSurveyData, isLoading: isEducationSurveyLoading, error: educationSurveyError } = useEducationSurvey({
    searchStartDate: dateRange.fromDate ? dateRange.fromDate : threeMonthDay,
    searchEndDate: dateRange.toDate ? dateRange.toDate : toDay,
    emplNo: userData.loginUserId,
    searchEmplNameHan: userData.loginUserNm,
  });
	if (isEducationSurveyLoading) return <p>Loading...</p>;
	if (educationSurveyError) return <p>Error: {educationSurveyError.message}</p>;


  const [questionItemList, setQuestionItemList] = useState([]);
  const [detailData, setDetailData] = useState(false);
  const handleFetchSurvey = async (params: any) => {
    try {
      const { data } = await axiosInstance.get(`/edu/dbhedust/edust400/pop?examSeq=${params.examSeq}`)
      if (data.length > 0) {
        setDetailData(true)
        setQuestionItemList(data)
        // setForm((prev) => ({
        //   ...prev,
        //   edust400DtoList: data.map((item: any) => ({
        //     orderNo: item.orderNo,
        //     examQuestionSeq: item.examQuestionSeq,
            
        //   }))
        // }))
      } else {
        console.log(data);
      }
    } catch (error: any) {
      console.log(error);
    }
  }




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

  return (
    <>
      <div className="pt-10 pb-10">
        <UIDatePicker
          label="조회월"
          type="range"
          onDateRangeChange={handleDateRangeChange}
        />
      </div>
      <div className="pt-10 pb-10">
        <div className="count__control">
          <div className="count">총 <em>{educationSurveyData.length}</em> 건</div>
        </div>
        <ul className="list">
          {educationSurveyData.map((item: any, i) =>
            <li key={i}>
              <div className="list__content">
                {item.examTake === "Y" ?
                  <div className="top" onClick={() => handleFetchSurvey({examSeq: item.examSeq}) }>
                    <div className="date">{item.examDateRange}</div>
                    <div className="icon is-arrow__right"></div>
                  </div>
                :
                  <div className="top">
                    <div className="date">{item.examDateRange}</div>
                  </div>
                }
                <div className="info">
                  <div>
                    <strong>설문명</strong>
                    <span>{item.examNm}</span>
                  </div>
                  <div>
                    <strong>문제수</strong>
                    <span className="text-point-1">{item.eduQstCnt}</span>
                  </div>
                  <div>
                    <strong>설문상태</strong>
                    <span>{item.examTake}</span>
                  </div>
                </div>
              </div>
            </li>
          )}
        </ul>

        <Popover.Root open={detailData} onOpenChange={setDetailData}>
          <Popover.Content className="d-flex align-items-cneter flex-direction-column custom__popper mt-100" style={{overflowY: "scroll"}}>
            <h4 className="p-30">온라인설문</h4>
            {questionItemList.map((item: any, i) =>
              <div key={i} className={(i+1) === questionItemList.length ? "pb-200" : ""}>
                {item.questionTypeCd === "10" ? 
                  <div className="custom__popper__in pl-20 pr-20">
                    <div className="fs-16 pt-40 pb-10">{item.question}</div>
                    <div className="d-flex">
                      <UIRadio
                        items={item.optionList.map((op: any) => { return { label: op.optionCnt, value: op.optionNo }})}
                        onItemSelect={handleRadioCheck}
                        name={item.question}
                        direction="column"
                      />
                    </div>
                  </div>
                : item.questionTypeCd === "5" ? 
                  <div className="custom__popper__in pl-20 pr-20">
                    <div className="fs-16 pt-40 pb-10">{item.question}</div>
                    <div>
                      <UIRadio
                        items={item.optionList.map((op: any) => { return { label: op.optionCnt, value: op.optionNo }})}
                        onItemSelect={handleRadioCheck}
                        name={item.question}
                        direction="column"
                      />
                    </div>
                  </div>
                : 
                  <div className="custom__popper__in pl-20 pr-20">
                    <div className="fs-16 pt-40 pb-10">{item.question}</div>
                    <div className="d-flex">
                      <UITextarea />
                    </div>
                  </div>
                }
              </div>
            )}

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

          </Popover.Content>
        </Popover.Root>
      </div>

      
      <UIToast message={openToast.message} type={openToast.type} open={openToast.open} onOpenChange={setOpenToast} />
    </>
  )
}