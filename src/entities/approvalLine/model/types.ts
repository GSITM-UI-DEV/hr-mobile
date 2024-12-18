export type ApprovalLine = {
  formId: string,
  orgNameHan: string,
  lvl: string,
  emplNo: string,
  positionNameHan: string,
  emplNameHan: string,
  aprvDepth: number,
  confirmSeqNo: string,
  aprvDate: string,
  coCode: string,
  orgCode: string,
  titleNameHan: string,
  aprvType: string,
  rank: number,
  confirmType: string,
}

export type ApprovalForm = {
  formId: string,
  aprvDepth: number,
  classCode: string,
  formFileName: string,
  coCode: string,
  effDateTo: string,
  formName: string,
  pgmId: string,
  effDateFrom: string,
  mblPgmId: string
}