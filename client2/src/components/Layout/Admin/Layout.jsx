import React from 'react';
import Sidebar from './Sidebar';
import CustomHeader from './Header';
import { Button, Layout } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'

import './AdminStyles.css';

const { Sider, Header, Content } = Layout;

const AdminLayout = ({ children }) => {
    const [collapsed, setCollapsed] = React.useState(false);

    return (
        <Layout>
            <Sider
                theme='light'
                trigger={null}
                collapsible
                collapsed={collapsed}
                className='sider'
            >
                <Sidebar />

                {/* <Button
                    type='text'
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    className='trigger-btn'
                /> */}
            </Sider>
            <Layout>
                <Header className='header'>
                    <CustomHeader />
                </Header>
                <Content className='content'>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}

export default AdminLayout;