// import { axiosInstance } from "@/app/api/axiosInstance";
// import { useQuery } from "@tanstack/react-query";
// import { Menu } from "..";

// const fetchMenu = async (): Promise<Menu> => {
// 	const { data } = await axiosInstance.get("/api/menus/side");
// 	return data;
// };

// export const useMenu = () => {
// 	return useQuery<Menu, Error>({
// 		queryKey: ['menu'],
// 		queryFn: fetchMenu,
// 		initialData: Object,
// 	});
// };