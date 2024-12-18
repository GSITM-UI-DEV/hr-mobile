import { axiosInstance } from "@/app/api/axiosInstance";
import { useQueries, useQuery } from "@tanstack/react-query";
import { PersonnelInfo, PersonnelInfoAcademic, PersonnelInfoDetail, PersonnelInfoItemCareer, PersonnelInfoItemFamily } from "..";


// 인사정보 메인 조회
const fetchPersonnelInfo = async (params: any): Promise<PersonnelInfo> => {
	const { data } = await axiosInstance.get(`/emp/psmstinforeq/emppsmstinforeq100/main?emplNo=${params.emplNo}`);
	return data;
};
export const usePersonnelInfo = (params: any) => {
	return useQuery<PersonnelInfo, Error>({
		queryKey: ['PersonnelInfo'],
		queryFn: () => fetchPersonnelInfo(params),
		initialData: Object,
		enabled: !!params.emplNo
	});
};

// 인사정보 상세 조회(주소, 학력, 경력, 가족)
const fetchPersonnelInfoDetail = async (params: any): Promise<PersonnelInfoDetail> => {
  const { data } = await axiosInstance.get(`/emp/psmstinforeq/emppsmstinforeq100/emppsmstinfo120/select?emplNo=${params.emplNo}`);
  return data;
};
const fetchPersonnelInfoAcademic = async (params: any): Promise<PersonnelInfoAcademic> => {
  const { data } = await axiosInstance.get(`/emp/psmstinforeq/emppsmstinforeq100/emppsmstinfo150/select?emplNo=${params.emplNo}`);
  return data;
};
const fetchPersonnelInfoItemCareer = async (params: any): Promise<PersonnelInfoItemCareer> => {
  const { data } = await axiosInstance.get(`/emp/psmstinforeq/emppsmstinforeq100/emppsmstinfo160/select?emplNo=${params.emplNo}`);
  return data;
};
const fetchPersonnelInfoItemFamily = async (params: any): Promise<PersonnelInfoItemFamily[]> => {
  const { data } = await axiosInstance.get(`/emp/psmstinforeq/emppsmstinforeq100/emppsmstinfo140/select?emplNo=${params.emplNo}`);
  return data;
};

export const usePersonnelInfoItem = (params: any) => {
  const results = useQueries({
    queries: [
      {
        queryKey: ["PersonnelInfoDetail", params] as const,
        queryFn: () => fetchPersonnelInfoDetail(params),
        initialData: Object,
        enabled: !!params.emplNo,
      },
      {
        queryKey: ["PersonnelInfoAcademic", params] as const,
        queryFn: () => fetchPersonnelInfoAcademic(params),
        initialData: Object,
        enabled: !!params.emplNo,
      },
      {
        queryKey: ["PersonnelInfoItemCareer", params] as const,
        queryFn: () => fetchPersonnelInfoItemCareer(params),
        initialData: Object,
        enabled: !!params.emplNo,
      },
      {
        queryKey: ["PersonnelInfoItemFamily", params] as const,
        queryFn: () => fetchPersonnelInfoItemFamily(params),
        initialData: [],
        enabled: !!params.emplNo,
      },
    ],
  });

  // 반환 타입 지정(react query v5...)
  return {
    personnelDetail: results[0]?.data as PersonnelInfoDetail | undefined,
    personnelAcademic: results[1]?.data as PersonnelInfoAcademic | undefined,
    personnelCareer: results[2]?.data as PersonnelInfoItemCareer | undefined,
    personnelFamily: results[3]?.data as PersonnelInfoItemFamily[] | undefined,
    isLoading: results.some((result) => result.isLoading),
    isError: results.some((result) => result.isError),
  };
};