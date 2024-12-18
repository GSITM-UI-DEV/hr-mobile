import { axiosInstance } from "@/app/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { User } from "..";

const fetchUser = async (): Promise<User> => {
	const { data } = await axiosInstance.get("/api/user");
	return data;
};

export const useUser = () => {
	return useQuery<User, Error>({
		queryKey: ['user'],
		queryFn: fetchUser,
		initialData: Object,
	});
};