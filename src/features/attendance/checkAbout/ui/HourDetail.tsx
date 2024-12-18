import { axiosInstance } from "@/app/api/axiosInstance";
import { useBaseCode } from "@/entities/approvalLine";
import { useAttendanceHourDetail } from "@/entities/attendance";
import { formatByType } from "@/shared/lib/formatByType";
import { UIAlert, UIBadge, UIButton, UIInput, UITimePicker, UIToast } from "@/shared/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";


export const HourDetail = () => {
  // const navigate = useNavigate();
  const qs: string = useOutletContext();
  const { data: hourDetailData, isLoading: isHourDetailLoading, error: hourDetailError } = useAttendanceHourDetail(qs);
  if (isHourDetailLoading) return <p>Loading...</p>;
  if (hourDetailError) return <p>Something went wrong!</p>;
  const params = new URLSearchParams(qs);
  const qsWorkName = params.get("workName");




  const [form, setForm] = useState({
    wcabshistDtoList: [{}]
  });

  const parameters = {
    baseCodList: [
      { "patternCode": "WC52", "effDateYn": true, "companyYn": true }
    ]
  }
  const { data: baseCodeData, isLoading: isBaseCodeLoading, error: baseCodeError } = useBaseCode(parameters);
	if (isBaseCodeLoading) return <p>Loading...</p>;
	if (baseCodeError) return <p>Something went wrong!</p>;
  const codeData = baseCodeData && baseCodeData.map((code: any, index) =>
    code.cdbaseList.map((cd: any) => (
      {codeKey : cd.baseCode, codeName: cd.codeNameHan}
    ))
  )
  const reasonCodeData = codeData[0];
  const findMatchingCode = (data: any, value: any) => {
    const matchingCode = data?.find((code: any) => code.codeKey === value); 
    return matchingCode ? matchingCode.codeName : null;
  };


  // useEffect(() => {
  //   setForm((prev: any) => ({
  //     ...prev,
  //     wcabshistDtoList: [{}]
  //   }))
  // }, [hourDetailData]);


  const handleApplySetting = (historyIndex: number) => {
    setForm((prev) => ({
      ...prev,
      wcabshistDtoList: [
        {
          coCode: hourDetailData[historyIndex].coCode,
          emplNo: hourDetailData[historyIndex].emplNo,
          workDate: hourDetailData[historyIndex].workDate,
          seq: hourDetailData[historyIndex].seq,
          absStartTime: hourDetailData[historyIndex].absStartTime,
          absEndTime: hourDetailData[historyIndex].absEndTime,
          absHour: hourDetailData[historyIndex].absHour,
          admitHour: hourDetailData[historyIndex].admitHour,
          nwkDayHour: hourDetailData[historyIndex].nwkDayHour,
          nwkOtHour: hourDetailData[historyIndex].nwkDayHour,
          absRsn: hourDetailData[historyIndex].absRsn,
          closeInd: hourDetailData[historyIndex].closeInd,
          chngRsn: "",
          rowKey: "0",
          rowStatus: "U",
        }
      ]
    }))
  }

  // 부재 소명(+결과값 Toast 알림)
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
        setTimeout(() => {
          setOpenToast((prev) => ({ ...prev, open: false }));
          // navigate('/attendance/hour');
        }, 1000);
      } else {
        setOpenToast({message: "결재요청에 이상이 있습니다.", open: true, type: "danger"});
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

  


  // 선택값 변경
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
      <div className="bg-primary-500 p-30 mt-10 mb-10 radius-6">
        <div className="fs-20 text-center text-point-2">
          {hourDetailData.map((item: any, i) => item.workDate)[0] && formatByType("date", hourDetailData.map((item: any, i) => item.workDate)[0])}
        </div>
      </div>
      <div className="pt-10 pb-10">
        <div className="count__control">
          <div className="count">총 <em>{hourDetailData.length}</em> 건</div>
        </div>
        <ul className="list">
          {hourDetailData.map((item: any, index) =>
            <li key={index}>
              <Popover>
                <PopoverTrigger asChild className="list__content">
                  <div>
                    <div className="top">
                      <UIBadge type="border" shape="square" status="primary">{qsWorkName}</UIBadge>
                      <div className="icon is-arrow__right" onClick={() => handleApplySetting(index)}></div>
                    </div>
                    <div className="info">
                      <div>
                        <strong>시작/종료</strong>
                        <span>
                          {formatByType("time", item.absStartTime)}
                          &nbsp;~&nbsp;
                          {formatByType("time", item.absEndTime)}
                          &nbsp;
                          &#40;{formatByType("time", item.absHour)}&#41;
                        </span>
                      </div>
                      <div>
                        <strong>인정시간</strong>
                        <span>{item.emplNameHan}</span>
                      </div>
                      <div>
                        <strong>부재사유</strong>
                        <span>{findMatchingCode(reasonCodeData, item.absRsn)}</span>
                      </div>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="d-flex align-items-cneter flex-direction-column custom__popper">
                  {item.absStartTime ?
                    <>
                      <h4 className="pt-30 pl-30 pr-30 pb-10">부재시간</h4>
                      <div className="pl-30 pr-30 mb-30 text-danger-dark fs-16">
                        {/* {item.absStartTime.slice(0,2)}:{item.absStartTime.slice(2)}
                        &nbsp;~&nbsp;
                        {item.absEndTime.slice(0,2)}:{item.absEndTime.slice(2)} */}
                        <UITimePicker
                          type="range"
                          // 기존값
                          start={`${item.absStartTime.slice(0,2)}:${item.absStartTime.slice(2)}`}
                          end={`${item.absEndTime.slice(0,2)}:${item.absEndTime.slice(2)}`}
                          // 업데이트값
                          // onStartTimeChange={(start) => handleAbsenceExplain(item, {startTime: start})}
                          // onEndTimeChange={(end) => handleAbsenceExplain(item, {endTime: end})}
                          readOnly
                        />
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
                          onStartTimeChange={(start) => handleSelectChange("wcabshistDtoList[0].wkStartTime", start ? start.replace(":", "") : item.wkStartTime)}
                          onEndTimeChange={(end) => handleSelectChange("wcabshistDtoList[0].wkEndTime", end ? end.replace(":", "") :  item.wkEndTime)}
                        />
                      </div>
                      <div className="pt-10 pb-10 pl-30 pr-30">
                        <UIInput
                          label="사유"
                          value={item.chngRsn}
                          onChange={(e) => handleSelectChange("wcabshistDtoList[0].chngRsn", e.target.value)}
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
                          onStartTimeChange={(start) => handleSelectChange("wcabshistDtoList[0].wkStartTime", start)}
                          onEndTimeChange={(end) => handleSelectChange("wcabshistDtoList[0].wkEndTime", end)}
                        />
                      </div>
                      <div className="pt-10 pb-10 pl-30 pr-30">
                        <UIInput
                          label="사유"
                          onChange={(e) => handleSelectChange("wcabshistDtoList[0].chngRsn", e.target.value)}
                        />
                      </div>
                    </>
                  }

                  <div className="applyAction">
                    <UIAlert
                      description="소명하시겠습니까?"
                      actionProps={{
                        onClick: () => {
                          handleApply();
                        },
                      }}
                    >
                      <UIButton type="primary">확인/정정</UIButton>
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