import { useQuery } from "@tanstack/react-query";
import { mockCashbox } from "@/utils/mockData";
import { CashEntry } from "@/types/cashbox";

export const useCashbox = () => {
  return useQuery<CashEntry[]>({
    queryKey: ["cashbox"],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 300));
      return mockCashbox;
    },
  });
};
