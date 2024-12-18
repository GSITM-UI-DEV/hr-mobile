import { ApprovalLineChange, ApprovalLineList } from "@/features/approvalLine"

export const ApprovalLinePage = () => {
  return (
    <>
      <ApprovalLineList />
      <ApprovalLineChange />
    </>
  )
}