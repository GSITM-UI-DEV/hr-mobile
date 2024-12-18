import { useState } from 'react'
import './ApplyAction.scss'
import { UIButton } from "@/shared/ui"
import { applyFund } from '..';
import { axiosInstance } from '@/app/api/axiosInstance';



export const ApplyAction = (props: any) => {
  // const aa = applyFund();
  const [ required, setRequired ] = useState<boolean>(false);

  
  const handleSave = async () => {
    console.log(props);
  }

  const formData = props.formData;
  const handleApply = async (formData: any) => {
    console.log(formData);
    // const { data } = await axiosInstance.post('/wlf/wlfstuapply/wlfstuapply111/req', props.data)
    // console.log(data);
  }

  return (
    <div className="applyAction">
      <UIButton type="border" onClick={handleSave}>임시저장</UIButton>
      {/* <UIButton type="primary" disabled={required}  onClick={handleApply}>결재요청</UIButton> */}
    </div>
  )
}