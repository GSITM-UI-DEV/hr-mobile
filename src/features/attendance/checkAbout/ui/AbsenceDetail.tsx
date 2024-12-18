import { axiosInstance } from "@/app/api/axiosInstance";
import { useAttendanceAbsenceDetail } from "@/entities/attendance";
import { UIAlert, UIBadge, UIButton, UIInput, UITimePicker, UIToast } from "@/shared/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";


export const AbsenceDetail = () => {
  const navigate = useNavigate();
  const qs = useOutletContext();
  const { data: absenceDetailData, isLoading: isAbsenceDetailLoading, error: absenceDetailError } = useAttendanceAbsenceDetail(qs);
  if (isAbsenceDetailLoading) return <p>Loading...</p>;
  if (absenceDetailError) return <p>Something went wrong!</p>;



  const [form, setForm] = useState({
    wcabshistDtoList: []
  });

  
  // 취소 신청(+결과값 Toast 알림)
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
      const { data } = await axiosInstance.put('/wrk/dbhwrkabs/wrkabsstat100', formData);
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
        navigate('/attendance/absence');
      }, 1000);
    }
  }


  const handleAbsenceExplain = (prevData: any, newData: any) => {
    // console.log(newData);
    setForm((prev: any) => ({
      ...prev,
      wcabshistDtoList: [
        {
          wkStartTime: newData.startTime ? newData.startTime.replace(":", "") : prevData.wkStartTime,
          wkEndTime: newData.endTime ? newData.endTime.replace(":", "") : prevData.wkEndTime,
          chngRsn: newData.reason ? newData.reason : prevData.chngRsn,

          coCode: prevData.coCode,
          emplNo: prevData.emplNo,
          workDate: prevData.workDate,
          seq: prevData.seq,
          absStartTime: prevData.absStartTime,
          absEndTime: prevData.absEndTime,
          absHour: prevData.absHour,
          admitHour: prevData.admitHour,
          nwkDayHour: prevData.nwkDayHour,
          nwkOtHour: prevData.nwkOtHour,
          absRsn: prevData.absRsn,
          closeInd: prevData.closeInd,
          rowKey: "0",
          rowStatus: "U"
        }
      ]
    }))
  }

  return (
    <>
      <div className="bg-primary-500 p-30 mt-10 mb-10 radius-6">
        <div className="fs-20 text-center text-point-2">
          {absenceDetailData.map((item: any, i) => item.workDate)[0]}
        </div>
      </div>
      <div className="pt-10 pb-10">
        <div className="count__control">
          <div className="count">총 <em>{absenceDetailData.length}</em> 건</div>
        </div>
        <ul className="list">
          {absenceDetailData.map((item: any, i) =>
            <li key={i}>
              <Popover>
                <PopoverTrigger asChild className="list__content">
                  <div>
                    <div className="top">
                      <UIBadge type="border" shape="square" status="primary">기본</UIBadge>
                      <div className="icon is-arrow__right"></div>
                    </div>
                    <div className="info">
                      <div>
                        <strong>사번</strong>
                        <span>{item.emplNo}</span>
                      </div>
                      <div>
                        <strong>성명</strong>
                        <span></span>
                      </div>
                      <div>
                        <strong>시작/종료</strong>
                        <span>
                          {item.absStartTime.slice(0,2)}:{item.absStartTime.slice(2)}
                          &nbsp;~&nbsp;
                          {item.absEndTime.slice(0,2)}:{item.absEndTime.slice(2)}
                          &nbsp;
                          ({item.absHour.slice(0,2)}:{item.absHour.slice(2)})
                        </span>
                      </div>
                      <div>
                        <strong>부재사유</strong>
                        <span>{item.absRsn}</span>
                      </div>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="d-flex align-items-cneter flex-direction-column custom__popper">
                  {item.absStartTime ?
                    <>
                      <h4 className="pt-30 pl-30 pr-30 pb-10">부재시간</h4>
                      <div className="pl-30 pr-30 mb-30 text-danger-dark fs-16">
                        {item.absStartTime.slice(0,2)}:{item.absStartTime.slice(2)}
                        &nbsp;~&nbsp;
                        {item.absEndTime.slice(0,2)}:{item.absEndTime.slice(2)}
                      </div>
                      <h4 className="pt-30 pl-30 pr-30 pb-10">부재소명 시간 입력</h4>
                      <div className="custom__popper__in pl-30 pr-30">
                        <UITimePicker
                          label="업무시작/종료"
                          type="range"
                          // 기존값
                          start={`${item.wkStartTime.slice(0,2)}:${item.wkStartTime.slice(2)}`}
                          end={`${item.wkEndTime.slice(0,2)}:${item.wkEndTime.slice(2)}`}
                          // 업데이트값
                          onStartTimeChange={(start) => handleAbsenceExplain(item, {startTime: start})}
                          onEndTimeChange={(end) => handleAbsenceExplain(item, {endTime: end})}
                        />
                      </div>
                      <div className="pt-10 pb-10 pl-30 pr-30">
                        <UIInput
                          label="사유"
                          value={item.chngRsn}
                          onChange={(e) => handleAbsenceExplain(item, {reason: e.target.value})}
                        />
                      </div>
                    </>
                  :
                    <>
                      <h4 className="p-30">부재시간</h4>
                      <div className="pl-30 pr-30 mb-30 text-danger-dark fs-16">
                        {item.absStartTime.slice(0,2)}:{item.absStartTime.slice(2)}
                        &nbsp;~&nbsp;
                        {item.absEndTime.slice(0,2)}:{item.absEndTime.slice(2)}
                      </div>
                      <h4 className="p-30">부재시작 시간 입력</h4>
                      <div className="custom__popper__in pl-30 pr-30">
                        <UITimePicker
                          label="부재시작"
                          onStartTimeChange={(e: any) => console.log(e)}
                        />
                      </div>
                      <div className="pt-10 pb-10 pl-30 pr-30">
                        <UIInput label="사유" />
                      </div>
                    </>
                  }

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