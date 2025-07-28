import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { type WithdrawalRequest, type WithdrawalResponse } from "@/types/setting";

export const withdrawUser = async (request: WithdrawalRequest): Promise<WithdrawalResponse> => {
  const response = await API.patch(API_ENDPOINTS.AUTH.INACTIVE, request);
  return response.data;
};
