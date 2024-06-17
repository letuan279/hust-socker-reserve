import moment from "moment";

export function getStartAndEndOfWeek(offsetWeeks = 0) {
    const today = new Date();
    const day = today.getDay(); // 0 (Sunday) - 6 (Saturday)
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday

    const monday = new Date(today.setDate(diff + offsetWeeks * 7));
    const sunday = new Date(today.setDate(diff + 6 + offsetWeeks * 7));

    return {
        start: moment(monday).format("YYYY-MM-DD"),
        end: moment(sunday).format("YYYY-MM-DD")
    };
}

export const convertTimeSlot = (timeSlot) => {
    if (!timeSlot) {
        return "";
    }
    const [start, end] = timeSlot.split("_");
    return `${start}:00 - ${end}:00`;
};