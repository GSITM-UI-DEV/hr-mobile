import { axiosInstance } from "@/app/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";



// 입퇴사 신청
const createFund = async (): Promise<{}> => {
	const { data } = await axiosInstance.post("/",
		{},
	);
	return data;
};
export const applyFund = () => {
	return useQuery<{}, Error>({
		queryKey: ['WelfareFund'],
		queryFn: createFund,
		initialData: Object,
	});
};