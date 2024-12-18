import { useEducation } from "@/entities/education";
import { UICheckboxChips, UISelect } from "@/shared/ui";


export const Report = () => {
  // /edu/dbhedumt/edumt300
  const aa = {
    baseYear: '2024',
    searchEmplNo: '10006254',
    searchEmplNameHan: '%EB%85%B8%ED%83%9C%EA%B7%9C',
    isAdmin: false
  }


  const { data: educationData, isLoading: isEducationLoading, error: educationeError } = useEducation('');
  if (isEducationLoading) return <p>Loading...</p>;
  if (educationeError) return <p>Something went wrong!</p>;
  console.log(educationData)




  return (
    <>
      <div className="pt-10 pb-10">
        <UISelect label="조회연도" items={[]}/>
      </div>
      <div className="pt-10 pb-10">
        <UICheckboxChips
          name="checkbox_chips"
          items={[
            { label: "label 2", value: "value2" },
            { label: "label 3", value: "value3" },
          ]}
        />
      </div>
      <div className="pt-10 pb-10">
        <div className="count__control">
          <div className="count">총 <em>3</em> 명</div>
        </div>
      </div>
    </>
  )
}