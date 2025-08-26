"use client";

import {
  useManagers,
  useCreateManager,
  useUpdateManager,
  useDeleteManager,
} from "@/hooks/managers";
import MainLayout from "@/components/layout/MainLayout";
import ManagerTable from "@/components/managers/ManagerTable";
import ManagerFormModal from "@/components/managers/ManagerFormModal";
import { Typography, Spin, Alert, Button, Space, App } from "antd";
import { useState } from "react";
import type { Manager } from "@/types/manager";

const ManagersPage = () => {
  const { data, isLoading, error } = useManagers();
    const { message } = App.useApp();

  // мутации dev/prod — одинаковый интерфейс
  const createManager = useCreateManager();
  const updateManager = useUpdateManager();
  const deleteManager = useDeleteManager();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<Manager | null>(null);

  const handleAdd = () => {
    setEditingManager(null);
    setIsModalOpen(true);
  };

  // formData НЕ содержит id/createdAt — их даст бэк (prod) или dev-хук
  const handleSubmit = async (formData: Omit<Manager, "id" | "createdAt">) => {
    try {
      if (editingManager) {
        await updateManager.mutateAsync({ ...editingManager, ...formData });
        message.success("Менеджер обновлён");
      } else {
        await createManager.mutateAsync(formData);
        message.success("Менеджер добавлен");
      }
      setIsModalOpen(false);
      setEditingManager(null);
    } catch (e: any) {
      message.error(e?.message || "Ошибка сохранения");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteManager.mutateAsync(id);
      message.success("Менеджер удалён");
    } catch (e: any) {
      message.error(e?.message || "Ошибка удаления");
    }
  };

  const anyLoading =
    isLoading ||
    createManager.isPending ||
    updateManager.isPending ||
    deleteManager.isPending;

  return (
    <MainLayout>
      <Typography.Title level={2}>Менеджеры</Typography.Title>

      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={handleAdd}
          loading={createManager.isPending}
        >
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
        onCancel={() => {
          setIsModalOpen(false);
          setEditingManager(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editingManager ?? undefined}
      />

      {anyLoading && null}
    </MainLayout>
  );
};

export default ManagersPage;
