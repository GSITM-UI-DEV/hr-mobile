import { UIAvatar, UIButton, UICheckbox } from "@/shared/ui"
import "./ApprovalLineList.scss";
import { useApprovalLine } from "@/entities/approvalLine";
import { useAuthStore } from "@/app/store/authStore";


export const ApprovalLineList = () => {
  const auth = useAuthStore((state) => state.auth);
  // const { data, isLoading, error } = useApprovalLine('', auth?.username);
  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Something went wrong!</p>;

  return (
    <>
      <div className="count__control">
        <div className="count">총 <em>3</em> 명</div>
        <div>
          <UIButton size="small" shape="square" type="secondary">추가</UIButton>
          <UIButton size="small" shape="square" type="secondary">삭제</UIButton>
          <UIButton type="border" size="small" shape="square" disabled>
            <div className="icon is-arrow__up"></div>
          </UIButton>
          <UIButton type="border" size="small" shape="square" disabled>
            <div className="icon is-arrow__down"></div>
          </UIButton>
        </div>
      </div>


      <div className="approval__line">
        <ul>
          <li>
            <strong>1차 결재자</strong>
            <div>
              <UICheckbox />
              <UIAvatar size="large" icon="none" src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop" fallback="이미지 로드 실패!" />
              <div>
                <div><span>박개발</span> 과장</div>
                <p>영업1팀</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  )
}