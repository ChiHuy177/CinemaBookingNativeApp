import { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, ConfigProvider, theme } from 'antd';
import type { MenuProps } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  VideoCameraOutlined,
  TagsOutlined,
  ShoppingOutlined,
  ShopOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import MovieList from './components/MovieList';
import GenreList from './components/GenreList';
import ComboList from './components/ComboList';
import CinemaList from './components/CinemaList';
import TicketList from './components/TicketList';
import Login from './components/Login';
import Register from './components/Register';
import { authService } from './services/authService';
import './App.css';

const { Header, Content } = Layout;

type View = 'login' | 'register' | 'movies' | 'genres' | 'combos' | 'cinemas' | 'tickets';

function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const authenticated = authService.isAuthenticated();
    const email = authService.getCurrentUserEmail();

    if (authenticated && email) {
      setIsAuthenticated(true);
      setUserEmail(email);
      setCurrentView('movies');
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setUserEmail(authService.getCurrentUserEmail());
    setCurrentView('movies');
  };

  const handleRegisterSuccess = () => {
    setCurrentView('login');
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserEmail(null);
    setCurrentView('login');
  };

  const handleSwitchToRegister = () => {
    setCurrentView('register');
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  const isAuthenticatedView = currentView !== 'login' && currentView !== 'register';

  const menuItems: MenuProps['items'] = [
    {
      key: 'movies',
      icon: <VideoCameraOutlined />,
      label: 'Phim',
    },
    {
      key: 'genres',
      icon: <TagsOutlined />,
      label: 'Thể loại',
    },
    {
      key: 'combos',
      icon: <ShoppingOutlined />,
      label: 'Combo',
    },
    {
      key: 'cinemas',
      icon: <ShopOutlined />,
      label: 'Rạp chiếu',
    },
    {
      key: 'tickets',
      icon: <FileTextOutlined />,
      label: 'Vé của tôi',
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setCurrentView(e.key as View);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#FF5757',
          colorBgBase: '#1C1C2E',
          colorBgContainer: '#252538',
          colorBorder: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
        },
      }}
    >
      <div className="app">
        {currentView === 'login' && (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={handleSwitchToRegister}
          />
        )}

        {currentView === 'register' && (
          <Register
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}

        {isAuthenticated && isAuthenticatedView && (
          <Layout style={{ minHeight: '100vh' }}>
            <Header style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 24px',
              background: '#252538',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Menu
                mode="horizontal"
                selectedKeys={[currentView]}
                items={menuItems}
                onClick={handleMenuClick}
                style={{
                  flex: 1,
                  minWidth: 0,
                  background: 'transparent',
                  borderBottom: 'none'
                }}
              />

              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  transition: 'background 0.3s'
                }}>
                  <Avatar icon={<UserOutlined />} style={{ background: '#FF5757' }} />
                  <span style={{ color: '#fff' }}>{userEmail}</span>
                </div>
              </Dropdown>
            </Header>

            <Content style={{ padding: '24px', background: '#1C1C2E' }}>
              {currentView === 'movies' && <MovieList />}
              {currentView === 'genres' && <GenreList />}
              {currentView === 'combos' && <ComboList />}
              {currentView === 'cinemas' && <CinemaList />}
              {currentView === 'tickets' && <TicketList />}
            </Content>
          </Layout>
        )}
      </div>
    </ConfigProvider>
  );
}

export default App;
