import React, { useState } from 'react'
import { formatDate } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS } from './event-utils'
import { timeService,api } from './event-utils'
import './admin.scss'
import { Table, Button ,Modal,Form,Input, Select } from 'antd'
const {Option}= Select
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const dataSource = [
  { key: '2', time_dat_san: '2024-06-02', khung_gio_dat_san: '19:00 - 20:00', bookingStatus: 'Pending', slot: 'Vị trí 1', user: 'Jane Smith' },
  { key: '3', time_dat_san: '2024-06-03', khung_gio_dat_san: '20:00 - 21:00', bookingStatus: 'Cancelled', slot: 'Vị trí 3', user: 'Alice Johnson' },
  { key: '4', time_dat_san: '2024-06-04', khung_gio_dat_san: '21:00 - 22:00', bookingStatus: 'Confirmed', slot: 'Vị trí 4', user: 'Bob Brown' },
  { key: '5', time_dat_san: '2024-06-05', khung_gio_dat_san: '18:00 - 19:00', bookingStatus: 'Pending', slot: 'Vị trí 1', user: 'Charlie Davis' },
  { key: '6', time_dat_san: '2024-06-06', khung_gio_dat_san: '19:00 - 20:00', bookingStatus: 'Confirmed', slot: 'Vị trí 1', user: 'David Evans' },
  { key: '7', time_dat_san: '2024-06-07', khung_gio_dat_san: '20:00 - 21:00', bookingStatus: 'Cancelled', slot: 'Vị trí 7', user: 'Eve Harris' },
  { key: '8', time_dat_san: '2024-06-08', khung_gio_dat_san: '21:00 - 22:00', bookingStatus: 'Confirmed', slot: 'Vị trí 8', user: 'Frank White' },
  { key: '9', time_dat_san: '2024-06-09', khung_gio_dat_san: '18:00 - 19:00', bookingStatus: 'Pending', slot: 'Vị trí 9', user: 'Grace Lee' },
  { key: '10', time_dat_san: '2024-06-10', khung_gio_dat_san: '19:00 - 20:00', bookingStatus: 'Confirmed', slot: 'Vị trí 10', user: 'Hank Kim' },
  { key: '11', time_dat_san: '2024-06-11', khung_gio_dat_san: '20:00 - 21:00', bookingStatus: 'Cancelled', slot: 'Vị trí 11', user: 'Ivy Morgan' },
  { key: '12', time_dat_san: '2024-06-12', khung_gio_dat_san: '21:00 - 22:00', bookingStatus: 'Confirmed', slot: 'Vị trí 12', user: 'Jack Brown' },
  { key: '13', time_dat_san: '2024-06-13', khung_gio_dat_san: '18:00 - 19:00', bookingStatus: 'Pending', slot: 'Vị trí 13', user: 'Kara Young' },
  { key: '14', time_dat_san: '2024-06-14', khung_gio_dat_san: '19:00 - 20:00', bookingStatus: 'Confirmed', slot: 'Vị trí 14', user: 'Leo Scott' },
  { key: '15', time_dat_san: '2024-06-15', khung_gio_dat_san: '20:00 - 21:00', bookingStatus: 'Cancelled', slot: 'Vị trí 15', user: 'Mia Mitchell' },
  { key: '16', time_dat_san: '2024-06-16', khung_gio_dat_san: '21:00 - 22:00', bookingStatus: 'Confirmed', slot: 'Vị trí 16', user: 'Nina Perry' },
  { key: '17', time_dat_san: '2024-06-17', khung_gio_dat_san: '18:00 - 19:00', bookingStatus: 'Pending', slot: 'Vị trí 17', user: 'Oscar Reed' },
  { key: '18', time_dat_san: '2024-06-18', khung_gio_dat_san: '19:00 - 20:00', bookingStatus: 'Confirmed', slot: 'Vị trí 18', user: 'Paul Clark' },
  { key: '19', time_dat_san: '2024-06-19', khung_gio_dat_san: '20:00 - 21:00', bookingStatus: 'Cancelled', slot: 'Vị trí 19', user: 'Quincy Adams' },
  { key: '20', time_dat_san: '2024-06-20', khung_gio_dat_san: '21:00 - 22:00', bookingStatus: 'Confirmed', slot: 'Vị trí 20', user: 'Rachel Wright' },
  { key: '20', time_dat_san: '2024-06-20', khung_gio_dat_san: '21:00 - 22:00', bookingStatus: 'Confirmed', slot: 'Vị trí 20', user: 'Rachel Wright' },
  { key: '20', time_dat_san: '2024-06-20', khung_gio_dat_san: '21:00 - 22:00', bookingStatus: 'Confirmed', slot: 'Vị trí 20', user: 'Rachel Wright' },
];


