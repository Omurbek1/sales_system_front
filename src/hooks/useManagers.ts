import { useQuery, useQueryClient } from "@tanstack/react-query";
import { mockManagers } from "@/utils/mockData";
import { Manager } from "@/types/manager";

export const fetchManagers = async (): Promise<Manager[]> => {
  await new Promise((res) => setTimeout(res, 300));
  return mockManagers;
};

export const useManagers = () =>
  useQuery({
    queryKey: ["managers"],
    queryFn: fetchManagers,
  });
