import React, { useState, useEffect } from 'react'
import { formatDate } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS } from './event-utils'
import allLocales from '@fullcalendar/core/locales-all'
import { timeService,api } from './event-utils'
import './schedule.scss'
import { Button ,Modal,Form,Input, Select} from 'antd'
import ScheduleService from '../../services/ScheduleService'
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
export default function DemoApp() {
  const [weekendsVisible, setWeekendsVisible] = useState(true)
  const [currentEvents, setCurrentEvents] = useState([])
  const [form] = Form.useForm();
  const [bookingList,setBookingList]= useState([])
  const [formValues, setFormValues] = useState();
  const handleGetBooking= async()=>{
    const schedule=await ScheduleService.getBooking()
    console.log("schedule",schedule)
    setBookingList(schedule)
    // console.log("schedule",timeService.getCurrentWeekTimeSlots(new Date(),timeService.convertEvent(schedule)))
    setCurrentEvents(timeService.getCurrentWeekTimeSlots(new Date(),timeService.convertEvent(schedule)))

    // return await ScheduleService.getBooking()
  }

  const handleChangeDate=(date)=>{
    setCurrentEvents(timeService.getCurrentWeekTimeSlots(date.start,timeService.convertEvent(bookingList)))

  }
  useEffect(()=>{
      handleGetBooking()
  },[])
  const [open, setOpen] = useState(false);
  const onCreate = (values) => {
    // console.log('Received values of form: ', values);
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
    console("ts")
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
    // console.log(clickInfo.view)
    console.log("hello")
    if(clickInfo.event.extendedProps.bookingStatus!='NO'){
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
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay'
          }}
          initialView='timeGridWeek'
          // editable={true}
          // selectable={true}
          locales={allLocales} locale={'vi'}
          selectMirror={true}
          nex
          dayMaxEvents={true}
          slotMinTime="10:00:00"
          slotMaxTime="18:00:00"
          // slotMaxTime="18:00:00"
          weekends={weekendsVisible}
          events={currentEvents} // alternatively, use the `events` setting to fetch from a feed
          select={handleDateSelect}
          eventContent={renderEventContent} // custom render function
          eventClick={handleEventClick}
          eventDisplay="block"
          // timeFormat='H(:mm)'
          datesSet={handleChangeDate}
          allDaySlot={false}
          // eventsSet={} // called after events are initialized/added/changed/removed
          eventAdd={function(e){ console.log(e,'test')}}
          /* you can update a remote database when these fire:
          eventChange={function(){}}
          eventRemove={function(){}}
          */
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
        modalRender={(dom) => (
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
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="title"
          label="📆 Ngày : "
          rules={[{ required: true, message: 'Please input the title of collection!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="title"
          label="⌛ Giờ :"
          rules={[{ required: true, message: 'Please input the title of collection!' }]}
        >
         <Select
          placeholder="hour"
          // onChange={onGenderChange}
        >
          <Option value="1">10:00AM-12:00AM</Option>
          <Option value="2">12:00AM-02:00PM</Option>
          <Option value="3">02:00PM-04:00PM</Option>
          <Option value="4">04:00PM-06:00PM</Option>
        </Select>
        </Form.Item>
        <Form.Item
          name="slot"
          label="🥅 Sân bóng :"
          rules={[{ required: true, message: 'Please input the title of collection!' }]}
        >
            <Select
          placeholder="Select a option and change input text above"
          // onChange={onGenderChange}
        >
          <Option value="1">Sân 1</Option>
          <Option value="2">Sân 2</Option>
          <Option value="3">Sân 3</Option>
          <Option value="4">Sân 4</Option>
        </Select>
        </Form.Item>
          {/* <Radio.Group>
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </Radio.Group> */}
      </Modal>
    </div>
  )
}

function renderEventContent(eventInfo) {
    // console.log('render event content',eventInfo)
  return (
    
    <div className={`soccer-field-${eventInfo.event.extendedProps.slot} ${eventInfo.event.extendedProps.bookingStatus!='NO'? 'not-avaiable':''}`}>
      <i> Sân {eventInfo.event.extendedProps.slot}</i>
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