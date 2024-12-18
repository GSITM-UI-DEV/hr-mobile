import { axiosInstance } from "@/app/api/axiosInstance";
import { useDateStore } from "@/app/store/authStore";
import { useSalary, useSalaryDeduct, useSalaryDetail } from "@/entities/salary";
import { useUser } from "@/entities/user/api/useUser";
import { formatByType } from "@/shared/lib/formatByType";
import { UIDatePicker, UISelect } from "@/shared/ui";
import { useState } from "react";

export const Salary = () => {
  const {currentDate, setCurrentDate} = useDateStore();
  const thisYear = currentDate.toLocaleDateString('sv-SE', { year: 'numeric' });
  const toDay = currentDate.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit' });
  const [month, setMonth] = useState<string>(toDay + "-25");
  const [payParams, setPayParams] = useState({payDate: "", paySeqNo: ""});


  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Error: {userError.message}</p>;

  const { data: salaryData, isLoading: isSalaryLoading, error: salaryError } = useSalary({ emplNo: userData.loginUserId, emplNameHan: userData.loginUserNm, baseYear: thisYear });
  if (isSalaryLoading) return <p>Loading...</p>;
  if (salaryError) return <p>Something went wrong!</p>;
  // console.log(salaryData);

  const { data: salaryDetailData, isLoading: isSalaryDetailLoading, error: salaryDetailError } = useSalaryDetail({ emplNo: userData.loginUserId, payDate: payParams.payDate, paySeqNo: payParams.paySeqNo });
  if (isSalaryDetailLoading) return <p>Loading...</p>;
  if (salaryDetailError) return <p>Something went wrong!</p>;
  // console.log(salaryDetailData);

  const { data: salaryDeductData, isLoading: isSalaryDeductLoading, error: salaryDeductError } = useSalaryDeduct({ emplNo: userData.loginUserId, payDate: payParams.payDate, paySeqNo: payParams.paySeqNo });
  if (isSalaryDeductLoading) return <p>Loading...</p>;
  if (salaryDeductError) return <p>Something went wrong!</p>;
  // console.log(salaryDeductData);


  // const handleMonth = async (date: Date) => {
  //   const initMonth = date.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit' }) + "-25";
  //   setMonth(initMonth);
  //   const { data } = await axiosInstance.get(`/pay/payself/payself110?baseYear=2024&emplNo=10006254&emplNameHan=%EB%85%B8%ED%83%9C%EA%B7%9C&payGroupCode=`)
  //   console.log(data)
  // }


  const salaryTotal = salaryDetailData.reduce((acc, item) => acc + item.incomeAmt, 0)
  const salaryDeduct = salaryDeductData.reduce((acc, item) => acc + item.dedAmt, 0)
  const salaryFinal = salaryTotal-salaryDeduct;

  const getYearRange = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => ({
      label: `${start + i}`,
      error: false,
      query: `${start + i}`,
    }));
  }



  const [selectData, setSelectData] = useState();


  const handleSelect = (qs: any) => {
    useSalaryDetail(qs);
    useSalaryDetail(qs);
  }

  return (
    <>
      {/* <div className="pt-10 pb-10">
        <UIDatePicker
          label="지급연월"
          type="year-month"
          onMonthSelect={handleMonth}
          placeholder={month.replace("-25", "")}
        />
      </div> */}
      <div className="pt-10 pb-10">
        <UISelect
          label="기준년도"
          items={getYearRange(2010, 2025).reverse()}
          onQuerySelect={async (year) => {
            const { data } = await axiosInstance.get(`/pay/payself/payself110?baseYear=${year}&emplNo=${userData.loginUserId}&emplNameHan=${userData.loginUserNm}&payGroupCode=`);
            const salaryItem = data.map((item: any) => { return {label: item.payNameEnv, error: false, query: {qs1: item.paySeqNo, qs2: item.payDate} }})
            setSelectData(salaryItem)
          }}
        />
      </div>
      <div className="pt-10 pb-10">
        <UISelect
          label="급여지급내역"
          items={selectData}
          onQuerySelect={(row: any) => 
            setPayParams({ payDate: row.qs2, paySeqNo: row.qs1 })
          }
        />
      </div>
      <div className="pt-50 pb-10">
        <div className="box">
          <div className="title center">{formatByType("number", salaryFinal)}</div>
          <div className="content">
            <div className="detail">
              <span className="detail__label">지급금액</span>
              <span className="detail__data">{formatByType("number", salaryTotal)}</span>
            </div>
            <div className="detail">
              <span className="detail__label">공제금액</span>
              <span className="detail__data">{formatByType("number", salaryDeduct)}</span>
            </div>
          </div>
        </div>
      </div>


      {salaryDetailData.length > 0 ?
      <div className="pt-10 pb-10">
        <div className="card">
          <div className="title">지급내역</div>
          <div className="content">
            {salaryDetailData.map((item: any, i) =>
              <div className="detail justify-content-between" key={i}>
                <span className="detail__label">{item.printNm}</span>
                <span className="detail__data">{formatByType("number", item.incomeAmt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      : null }

      {salaryDeductData.length > 0 ?
      <div className="pt-10 pb-10">
        <div className="card">
          <div className="title">공제내역</div>
          <div className="content">
            {salaryDeductData.map((item: any, i) =>
              <div className="detail justify-content-between" key={i}>
                <span className="detail__label">{item.payNameHan}</span>
                <span className="detail__data">{formatByType("number", item.dedAmt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      : null }

    </>
  )
}