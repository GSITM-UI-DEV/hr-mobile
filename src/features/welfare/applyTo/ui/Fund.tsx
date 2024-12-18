import { axiosInstance } from "@/app/api/axiosInstance";
import { useAuthStore } from "@/app/store/authStore";
import { useApprovalLine } from "@/entities/approvalLine";
import { useFundBank } from "@/entities/welfare/api/useWelfare";
import { UIAlert, UIButton, UIDatePicker, UIIconButton, UIInput, UISelect, UIToast } from "@/shared/ui";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Fund = () => {
  const navigate = useNavigate();
  const auth = useAuthStore((state) => state.auth);


  // 결재선
  const { data: approvalLineData, isLoading: isApprovalLineLoading, error: approvalLineError } = useApprovalLine({formId: 'CL', emplNo: auth?.username});
  // const { data: approvalLineData, isLoading: isApprovalLineLoading, error: approvalLineError } = useApprovalLine({
  //   formId: selectedForm?.formId,
  //   emplNo: userData.loginUserId,
  // });
  if (isApprovalLineLoading) return <p>Loading...</p>;
  if (approvalLineError) return <p>Something went wrong!</p>;
  // 계좌
  const { data: fundBankData, isLoading: isFundBankLoading, error: fundBankError } = useFundBank(auth?.username);
  if (isFundBankLoading) return <p>Loading...</p>;
  if (fundBankError) return <p>Something went wrong!</p>;


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
    costCenter: "",
    costName: "",
    payAmt: 0,
    leaveCnt: 0,
    bankCd: "",
    acctNo: "",
    acctDepositor: "",
    reqEmplNo: "",
    reqEmplName: "",
    docNo: "",
    statusCode: 0,
    docTitlNm: "",
    formId: "",
    pgmId: "",
    aprvPathOrder: "",
    aprvdetailDtoList: [],
    files: [],
  });

  useEffect(() => {
    if (approvalLineData && approvalLineData.length > 0) {
      const updatedAprvdetailDtoList = approvalLineData.map((item, index) => ({
        aprvType: item.aprvType,
        aprvSeqNo: index + 1,
        aprvEmplNo: item.emplNo,
        statusCode: item.aprvDepth
      }));
      setForm((prevForm: any) => ({
        ...prevForm,
        aprvdetailDtoList: updatedAprvdetailDtoList,
      }));
    }


    if (fundBankData) {
      // setForm((prevForm) => ({
      //   ...prevForm,
      //   bankCd: fundBankData.acct[0].bankCd
      // }));
      // console.log(fundBankData)
    }
  }, [approvalLineData, fundBankData]);

  


  const handleSelect = async (item: any) => {
    setReason(item);
    const { data } = await axiosInstance.get(`/uhr/docappr/apprcn600/relcodelist?cncCode=${item}`);
    const transformedData = data.map((item: any) => ({
      label: item.relCodeName,
      error: false,
      query: item.relCode,
    }));
    setRelation(transformedData);
    // return data;
  }


  const handleSelectRelation = async (item: any) => {
    // console.log(reason);
    // console.log(item);
    if (!reason) return;

    const eventDateParams = form.eventDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
    const response1 = await axiosInstance.get(`/uhr/docappr/apprcn600/cnpayrule?supportInd=C&cncCode=${reason}&relCode=${item}&eventDate=${eventDateParams}`);
    console.log(response1.data);
    const response2 = await axiosInstance.get(`/uhr/docappr/apprcn600/setacct?payType=5&emplNo=${auth?.username}&eventDate=${eventDateParams}`);
    console.log(response2.data);
    const response3 = await axiosInstance.get(`/uhr/docappr/apprcn600/docno?reqEmplNo=${auth?.username}`);
    console.log(response3.data);
    handleInputChange("docNo", response3.data);
  }
  // console.log(form)



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


  // 입력값 변경
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


  // 신청하기
  const [openToast2, setOpenToast2] = useState<boolean>(false);
  const [openToast3, setOpenToast3] = useState<boolean>(false);
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
    const { data } = await axiosInstance.post('/uhr/docappr/apprcn600', formData);
  }



  const handleReset = () => {
    handleInputChange("shpayreq.reqAmt", 0);
    handleSelectChange("resNoFamily", "");
    handleSelectChange("shpayreq.relCode", "");
    handleSelectChange("shpayreq.schoolKindCode", "");
    handleSelectChange("shpayreq.schoolKindCode", "");
  }

  


  return (
    <>
      <div className="d-flex pt-10 pb-10 flex-direction-column">
        <UISelect
          label="경조사유"
          items={[
            { label: "선택", error: false, query: "" },
            { label: "결혼", error: false, query: "01" },
            { label: "회갑", error: false, query: "05" },
            { label: "칠순", error: false, query: "06" },
            { label: "사망", error: false, query: "07" },
            { label: "출산(첫째)", error: false, query: "09" },
            { label: "출산(둘째)", error: false, query: "10" },
            { label: "출산(셋째이상)", error: false, query: "11" },
            { label: "기타(기타 외부인)", error: false, query: "03" },
          ]}
          onQuerySelect={handleSelect}
        />
      </div>
      <div className="d-flex pt-10 pb-10 flex-direction-column">
        <UIDatePicker
          label="경조발생일"
          onDateSelect={(value) => handleSelectChange("eventDate", value.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3'))}
        />
      </div>
      <div className="d-flex pt-10 pb-10 flex-direction-column">
        <UISelect label="관계" items={relation} onQuerySelect={handleSelectRelation} />
      </div>
      <div className="d-flex pt-10 pb-10">
        <UIInput label="비고" />
      </div>
      <div className="d-flex pt-10 pb-10 flex-direction-column">
      {form.payAmt}
        <UIInput label="지급금액" readOnly defaultValue={form.payAmt} />
      </div>
      <div className="d-flex pt-10 pb-10">
      {form.leaveCnt}
        <UIInput label="휴가일수" readOnly defaultValue={form.leaveCnt} />
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
          <UIInput label="첨부파일" placeholder="증빙서류첨부" disabled />
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
      <UIToast message="신청이 완료되었습니다." type="success" open={openToast2} onOpenChange={setOpenToast2} />
      <UIToast message="결재요청에 이상이 생겼습니다." type="danger" open={openToast3} onOpenChange={setOpenToast3} />
    </>
  );
};