import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/Layout/Admin/Layout";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Flex,
  Modal,
  message,
  Tag,
  DatePicker,
  Select,
} from "antd";
import { API_URL } from "../../config";
import { convertTimeSlot } from "../Booking/booking.service";

const { RangePicker } = DatePicker;
const { Option } = Select;

function AdminBooking() {
  const [bookings, setBookings] = useState([]);

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "10%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      width: "15%",
      sorter: (a, b) => new Date(b.date) - new Date(a.date),
      render: (text, record) => {
        return new Date(record.date).toLocaleDateString();
      },
    },
    {
      title: "Khung giờ",
      dataIndex: "timeSlot",
      key: "timeSlot",
      width: "15%",
      render: (text, record) => {
        return convertTimeSlot(record.timeSlot);
      },
    },
    {
      title: "Số sân",
      dataIndex: "type",
      key: "type",
      width: "10%",
      render: (text, record) => {
        return record.type;
      },
    },
    {
      title: "Người đặt",
      dataIndex: "name",
      key: "name",
      width: "10%",
      render: (text, record) => {
        return record.user ? record.user.name : "Không xác định";
      },
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
      width: "20%",
      render: (text, record) => {
        return record.user ? record.user.phone : "Không xác định";
      },
    },
    {
      title: "Gmail",
      dataIndex: "gmail",
      key: "gmail",
      width: "20%",
      render: (text, record) => {
        return record.user ? record.user.email : "Không xác định";
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      width: "20%",
      render: (text, record) => {
        const status = record.bookingStatus;
        const color = status === "PENDING" ? "blue" : status === "CONFIRMED" ? "green" : "red";
        const statusText = status === "PENDING" ? "Chờ xác nhận" : status === "CONFIRMED" ? "Đã xác nhận" : "Đã hủy";
        // Use Tag in antd
        return (
          <Tag color={color}>{statusText}</Tag>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: "30%",
      render: (text, record) => (
        <Flex justify="center" gap={10}>
          <Button type="primary" onClick={() => handleApproveBooking(record)}>
            Xác nhận
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => handleCancelBooking(record)}
          >
            Hủy
          </Button>
        </Flex>
      ),
    },
  ];

  const fetchBookings = async () => {
    const res = await fetch(API_URL + "/api/bookings/all");
    const data = await res.json();
    setBookings(data.data);
  };
  React.useLayoutEffect(() => {
    fetchBookings();
  }, []);

  const handleApproveBooking = async (booking) => {
    try {
      await Modal.confirm({
        title: "Xác nhận xác nhận lịch đặt",
        content: `Bạn có chắc chắn muốn thực hiện việc này?`,
        onOk: async () => {
          await fetch(API_URL + `/api/bookings/approve/${booking._id}`);
          await fetchBookings()
        },
      });
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra");
    }
  };

  const handleCancelBooking = async (booking) => {
    try {
      await Modal.confirm({
        title: "Xác nhận hủy lịch đặt",
        content: `Bạn có chắc chắn muốn thực hiện việc này?`,
        onOk: async () => {
          await fetch(API_URL + `/api/bookings/cancel/${booking._id}`);
          await fetchBookings()
        },
      });
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra");
    }
  };

  return (
    <div>
      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title="Danh sách đặt sân"
          >
            <Table
              pagination={{
                pageSize: 5,
              }}
              columns={columns}
              dataSource={bookings}
              className="ant-border-space"
              rowKey={(record) => record._id}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

const Admin = () => {
  return (
    <AdminLayout>
      <AdminBooking />
    </AdminLayout>
  );
};

export default Admin;
