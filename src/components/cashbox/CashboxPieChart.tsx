import { Pie } from "@ant-design/charts";
import { CashEntry } from "@/types/cashbox";

interface Props {
  data: CashEntry[];
}

const CashboxPieChart: React.FC<Props> = ({ data }) => {
  const grouped = data.reduce((acc, entry) => {
    const item = acc.find((i) => i.type === entry.source);
    if (item) item.amount += entry.amount;
    else acc.push({ type: entry.source, amount: entry.amount });
    return acc;
  }, [] as { type: string; amount: number }[]);

  return (
    <Pie
      data={grouped}
      angleField="amount"
      colorField="type"
      radius={0.8}
      label={{
        type: "inner",
        content: "{value}",
        style: { fontSize: 14 },
      }}
      height={300}
    />
  );
};

export default CashboxPieChart;
