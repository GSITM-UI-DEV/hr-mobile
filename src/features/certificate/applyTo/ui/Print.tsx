import { axiosInstance } from "@/app/api/axiosInstance";
import { useDateStore } from "@/app/store/authStore";
import { useCertificatePrint } from "@/entities/certificate";
import { useUser } from "@/entities/user/api/useUser";
// import { openReportPrint } from "@/shared/lib/openReportPrint";
import { UIAlert, UIButton, UIToast } from "@/shared/ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export const Print = () => {
  const navigate = useNavigate();
  const [printUpdate, setPrintUpdate] = useState(false);
  const [form, setForm] = useState({
    reqSeqNo: "",
    reqDate: "",
    emplNo: "",
    certiCodeKind: ""
  })


  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Error: {userError.message}</p>;

  const {currentDate, setCurrentDate} = useDateStore();
  const toDay = currentDate.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const [day, setDay] = useState<string>(toDay);



  const checkDate = new Date();
  const threeMonthAgo = new Date(checkDate.setMonth(checkDate.getMonth() - 3));
  const threeMonthDay = threeMonthAgo.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });

  const { data: printData, isLoading: isPrintLoading, error: printError } = useCertificatePrint({ emplNo: userData.userId, emplNameHan: userData.userNm, baseDateTo: day, baseDateFrom: threeMonthDay });
  if (isPrintLoading) return <p>Loading...</p>;
  if (printError) return <p>Something went wrong!</p>;

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      emplNo: userData.loginUserId
    }))
  }, [userData])



  const [openToast, setOpenToast] = useState({
    message: "",
    type: "",
    open: false
  });
  const handlePrint = async (printIndex: any) => {
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

    const printTarget = printData.filter((field) => field.reqSeqNo === printIndex);
    try {
      const { data } = await axiosInstance.post('/one/picertprt/onepicertprt110/issueseqno', formData)
      const printFormData = {
        formName: 
          printTarget[0].certiCodeKind === "1" && printTarget[0].certiCodeType === "E" ? // 재직증명서 영문
            "emppscertooff_eng"
          : printTarget[0].certiCodeKind === "1" && printTarget[0].certiCodeType === "K" ? // 재직증명서 국문
            "emppscertoff_01"
          : printTarget[0].certiCodeKind === "4" ? // 갑근세증명서
            "emppscertpaydt170" : "emppscertoff_01",
        sysRptId:
          printTarget[0].certiCodeKind === "1" && printTarget[0].certiCodeType === "E" ? // 재직증명서 영문
            "emppscertooff_eng"
          : printTarget[0].certiCodeKind === "1" && printTarget[0].certiCodeType === "K" ? // 재직증명서 국문
            "emppscertoff_01"
          : printTarget[0].certiCodeKind === "4" ? // 갑근세증명서
            "emppscertpaydt170" : "emppscertoff_01",
        projectName: "dbh^emp",
        UB_UNVISIBLE_MENULIST: "saveWord,savePPT,saveCSV,saveExcel,saveHWP",
        issueSeqNo: data.issueSeqNo,
        coCode: printTarget[0].coCode,
        emplNo: printTarget[0].emplNo,
        resNo: printTarget[0].resNo,
        sysEmpId: printTarget[0].loginUserId,
        sysCoNm: printTarget[0].loginCoNm,
        sysCoEngNm: printTarget[0].loginCoNm,

        // 개발배포
        rptProfile: "dev",

        // 운영배포
        // rptProfile: "prod",

        // 개발배포
        imgUrl: "http://10.141.5.197:8110/",

        // 운영배포
        // imgUrl: "https://hrmreport.dbhitek.com/",

        dataset_2: encodeURIComponent(JSON.stringify([{
          resNo: printTarget[0].resNo,
          // birth: printTarget[0].resNo.split("-")[0].replace(/(\d{2})(\d{2})(\d{2})/, "$1.$2.$3")
          birth: printTarget[0].resNo.substring(0,2) + '.' + printTarget[0].resNo.substring(2,4)+ '.' + printTarget[0].resNo.substring(4,6)
        }])),
        // 갑근세증명서 parameter 추가
        startDate: printTarget[0].certiCodeKind === "4" ? printTarget[0].payDateFrom : "",
        endDate: printTarget[0].certiCodeKind === "4" ? printTarget[0].payDateTo : "",
      };
    
      // Create a form dynamically
      const printForm = document.createElement("form");
      printForm.setAttribute("method", "POST");

      // 개발배포
      printForm.setAttribute("action", "http://10.141.5.197:8120/UView5/index.jsp");

      // 운영배포
      // printForm.setAttribute("action", "https://hrmreport.dbhitek.com/UView5/index.jsp");


      printForm.setAttribute("target", "_blank"); // Open in a new tab or window
      // Append hidden inputs for each form data field
      for (const [key, value] of Object.entries(printFormData)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        printForm.appendChild(input);
      }
    
      // Append the form to the document, submit, and remove it
      document.body.appendChild(printForm);
      console.log(printForm);
      printForm.submit();
      document.body.removeChild(printForm);
    } catch (error: any) {
      console.log(error)
    }
  }




  const handleDownload = async (downloadParams: any) => {
    const atchFileIdName = "KOYPAY_" + downloadParams.issueYear + "_" + downloadParams.loginUserId
    try {
      const { data } = await axiosInstance.get(`/one/picertprt/onepicertprt110/findPayFile?reqSeqNo?emplNo=${downloadParams.loginUserId}&emplNameHan=${downloadParams.loginUserNm}&orgCode=${downloadParams.orgCode}&orgNameHan=${downloadParams.orgNameHan}&positionTitleName=${downloadParams.positionTitleName}&certiCodeKind=${downloadParams.certiCodeKind}&certiCodeType=${downloadParams.certiCodeType}&issueYear=${downloadParams.issueYear}&issueUse=${downloadParams.issueUse}&issueDate=${downloadParams.issueDate}&reqDate=${downloadParams.reqDate}&reqSeqNo=${downloadParams.reqDate}&issueInd=${downloadParams.issueInd}&maskingInd=${downloadParams.maskingInd}&atchFileId=${atchFileIdName}`);
      if (data > 0) {
        location.href = "/files/" + atchFileIdName + "/1" + "/download";
      } else {
        alert("파일[ " + atchFileIdName + " ]이 존재하지 않습니다.")
      }
    } catch (error: any) {
      console.log(error)
    }
  }



  // 신청 날짜로 정렬
  const printSortData = printData.sort((a: any, b: any) => {
    return b.reqSeqNo - a.reqSeqNo
  })
  

  return (
    <>
      <div className="pt-10 pb-10">
        <div className="count__control">
          <div className="count">총 <em>{printData.length}</em> 건</div>
        </div>
        <ul className="list">
          {printSortData.map((item, index) => 
            <li key={index}>
              <div className="list__content">
                <div className="top mb-20">
                  <div className="date print align-items-center">신청일자: {item.issueDate}</div>
                  {item.issueInd === "N" && (item.certiCodeKind === "1" || item.certiCodeKind === "4") ?
                    <UIAlert
                      description="출력하시겠습니까?"
                      actionProps={{
                        onClick: () => {
                          handlePrint(item.reqSeqNo);
                        },
                      }}
                    >
                      <UIButton type="border" size="small" onClick={() => setForm((prev) => ({
                        ...prev,
                        reqSeqNo: item.reqSeqNo,
                        reqDate: item.reqDate,
                        certiCodeKind: "1",
                        emplNo: item.loginUserId
                        }
                      ))}>인쇄</UIButton>
                    </UIAlert>
                  : item.issueInd === "N" && (item.certiCodeKind === "5") ?
                    <UIAlert
                      description="다운로드 하시겠습니까?"
                      actionProps={{
                        onClick: () => {
                          handleDownload(item);
                        },
                      }}
                    >
                      <UIButton type="border" size="small" onClick={() => setForm((prev) => ({
                        ...prev,
                        reqSeqNo: item.reqSeqNo,
                        reqDate: item.reqDate,
                        certiCodeKind: "1",
                        emplNo: item.loginUserId
                        }
                      ))}>다운로드</UIButton>
                    </UIAlert>
                  :
                    <div>발급일련번호: <span className="text-point-1">{item.issueSeqNo}</span></div>
                  }
                </div>
                <div className="info">
                  <div>
                    <strong>증명서</strong>
                    <span>{item.certiCodeKindName}</span>
                  </div>
                  <div>
                    <strong>발급용도</strong>
                    <span>{item.issueUse}</span>
                  </div>
                  <div>
                    <strong>언어</strong>
                    <span>{item.certiCodeTypeName}</span>
                  </div>
                </div>
              </div>
            </li>
          )}
        </ul>
      </div>
      <UIToast message={openToast.message} type={openToast.type} open={openToast.open} onOpenChange={setOpenToast} />
    </>
  )
}