// 공통 스타일
import "@/assets/styles/base/document/_reset.scss";
import "@/assets/styles/utilities/_helpers.scss";

// import { Theme } from "@radix-ui/themes";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";


// import LoginForm from "@/features/auth/LoginForm.tsx";
// import { LoginPage } from "@/pages/login";
// import { WelfarePage } from "@/pages/welfare";
// import './index.css';
import App from "./App.tsx";
import { AppProviders } from "./providers.tsx";

import { NotFound } from "@/pages/error";
import { LoginPage } from "@/pages/login";
import { TwoFactorPage } from "@/pages/twofactor";
import { UserPage } from "@/pages/user";




// 결재선(화면제공X)
import { ApprovalLinePage } from "@/pages/approvalLine";

// 근태
import {
	AttendanceAbsencePage,
	AttendanceApplyPage,
	AttendanceCancelPage,
	AttendanceChoosePlanPage,
	AttendanceHistoryPage,
	AttendanceScheduleMemberPage,
	AttendanceHourPage,
	AttendanceOvertimePage,
	AttendanceOverTimeCancelPage,
	AttendanceSchedulePage,
	AttendanceSwitchPage,
	AttendanceShiftPage,
	AttendanceListPage
} from "@/pages/attendance";

// 입퇴사
import {
	TenureAttachfilePage,
	TenureEcontractPage,
	TenureJoinApplyPage,
	TenureJoinInfoPage,
	TenureLeaveFlowPage,
	TenureLeaveResignationPage,
	TenureLeaveSurveyPage,
	TenurePage
} from "@/pages/tenure";

// 복리후생
import {
	WelfareFundPage,
	WelfareInsurancePage,
	WelfarePage,
	WelfareStudentLoanPage
} from "@/pages/welfare";

// 교육
import {
	EducationReportPage,
	EducationSurveyPage
} from "@/pages/education";

// 증명서
import {
	CertificateIssuePage,
	CertificatePrintPage
} from "@/pages/certificate";

// 급여
import {
	SalaryAnnualPage,
	SalaryHealthInsPage,
	SalaryIncomePage,
	SalaryPage,
	SalarySeverancePage,
	SalaryTaxPage
} from "@/pages/salary";

// 인사
import {
	PersonnelInfoPage,
	PersonnelInquirePage
} from "@/pages/personnel";

// 행정서비스
import {
	ComplaintApplyPage,
	ComplaintListPage
} from "@/pages/complaint";
import { AbsenceDetail } from "@/features/attendance/checkAbout/index.ts";
import { ProtectedRoute } from "./ProtectedRoute.tsx";
import { HourDetail } from "@/features/attendance/checkAbout/ui/HourDetail.tsx";
import { MainPage } from "@/pages/main/index.ts";
import { FlowDetail } from "@/features/tenure/leave/index.ts";





createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AppProviders>
			<BrowserRouter>
				<Routes>

					<Route path="/" element={<Navigate to="/login" replace />} />
					<Route path="/login" element={<LoginPage />} />
					<Route element={<ProtectedRoute />}>
						<Route path="/user" element={<UserPage />} />
						<Route path="/approval-line" element={<ApprovalLinePage />} />
						<Route path="/app-component" element={<App />} />


						{/* 앱 진입 */}
						<Route path="/twofactor" element={<TwoFactorPage />} />
						<Route path="/home" element={<MainPage />} />
						<Route path="/attendance/hour" element={<AttendanceHourPage />}>
							<Route path=":id" element={<HourDetail />} />
						</Route>
						<Route path="/attendance/schedule" element={<AttendanceSchedulePage />} />
						<Route path="/attendance/absence" element={<AttendanceAbsencePage />}>
							<Route path=":id" element={<AbsenceDetail />} />
						</Route>
						<Route path="/attendance/schedule-member" element={<AttendanceScheduleMemberPage />} />


						<Route path="/attendance/apply-list" element={<AttendanceListPage />} />
						<Route path="/attendance/apply" element={<AttendanceApplyPage />} />
						<Route path="/attendance/cancel" element={<AttendanceCancelPage />} />
						<Route path="/attendance/chooseplan" element={<AttendanceChoosePlanPage />} />
						<Route path="/attendance/switch" element={<AttendanceSwitchPage />} />
						<Route path="/attendance/history" element={<AttendanceHistoryPage />} />
						<Route path="/attendance/overtime" element={<AttendanceOvertimePage />} />
						<Route path="/attendance/overtime-cancel" element={<AttendanceOverTimeCancelPage />} />
						<Route path="/attendance/shift" element={<AttendanceShiftPage />} />


						<Route path="/welfare" element={<WelfarePage />} />
						<Route path="/welfare/fund" element={<WelfareFundPage />} />
						<Route path="/welfare/insurance" element={<WelfareInsurancePage />} />
						<Route path="/welfare/studentLoan" element={<WelfareStudentLoanPage />} />


						<Route path="/tenure" element={<TenurePage />} />
						<Route path="/tenure/join-apply" element={<TenureJoinApplyPage />} />
						<Route path="/tenure/attachfile" element={<TenureAttachfilePage />} />
						<Route path="/tenure/econtract" element={<TenureEcontractPage />} />
						<Route path="/tenure/join-info" element={<TenureJoinInfoPage />} />


						<Route path="/tenure/leave-flow" element={<TenureLeaveFlowPage />}>
							<Route path=":id" element={<FlowDetail />} />
						</Route>
						<Route path="/tenure/leave-resignation/:id" element={<TenureLeaveResignationPage />} />
						<Route path="/tenure/leave-survey/:id" element={<TenureLeaveSurveyPage />} />


						<Route path="/certificate/issue" element={<CertificateIssuePage />} />
						<Route path="/certificate/print" element={<CertificatePrintPage />} />


						<Route path="/personnel/info" element={<PersonnelInfoPage />} />
						<Route path="/personnel/inquire" element={<PersonnelInquirePage />} />


						<Route path="/complaint/apply" element={<ComplaintApplyPage />} />
						<Route path="/complaint/list" element={<ComplaintListPage />} />


						<Route path="/salary/salary" element={<SalaryPage />} />
						<Route path="/salary/annual" element={<SalaryAnnualPage />} />
						<Route path="/salary/income" element={<SalaryIncomePage />} />
						<Route path="/salary/severance" element={<SalarySeverancePage />} />
						<Route path="/salary/healthins" element={<SalaryHealthInsPage />} />
						<Route path="/salary/tax" element={<SalaryTaxPage />} />


						<Route path="/education/survey" element={<EducationSurveyPage />} />
						<Route path="/education/report" element={<EducationReportPage />} />
					</Route>

					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</AppProviders>
	</StrictMode>
);
