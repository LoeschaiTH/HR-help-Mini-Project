import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { generateDate, months } from "../util/calendar";
import cn from "../util/cn";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useLocation } from "react-router-dom";
import { Space } from "antd";

const Calendar = () => {
  function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  const query = useQuery();
  // eslint-disable-next-line no-unused-vars
  const [selectMonth, setSelectMonth] = useState(query.get("month"));
  const days = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัส","ศุกร์","เสาร์"];
  const currentDate = dayjs();
  const [today, setToday] = useState(currentDate);
  // eslint-disable-next-line no-unused-vars
  const [selectDate, setSelectDate] = useState(currentDate);
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const monthIndex = months.findIndex(
      (month) => month.toLowerCase() === selectMonth?.toLowerCase()
    );
    if (monthIndex !== -1) {
      setToday(today.month(monthIndex));
    }
  }, [selectMonth, today]);

  useEffect(() => {
    fetch("/api/getHoliYear")
      .then((response) => response.json())
      .then((data) => {
        console.log("Holidays data:", data);
        const updatedHolidays = data.map((holiday) => ({
          ...holiday,
          topic: `${dayjs(holiday.holiday_date_start)
            .add(543, "year")
            .format("DD-MM-YYYY")} ${holiday.holiday_topic}`,
        }));

        setHolidays(updatedHolidays);
      })
      .catch((error) => console.error("Error fetching holidays:", error));
  }, []);

  const isHoliday = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");
    return holidays.some((holiday) => {
      const holidayStartDate = dayjs(holiday.holiday_date_start).format(
        "YYYY-MM-DD"
      );
      const holidayEndDate = dayjs(holiday.holiday_date_end).format(
        "YYYY-MM-DD"
      );
      return (
        formattedDate >= holidayStartDate && formattedDate <= holidayEndDate
      );
    });
  };

  const handleNextMonth = () => {
    console.log("Next Month Clicked");
    const nextMonth = today.month(today.month() + 1);
    setSelectMonth(months[nextMonth.month()]);
  };

  const handlePreviousMonth = () => {
    console.log("Previous Month Clicked");
    const previousMonth = today.month(today.month() - 1);
    setSelectMonth(months[previousMonth.month()]);
  };

  return (
    <>
      <div className="mt-20 mb-10 text-xl font-bold text-center ">
        วันหยุดประจำเดือน{months[today.month()]}
      </div>
      <div className="flex gap-10 sm:divide-x justify-center sm:w-1/2 mx-auto h-screen items-center sm:flex-row flex-col">
        <div className="w-96 h-96">
          <div className="flex justify-center items-center">
            <div className="flex gap-10 items-center">
              <GrFormPrevious
                className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
                onClick={handlePreviousMonth}
              />
               <h1 className="select-none font-semibold text-xl">
              {months[today.month()]}, {today.year() + 543}
            </h1>
              <GrFormNext
                className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
                onClick={handleNextMonth}
              />
            </div>
          </div>
          <div className="grid grid-cols-7">
            {days.map((day, index) => (
              <h1
                key={index}
                className="text-sm text-center h-14 w-14 grid place-content-center text-gray-500 select-none"
              >
                {day}
              </h1>
            ))}
          </div>
          <div className="date-grid">
            {generateDate(today.month(), today.year()).map(
              ({ date, currentMonth, today }, index) => (
                <div
                  key={index}
                  className="p-2 text-center h-10 grid place-content-center text-xs border-t"
                >
                  <h1
                    className={cn("date-cell",
                      currentMonth ? "" : "text-gray-400",
                      today && (date.day() === 0 || date.day() === 6)
                        ? "h-9 w-9 rounded-full grid place-content-center bg-black text-white"
                        : "",
                      today
                        ? "h-9 w-9 rounded-full grid place-content-center bg-black text-white"
                        : "",
                      date.day() === 0 ? "text-red-500" : "",
                      date.day() === 6 ? "text-red-500" : "",
                      isHoliday(date) && currentMonth
                        ? " h-9 w-9 rounded-full grid place-content-center bg-red-200"
                        : ""
                    )}
                    onClick={() => {
                      setSelectDate(date);
                    }}
                  >
                    {date.date()}
                  </h1>
                </div>
              )
            )}
          </div>
        </div><br/>
        <div className="h-96 w-96 sm:px-5 ">
          <h1 className="font-semibold text-xl">
            วันหยุดในเดือน{months[today.month()]}
          </h1>
          <ul >
            {holidays
              .filter(
                (holiday) =>
                  dayjs(holiday.holiday_date_start).month() === today.month()
              )
              .map((holiday, index) => (
                
                <li key={index} >

                   <Space size={10} >
                    <div className=" py-4">
                       <strong >
                          {dayjs(holiday.holiday_date_start).format(
                            "DD " + months[today.month()]
                          )}
                        </strong>{" "}
                        {holiday.holiday_date_start !== holiday.holiday_date_end &&
                          ` ถึง `}
                        {holiday.holiday_date_start !== holiday.holiday_date_end && (
                          <strong>
                            {dayjs(holiday.holiday_date_end).format(
                              "DD " + months[today.month()]
                            )}
                          </strong>
                      )}{" "}
                    </div>
                     
                 </Space> 
                 <div className=" font-bold text-red-400">
                    {holiday.topic.replace(/(\d{2}-\d{2}-\d{4})/g, "")}
                 </div>
                </li>   
              ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Calendar;
