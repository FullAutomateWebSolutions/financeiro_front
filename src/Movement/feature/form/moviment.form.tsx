import { useEffect, useMemo } from "react";
import { Button, Flex, Form, Input, InputNumber, notification, Switch, DatePicker, Row, Col, Select, Grid } from "antd";
import { FormEditing, FormConfig } from "../../../components/form/formConfig";

import { useMovement } from "../../hook/useMovement";
import { ApiValidationError } from "@/api/axios";
import dayjs from "dayjs";
import { MovementType, Movement } from "../../model/moviment.model";

// Hooks para alimentar os Selects
import { useAccount } from "@/Movement/hook/useAccount";
import { useCard } from "@/Movement/hook/useCard";
import { useCategory } from "@/Movement/hook/useCategory";
import { usePaymentMethod } from "@/Movement/hook/usePaymentMethod";
import { useStatus } from "@/Movement/hook/useStatus";

const { useBreakpoint } = Grid;

interface MovementFormValues {
    formEditing: FormEditing;
    data: MovementType;
    onClose: () => void;
}

export const MovementForm = ({ formEditing, data, onClose }: MovementFormValues) => {
    const { saveMovement, fetchByIdMovement, updateMovement } = useMovement();
    const { listAccount } = useAccount();
    const { listCard } = useCard();
    const { listStatus } = useStatus();
    const { listPaymentMethod } = usePaymentMethod();
    const { listCategory } = useCategory();

    const [form] = Form.useForm<any>(); 
    
    const screens = useBreakpoint();
    const isMobile = screens.md === false;
    
    const formConfig = useMemo(() => { return new FormConfig({ formEditing }); }, [formEditing, data]);
    const formMovement = useMemo(() => { return new Movement(); }, [formEditing, data]);
    
    const { data: movementData } = fetchByIdMovement(
        { id: data?.codMovimentacao },
        formConfig.isEdit() || formConfig.isView()
    );

    const accountQuery = listAccount ? listAccount({}) : { data: null, isLoading: false };
    const categoryQuery = listCategory ? listCategory({}) : { data: null, isLoading: false };
    const cardQuery = listCard ? listCard({}) : { data: null, isLoading: false };
    const paymentMethodQuery = listPaymentMethod ? listPaymentMethod({}) : { data: null, isLoading: false };
    const statusQuery = listStatus ? listStatus({}) : { data: null, isLoading: false };
    
    //@ts-ignore
    const accountsData = accountQuery.data?.content ?? accountQuery.data ?? [];
    //@ts-ignore
    const categoriesData = categoryQuery.data?.content ?? categoryQuery.data ?? [];
    //@ts-ignore
    const cardsData = cardQuery.data?.content ?? cardQuery.data ?? [];
    //@ts-ignore
    const paymentMethodsData = paymentMethodQuery.data?.content ?? paymentMethodQuery.data ?? [];
    //@ts-ignore
    const statusData = statusQuery.data?.content ?? statusQuery.data ?? [];

    useEffect(() => {
        if (!movementData) return;

        Object.assign(formMovement, movementData);
        
        form.setFieldsValue({
            codMovimentacao: movementData.codMovimentacao,
            descMovimento: movementData.descMovimento,
            valorUnit: movementData.valorUnit ? Number(movementData.valorUnit) : undefined,
            porcJuros: movementData.porcJuros ? Number(movementData.porcJuros) : undefined,
            valorJuros: movementData.valorJuros ? Number(movementData.valorJuros) : undefined,
            tipoParcelamento: movementData.tipoParcelamento,
            qtdParcAtual: movementData.qtdParcAtual,
            qtdParcFinal: movementData.qtdParcFinal,
            qtdParcPendente: movementData.qtdParcPendente,
            valorTotalPendente: movementData.valorTotalPendente,
            codFormPag: movementData.codFormPag,
            codConta: movementData.codConta,
            codStatus: movementData.codStatus,
            codCategoria: movementData.codCategoria,
            codCartao: movementData.codCartao,
            indAtivo: movementData.indAtivo,
            dataMov: movementData.dataMov ? dayjs(movementData.dataMov) : null,
        });

    }, [movementData, form]);

    const handleSubmit = async (values: any) => {
        const payload = {
            ...values,
            codMovimentacao: formMovement.codMovimentacao,
            dataMov: values.dataMov ? values.dataMov.toISOString() : undefined,
        };

        const mutation = formConfig.isEdit() ? updateMovement : saveMovement;
        const successMessage = formConfig.isEdit() ? "Atualizado com sucesso!" : "Cadastrado com sucesso!";

        mutation.mutate(payload, {
            onSuccess: (e) => {
                notification.success({ message: e?.message || successMessage });
                form.resetFields();
                onClose();
            },
            onError: (err: any) => {
                const response: ApiValidationError = err;
                if (!response?.errors) return;

                form.setFields(
                    response.errors.map((error: any) => ({
                        name: error.field,
                        errors: [error.message],
                    }))
                );
            }
        });
    };

    return (
        <div style={{ padding: isMobile ? "0 4px" : "0" }}>
            <Flex style={{ justifyContent: "center", marginBottom: 10, marginTop: 10 }}>
                <Form
                    disabled={formConfig.isView()}
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    style={{ 
                        width: "100%", 
                        maxWidth: 600 
                    }}
                >
                    <Row gutter={[16, 0]}>
                        <Col xs={24}>
                            <Form.Item 
                                label="Descrição do Movimento" 
                                name="descMovimento"
                                rules={[{ required: true, message: "Informe a descrição" }]}
                            >
                                <Input maxLength={150} />
                            </Form.Item>
                        </Col>
                        
                        <Col xs={24} sm={12}>
                            <Form.Item 
                                label="Valor Unitário" 
                                name="valorUnit"
                                rules={[{ required: true, message: "Informe o valor" }]}
                            >
                                <InputNumber style={{ width: '100%' }} placeholder="0.00" precision={2} step={0.01} />
                            </Form.Item>
                        </Col>
                        
                        <Col xs={24} sm={12}>
                            <Form.Item label="Data Movimento" name="dataMov">
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item label="Porcentagem Juros" name="porcJuros">
                                <InputNumber style={{ width: '100%' }} placeholder="0" precision={2} />
                            </Form.Item>
                        </Col>
                        
                        <Col xs={24} sm={12}>
                            <Form.Item label="Valor Juros" name="valorJuros">
                                <InputNumber style={{ width: '100%' }} placeholder="0.00" precision={2} disabled />
                            </Form.Item>
                        </Col>

                        <Col xs={12} sm={8}>
                            <Form.Item label="Parc. Atual" name="qtdParcAtual">
                                <InputNumber style={{ width: '100%' }} min={1} />
                            </Form.Item>
                        </Col>
                        
                        <Col xs={12} sm={8}>
                            <Form.Item label="Parc. Final" name="qtdParcFinal">
                                <InputNumber style={{ width: '100%' }} min={1} />
                            </Form.Item>
                        </Col>
                        
                        <Col xs={24} sm={8}>
                            <Form.Item label="Tipo Parcelamento" name="tipoParcelamento">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item label="Categoria" name="codCategoria">
                                <Select
                                    placeholder="Selecione a categoria"
                                    showSearch
                                    allowClear
                                    loading={categoryQuery.isLoading}
                                    optionFilterProp="children"
                                    options={categoriesData.map((cat: any) => ({
                                        value: cat.codCategoria,
                                        label: cat.descCategoria
                                    }))}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item label="Conta" name="codConta">
                                <Select
                                    placeholder="Selecione a conta"
                                    showSearch
                                    allowClear
                                    loading={accountQuery.isLoading}
                                    optionFilterProp="children"
                                    options={accountsData.map((acc: any) => ({
                                        value: acc.codConta,
                                        label: acc.descConta
                                    }))}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item label="Forma Pagamento" name="codFormPag">
                                <Select
                                    placeholder="Selecione a forma"
                                    showSearch
                                    allowClear
                                    loading={paymentMethodQuery.isLoading}
                                    optionFilterProp="children"
                                    options={paymentMethodsData.map((fp: any) => ({
                                        value: fp.codFormPag,
                                        label: fp.descFormPag
                                    }))}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item label="Cartão" name="codCartao">
                                <Select
                                    placeholder="Selecione o cartão"
                                    showSearch
                                    allowClear
                                    loading={cardQuery.isLoading}
                                    optionFilterProp="children"
                                    options={cardsData.map((card: any) => ({
                                        value: card.codCartao,
                                        label: card.descCard ?? card.nomeCard
                                    }))}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item label="Status" name="codStatus">
                                <Select
                                    placeholder="Selecione o status"
                                    showSearch
                                    allowClear
                                    loading={statusQuery.isLoading}
                                    optionFilterProp="children"
                                    options={statusData.map((st: any) => ({
                                        value: st.codStatus,
                                        label: st.descStatus
                                    }))}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item 
                                label="Ativo" 
                                name="indAtivo" 
                                valuePropName="checked"
                                style={{ 
                                    marginBottom: isMobile ? 24 : 0,
                                    display: isMobile ? "flex" : "block",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ marginTop: isMobile ? 16 : 24, marginBottom: 12 }}>
                        <div style={{ 
                            display: "flex", 
                            gap: "12px", 
                            justifyContent: isMobile ? "stretch" : "flex-start" 
                        }}>
                            {!formConfig.isView() && (
                                <Button 
                                    htmlType="submit" 
                                    type="primary" 
                                    style={{ flex: isMobile ? 1 : "none" }}
                                >
                                    Salvar
                                </Button>
                            )}
                            {!formConfig.isView() && (
                                <Button 
                                    htmlType="button" 
                                    type="dashed" 
                                    onClick={() => form.resetFields()}
                                    style={{ flex: isMobile ? 1 : "none" }}
                                >
                                    Limpar
                                </Button>
                            )}
                        </div>
                    </Form.Item>

                    {formConfig.isEdit() && formMovement.dataAtualizacao && (
                        <p style={{ color: 'gray', fontSize: '11px', textAlign: isMobile ? 'center' : 'left', margin: 0 }}>
                            Última modificação: {dayjs(formMovement.dataAtualizacao).format("DD/MM/YYYY HH:mm")}
                        </p>
                    )}
                </Form>
            </Flex>
        </div>
    );
};