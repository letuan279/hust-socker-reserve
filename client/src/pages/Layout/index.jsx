import React, { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import './layout.scss';
const { Header, Sider, Content } = Layout;
export default function Index() {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Layout>
            <Header
                style={{
                    padding: 0,
                    background: colorBgContainer,
                    // position: 'sticky',
                    // top: 0,
                    // zIndex: 1,
                }}
            >
                {/* <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
                fontSize: '16px',
                width: 64,
                height: 64,
            }}
        /> */}
                <Navbar></Navbar>
            </Header>
            <Layout>
                <Sider
                    style={{
                        overflow: 'auto',
                        // height: '100vh',
                        // position: 'fixed',
                        left: 0,
                        // top: 0,
                        bottom: 0,
                        borderInlineEnd: '1px solid rgba(5, 5, 5, 0.06)',
                    }}
                    className='sidebar'
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                >
                    <Sidebar></Sidebar>
                </Sider>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        background: colorBgContainer,
                    }}
                >
                    <Outlet></Outlet>
                </Content>
            </Layout>
        </Layout>
    );
}
