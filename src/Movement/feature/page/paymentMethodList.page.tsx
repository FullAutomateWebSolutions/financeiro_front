import { useState } from "react";
import {
  Button,
  Space,
  Popconfirm,
  notification,
  Modal,
  Grid,
  Tag,
  List,
  Typography,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  DollarOutlined,
} from "@ant-design/icons";

import { usePaymentMethod } from "../../hook/usePaymentMethod";
import { PaymentMethod } from "../../model/moviment.model";
import { PaymentMethodForm } from "../form/paymentMethod.form";
import { FormEditing } from "../../../components/form/formConfig";
import { StandardTable } from "@/components/table/StandardTableSimples";

const { useBreakpoint } = Grid;
const { Text } = Typography;

export const PaymentMethodList = () => {
  const { listPaymentMethod, deletePaymentMethod } = usePaymentMethod();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<PaymentMethod | null>(null);
  const [formMode, setFormMode] = useState<FormEditing>("criar");

  const screens = useBreakpoint();
  const isMobile = screens.md === false;

  const { data: methods, isLoading } = listPaymentMethod({});

  const handleOpenForm = (mode: FormEditing, record: PaymentMethod | null = null) => {
    setFormMode(mode);
    setSelectedData(record);
    setIsModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsModalOpen(false);
    setSelectedData(null);
  };

  const handleDelete = (id: number) => {
    deletePaymentMethod.mutate({ id }, {
      onSuccess: () => {
        notification.success({ message: "Removida com sucesso!" });
      },
      onError: () => {
        notification.error({ message: "Erro para remover ainda esta sendo utilizado" });
      }
    });
  };

  const StatusTag = ({ active }: { active: boolean }) => (
    <Tag color={active ? "green" : "red"} style={{ margin: 0 }}>
      {active ? "Ativo" : "Inativo"}
    </Tag>
  );

  const columns = [
    { title: "Código", dataIndex: "codFormPag", key: "codFormPag", width: 100 },
    { title: "Tipo", dataIndex: "tipoFormPag", key: "tipoFormPag" },
    { title: "Descrição", dataIndex: "descFormPag", key: "descFormPag" },
    {
      title: "Status",
      dataIndex: "indAtivo",
      key: "indAtivo",
      width: 120,
      render: (ativo: boolean) => <StatusTag active={ativo} />,
    },
    {
      title: "Ações",
      key: "actions",
      width: 120,
      align: "center" as const,
      render: (_: any, record: PaymentMethod) => (
        <Space >
          <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenForm("editar", record)} />
          <Popconfirm title="Excluir este método?" onConfirm={() => handleDelete(record.codFormPag!)} okText="Sim" cancelText="Não">
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const safeMethods = Array.isArray(methods) ? methods : [];

  return (
    <div style={{ padding: isMobile ? "16px 8px" : "0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Typography.Title level={isMobile ? 4 : 3} style={{ margin: 0 }}>
          Formas de Pagamento
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenForm("criar")}>
          {!isMobile && "Nova Forma"}
        </Button>
      </div>

      {isMobile ? (
        <List
          loading={isLoading}
          itemLayout="horizontal"
          dataSource={safeMethods}
          renderItem={(item: PaymentMethod) => (
            <List.Item
              key={item.codFormPag}
              style={{ background: "#fff", padding: "12px 16px", marginBottom: 8, borderRadius: 8, border: "1px solid #f0f0f0" }}
              actions={[
                <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => handleOpenForm("editar", item)} />,
                <Popconfirm key="delete" title="Excluir?" onConfirm={() => handleDelete(item.codFormPag!)} okText="Sim" cancelText="Não">
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div style={{ background: "#f6ffed", padding: "8px", borderRadius: "50%", display: "flex", alignItems: "center" }}>
                    <DollarOutlined style={{ color: "#52c41a", fontSize: 18 }} />
                  </div>
                }
                title={
                  <Space align="center">
                    <span style={{ fontWeight: 600 }}>{item.descFormPag}</span>
                    <StatusTag active={!!item.indAtivo} />
                  </Space>
                }
                description={
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4 }}>
                    <Text type="secondary" ><b>Cód:</b> {item.codFormPag} | <b>Tipo:</b> {item.tipoFormPag}</Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <StandardTable dataSource={safeMethods} columns={columns} rowKey="codFormPag" loading={isLoading} />
      )}

      <Modal
        title={formMode === "criar" ? "Nova Forma de Pagamento" : "Editar Forma de Pagamento"}
        open={isModalOpen}
        onCancel={handleCloseForm}
        footer={null}
        destroyOnClose
        width={isMobile ? "100%" : 650}
        styles={{ body: { padding: isMobile ? "12px" : "24px" } }}
        centered={!isMobile}
      >
        <PaymentMethodForm formEditing={formMode} data={selectedData as any} onClose={handleCloseForm} />
      </Modal>
    </div>
  );
};