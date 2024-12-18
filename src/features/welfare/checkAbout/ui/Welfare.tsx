import { useWelfare } from "@/entities/welfare/api/useWelfare";
import { UIDatePicker, UISelect } from "@/shared/ui";


export const Welfare = () => {
  const { data, isLoading, error } = useWelfare();
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;
  console.log(data);

  
  return (
    <>
      <div className="pt-10 pb-10">
        <UIDatePicker label="조회기간" type="range" />
        <UISelect label="조회월" items={[
          { label: "경조사", error: false },
          { label: "학자금", error: false },
          { label: "상해보험", error: false },
        ]}/>
      </div>
      <div>
        <UISelect label="신청구분" items={[
          { label: "경조사", error: false },
          { label: "학자금", error: false },
          { label: "상해보험", error: false },
        ]}/>
      </div>
    </>
  )
}