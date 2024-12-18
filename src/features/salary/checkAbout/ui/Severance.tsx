import { useSalarySeverance, useSalarySeveranceReckon } from "@/entities/salary";
import { useUser } from "@/entities/user";
import { formatByType } from "@/shared/lib/formatByType";


export const Severance = () => {
  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Something went wrong!</p>;

  const { data: severanceReckonData, isLoading: isSeveranceReckonLoading, error: severanceReckonError } = useSalarySeveranceReckon({
    // orgCode: userData.loginDeptId,
    // orgNameHan: userData.loginDeptName,
    // emplNameHan: userData.loginUserNm,
    emplNo: userData.loginUserId,
  });
	if (isSeveranceReckonLoading) return <p>Loading...</p>;
	if (severanceReckonError) return <p>Something went wrong!</p>;

  const { data: severanceData, isLoading: isSeveranceLoading, error: severanceError } = useSalarySeverance({
    // orgCode: userData.loginDeptId,
    // orgNameHan: userData.loginDeptName,
    // emplNameHan: userData.loginUserNm,
    emplNo: userData.loginUserId,
  });
	if (isSeveranceLoading) return <p>Loading...</p>;
	if (severanceError) return <p>Something went wrong!</p>;

  
  return (
    <>
      {/* <div className="pt-10 pb-10">
        <UIDatePicker
          label="예상 퇴직일자"
          onDateSelect={(value) => setBasisDate(value)}
        />
      </div> */}
      <div className="pt-10 pb-200">
        {/* DB형 보험 */}
        {severanceData?.prrtappropDbList?.length > 0 ? severanceData?.prrtappropDbList?.map((item: any, index: any) => 
          <div className="card" key={index}>
            <div className="title">예상퇴직금</div>
            <div className="content">
              <div className="detail justify-content-between">
                <span className="detail__label">기준일자</span>
                <span className="detail__data">{formatByType("date", item.basisDateRetire)}</span>
              </div>
              <div className="detail justify-content-between">
                <span className="detail__label">시작일자</span>
                <span className="detail__data">{formatByType("date", item.retireDateReckon)}</span>
              </div>
              <div className="detail justify-content-between">
                <span className="detail__label">근속년수</span>
                <span className="detail__data">{item.wkym}</span>
              </div>
              <div className="detail justify-content-between">
                <span className="detail__label">근속월수</span>
                <span className="detail__data">{item.wkmm}</span>
              </div>
              <div className="detail justify-content-between">
                <span className="detail__label">예상퇴직금</span>
                <span className="detail__data">{formatByType("number", item.rtpayAmt)}</span>
              </div>
            </div>
          </div>
        ) : null}
        

        {/* DC형 보험 */}
        {severanceData?.prrtappropDcList?.length > 0 ? severanceData?.prrtappropDcList?.map((item: any, index: any) => 
          <div className="card" key={index}>
            <div className="title">예상퇴직금</div>
            <div className="content">
              <div className="detail justify-content-between">
                <span className="detail__label">근무기간</span>
                <span className="detail__data">{item.workPeriod}</span>
              </div>
              <div className="detail justify-content-between">
                <span className="detail__label">납입연월</span>
                <span className="detail__data">{formatByType("date", item.effDateYm)}</span>
              </div>
              <div className="detail justify-content-between">
                <span className="detail__label">금액</span>
                <span className="detail__data">{formatByType("number", item.payAmt)}</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>



      {severanceReckonData === "01" ?
        // DB형 보험
        <div className="notification">
          <div className="noti"><div className="icon is-system is-info"></div>[퇴직금 산정 기준]</div>
          <ul>
            <li className="pb-40">
              <div className="text-underline pb-10">1. 퇴직금은 [ 최근 1개월 평균급여 X 근속연수 ]로 구해집니다.</div>

              이때, "최근 3개월 평균급여"란 최근 3개월간 지급받은 기본급, 수당(직책수당, 자격수당, 할증수당, 차량유지비 등),
              년중 특정시기에 지급되는 급여항목(성과급, 상여, 전년 연차보상)의 3개월치를 포함합니다.

              즉, 년간 지급받을 성과급 혹은 년간 지급받을 MS상여를 12개월로 나누어서
              매월 분할하여 지급했더라면 지급받았을 금액(1개월치 성과급/상여급)을 최근 3개월간 평균급여를 구할 때 포함합니다.<br /><br />

              "최근 3개월"에는 출산휴가기간, 휴직기간, 휴업기간이 포함되지 않습니다.
              예를 들어, 실제 최근 3개월 중 1개월의 휴직이 있었다면 휴직기간 이전과 이후의 실제 근무한 3개월을 최근 3개월로 산정합니다.
              단, "최근 3개월"에는 감급, 정직, 무급휴가, 대기발령 기간은 포함이 됩니다.
            </li>
            <li className="pb-40">
              <div className="text-underline pb-10">2. 예상퇴직금은 매월 말일에 업데이트 되어, 실제 퇴직금과 차이가 있을 수 있습니다.</div>

              예상퇴직금은 전월 말일 기준으로 산정된 금액으로 당월 급여일 이전에 퇴직할 경우 당월 근무기간에 대한 급여가
              반영되어 있지 않아 실제 퇴직금과 예상퇴직금은 차이가 있을 수 있습니다.
            </li>
            <li>
              <div className="text-underline pb-10">3. 퇴직금은 퇴직 후 2주 이내에 개인별 퇴직연금계좌(IRP : Individual Retirement Pension)로 입금됩니다.</div>

              퇴직금은 본인 명의의 퇴직연금계좌로만 입금이 가능합니다.
              따라서, 퇴직시 반드시 개인별 퇴직연금계좌의 통장 사본을 제출하셔야 하면 제출이 늦어지면 퇴직금 입금이 늦어질 수 있습니다.<br /><br />

              참고로, 실제 퇴직시에는 잔여 연차에 대한 보상, 4대보험 정산, 근로소득 정산 등 기타 퇴직정산이 이루어지며
              기타 퇴직정산은 퇴직금이 아니므로 IRP가 아니라 급여통장으로 입금이 됩니다.
            </li>
          </ul>
        </div>
      :
        // DC형 보험
        <div className="notification">
          <div className="noti"><div className="icon is-system is-info"></div>[퇴직금 산정 기준]</div>
          <ul>
            <li className="pb-40">
              <div className="text-underline pb-10">1. 퇴직금은 [ 연간 임금총액의 1/12 ]로 구해집니다.</div>
              회사는 전년도 4월부터 당해년도 3월까지 받으신 급여에 해당하는 퇴직금을 매년 4월에 퇴직연금(DB생명)에 납입하고 있습니다.
            </li>
            <li className="pb-40">
              <div className="text-underline pb-10">2. 확정기여형(DC형) 퇴직연금 전환 후 회사에서 불입한 퇴직연금액이며, 퇴직연금 운용에 따른 이자수익은 포함되지 않았습니다.</div>
            </li>
            <li>
              <div className="text-underline pb-10">3. 퇴직금은 퇴직 후 2주 이내에 개인별 퇴직연금계좌(IRP : Individual Retirement Pension)로 입금됩니다.</div>

              퇴직금은 본인 명의의 퇴직연금계좌로만 입금이 가능합니다.
              따라서, 퇴직시 반드시 개인별 퇴직연금계좌의 통장 사본을 제출하셔야 하면 제출이 늦어지면 퇴직금 입금이 늦어질 수 있습니다.
            </li>
          </ul>
        </div>
      }
    </>
  )
}