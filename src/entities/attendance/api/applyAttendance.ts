// entities/api.ts
import axios from 'axios';
import { RequestPayload } from '..';
// features/hooks/useApprovalRequest.ts
import { useMutation } from '@tanstack/react-query';

// POST 요청 함수
const postApprovalRequest = async (data: RequestPayload) => {
  const response = await axios.post('/wrk/dbhabsappr/apprattc100', data);
  return response.data;
};

export const useApprovalRequest = () => {
  return useMutation<any, Error, RequestPayload>({mutationFn: postApprovalRequest});
};