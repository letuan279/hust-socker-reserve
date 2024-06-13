import React, { useState, useEffect } from 'react';
import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { timeService, api } from './event-utils';
import './schedule.scss';
import { Button, Modal, Form, Input, Select, DatePicker } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import moment from 'moment'; // Thêm dòng này để import moment
import ScheduleService from '../../services/ScheduleService'
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

export default function DemoApp() {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [form] = Form.useForm();
  const [bookingList, setBookingList] = useState([])
  const [formValues, setFormValues] = useState();
  const handleGetBooking = async () => {
    let schedule = await ScheduleService.getBooking()
    schedule = schedule.filter(event => event.bookingStatus != "CANCELLED")
    console.log("schedule", schedule)
    setBookingList(schedule)
    // console.log("schedule",timeService.getCurrentWeekTimeSlots(new Date(),timeService.convertEvent(schedule)))
    setCurrentEvents(timeService.getCurrentWeekTimeSlots(new Date(), timeService.convertEvent(schedule)))

    // return await ScheduleService.getBooking()
  }

  const handleChangeDate = (date) => {
    setCurrentEvents(timeService.getCurrentWeekTimeSlots(date.start, timeService.convertEvent(bookingList)))

  }
  useEffect(() => {
    handleGetBooking()
  }, [])
  const [open, setOpen] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const bookingDate = values.bookingDate.format('YYYY-MM-DD');
      const bookingTime = values.bookingTime.format('hh:mm A');

      const response = await axios.post('/booking/add', {
        userId: values.userId,
        bookingDate,
        bookingTime,
        slot: values.slot,
      });

      if (response.data.success) {
        // Handle successful booking
        console.log('Booking successful');
        setOpen(false);
      } else {
        // Handle booking error
        console.error('Booking failed', response.data.message);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };


  const onCreate = (values) => {
    // console.log('Received values of form: ', values);
    setFormValues(values);
    handleOk();
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible);
  }

  function handleDateSelect(selectInfo) {
    const startDate = moment(selectInfo.start);
    const endDate = moment(selectInfo.end);
    form.setFieldsValue({
      date: startDate,
      hour: `${startDate.format('HH:mm')} - ${endDate.format('HH:mm')}`,
      slot: null,
      note: ''
    });
    handleOpen();
  }

  function handleEventClick(clickInfo) {
    console.log(clickInfo.view.getCurrentData());
    if (clickInfo.event.extendedProps.booingStatus !== 'NO') {
      return;
    }
    const startDate = moment(clickInfo.event.start);
    const endDate = moment(clickInfo.event.end);
    form.setFieldsValue({
      date: startDate,
      hour: `${startDate.format('HH:mm')} - ${endDate.format('HH:mm')}`,
      slot: clickInfo.event.extendedProps.slot,
      note: clickInfo.event.extendedProps.note || ''
    });
    handleOpen();
  }

  function handleEvents(events) {
    setCurrentEvents(events);
  }

  return (
    <div className='demo-app'>
      <div className='demo-app-main'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay'
          }}
          initialView='timeGridWeek'
          selectMirror={true}
          nex
          dayMaxEvents={true}
          slotMinTime="10:00:00"
          slotMaxTime="19:00:00"
          weekends={weekendsVisible}
          select={handleDateSelect}
          events={currentEvents}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventDisplay="block"
          allDaySlot={false}
          // eventsSet={ }
          eventAdd={function (e) { console.log(e, 'test') }}
        />
      </div>

      <Modal
        open={open}
        title="⚽ Đặt sân ⚽"
        okText="Đặt"
        cancelText="Hủy"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        footer={null}
      >
        <Form
          {...formItemLayout}
          labelAlign='left'
          layout="horizontal"
          form={form}
          name="form_in_modal"
          initialValues={{ modifier: 'public' }}
          clearOnDestroy
          onFinish={(values) => onCreate(values)}
        >
          <Form.Item
            name="date"
            label="📆 Ngày : "
            rules={[{ required: true, message: 'Please input the date!' }]}
          >
            <span>{form.getFieldValue('date') && form.getFieldValue('date').format('YYYY-MM-DD')}</span>
          </Form.Item>
          <Form.Item
            name="hour"
            label="⌛ Giờ :"
            rules={[{ required: true, message: 'Please select the time!' }]}
          >
            <span>{form.getFieldValue('hour')}</span>
          </Form.Item>
          <Form.Item
            name="slot"
            label="🥅 Sân bóng :"
            rules={[{ required: true, message: 'Please select a slot!' }]}
          >
            {/* <Select placeholder="Select a field" disabled >
              <Option value="1">Sân 1</Option>
              <Option value="2">Sân 2</Option>
              <Option value="3">Sân 3</Option>
              <Option value="4">Sân 4</Option>
            </Select> */}
            <span>{form.getFieldValue('slot')}</span>
          </Form.Item>
          <Form.Item
            name="note"
            label="* Ghi chú: "
            rules={[{ required: true, message: 'Please enter a note!' }]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Đặt
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

function renderEventContent(eventInfo) {
  // console.log('render event content',eventInfo)
  return (

    <div className={`soccer-field-${eventInfo.event.extendedProps.slot} ${eventInfo.event.extendedProps.bookingStatus != 'NO' ? 'not-avaiable' : ''}`}>
      <i> Sân {eventInfo.event.extendedProps.slot}</i>
    </div>
  )
}



function Sidebar({ weekendsVisible, handleWeekendsToggle, currentEvents }) {
  return (
    <div className='demo-app-sidebar'>
      <div className='demo-app-sidebar-section'>
        <h2>Instructions</h2>
        <ul>
          <li>Select dates and you will be prompted to create a new event</li>
          <li>Drag, drop, and resize events</li>
          <li>Click an event to delete it</li>
        </ul>
      </div>
      <div className='demo-app-sidebar-section'>
        <label>
          <input
            type='checkbox'
            checked={weekendsVisible}
            onChange={handleWeekendsToggle}
          ></input>
          toggle weekends
        </label>
      </div>
      <div className='demo-app-sidebar-section'>
        <h2>All Events ({currentEvents.length})</h2>
        <ul>
          {currentEvents.map((event) => (
            <SidebarEvent key={event.id} event={event} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function SidebarEvent({ event }) {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}</b>
      <i>{event.title}</i>
    </li>
  );
}
