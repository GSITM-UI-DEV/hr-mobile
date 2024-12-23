import { axiosInstance } from "@/app/api/axiosInstance";
import { useApprovalDocument, useApprovalForm, useApprovalLine, useBaseCode } from "@/entities/approvalLine";
import { useUser } from "@/entities/user";
import { useFundBank } from "@/entities/welfare";
import { formatByType } from "@/shared/lib/formatByType";
import { UIAlert, UIButton, UIDatePicker, UIIconButton, UIInput, UISelect, UIToast } from "@/shared/ui";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";




export const Fund = () => {
  const navigate = useNavigate();
  const [openToast, setOpenToast] = useState({ message: "", type: "", open: false });

  const [fieldDisable, setFieldDisable] = useState(false);
  const [disableSave, setDisableSave] = useState(false);
  const [disableApply, setDisableApply] = useState(true);

  const [reason, setReason] = useState();
  const [relation, setRelation] = useState([]);
  const [form, setForm] = useState({
    filePath: "",
    cncCode: "",
    supportInd: "",
    emplNo: "",
    emplNameHan: "",
    orgNameHan: "",
    positionNameHan: "",
    eventDate: "",
    relCode: "",
    objNameHan: "",
    addRegEmplNo: "",
    addRegEmplNameHan: "",
    remark: "",
    costCenter: "",
    costName: "",
    acctCode: "",
    payAmt: "",
    budgetAmt: "",
    leaveCnt: "",
    bankCd: "",
    acctNo: "",
    acctDepositor: "",
    reqRemark: "",
    atchFileId: "",
    fileItemCheck0: "",
    reqEmplNo: "",
    reqEmplName: "",
    docNo: "",
    statusCode: "",
    docTitlNm: "",
    formId: "",
    pgmId: "",
    mblPgmId: "",
    saveFlag: "",
    bfDocNo: "",
    wreathInd: "",
    artmouInd: "",
    addRegEmplOrg: "",
    aprvPathOrder: "",
    payType: "",
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({
    cncCode: false,
    eventDate: false,
    relCode: false,
    objNameHan: false,
  }); // 에러 메시지 관리



  // 결재선
  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Error: {userError.message}</p>;

  const { data: approvalFormData, isLoading: isApprovalFormLoading, error: approvalFormError } = useApprovalForm();
  if (isApprovalFormLoading) return <p>Loading...</p>;
  if (approvalFormError) return <p>Something went wrong!</p>;
  const selectedForm = approvalFormData?.filter((i) => i.formId === "CL")[0]
  
  const { data: approvalLineData, isLoading: isApprovalLineLoading, error: approvalLineError } = useApprovalLine({
    formId: selectedForm?.formId,
    emplNo: userData.loginUserId,
    recvEmplNo: userData.loginUserId,
    ccCode: userData.loginUserId,
    cncCode: form.cncCode,
  });
  if (isApprovalLineLoading) return <p>Loading...</p>;
  if (approvalLineError) return <p>Something went wrong!</p>;

  const { data: approvalDocumentData, isLoading: isApprovalDocumentLoading, error: approvalDocumentError } = useApprovalDocument(userData.loginUserId);
  if (isApprovalDocumentLoading) return <p>Loading...</p>;
  if (approvalDocumentError) return <p>Something went wrong!</p>;


  // 경조 유형 코드 쿼리
  const parameters = {
    baseCodList: [
      { "patternCode": "CN03", "effDateYn": true, "companyYn": true, "etc1Value": "Y" },
      { "patternCode": "CN08", "effDateYn": true, "etc1Value": "Y", "companyYn": true },
      { "patternCode": "PR02", "effDateYn": true, "companyYn": true },
      { "patternCode": "CN12", "effDateYn": true, "companyYn": true },
      { "patternCode": "CN09", "effDateYn": true, "companyYn": true }
    ]
  }
  const { data: baseCodeData, isLoading: isBaseCodeLoading, error: baseCodeError } = useBaseCode(parameters);
	if (isBaseCodeLoading) return <p>Loading...</p>;
	if (baseCodeError) return <p>Something went wrong!</p>;
  const codeData = baseCodeData && baseCodeData.map((code: any) =>
    code.cdbaseList.map((cd: any) => (
      {codeKey : cd.baseCode, codeName: cd.codeNameHan}
    ))
  )
  const welfareFundCodeData = codeData[0];
  const welfareFundCodeDataTarget = welfareFundCodeData?.map((codeItem: any) => { return {label: codeItem.codeName, error: false, query: codeItem.codeKey}})


  // 신청자 계좌
  const { data: fundBankData, isLoading: isFundBankLoading, error: fundBankError } = useFundBank({ emplNo: userData.loginUserId, coCode: userData.loginCoId });
  if (isFundBankLoading) return <p>Loading...</p>;
  if (fundBankError) return <p>Something went wrong!</p>;


  // useEffect(() => {
  //   if (approvalLineData && approvalLineData.length > 0) {
  //     const updatedAprvdetailDtoList = approvalLineData.map((item, index) => ({
  //       aprvType: item.aprvType,
  //       aprvSeqNo: index + 1,
  //       aprvEmplNo: item.emplNo,
  //       statusCode: item.aprvDepth
  //     }));
  //     setForm((prevForm: any) => ({
  //       ...prevForm,
  //       aprvdetailDtoList: updatedAprvdetailDtoList,
  //     }));
  //   }


  //   if (fundBankData) {
  //     // setForm((prevForm) => ({
  //     //   ...prevForm,
  //     //   bankCd: fundBankData.acct[0].bankCd
  //     // }));
  //     // console.log(fundBankData)
  //   }
  // }, [approvalLineData, fundBankData]);



  useEffect(() => {
    if (!fundBankData || !fundBankData.acct || !fundBankData.cost) {
      return; // 데이터가 없으면 실행하지 않음
    }
    // 결재 라인-기안서 세팅 + 신청자정보(계좌 등) 세팅
    setForm((prev) => ({
      ...prev,
      acctNo: fundBankData.acct[0]?.payacctNo || "",
      bankCd: fundBankData.acct[0]?.bankCode || "",
      costCenter: fundBankData.cost[0]?.costCd || "",
      supportInd: "C",
      payType: "5",

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
  }, [userData, approvalLineData, approvalDocumentData, fundBankData])


  const handleSelect = async (item: any) => {
    const { data } = await axiosInstance.get(`/uhr/docappr/apprcn600/relcodelist?cncCode=${item}`);
    const transformedData = data.map((item: any) => ({
      label: item.relCodeName,
      error: false,
      query: item.relCode,
    }));
    setReason(item);
    setRelation(transformedData);
  }


  const [account, setAccount] = useState([]);
  const handleSelectRelation = async (item: any) => {
    if (!reason) return;
    const responsePay = await axiosInstance.get(`/uhr/docappr/apprcn600/cnpayrule?supportInd=${form.supportInd}&cncCode=${reason}&relCode=${item}&eventDate=${form.eventDate}&costCenter=${form.costCenter}&acctCode=`);
    setForm((prevForm) => ({
      ...prevForm,
      payAmt: responsePay.data[0].payAmt
    }));
    const responseAcct = await axiosInstance.get(`/uhr/docappr/apprcn600/setacct?payType=${form.payType}&emplNo=${form.reqEmplNo}&eventDate=${form.eventDate}`);
    const resAcct = responseAcct.data.map((codeItem: any) => { return {label: codeItem.acctNm, error: false, query: codeItem.acctCode}})
    setAccount(resAcct)
  }


  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  // 버튼 클릭 핸들러
  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 첨부창 열기
    }
  };
  // 파일 선택 핸들러
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setSelectedFiles(files); // 선택된 파일들을 상태로 설정
    const { data } = await axiosInstance.post('/files/upload-atchfile', files,
      { headers: { 'Content-Type' : 'multipart/form-data' } }
    );
    const fileList = Array.from(data).map((file:any, index:any) => ({
      fileSeqNo: (index + 1).toString(),
      fileSn: file.fileSn,
      atchFileId: file.atchFileId,
      fileName: file.orignlFileNm,
      url: ''
    }));

    setForm((prevForm) => ({
      ...prevForm,
      atchFileId: fileList[0].atchFileId,
      shpayreqfileList: fileList
    }));
  };

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
    setErrors((prevErrors) => ({ ...prevErrors, [field]: false })); // Clear error on change
  };



  const validateForm = () => {
    const newErrors = {
      // certiCodeKind: !form.certiCodeKind, // 공통 필수값 검증
      cncCode: !form.cncCode,
      eventDate: !form.eventDate,
      relCode: !form.relCode,
      objNameHan: !form.objNameHan,
    };
    // 상태 업데이트
    setErrors(newErrors);
    // 오류가 없으면 true 반환
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
        const response = await axiosInstance.post("/uhr/docappr/apprcn600", formData);
        if (response.status === 200 && response.data) {
          setOpenToast({ message: "임시저장이 완료되었습니다.", type: "success", open: true });
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
          setOpenToast({ message: "요청에 이상이 있습니다.", type: "danger", open: true });
        }
      } catch (error: any) {
        setOpenToast({ message: error.response?.data?.message || "오류가 발생하였습니다.", type: "danger", open: true });
      }
    }
  }


  // 신청하기
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
          navigate("/welfare");
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

  


  return (
    <>
      <div className="d-flex pt-10 pb-10 flex-direction-column">
        <UISelect
          label="경조사유"
          items={welfareFundCodeDataTarget}
          onQuerySelect={(value) => {
            handleSelect(value);
            handleSelectChange("cncCode", value);
          }}
          error={errors.cncCode}
          hint={errors.cncCode ? "필수값입니다." : ""}
        />
      </div>
      <div className="d-flex pt-10 pb-10 flex-direction-column">
        <UIDatePicker
          label="경조발생일"
          onDateSelect={(value) => handleSelectChange("eventDate", formatByType("date", value)) }
          error={errors.eventDate}
          hint={errors.eventDate ? "필수값입니다." : ""}
        />
      </div>
      <div className="d-flex pt-10 pb-10 gap-10">
        <div className="d-flex">
          <UISelect
            label="관계"
            items={relation}
            onQuerySelect={(value) => {
              handleSelectRelation(value);
              handleSelectChange("relCode", value);
            }}
            readOnly={form.eventDate === "" ? true : false}
            error={errors.relCode}
            hint={errors.relCode ? "필수값입니다." : ""}
          />
        </div>
        <div className="d-flex align-items-end">
          <UIInput
            label="대상자"
            placeholder="대상자 성명 기재"
            onChange={(e) => handleSelectChange("objNameHan", e.target.value)}
            error={errors.objNameHan}
            hint={errors.objNameHan ? "필수값입니다." : ""}
          />
        </div>
      </div>
      <div className="d-flex pt-10 pb-10 flex-direction-column">
        <UISelect label="계정" items={account} readOnly={form.relCode === "" ? true : false} />
      </div>
      <div className="d-flex pt-10 pb-10 flex-direction-column">
        <UIInput label="지급금액" readOnly placeholder={form.payAmt} />
      </div>
      <div className="d-flex pt-10 pb-10">
        <UIInput label="은행" readOnly placeholder={form.bankCd} />
      </div>
      <div className="d-flex pt-10 pb-10">
        <UIInput label="계좌정보" readOnly placeholder={form.acctNo} />
      </div>


      <div className="pt-10 pb-10">
        <div className="attach__file">
          <input
            type="file"
            ref={fileInputRef} // useRef로 파일 입력 요소 참조
            style={{ display: "none" }} // 화면에 보이지 않게 숨김
            onChange={handleFileChange}
            multiple // multiple 속성 추가
          />
          <UIInput
            label="첨부파일"
            placeholder="증빙서류첨부"
            disabled
            error={errors.atchFileId}
            hint={errors.atchFileId ? "필수값입니다." : ""}
          />
          <UIIconButton onClick={handleFileClick} className="is-file has-pressed-action" />
        </div>
        {selectedFiles && (
          <ul className="attach__file__list">
            {Array.from(selectedFiles).map((file, index) => (
              <li key={index}>
                <UIInput value={file.name} readOnly />
                <div className="icon is-delete mt-10 ml-10 mr-10"></div>
              </li>
            ))}
          </ul>
        )}
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
  );
};