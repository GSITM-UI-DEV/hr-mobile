import { axiosInstance } from "@/app/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { EducationReport, EducationSurvey } from "..";

// const fetchEducation = async (params: any): Promise<Report[]> => {
//   // ?baseYear=2024&searchEmplNo=10006254&searchEmplNameHan=%EB%85%B8%ED%83%9C%EA%B7%9C&isAdmin=false
//   // baseYear
//   // searchEmplNo
//   // searchEmplNameHan
//   // isAdmin
// 	const { data } = await axiosInstance.get(`/edu/dbhedumt/edumt300?baseYear=2024&searchEmplNo=10006254&searchEmplNameHan=%EB%85%B8%ED%83%9C%EA%B7%9C&isAdmin=false`);
// 	return data;
// };

// export const useEducation = (params: any) => {
// 	return useQuery<Report[], Error>({
// 		queryKey: ['Report', params],
// 		queryFn: () => fetchEducation(params),
// 		initialData: [],
// 	});
// };

// 온라인 설문 조회
const fetchEducationSurvey = async (params: any): Promise<EducationSurvey[]> => {
	const { data } = await axiosInstance.get(`/edu/dbhedust/edust400?searchStartDate=${params.searchStartDate}&searchEndDate=${params.searchEndDate}&emplNo=${params.emplNo}&searchEmplNameHan=${params.searchEmplNameHan}&orgCode=&orgNameHan=`);
	return data;
};
export const useEducationSurvey = (params: any) => {
	return useQuery<EducationSurvey[], Error>({
		queryKey: ['EducationSurvey', params],
		queryFn: () => fetchEducationSurvey(params),
		initialData: [],
		enabled: !!params.searchStartDate && !!params.searchEndDate && !!params.emplNo && !!params.searchEmplNameHan
	});
};

// 다솜 월별 보고 조회
const fetchEducationReport = async (params: any): Promise<EducationReport[]> => {
	const { data } = await axiosInstance.get(`/edu/dbhedumt/edumt300?baseYear=${params.baseYear}&searchEmplNo=${params.searchEmplNo}&searchEmplNameHan=${params.searchEmplNameHan}&isAdmin=${params.isAdmin}`);
	return data;
};
export const useEducationReport = (params: any) => {
	return useQuery<EducationReport[], Error>({
		queryKey: ['EducationReport', params],
		queryFn: () => fetchEducationReport(params),
		initialData: [],
		enabled: !!params.baseYear
	});
};