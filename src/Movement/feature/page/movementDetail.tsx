import React from "react";
import { Drawer, Descriptions, Divider, Typography, Row, Col, Space } from "antd";
import dayjs from "dayjs";
import { MovementType } from "@/Movement/model/moviment.model";

const { Title, Text } = Typography;

interface MovementDetailProps {
  visible: boolean;
  onClose: () => void;
  movement: MovementType | null;
}

export const MovementDetail: React.FC<MovementDetailProps> = ({ visible, onClose, movement }) => {
  if (!movement) return null;

  const vUnit = parseFloat(movement.valorUnit || "0");
  const vJuros = parseFloat(movement.valorJuros || "0");
  const totalParcela = vUnit + vJuros;
  const totalPendente = parseFloat(movement.valorTotalPendente || "0");

  const tipoParcelamento = 
    movement.tipoParcelamento === 1 ? "Parcelado" : 
    movement.tipoParcelamento === 2 ? "À Vista" : "PIX";

  return (
    <Drawer
      title={
        <Space direction="vertical" size={2}>
          <Text type="secondary" style={{ fontSize: "12px" }}>Detalhes da Movimentação</Text>
          <Title level={4} style={{ margin: 0 }}>#{movement.codMovimentacao} - {movement.descMovimento}</Title>
        </Space>
      }
      placement="right"
      width={window.innerWidth > 768 ? 600 : "100%"} 
      onClose={onClose}
      open={visible}
    >
      {/* SEÇÃO 1: FINANCEIRO */}
      <Divider orientation="left" style={{ marginTop: 0 }}>Valores e Custos</Divider>
      <Descriptions column={2} layout="vertical" bordered size="small">
        <Descriptions.Item label="Valor Unitário">
          <Text strong>R$ {vUnit.toFixed(2)}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Taxa de Juros (%)">
          <Text>{parseFloat(movement.porcJuros || "0")}%</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Valor do Juros">
          <Text type="danger">R$ {vJuros.toFixed(2)}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Total da Parcela Atual">
          <Text style={{ color: "#3f8600" }} strong>R$ {totalParcela.toFixed(2)}</Text>
        </Descriptions.Item>
      </Descriptions>

      {/* CRONOGRAMA DE PARCELAS */}
      <Divider orientation="left">Fluxo e Parcelamento</Divider>
      <Descriptions column={2} layout="vertical" bordered size="small">
        <Descriptions.Item label="Tipo de Fluxo">
          <Text strong>{tipoParcelamento}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Evolução das Parcelas">
          <Text strong>{movement.qtdParcAtual} de {movement.qtdParcFinal}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Parcelas Pendentes">
          <Text type={movement.qtdParcPendente > 0 ? "warning" : "secondary"}>
            {movement.qtdParcPendente} parcelas restantes
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="Saldo Devedor Pendente">
          <Text type="danger" strong>R$ {totalPendente.toFixed(2)}</Text>
        </Descriptions.Item>
      </Descriptions>

      {/* ENTIDADES E VÍNCULOS */}
      <Divider orientation="left">Vínculos e Origem</Divider>
      <Descriptions column={2} layout="vertical" bordered size="small">
        <Descriptions.Item label="Categoria">
          {movement.categoria?.descCategoria || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Conta Bancária">
          {movement.conta?.descConta ? `${movement.conta.descConta} (${movement.conta.tipoConta || ""})` : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Cartão de Crédito">
          {movement.cartao?.descCartao || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Forma de Pagamento">
          {movement.formaPagamento?.descFormPag || "-"}
        </Descriptions.Item>
      </Descriptions>

      {/* DATAS E AUDITORIA */}
      <Divider orientation="left">Linha do Tempo / Auditoria</Divider>
      <Descriptions column={1} layout="horizontal" bordered size="small">
        <Descriptions.Item label="Data da Movimentação">
          {movement.dataMov ? dayjs(movement.dataMov).format("DD/MM/YYYY") : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Data Final Prevista">
          {movement.dataFimMov ? dayjs(movement.dataFimMov).format("DD/MM/YYYY") : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Status Atual">
          <Text strong>{movement.status?.descStatus || "ABERTO"}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Data de Criação do Registro">
          {movement.dataCriacao ? dayjs(movement.dataCriacao).format("DD/MM/YYYY HH:mm:ss") : "-"}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};