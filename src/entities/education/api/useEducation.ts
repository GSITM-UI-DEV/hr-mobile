import { axiosInstance } from "@/app/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { Report, Survey } from "..";

const fetchEducation = async (params: any): Promise<Report[]> => {
  // ?baseYear=2024&searchEmplNo=10006254&searchEmplNameHan=%EB%85%B8%ED%83%9C%EA%B7%9C&isAdmin=false
  // baseYear
  // searchEmplNo
  // searchEmplNameHan
  // isAdmin
	const { data } = await axiosInstance.get(`/edu/dbhedumt/edumt300?baseYear=2024&searchEmplNo=10006254&searchEmplNameHan=%EB%85%B8%ED%83%9C%EA%B7%9C&isAdmin=false`);
	return data;
};

export const useEducation = (params: any) => {
	return useQuery<Report[], Error>({
		queryKey: ['Report', params],
		queryFn: () => fetchEducation(params),
		initialData: [],
	});
};