import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, Avatar, Space, Typography, Grid, Dropdown } from "antd";
import {
  DashboardOutlined,
  TransactionOutlined,
  UserAddOutlined,
  UserOutlined,
  UserSwitchOutlined,
  LogoutOutlined,
  SearchOutlined,
  EyeOutlined,
  GlobalOutlined,
  ApiOutlined,
  PlusOutlined,
  AppstoreOutlined,
  CodeOutlined,
  MenuOutlined
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import logo from "../../public/assets/Frame.svg";

const { Header, Content, Footer } = Layout;
const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

// --- CENTRALIZAÇÃO DE CORES (PALETA AZUL FAWS) ---
const COLORS = {
  primary: '#0052CC',       // Azul Principal (Faws)
  primaryLight: '#E6F0FF',  // Azul claro para destaques/avatares
  primaryDark: '#0747A6',   // Azul escuro para seleções activas
  bgLayout: '#F4F5F7',      // Cinza de fundo da página
  border: '#DFE1E6',        // Cor das bordas do topo/baixo
  textDark: '#172B4D',      // Texto principal
  textMuted: '#7A869A',     // Texto secundário / sub-labels
  danger: '#DE350B',        // Vermelho do logout
};

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState<string>("Usuário");
  const [userRole, setUserRole] = useState<string>("USER");
  const [activeMenuKey, setActiveMenuKey] = useState<string | null>("Dashboard"); 
  
  const screens = useBreakpoint();
  const isMobile = screens.lg === false; 
  const firstName = userName.split(" ")[0];

  useEffect(() => {
    const savedUser = localStorage.getItem("faws:user");
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        if (userObj && userObj.nome) {
          setUserName(userObj.nome);
        } else if (typeof userObj === "string") {
          setUserName(userObj);
        }
        if (userObj && userObj.role) {
          setUserRole(userObj.role.toUpperCase());
        }
      } catch {
        setUserName(savedUser);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
    setActiveMenuKey(null);
  };

  // --- MODELAGEM DOS SUBMENUS FLUTUANTES (PADRÃO DA IMAGEM) ---
  const menuIntegracoesSub = (mobile: boolean = false) => (
    <div style={{
      backgroundColor: '#fff',
      padding: mobile ? '20px 16px 24px 16px' : '24px 32px',
      borderRadius: mobile ? '16px 16px 0 0' : '0 0 12px 12px',
      boxShadow: mobile ? '0 -4px 16px rgba(0,0,0,0.1)' : '0 12px 24px rgba(0,0,0,0.08)',
      width: mobile ? '100vw' : '420px',
      borderTop: `1px solid ${COLORS.border}`,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {mobile && <div style={{ width: '40px', height: '4px', backgroundColor: COLORS.border, borderRadius: '2px', margin: '0 auto 16px auto' }} />}
      <Title level={5} style={{ fontSize: '14px', marginBottom: '16px', color: COLORS.textDark }}>Integrações</Title>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'space-around' }}>
        <div style={{ textAlign: 'center', cursor: 'pointer', flex: 1 }}>
          <Avatar size={44} style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }} icon={<PlusOutlined />} />
          <div style={{ marginTop: 8, fontSize: '11px', fontWeight: 500, color: COLORS.textDark, lineHeight: '13px' }}>Nova Integração</div>
        </div>
        <div style={{ textAlign: 'center', cursor: 'pointer', flex: 1 }}>
          <Avatar size={44} style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }} icon={<AppstoreOutlined />} />
          <div style={{ marginTop: 8, fontSize: '11px', fontWeight: 500, color: COLORS.textDark, lineHeight: '13px' }}>Minhas Opções</div>
        </div>
        <div style={{ textAlign: 'center', cursor: 'pointer', flex: 1 }}>
          <Avatar size={44} style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }} icon={<CodeOutlined />} />
          <div style={{ marginTop: 8, fontSize: '11px', fontWeight: 500, color: COLORS.textDark, lineHeight: '13px' }}>Portal do Dev</div>
        </div>
      </div>
    </div>
  );

  const baseMenuItems = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard", adminOnly: false },
    { key: "/movimentacao", icon: <TransactionOutlined />, label: "Movimentações", adminOnly: false },
    { key: "/cadastro", icon: <UserAddOutlined />, label: "Cadastros", adminOnly: false },
    { key: "/usuarios", icon: <UserOutlined />, label: "Gestão Usuários", adminOnly: true },
    { key: "/register", icon: <UserSwitchOutlined />, label: "Registrar Link", adminOnly: true },
    { key: "integrar", icon: <ApiOutlined />, label: "Integrar", adminOnly: false, hasDropdown: true }
  ];

  const allowedMenuItems = baseMenuItems.filter(item => !item.adminOnly || userRole === "ADMIN");

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: COLORS.bgLayout, paddingBottom: isMobile ? '60px' : 0 }}>
      
      {/* --- HEADER INTEGRADO RESPONSIVO --- */}
      <Header style={{ 
        backgroundColor: '#fff', 
        padding: isMobile ? '0 16px' : '0 40px', 
        height: 'auto', 
        lineHeight: 'normal',
        borderBottom: `1px solid ${COLORS.border}`,
        position: 'sticky', top: 0, zIndex: 1000
      }}>
        {isMobile ? (
          /* --- DESIGN HEADER MOBILE --- */
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <img src={logo} alt="Logo" width="22" height="22" />
                <span style={{ color: COLORS.primary, fontSize: '20px', fontWeight: '900', letterSpacing: '-0.5px' }}>FAWS</span>
              </div>
              <Space size="middle">
                <SearchOutlined style={{ fontSize: '18px', color: COLORS.textMuted }} />
                <EyeOutlined style={{ fontSize: '18px', color: COLORS.primary }} />
                <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: COLORS.bgLayout, color: COLORS.textMuted }} />
              </Space>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0 12px 0', borderTop: `1px solid ${COLORS.bgLayout}` }}>
              <div>
                <div style={{ fontSize: '10px', color: COLORS.textMuted }}>Olá, {firstName}</div>
                <div style={{ fontWeight: '700', color: COLORS.textDark, fontSize: '14px' }}>Painel Financeiro</div>
              </div>
              <Button type="primary" danger ghost size="small" icon={<LogoutOutlined />} onClick={handleLogout} />
            </div>
          </>
        ) : (
          /* --- DESIGN HEADER DESKTOP (IGUAL À IMAGEM) --- */
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
              {/* Logo / Brand */}
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img src={logo} alt="Logo FAWS" width="24" height="24" />
                  <span style={{ color: COLORS.primary, fontSize: '26px', fontWeight: '900', letterSpacing: '-1px' }}>FAWS</span>
                </div>
                <span style={{ color: COLORS.textMuted, fontSize: '11px', fontWeight: '500', paddingLeft: '32px', marginTop: '2px' }}>financeiro</span>
              </div>

              {/* Informações superiores direita */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                <Space size="large">
                  <SearchOutlined style={{ fontSize: '18px', color: COLORS.textMuted, cursor: 'pointer' }} />
                  <EyeOutlined style={{ fontSize: '18px', color: COLORS.primary, cursor: 'pointer' }} />
                  <div>
                    <div style={{ fontSize: '11px', color: COLORS.textMuted }}>Perfil ativo</div>
                    <div style={{ fontWeight: '700', color: COLORS.textDark, fontSize: '14px' }}>{firstName}</div>
                  </div>
                </Space>

                <div style={{ borderLeft: `1px solid ${COLORS.border}`, paddingLeft: '24px', height: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: '11px', color: COLORS.textMuted }}>Nível de Acesso</div>
                  <div style={{ fontWeight: '700', color: COLORS.textDark, fontSize: '12px' }}>{userRole}</div>
                </div>

                <Space size="middle" style={{ marginLeft: '12px' }}>
                  <Button size="small" icon={<LogoutOutlined style={{ color: COLORS.danger }} />} onClick={handleLogout} style={{ fontWeight: 500 }}>
                    Sair da conta
                  </Button>
                  <Avatar icon={<UserOutlined />} style={{ backgroundColor: COLORS.bgLayout, color: COLORS.textMuted }} />
                </Space>
              </div>
            </div>

            {/* Barra Inferior do Header: Menu de abas idêntico à foto */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flex: 1 }}>
                {allowedMenuItems.map((item) => {
                  const isRouteSelected = location.pathname === item.key;
                  const isDropdownActive = activeMenuKey === item.key;
                  const isSelected = isRouteSelected || isDropdownActive;

                  const tabContent = (
                    <div 
                      onClick={() => item.hasDropdown ? setActiveMenuKey(isDropdownActive ? null : item.key) : handleMenuClick(item.key)} 
                      style={{ 
                        padding: '14px 16px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        cursor: 'pointer', 
                        borderBottom: isSelected ? `3px solid ${COLORS.primary}` : '3px solid transparent', 
                        backgroundColor: isSelected ? COLORS.primaryLight : 'transparent', 
                        color: isSelected ? COLORS.primary : COLORS.textDark, 
                        minWidth: '100px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ fontSize: '16px', color: isSelected ? COLORS.primary : COLORS.textMuted }}>{item.icon}</span>
                      <span style={{ fontSize: '12px', fontWeight: isSelected ? '600' : '400', marginTop: '2px' }}>{item.label}</span>
                    </div>
                  );

                  return item.hasDropdown ? (
                    <Dropdown 
                      key={item.key} 
                      overlay={menuIntegracoesSub(false)} 
                      visible={isDropdownActive} 
                      trigger={['click']} 
                      placement="bottomLeft"
                      getPopupContainer={(trigger) => trigger.parentElement!}
                    >
                      {tabContent}
                    </Dropdown>
                  ) : <React.Fragment key={item.key}>{tabContent}</React.Fragment>;
                })}
              </div>
              <div style={{ color: COLORS.textMuted, fontSize: '12px', fontWeight: '500' }}>Sistema de Gestão Interna V 0.0.1</div>
            </div>
          </>
        )}
      </Header>

      {/* --- CONTEÚDO DINÂMICO DOS COMPONENTES (OUTLET) --- */}
      <Content style={{ padding: isMobile ? '16px' : '32px 40px', position: 'relative' }}>
        {/* Backdrop de isolamento caso o menu de integrações do desktop esteja expandido */}
        {!isMobile && activeMenuKey === 'integrar' && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(9, 30, 66, 0.12)', zIndex: 50, borderRadius: '8px' }} onClick={() => setActiveMenuKey(null)} />
        )}
        
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Outlet />
        </div>
      </Content>

      {/* --- MENU INFERIOR MOBILE (BOTTOM APP BAR) --- */}
      {isMobile && (
        <Footer style={{ 
          position: 'fixed', bottom: 0, left: 0, right: 0, height: '60px', 
          backgroundColor: '#fff', padding: 0, display: 'flex', alignItems: 'center', 
          justifyContent: 'space-around', borderTop: `1px solid ${COLORS.border}`, zIndex: 1100 
        }}>
          <div onClick={() => handleMenuClick("/dashboard")} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: location.pathname === "/dashboard" ? COLORS.primary : COLORS.textMuted }}>
            <DashboardOutlined style={{ fontSize: '18px' }} />
            <span style={{ fontSize: '10px', marginTop: '2px' }}>Início</span>
          </div>
          <div onClick={() => handleMenuClick("/movimentacao")} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: location.pathname === "/movimentacao" ? COLORS.primary : COLORS.textMuted }}>
            <TransactionOutlined style={{ fontSize: '18px' }} />
            <span style={{ fontSize: '10px', marginTop: '2px' }}>Ações</span>
          </div>
          
          {/* Item flutuante de Integrações com Dropdown fixo de Mobile */}
          <Dropdown overlay={menuIntegracoesSub(true)} visible={activeMenuKey === 'integrar'} trigger={['click']} placement="topCenter">
            <div onClick={() => setActiveMenuKey(activeMenuKey === 'integrar' ? null : 'integrar')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeMenuKey === 'integrar' ? COLORS.primary : COLORS.textMuted }}>
              <ApiOutlined style={{ fontSize: '18px' }} />
              <span style={{ fontSize: '10px', marginTop: '2px', fontWeight: activeMenuKey === 'integrar' ? '700' : '400' }}>Integrar</span>
            </div>
          </Dropdown>

          <div onClick={() => handleMenuClick("/cadastro")} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: location.pathname === "/cadastro" ? COLORS.primary : COLORS.textMuted }}>
            <UserAddOutlined style={{ fontSize: '18px' }} />
            <span style={{ fontSize: '10px', marginTop: '2px' }}>Cadastros</span>
          </div>
        </Footer>
      )}

    </Layout>
  );
};