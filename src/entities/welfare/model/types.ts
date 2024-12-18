// // 경조사
// export type RequestBody = {
//   zipCode?: string,
//   emplNo: string,
//   fixamtInd: string,
//   emplNameHan: string,
//   sendNameEtc: string,
//   acctDepositor: string,
//   acctNo: string,
//   sendNameCode: string,
//   flRecvDatetime: string,
//   docTitlNm: string,
//   reqEmplNo: string,
//   formId: string,
//   apprvDate: string,
//   reqRemark: string,
//   costCenter: string,
//   payRate: string,
//   indCode: string,
//   addrDtl1: string,
//   salaryAmt: string,
//   addrDtl2: string,
//   docNo: string,
//   payAmt: number,
//   addRegYn: string,
//   objNameHan: string,
//   cncCode: string,
//   depYn: string,
//   addRegEmplNo: string,
//   titleNameHan: string,
//   artmouInd: string,
//   createOrgNameHan: string,
//   leaveCnt: number,
//   createPositionNameHan: string,
//   eventDate: string,
//   mblPgmId: string,
//   statusCode: string,
//   orgNameHan: string,
//   remark: string,
//   positionNameHan: string,
//   pgmId: string,
//   atchFileId: string,
//   costName: string,
//   coCode: string,
//   outGbn: string,
//   relCode: string,
//   eventPlace: string,
//   placeHpNo: string,
//   createDate: string,
//   addRegEmplNameHan: string,
//   acctCode: string,
//   wreathInd: string,
//   createTitleNameHan: string,
//   supportInd: string,
//   bankCd: string,
//   reqEmplName: string,
//   saveFlag: string,
//   placeName: string,
//   reqstDate: string,
//   outNm: string,
// }



// export interface WelfareFund {
// 	emplNo: string,
// 	cncCode: string,
// 	relCode: string,
// 	eventDate: string,
// 	payAmt: number,
// 	leaveCnt: number,
// 	remark: string,
// }



// export interface WelfareApplyStatus {
// 	emplNo: string,
// 	yyMM: string
// }





// 복리후생 전체 조회
export interface WelfareStatus {
  // artmouInd: string,
	// leaveCnt: string,
	reqGbn: string,
	reqGbnNm: string,
	reqDate: string,
	aprDate: string,
	statusCode: string,
}



// 경조사
export interface WelfareFund {
	artmouInd: string,
	leaveCnt: number,
	payAmt: number,
	wreathInd: string,
	cncCode: string,
	relCode: string,
	eventDate: string,
	supportInd: string,
}

// 보험
export interface WelfareInsurance {
	baseYear: string,
	coCode: string,
	insGrpSeq: number,
	insName: string,
	insVouch: string,
}

// 학자금
export interface WelfareStudentLoan {
  loginUserId: any
  familyNameHan: any
	emplNo: string,
	resNoFamily: string,
	schoolCode: string,
	schoolNameHan: string,
	schoolCodeInd: string,
	semesterCode: string,
	reqAmt: number,
	payDate: string,
	atchFileId: string,
	relCode: string,
}
// const studentLoan: any = {
//   reqDate: '20241113',
//   payDate: '20241231',
//   reqSeqNo: '1',
//   resNoFamily: '1502022222222',
//   atchFileId: 'CrTqpgMkUV1eG7f5k4BnoJqflCSmSu',
//   shpayreq: {
//     schoolCodeInd: 'HS',
//     schoolKindCode: 'EN',
//     semesterCode: '1',
//     schoolNameHan: '대학교',
//     relCode: '21',
//     reqAmt: 300000,
//     payAmt: 300000,
//     schYear: '2',
//     reqCnt: '1/12',
//   },
//   shpayreqfileList: [
//     {
//       fileSeqNo: '1',
//       fileName: '(I&Inie.jpg',
//       fileSn: '7529254',
//       url: '',
//       atchFileId: 'CrTqpgMkUV1eG7f5k4BnoJqflCSmSu'
//     }
//   ]
// }