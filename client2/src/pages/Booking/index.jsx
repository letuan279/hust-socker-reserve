import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, Form, Input, Select, message } from "antd";
import moment from "moment";

import Header from "../../components/Header";

import "./index.css";
import { getStartAndEndOfWeek, convertTimeSlot } from "./booking.service";
import { API_URL, userId } from "../../config";

const Booking = () => {
  const [form] = Form.useForm();
  const [events, setEvents] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [weekendDataLoading, setWeekendDataLoading] = useState(false);

  const timeSlotEnum = [
    "06_08",
    "08_10",
    "10_12",
    "12_14",
    "14_16",
    "16_18",
    "18_20",
  ];

  const typeEnum = ["Sân 1", "Sân 2", "Sân 3", "Sân 4"];
  const [selectableType, setSelectableType] = useState(typeEnum);
  const [bookings, setBookings] = useState([]);

  // Fetch bookings from the server
  useEffect(() => {
    const { start, end } = getStartAndEndOfWeek(currentWeek);
    fetchEvents(start, end);
  }, [currentWeek]);

  const fetchEvents = async (start, end) => {
    try {
      setWeekendDataLoading(true);

      // Simulate loading
      await new Promise(r => setTimeout(r, 2000));

      const response = await fetch(
        `${API_URL}/api/bookings?start=` + start + "&end=" + end
      );
  
      const res = await response.json();
  
      if (res.status === 0) {
        message.error(res.data.message);
        return;
      }
  
      const bookings = res.data;
      setBookings(bookings);
      let newEvents = bookings.map((booking) => {
        return {
          title: booking.type,
          start: booking.date.split("T")[0] + "T" + booking.timeSlot.split("_")[0] + ":00:00",
          end: booking.date.split("T")[0] + "T" + booking.timeSlot.split("_")[1] + ":00:00",
          status: booking.bookingStatus,
          userId: booking.user._id,
        };
      });
  
      // When newEvents has 4 CONFIRMED bookings in one time slot, merge the 4 events into 1 event and change the status to FULL
      const mergedEvents = [];
      for (let i = 0; i < newEvents.length; i++) {
        const event = newEvents[i];
        const sameTimeEvents = newEvents.filter((e) => e.start === event.start);
        if (sameTimeEvents.length === 4) {
          mergedEvents.push({
            title: "Hết chỗ",
            start: event.start,
            end: event.end,
            status: "FULL",
          });
          newEvents = newEvents.filter((e) => e.start !== event.start);
        }
      }
  
      newEvents = [...newEvents, ...mergedEvents];
      newEvents = newEvents.filter((event) => event.userId === userId || event.status === "FULL");
  
      setEvents(newEvents);
      setWeekendDataLoading(false);
    } catch (error) {
      message.error("Đã xảy ra lỗi gì đó, vui lòng load lại trang!");
    }
  };

  const handleSelect = (info) => {
    const { date, dateStr } = info;
    const timeSlot = timeSlotEnum.find((slot) => {
      const [start, end] = slot.split("_");
      const startHour = parseInt(start);
      const endHour = parseInt(end);
      return date.getHours() >= startHour && date.getHours() < endHour;
    });

    // If the selected time slot and date are in the past, do nothing
    if (moment().diff(date) > 0) {
      message.warning("Không thể đặt sân trong quá khứ!");
      return;
    }

    if (timeSlot) {
      // Set the selectableType based on the current bookings data
      const bookedTypes = bookings
        .filter((booking) => booking.date.split("T")[0] === dateStr.split("T")[0] && booking.timeSlot === timeSlot)
        .map((booking) => booking.type);
      const selectableType = typeEnum.filter((type) => !bookedTypes.includes(type));
      console.log(selectableType);
      setSelectableType(selectableType);

      form.setFieldsValue({
        date: dateStr.split("T")[0],
        timeSlot: timeSlot,
        type: null,
        note: "",
        name: "Tuấn Lê",
        phone: "0912345678",
        gmail: "latuan279@gmail.com"
      });
      setIsModalOpen(() => true);
    }
  };

  const handleOk = async () => {
    setModalLoading(true);
    // Get form values
    let values = null;
    try {
      values = await form.validateFields();
    } catch (error) {
      console.log("Validation failed!");
      setModalLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/bookings/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: values.date,
          timeSlot: values.timeSlot,
          type: typeEnum[values.type - 1],
          note: values.note,
        }),
      });
  
      const res = await response.json();
      if (res.status === 0) {
        console.log("Error: ", res.data.message);
        message.error(res.data.message);
      }
      
      setModalLoading(false);
      // Refresh the calendar
      const { start, end } = getStartAndEndOfWeek(currentWeek);
      message.success("Đặt sân thành công!");
      fetchEvents(start, end);
      setIsModalOpen(false);
    } catch (error) {
      message.error("Đã xảy ra lỗi gì đó, vui lòng load lại trang!");
    }
  };

  const handleMoveWeek = (info) => {
    const { start } = info;
    const { start: newStart, end: newEnd } = getStartAndEndOfWeek(currentWeek);
    const date = moment(start).format("YYYY-MM-DD");
    if (date < newStart) {
      setCurrentWeek(currentWeek - 1);
    } else if (date > newEnd) {
      setCurrentWeek(currentWeek + 1);
    }
  }

  const eventContent = (info) => {
    const { status } = info.event.extendedProps;
    const statusTranslate = {
      PENDING: "Đang duyệt",
      CONFIRMED: "Đã xác nhận",
      CANCELLED: "Đã hủy",
      FULL: "Hết chỗ",
    };

    return (
      <>
        {status === "CANCELLED" && <div className="h-[100%] bg-[#ffeff6] text-[#000] p-2">
          <b>{info.event.title}</b>
          <div className="text-[#ad5177] border-[3px] font-bold px-[4px] py-[2px] border-[#ad5177] w-max rounded">{statusTranslate[status]}</div>
        </div>}
        {status === "CONFIRMED" && <div className="h-[100%] bg-[#e1f5e8] text-[#000] p-2">
          <b>{info.event.title}</b>
          <div className="text-[#67cca5] border-[3px] font-bold px-[4px] py-[2px] border-[#67cca5] w-max rounded">{statusTranslate[status]}</div>
        </div>}
        {status === "PENDING" && <div className="h-[100%] bg-[#e8ecff] text-[#000] p-2">
          <b>{info.event.title}</b>
          <div className="text-[#859af6] border-[3px] font-bold px-[4px] py-[2px] border-[#859af6] w-max rounded">{statusTranslate[status]}</div>
        </div>}
        {status === "FULL" && <div className="h-[100%] bg-[#ccc] text-[#000] flex justify-center items-center">
          {/* <b>{info.event.title}</b> */}
          <div className="rotate-12 text-[#f00] border-[3px] font-bold px-[4px] py-[2px] border-[#f00] w-max rounded">{statusTranslate[status]}</div>
        </div>}
      </>
    );
  }

  return (
    <div className="leading-normal tracking-normal text-black h-screen gradient">
      <Header />
      <div className="h-full p-24">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: false,
          }}
          datesSet={handleMoveWeek}
          events={events}
          eventClick={(info) => {
            console.log(info.event);
          }}
          eventContent={eventContent}
          eventBorderColor="#ad5177"
          dateClick={handleSelect}
          // selectAllow={(selectInfo) => {
          //   return moment().diff(selectInfo.start) <= 0
          // }}
          locale="vi"
          slotMinTime="06:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          height="110%"
          contentHeight="auto"
          slotLabelInterval={{
            hour: 2,
          }}
          slotDuration={{
            minute: 120,
          }}
          slotMinWidth={100}
          firstDay="1"
          slotLabelContent={(info) => {
            const dateHour =
              info.date.getHours() < 10
                ? "0" + info.date.getHours()
                : info.date.getHours();
            const dateHourPlusTwo =
              info.date.getHours() + 2 < 10
                ? "0" + (info.date.getHours() + 2)
                : info.date.getHours() + 2;
            const timeSlot = dateHour + "_" + dateHourPlusTwo;
            return timeSlotEnum.includes(timeSlot)
              ? convertTimeSlot(timeSlot)
              : "";
          }}
          slotLaneContent={() => (
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
              }}
            >
              {[...Array(7)].map((_, index) => (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    height: "100%",
                  }}
                  className="cell-hover"
                />
              ))}
            </div>
          )}
          buttonText={{
            today: "Hôm nay",
          }}
        />
      </div>

      <Modal
        title="⚽ Đặt sân ⚽"
        open={isModalOpen}
        onOk={() => {
          handleOk()
        }}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={modalLoading}
      >
        <Form form={form}>
          <Form.Item
            label="Ngày đặt"
            name="date"
            rules={[{ required: true, message: "Vui lòng nhập ngày đặt!" }]}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item
            label="Khung giờ"
            name="timeSlot"
            rules={[{ required: true, message: "Vui lòng nhập khung giờ!" }]}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item
            label="Tên khách hàng"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item
            label="Gmail"
            name="gmail"
            rules={[{ required: true, message: "Vui lòng nhập gmail!" }]}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item
            label="Sân có thể đặt"
            name="type"
            rules={[{ required: true, message: "Vui lòng chọn sân!" }]}
          >
            <Select>
              {selectableType.map((court, index) => (
                <Select.Option key={index} value={index + 1}>
                  {court}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Ghi chú"
            name="note"
            rules={[
              { max: 100, message: "Ghi chú không được vượt quá 100 ký tự!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      <div>
      {weekendDataLoading ? (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center z-[1000]">
          <img src="loading.gif" width={300} height={300}></img>
          <span className="text-white text-4xl font-bold mt-[-50px] ml-5">Đang tải...</span>
        </div>
      ) : (
        <></>
      )}
    </div>
    </div>
  );
};

export default Booking;