const columns = [
  {
    title: 'Ngày đặt sân',
    dataIndex: 'time_dat_san',
    key: 'time_dat_san',
  },
  {
    title: 'Khung giờ đặt sân',
    dataIndex: 'khung_gio_dat_san',
    key: 'khung_gio_dat_san',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'bookingStatus',
    key: 'bookingStatus',
  },
  {
    title: 'Vị trí sân',
    dataIndex: 'slot',
    key: 'slot',
  },
  {
    title: 'Người đặt sân',
    dataIndex: 'user',
    key: 'user',
  },
  {
    title: 'Hành động',
    key: 'action',
    render: (text, record) => {
      return record.bookingStatus === 'Pending' ? (
        <>
          <Button type="primary" onClick={() => handleApprove(record.key)}>Duyệt</Button>
          <Button type="danger" onClick={() => handleReject(record.key)} style={{ marginLeft: 8 }}>Không duyệt</Button>
        </>
      ) : null;
    },
  },
];

export default function DemoApp() {
  const [weekendsVisible, setWeekendsVisible] = useState(true)
  const [currentEvents, setCurrentEvents] = useState(timeService.getCurrentWeekTimeSlots(timeService.convertEvent(api)))
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState();
  const [open, setOpen] = useState(false);
  const onCreate = (values) => {
    console.log('Received values of form: ', values);
    setFormValues(values);
    setOpen(false);
  };
  const handleOpen = (values) => {
    setOpen(true);

  }
  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible)
  }

  function handleDateSelect(selectInfo) {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: timeService.createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
      })
    }
  }


  function handleEventClick(clickInfo) {
    console.log(clickInfo.view)
    if(clickInfo.event.extendedProps.booingStatus!='NO'){
      return
    }
    handleOpen(clickInfo);
  }


  function handleEvents(events) {
    setCurrentEvents(events)
  }

  return (
    <div className='demo-app'>

      {/* <Sidebar
        weekendsVisible={weekendsVisible}
        handleWeekendsToggle={handleWeekendsToggle}
        currentEvents={currentEvents}
      /> */}
      <div className='demo-app-main'>
      <Table dataSource={dataSource} columns={columns} rowClassName={(record) => {
        if (record.bookingStatus === 'Confirmed') return 'confirmed-row';
        if (record.bookingStatus === 'Pending') return 'pending-row';
        if (record.bookingStatus === 'Cancelled') return 'cancelled-row';
        return '';
      }} />
      </div>

        
          {/* <Radio.Group>
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </Radio.Group> */}
    </div>
  )
}

function renderEventContent(eventInfo) {
    console.log('render event content',eventInfo)
  return (
    
    <div className={`soccer-field-${eventInfo.event.extendedProps.slot} ${eventInfo.event.extendedProps.booingStatus!='NO'? 'not-avaiable':''}`}>
      <b>{eventInfo.timeText}</b>
      <i> Sân{eventInfo.event.extendedProps.slot}</i>
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
  )
}

function SidebarEvent({ event }) {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
      <i>{event.title}</i>
    </li>
  )
}