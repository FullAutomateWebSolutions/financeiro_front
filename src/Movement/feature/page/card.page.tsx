import { useState } from "react";
import dayjs from "dayjs";
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
  CreditCardOutlined,
} from "@ant-design/icons";

import { useCard } from "../../hook/useCard";
import { Card as CardModel } from "../../model/moviment.model";
import { CardForm } from "../form/card.form";
import { FormEditing } from "../../../components/form/formConfig";
import { StandardTable } from "@/components/table/StandardTableSimples";

const { useBreakpoint } = Grid;
const { Text } = Typography;

export const CardList = () => {
  const { listCard, deleteCard } = useCard();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<CardModel | null>(null);
  const [formMode, setFormMode] = useState<FormEditing>("criar");

  const screens = useBreakpoint();
  const isMobile = screens.md === false;

  const { data: cards, isLoading } = listCard({});

  const handleOpenForm = (
    mode: FormEditing,
    record: CardModel | null = null
  ) => {
    setFormMode(mode);
    setSelectedData(record);
    setIsModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsModalOpen(false);
    setSelectedData(null);
  };

  const handleDelete = (id: number) => {
    deleteCard.mutate({ id }, {
      onSuccess: () => {
        notification.success({ message: "Cartão removida com sucesso!" });
      },
      onError: () => {
        notification.error({ message: "Erro ao remover Cartão." });
      }
    });
  };

  const formatDate = (date: string | undefined) =>
    date ? dayjs(date).format("DD/MM/YYYY") : "-";

  const StatusTag = ({ active }: { active: boolean }) => (
    <Tag color={active ? "green" : "red"} style={{ margin: 0 }}>
      {active ? "Ativo" : "Inativo"}
    </Tag>
  );

  // Colunas para Desktop
  const columns = [
    { title: "Código", dataIndex: "codCartao", key: "codCartao", width: 100 },
    { title: "Tipo", dataIndex: "tipoCartao", key: "tipoCartao" },
    { title: "Descrição", dataIndex: "descCartao", key: "descCartao" },
    {
      title: "Status",
      dataIndex: "indAtivo",
      key: "indAtivo",
      render: (ativo: boolean) => <StatusTag active={ativo} />,
    },
    {
      title: "Data Criação",
      dataIndex: "dataCriacao",
      key: "dataCriacao",
      align: "center" as const,
      render: formatDate,
    },
    {
      title: "Data Atualização",
      dataIndex: "dataAtualizacao",
      key: "dataAtualizacao",
      align: "center" as const,
      render: formatDate,
    },
    {
      title: "Ações",
      key: "actions",
      width: 120,
      align: "center" as const,
      render: (_: any, record: CardModel) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenForm("editar", record)}
          />
          <Popconfirm
            title="Excluir este cartão?"
            onConfirm={() => handleDelete(record.codCartao!)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const safeCards = Array.isArray(cards) ? cards : [];

  return (
    // Removemos o Card externo se estiver no mobile para ganhar espaço de borda na tela do celular
    <div style={{ padding: isMobile ? "16px 8px" : "0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Typography.Title level={isMobile ? 4 : 3} style={{ margin: 0 }}>
          Listagem de Cartões
        </Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenForm("criar")}
        >
          {!isMobile && "Novo Cartão"}
        </Button>
      </div>

      {isMobile ? (
        <List
          loading={isLoading}
          itemLayout="horizontal"
          dataSource={safeCards}
          renderItem={(item: CardModel) => (
            <List.Item
              key={item.codCartao}
              style={{
                background: "#fff",
                padding: "12px 16px",
                marginBottom: 8,
                borderRadius: 8,
                border: "1px solid #f0f0f0",
              }}
              actions={[
                <Button
                  key="edit"
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleOpenForm("editar", item)}
                />,
                <Popconfirm
                  key="delete"
                  title="Excluir?"
                  onConfirm={() => handleDelete(item.codCartao!)}
                  okText="Sim"
                  cancelText="Não"
                >
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div
                    style={{
                      background: "#e6f7ff",
                      padding: "8px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CreditCardOutlined style={{ color: "#1890ff", fontSize: 18 }} />
                  </div>
                }
                title={
                  <Space size="small" align="center">
                    <span style={{ fontWeight: 600 }}>{item.descCartao}</span>
                    <StatusTag active={!!item.indAtivo} />
                  </Space>
                }
                description={
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4 }}>
                    <Text type="secondary" >
                      <b>Cód:</b> {item.codCartao} | <b>Tipo:</b> {item.tipoCartao}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      Criado em: {formatDate(item.dataCriacao)}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <StandardTable
          dataSource={safeCards}
          columns={columns}
          rowKey="codCartao"
          loading={isLoading}
        />
      )}

      <Modal
        title={formMode === "criar" ? "Novo Cartão" : "Editar Cartão"}
        open={isModalOpen}
        onCancel={handleCloseForm}
        footer={null}
        destroyOnClose
        width={isMobile ? "100%" : 650}
        styles={{ body: { padding: isMobile ? "12px" : "24px" } }}
        centered={!isMobile}
      >
        <CardForm
          formEditing={formMode}
          data={selectedData as any}
          onClose={handleCloseForm}
        />
      </Modal>
    </div>
  );
};