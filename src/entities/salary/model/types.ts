export interface Salary {
  payNameEnv: string,
  paySeqNo: number,
  dedAmt: number,
  baseYear: string,
  incomeAmt: number,
  emplNo: string,
  emplNameHan: string,
  sumAmt: number,
  payDate: string
}
export interface SalaryDetail {
  printNm: string,
  adjDate: string,
  tlevel: string,
  dtlCnt: number,
  displayOrder: number,
  incomeAmt: number,
  payCode: string
}
export interface SalaryDeduct {
  adjDate: string,
  tlevel: string,
  dtlCnt: number,
  dedAmt: number,
  displayOrder: number,
  payNameHan: string,
  payCode: string
}

export interface SalaryAnnual {
  
}

export interface SalaryHealthIns {
  
}

export interface SalaryIncome {
  
}

export interface SalaryTaxPage {
  
}


export interface SalarySeveranceReckon {
  reckon: string;
}


interface PrrtappropDcList {
  workPeriod: string,
  effDateYm: string,
  payAmt: string,
}

interface prrtappropDbList {
  workPeriod: string,
  effDateYm: string,
  payAmt: string,
}
export interface SalarySeverance {
  loginUserNm: string;
  prrtappropDcList: PrrtappropDcList[];
  prrtappropDbList: prrtappropDbList[];
}