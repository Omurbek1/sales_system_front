import { Modal, Form, InputNumber, Select, DatePicker } from "antd";
import { PaymentSource } from "@/types/cashbox";
import dayjs from "dayjs";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    amount: number;
    source: PaymentSource;
    date: string;
  }) => void;
  defaultDate: dayjs.Dayjs;
}

const sourceOptions: PaymentSource[] = ["в наличии", "в рассрочку", "на заказ"];

const CashboxAddModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  defaultDate,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Добавить поступление"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{ date: defaultDate }}
      >
        <Form.Item name="amount" label="Сумма" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="source"
          label="Источник оплаты"
          rules={[{ required: true }]}
        >
          <Select
            options={sourceOptions.map((s) => ({ value: s, label: s }))}
          />
        </Form.Item>
        <Form.Item name="date" label="Дата" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CashboxAddModal;
