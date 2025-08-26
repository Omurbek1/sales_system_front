import { Table, Button, Dropdown, App } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Manager } from "@/types/manager";
import { EllipsisOutlined } from "@ant-design/icons";

interface Props {
  data: Manager[];
  onEdit: (manager: Manager) => void;
  onDelete: (id: string) => void;
}

const ManagerTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  const { message } = App.useApp();
  const columns: ColumnsType<Manager> = [
    { title: "Имя", dataIndex: "login", key: "login" },
    { title: "Телефон", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Дата", dataIndex: "createdAt", key: "createdAt" },
    {
      title: "Instagram",
      dataIndex: "instagramUsername",
      key: "instagramUsername",
      render: (username) =>
        username ? (
          <a
            href={`https://instagram.com/${username}`}
            target="_blank"
            rel="noreferrer"
          >
            @{username}
          </a>
        ) : (
          "—"
        ),
    },

    {
      title: "Действия",
      key: "actions",
      render: (_, record) => {
        const menu = {
          items: [
            {
              key: "edit",
              label: "Редактировать",
            },
            {
              key: "delete",
              label: "Удалить",
              danger: true,
            },
          ],
          onClick: async ({ key }: { key: string }) => {
            if (key === "edit") {
              onEdit(record);
            } else if (key === "delete") {
              try {
                await onDelete(record.id);
                message.success("Товар удалён!");
              } catch (err) {
                console.error(err);
                message.error("Ошибка при удалении товара");
              }
            }
          },
        };

        return (
          <Dropdown menu={menu} trigger={["click"]}>
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return <Table rowKey="id" columns={columns} dataSource={data} />;
};

export default ManagerTable;
