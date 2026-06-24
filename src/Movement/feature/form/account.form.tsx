import { useEffect, useMemo } from "react";
import { Button, Flex, Form, Input, notification, Space, Switch, Row, Col, Grid } from "antd";
import { FormEditing, FormConfig } from "../../../components/form/formConfig";

import { ApiValidationError } from "@/api/axios";
import dayjs from "dayjs";
import { Account } from "../../model/moviment.model";
import { useAccount } from "../../hook/useAccount";

const { useBreakpoint } = Grid;

interface AccountFormValues {
    formEditing: FormEditing;
    data: Account;
    onClose: () => void;
}

export const AccountForm = ({ formEditing, data, onClose }: AccountFormValues) => {
    const { saveAccount, fetchByIdAccount, updateAccount } = useAccount();
    const [form] = Form.useForm<Account>();
    
    const screens = useBreakpoint();
    const isMobile = screens.md === false;
    
    const formConfig = useMemo(() => { return new FormConfig({ formEditing }); }, [formEditing, data]);
    const formAccount = useMemo(() => { return new Account(); }, [formEditing, data]);
    
    const { data: accountData } = fetchByIdAccount(
        { id: data?.codConta },
        formConfig.isEdit() || formConfig.isView()
    );

    useEffect(() => {
        if (!accountData) return;

        Object.assign(formAccount, accountData);
        
        form.setFieldsValue({
            codConta: accountData.codConta,
            tipoConta: accountData.tipoConta,
            descConta: accountData.descConta,
            indAtivo: accountData.indAtivo,
            dataCriacao: accountData.dataCriacao,
            dataAtualizacao: accountData.dataAtualizacao
        });

    }, [accountData, form]);

    const handleSubmit = async (values: Account) => {
        const accountDataInstance = new Account();
        Object.assign(accountDataInstance, values);
        accountDataInstance.codConta = formAccount.codConta;

        const mutation = formConfig.isEdit() ? updateAccount : saveAccount;
        const successMessage = formConfig.isEdit() ? "Atualizado com sucesso!" : "Cadastrado com sucesso!";

        mutation.mutate(accountDataInstance, {
            onSuccess: (e: any) => {
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
                        <Col xs={24} md={10}>
                            <Form.Item 
                                label="Tipo de Conta" 
                                name="tipoConta"
                                rules={[{ required: true, message: "Informe o tipo de conta" }]}
                            >
                                <Input maxLength={50} />
                            </Form.Item>
                        </Col>
                        
                        <Col xs={24} md={10}>
                            <Form.Item 
                                label="Descrição da Conta" 
                                name="descConta"
                                rules={[{ required: true, message: "Informe a descrição" }]}
                            >
                                <Input maxLength={100} />
                            </Form.Item>
                        </Col>
                        
                        <Col xs={24} md={4}>
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
                            flexDirection: isMobile ? "row" : "row",
                            justifyContent: isMobile ? "stretch" : "flex-start" 
                        }}>
                            {!formConfig.isView() && (
                                <Button 
                                    htmlType="submit" 
                                    type="primary" 
                                    style={{ flex: isMobile ? 1 : "none" }}
                                // Tipo de Conta
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

                    {formConfig.isEdit() && formAccount.dataAtualizacao && (
                        <p style={{ color: 'gray', fontSize: '11px', textAlign: isMobile ? 'center' : 'left', margin: 0 }}>
                            Última modificação: {dayjs(formAccount.dataAtualizacao).format("DD/MM/YYYY HH:mm")}
                        </p>
                    )}
                </Form>
            </Flex>
        </div>
    );
};