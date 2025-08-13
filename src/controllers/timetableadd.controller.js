import { User } from "../models/user.model.js";
import { TimeTable } from "../models/timetable.model.js";
import { body } from "express-validator";

export const addTimeTable = async (req, res) => {
    try {
        const { facultyId, weektimetable } = req.body;
        console.log(facultyId);

        const faculty = await User.findOne({ _id: facultyId, role: "faculty" });

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: "Faculty not found"
            });
        }

        let weektime = await TimeTable.findOne({ facultyId });

        // Default timetable structure
        const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const periods = [
            { period: 1, time: "9:00 AM - 10:00 AM", status: "" },
            { period: 2, time: "10:00 AM - 11:00 AM", status: "" },
            { period: 3, time: "11:00 AM - 12:00 PM", status: "" },
            { period: 4, time: "1:00 PM - 2:00 PM", status: "" },
            { period: 5, time: "2:00 PM - 3:00 PM", status: "" },
            { period: 6, time: "3:00 PM - 4:00 PM", status: "" },
            { period: 7, time: "4:00 PM - 5:00 PM", status: "" },
            { period: 8, time: "5:00 PM - 6:00 PM", status: "" }
        ];

        const defaultTimetable = {};
        days.forEach(day => {
            defaultTimetable[day] = periods.map(p => ({ ...p }));
        });

        if (!weektime) {
            // If no timetable exists, merge the provided data with default values
            let mergedTimetable = {};

            days.forEach(day => {
                mergedTimetable[day] = weektimetable?.[day] 
                    ? mergePeriods(defaultTimetable[day], weektimetable[day]) 
                    : [...defaultTimetable[day]];
            });

            weektime = new TimeTable({
                facultyId,
                week: mergedTimetable
            });
        } else {
            // If updating, merge missing periods from the default
            for (const day of days) {
                if (!weektime.week[day] || weektime.week[day].length === 0) {
                    weektime.week[day] = [...defaultTimetable[day]];
                }
            }

            // Overwrite with provided timetable
            if (weektimetable) {
                for (const day of days) {
                    if (weektimetable[day]) {
                        weektime.week[day] = mergePeriods(weektime.week[day], weektimetable[day]);
                    }
                }
            }
        }

        await weektime.save();
        return res.status(200).json({ success: true, message: "Week timetable updated successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, data: error.message });
    }
};

const mergePeriods = (oldPeriods, providedPeriods) => {
    let merged = [...oldPeriods];

    providedPeriods.forEach(provided => {
        const index = merged.findIndex(p => p.period === provided.period);
        if (index !== -1) {
            // Only update the changed fields
            merged[index] = {
                ...merged[index],
                ...provided,
                status: provided.status && provided.status !== "" 
                    ? provided.status 
                    : merged[index].status || "Free"
            };
        }
    });

    return merged;
};



