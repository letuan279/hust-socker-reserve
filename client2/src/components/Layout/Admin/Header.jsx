import { Avatar, Flex, Typography } from 'antd'

const CustomHeader = () => {
    return (
        <Flex align='center' justify='space-between'>
            <Typography.Title level={3}>Chúc một ngày làm việc hiệu quả! 😎</Typography.Title>

            <Avatar size='large' src='https://i.pravatar.cc/300' />
        </Flex>
    );
}

export default CustomHeader;