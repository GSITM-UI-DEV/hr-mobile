import { useMain } from "@/entities/main";
import { UIButton } from "@/shared/ui"


export const Main = () => {

  const { data: mainData, isLoading: isMainLoading, error: mainError } = useMain();
	if (isMainLoading) return <p>Loading...</p>;
	if (mainError) return <p>Error: {mainError.message}</p>;


  return (
    <>
      <div className="text-center pt-124 pb-40">
				<img src="/logo_hitek.svg" />
			</div>
      <div className="text-center pt-10 pb-10 fs-18">
        <strong>{mainData.loginUserNm}</strong>님, 안녕하세요.
      </div>
      <div className="pt-30 pb-120 fs-16">
        <h3 className="main__card__title">연차현황</h3>
        <div className="main__card gap-10">
          <div>
            {/* <span className="icon has-bg-svg is-calendar is-get mr-4"></span> */}
            부여
            <p>{Math.floor(mainData.lveDays)} 일</p>
            <p>{(mainData.lveDays % 1)} 시간</p>
          </div>
          <div>
            {/* <span className="icon has-bg-svg is-calendar is-get mr-4"></span> */}
            사용
            <p>{Math.floor(mainData.useDays)} 일</p>
            <p>{(mainData.useDays % 1) * 8} 시간</p>
          </div>
          <div>
            {/* <span className="icon has-bg-svg is-calendar is-get mr-4"></span> */}
            잔여
            <p>{Math.floor(mainData.remindDays)} 일</p>
            <p>{(mainData.remindDays % 1) * 8} 시간</p>
          </div>
          <div>
            {/* <span className="icon has-bg-svg is-calendar is-get mr-4"></span> */}
            기타
            <p>{Math.floor(mainData.etcDays)} 일</p>
            <p>{(mainData.etcDays % 1) * 8} 시간</p>
          </div>
        </div>
        
      </div>
      <div className="pt-10 pb-10">
        <a href="https://drms.dbhitek.com/" target="_blank">
          <UIButton type="primary">다붓</UIButton>
        </a>
      </div>
      <div className="pt-10 pb-10">
        <a href="https://ims.dbhitek.com/" target="_blank">
          <UIButton type="primary">통합관리시스템</UIButton>
        </a>
      </div>
    </>
  )
}