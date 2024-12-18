import { axiosInstance } from "@/app/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { Main } from "..";


// 복리후생 전체 조회
const fetchMain = async (): Promise<Main> => {
	const { data } = await axiosInstance.get(`/main/main/findLveStatus`);
	return data;
};
export const useMain = () => {
	return useQuery<Main, Error>({
		queryKey: ['WelfareStatus'],
		queryFn: fetchMain,
		initialData: Object,
	});
};