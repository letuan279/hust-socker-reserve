import React, { useContext } from 'react';

import { Tooltip, Avatar, Space, Image, Dropdown, Input, Badge, Flex } from 'antd';
import { NavLink, createSearchParams, useNavigate } from 'react-router-dom';

import "./navbar.scss"

export default function Navbar() {
    // const logout = () => {
    //     localStorage.removeItem('user');
    //     localStorage.removeItem('acess_token');
    //     setCurrentUser(null);
    // };
    const items = [
        {
            label: (
                <NavLink to='/' onClick={() => logout()}>
                    ログアウト
                </NavLink>
            ),
            key: '2',
        },
    ];
    return (
        <div className='navbar'>

            <Flex justify='space-between'>
             <Image src={"/logo.png"} preview={false} ></Image>
            <Dropdown
                className='avatar'
                placement='bottomRight'
                menu={{
                    items,
                }}
            >
                <Space>
                <Avatar src='https://images.unsplash.com/photo-1528127269322-539801943592?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlldG5hbXxlbnwwfHwwfHx8MA%3D%3D'></Avatar>
                    hello
                </Space>
            </Dropdown>
            </Flex>
        </div>
    );
}
