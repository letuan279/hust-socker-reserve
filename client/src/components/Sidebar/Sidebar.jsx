import React, { useState } from "react";
import {
    BarChartOutlined,
    HomeOutlined,
    DatabaseOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { Image, Menu, Button, theme } from "antd";
import { GrStorage } from "react-icons/gr";
import { TiBook } from "react-icons/ti";
import { NavLink } from "react-router-dom";
import { MdManageAccounts } from "react-icons/md";
import StadiumManager from "../../pages/StadiumManager";

export default function Sidebar() {
    return (
        <div>
            <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                items={[
                    {
                        key: "1",
                        icon: <HomeOutlined />,
                        label: <NavLink to="home">Trang chủ</NavLink>,
                    },
                    {
                        key: "2",
                        icon: <MdManageAccounts fontSize={24} />,
                        label: (
                            <StadiumManager>Thông tin chủ sân</StadiumManager>
                        ),
                    },
                    {
                        key: '3',
                        icon: <UserOutlined />,
                        label: <NavLink to='information'>Thông tin sân</NavLink>,
                    },
                    {
                        key: '4',
                        icon: <HomeOutlined />,
                        label: <NavLink to='admin'>Quản lý </NavLink>,
                    }
                ]}
            />
        </div>
    );
}
