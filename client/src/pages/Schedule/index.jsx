import React, { useState } from 'react'
import { formatDate } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS } from './event-utils'
import { timeService,api } from './event-utils'
import './schedule.scss'
import { Button ,Modal,Form,Input, Select} from 'antd'
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
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView='timeGridWeek'
          // editable={true}
          // selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          slotMinTime="10:00:00"
          // slotMaxTime="18:00:00"
          weekends={weekendsVisible}
          initialEvents={currentEvents} // alternatively, use the `events` setting to fetch from a feed
          select={handleDateSelect}
          eventContent={renderEventContent} // custom render function
          eventClick={handleEventClick}
          eventDisplay="block"
          // timeFormat='H(:mm)'
          
          allDaySlot={false}
          eventsSet={handleEvents} // called after events are initialized/added/changed/removed
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