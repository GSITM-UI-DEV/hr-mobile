import { axiosInstance } from "@/app/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { CertificatePrint } from "..";


// 증명서 조회
const fetchCertificatePrint = async (params: any): Promise<CertificatePrint[]> => {
	const { data } = await axiosInstance.get(`/one/picertprt/onepicertprt110?baseDateFrom=${params.baseDateFrom}&baseDateTo=${params.baseDateTo}&certiCodeKind=&emplNo=${params.emplNo}&emplNameHan=${params.emplNameHan}`);
	return data;
};
export const useCertificatePrint = (params: any) => {
	return useQuery<CertificatePrint[], Error>({
		queryKey: ['CertificatePrint', params],
		queryFn: () => fetchCertificatePrint(params),
		initialData: [],
		enabled: !!params.emplNo
	});
};