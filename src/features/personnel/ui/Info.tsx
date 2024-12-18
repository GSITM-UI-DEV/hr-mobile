import { useBaseCode } from "@/entities/approvalLine";
import { usePersonnelInfo, usePersonnelInfoItem } from "@/entities/personnel";
import { useUser } from "@/entities/user/api/useUser";
import { UIAvatar } from "@/shared/ui";


export const Info = () => {
  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
	if (isUserLoading) return <p>Loading...</p>;
	if (userError) return <p>Something went wrong!</p>;

  const { data: personnelInfoData, isLoading: isPersonnelInfoLoading, error: personnelInfoError } = usePersonnelInfo({ emplNo: userData.loginUserId });
	if (isPersonnelInfoLoading) return <p>Loading...</p>;
	if (personnelInfoError) return <p>Something went wrong!</p>;

  const {
    personnelDetail,
    personnelAcademic,
    personnelCareer,
    personnelFamily,
    isLoading,
    isError
  } = usePersonnelInfoItem({ emplNo: userData.loginUserId });

  const parameters = {
    baseCodList: [
      { "patternCode": "PS22", "effDateYn": true, "companyYn": true },
      { "patternCode": "SH40", "effDateYn": true, "companyYn": false },
      { "patternCode": "EDU14", "effDateYn": true, "companyYn": false },
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
  const famCodeData = codeData[0];
  const schoolCodeData = codeData[1];
  const majorCodeData = codeData[2];
  const findMatchingCode = (data: any, value: any) => {
    const matchingCode = data?.find((code: any) => code.codeKey === value); 
    return matchingCode ? matchingCode.codeName : null;
  };


  return (
    <>
      <div className="pt-10 pb-10">
        <div className="box">
          <div className="title">
            <div className="title__image">
              <UIAvatar size="large" src={'/files/'+userData.photoFileId+'/'+userData.fileSn+'/download'} fallback="/avatar.svg" />
            </div>
            <div className="title__name">
              <span>{personnelInfoData.emplNameHan}</span>
              <span>{personnelInfoData.emplNameEng}</span>
              <span>{personnelInfoData.emplNameChn}</span>
            </div>
          </div>
          <div className="content">
            <div className="info">
              <span>생년월일</span>
              <span>{personnelInfoData.birthDate}</span>
            </div>
            <div className="info">
              <span>실본부</span>
              <span>{personnelInfoData.rootOrgNameHan}</span>
            </div>
            <div className="info">
              <span>직책</span>
              <span>{personnelInfoData.titleNameHan}</span>
            </div>
            <div className="info">
              <span>직군</span>
              <span>{personnelInfoData.jobGroupHan}</span>
            </div>
            <div className="info">
              <span>직무</span>
              <span>{personnelInfoData.jobNameHan}</span>
            </div>
            <div className="info">
              <span>부서</span>
              <span>{personnelInfoData.orgNameHan}</span>
            </div>
            <div className="info">
              <span>직위</span>
              <span>{personnelInfoData.positionNameHan}</span>
            </div>
            <div className="info">
              <span>직급</span>
              <span>{personnelInfoData.gradeNameHan}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-10 pb-10">
        <div className="card">
          <div className="title">주소/연락처</div>
          <div className="content">
            <div className="detail justify-content-between">
              <span className="detail__label">우편번호</span>
              <span className="detail__data">{personnelDetail?.resiplaceZip}</span>
            </div>
            <div className="detail justify-content-between">
              <span className="detail__label">주소</span>
              <span className="detail__data">{personnelDetail?.resiplaceAddr}</span>
            </div>
            <div className="detail justify-content-between">
              <span className="detail__label">휴대폰</span>
              <span className="detail__data">{personnelDetail?.cellularTel}</span>
            </div>
            <div className="detail justify-content-between">
              <span className="detail__label">비상연락처</span>
              <span className="detail__data">{personnelDetail?.emergencyTel}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-10 pb-10">
        <div className="card">
          <div className="title">최종학력</div>
          {personnelAcademic?.psschoolList && personnelAcademic?.psschoolList.map((item, index) =>
            index === 0 &&
            <div key={index}>
              <div className="content" >
                <div className="detail justify-content-between">
                  <span className="detail__label">졸업연도</span>
                  <span className="detail__data">{item.entranceDate}</span>
                </div>
              </div>
              <div className="content">
                <div className="detail justify-content-between">
                  <span className="detail__label">학교명(코드)</span>
                  <span className="detail__data">{findMatchingCode(schoolCodeData, item.schoolName)}</span>
                </div>
              </div>
              <div className="content">
                <div className="detail justify-content-between">
                  <span className="detail__label">전공(코드)</span>
                  <span className="detail__data">{findMatchingCode(majorCodeData, item.majorCode)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="pt-10 pb-10">
        <div className="card">
          <div className="title">최종경력</div>
          {personnelCareer?.psexprList && personnelCareer?.psexprList.map((item, index) =>
            index === 0 &&
            <div key={index}>
              <div className="content" >
                <div className="detail justify-content-between">
                  <span className="detail__label">회사명</span>
                  <span className="detail__data">{item.workplaceName}</span>
                </div>
              </div>
              <div className="content">
                <div className="detail justify-content-between">
                  <span className="detail__label">직위</span>
                  <span className="detail__data">{item.gradeNameHan}</span>
                </div>
              </div>
              <div className="content">
                <div className="detail justify-content-between">
                  <span className="detail__label">부서명</span>
                  <span className="detail__data">{item.jobkindNameHan}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-10 pb-10">
        <div className="card">
          <div className="title">가족</div>
          {personnelFamily?.map((item, index) =>
            <div key={index}>
              <div className="content">
                <div className="detail justify-content-between">
                  <span className="detail__label">{findMatchingCode(famCodeData, item.relCode)}</span>
                  <span className="detail__data">{item.familyNameHan}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}