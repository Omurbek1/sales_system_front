import { Line } from "@ant-design/charts";
import { CashEntry } from "@/types/cashbox";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

interface Props {
  data: CashEntry[];
  groupBy: "day" | "week" | "month";
}

const CashboxChart: React.FC<Props> = ({ data, groupBy }) => {
  const grouped = data.reduce((acc, entry) => {
    let key: string;
    const date = dayjs(entry.date);

    if (groupBy === "week") {
      key = `${date.year()}-W${date.isoWeek()}`;
    } else if (groupBy === "month") {
      key = date.format("YYYY-MM");
    } else {
      key = date.format("YYYY-MM-DD");
    }

    const existing = acc.find((d) => d.label === key);
    if (existing) {
      existing.amount += entry.amount;
    } else {
      acc.push({ label: key, amount: entry.amount });
    }

    return acc;
  }, [] as { label: string; amount: number }[]);

  const sorted = grouped.sort((a, b) => a.label.localeCompare(b.label));

  return (
    <Line
      data={sorted}
      xField="label"
      yField="amount"
      point={{ size: 4 }}
      smooth
      height={300}
      xAxis={{
        title: {
          text:
            groupBy === "day"
              ? "День"
              : groupBy === "week"
              ? "Неделя"
              : "Месяц",
        },
      }}
      yAxis={{ title: { text: "Сумма" } }}
    />
  );
};

export default CashboxChart;
