import { useState, useLayoutEffect } from 'react';
import { Flex, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selected, setSelected] = useState('1');

    useLayoutEffect(() => {
        const path = location.pathname;
        if (path.startsWith('/admin/booking')) {
            setSelected('1');
        }
    }, [location.pathname]);

    const handleMenuItemClick = (key) => {
        setSelected(key);
        switch (key) {
            case '1':
                navigate('/admin/booking');
                break;
            default:
                break;
        }
    };

    return (
        <>
            <Flex className='mt-[-16px]' align='center' justify='center'>
                <div className='logo'>
                ⚽
                </div>
                <span className='text-gray-800 no-underline hover:no-underline font-bold text-2xl lg:text-xl'>HUST SOCCER</span>
            </Flex>

            <Menu
                mode='inline'
                selectedKeys={[selected]}
                className='menu-bar'
                onSelect={({ key }) => handleMenuItemClick(key)}
                items={[
                    {
                        key: '1',
                        icon: "📅",
                        label: 'Quản lý đặt sân',
                    },
                ]}
            />
        </>
    );
};

export default Sidebar;