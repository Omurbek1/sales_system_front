"use client";
import { useManagers } from "@/hooks/useManagers";
import MainLayout from "@/components/layout/MainLayout";
import ManagerTable from "@/components/managers/ManagerTable";
import ManagerFormModal from "@/components/managers/ManagerFormModal";
import { Typography, Spin, Alert, Button, Space, message } from "antd";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Manager } from "@/types/manager";
import { v4 as uuidv4 } from "uuid";

const ManagersPage = () => {
  const { data, isLoading, error } = useManagers();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<Manager | null>(null);

  const handleAdd = () => {
    setEditingManager(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (formData: Omit<Manager, "id" | "createdAt">) => {
    const newManager: Manager = editingManager
      ? { ...editingManager, ...formData }
      : {
          id: uuidv4(),
          createdAt: new Date().toISOString().split("T")[0],
          ...formData,
        };

    const updatedList = editingManager
      ? data!.map((m) => (m.id === editingManager.id ? newManager : m))
      : [...(data ?? []), newManager];

    queryClient.setQueryData(["managers"], updatedList);
    message.success(editingManager ? "Менеджер обновлён" : "Менеджер добавлен");
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const filtered = data!.filter((m) => m.id !== id);
    queryClient.setQueryData(["managers"], filtered);
    message.success("Менеджер удалён");
  };

  return (
    <MainLayout>
      <Typography.Title level={2}>Менеджеры</Typography.Title>

      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>
          Добавить менеджера
        </Button>
      </Space>

      {isLoading && <Spin />}
      {error && <Alert type="error" message="Ошибка загрузки" />}
      {data && (
        <ManagerTable
          data={data}
          onEdit={(m) => {
            setEditingManager(m);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      <ManagerFormModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialValues={editingManager ?? undefined}
      />
    </MainLayout>
  );
};

export default ManagersPage;
