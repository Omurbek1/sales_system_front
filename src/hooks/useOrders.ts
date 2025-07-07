import { useQuery, useQueryClient } from "@tanstack/react-query";
import { mockOrders } from "@/utils/mockData";
import { Order } from "@/types/order";


export const fetchOrders = async (): Promise<Order[]> => {
  await new Promise((res) => setTimeout(res, 300));
  return mockOrders;
};

export const useOrders = () =>
  useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

 
