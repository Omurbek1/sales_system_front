import { Table, Button, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Manager } from "@/types/manager";

interface Props {
  data: Manager[];
  onEdit: (manager: Manager) => void;
  onDelete: (id: string) => void;
}

const ManagerTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  const columns: ColumnsType<Manager> = [
    { title: "Имя", dataIndex: "name", key: "name" },
    { title: "Логин", dataIndex: "login", key: "login" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Дата", dataIndex: "createdAt", key: "createdAt" },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => onEdit(record)}>
            Редактировать
          </Button>
          <Button danger type="link" onClick={() => onDelete(record.id)}>
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  return <Table rowKey="id" columns={columns} dataSource={data} />;
};

export default ManagerTable;
