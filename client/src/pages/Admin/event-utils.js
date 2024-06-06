let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

class TimeService {
    convertToEndTime = (time) => {
        const currentTime = new Date(time);

        const newTime = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000);
        return newTime.toISOString();
    };
    compareTime(time1, time2) {
      // Chuyển đổi chuỗi thời gian thành đối tượng Date
      let date1 = new Date(time1);
      let date2 = new Date(time2);

      return date1.getTime() === date2.getTime()
    }
    createEventId = () => {
        return String(eventGuid++);
    };

    getCurrentWeekTimeSlots(events) {
        const today = new Date();
        const timeSlots = [];

        // Tìm ngày đầu tiên của tuần hiện tại (Thứ Hai)
        const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);

        // Tạo danh sách các khung giờ trong tuần
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(firstDayOfWeek.getTime() + i * 24 * 60 * 60 * 1000);
            const dayName = currentDay.toLocaleDateString('vi-VN', { weekday: 'long' });

            for (let j = 0; j < 4; j++) {
                const timeSlot = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate(), 10 + j * 2, 0, 0);
                for (let j = 1; j < 5; j++) {
                  timeSlots.push({
                        id: this.createEventId(),
                        start: timeSlot.toISOString(),
                        end: this.convertToEndTime(timeSlot),
                        slot: j,
                        booingStatus:'NO'

                    });
                }
            }

        }
        return timeSlots.map((timeSlot) => {
            const findedEvent = events.find((event) => {
              if(event.slot === timeSlot.slot && event.start == timeSlot.start)  console.log(true)
                return event.slot === timeSlot.slot &&this.compareTime(event.start, timeSlot.start);
            });
            if (findedEvent) {
                return findedEvent;
            } else return timeSlot;
        });
    }
    convertToISO(time){
      return new Date(time).toISOString()
    }
    convertEvent(events) {
        return events.map((event) => {
            return {
                id: event._id,
                start: this.convertToISO(event.bookingDate),
                end: this.convertToEndTime(event.bookingDate),
                slot: event.slot,
                bookStatus:event.bookStatus
               
            };
        });
    }
}

export const timeService = new TimeService();

export const INITIAL_EVENTS = [
    {
        id: timeService.createEventId(),
        // title: 'Timed event',
        start: todayStr + 'T12:00:00.000Z',
        end: todayStr + 'T14:00:00.000Z',
        bookStatus: 'PENDING',
        slot: 1,
    },
    {
        id: timeService.createEventId(),
        // title: 'Timed event',
        start: todayStr + 'T12:00:00.000Z',
        end: todayStr + 'T14:00:00.000Z',
        bookStatus: 'CONFIRMED',
        slot: 2,
    },
];

export const api = [
    {
        id: timeService.createEventId(),
        // title: 'Timed event',
        bookingDate: new Date('2024-06-04T03:00:00.000+00:00').toISOString(),
        bookStatus: 'PENDING',
        slot: 1,
    },
    {
        id: timeService.createEventId(),
        // title: 'Timed event',
        bookingDate: new Date('2024-06-03T03:00:00.000+00:00').toISOString(),
        bookStatus: 'CONFIRMED',
        slot: 1,
    },
];
