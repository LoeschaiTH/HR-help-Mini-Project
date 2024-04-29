import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { generateDate, months } from "../util/calendar";
import cn from "../util/cn";
import { useNavigate } from "react-router-dom";
import "../index.css";

const FullCalendar = () => {
  const navigate = useNavigate();
  const days = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัส","ศุกร์","เสาร์",];
  const currentDate = dayjs();
  const [today, setToday] = useState(currentDate);
  // eslint-disable-next-line no-unused-vars
  const [selectDate, setSelectDate] = useState(currentDate);
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    fetch("/api/getHoliYear")
      .then((response) => response.json())
      .then((data) => {
        console.log("Holidays data:", data);
        setHolidays(data);
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

  return (
    <>
      <div className="flex gap-10 items-center justify-center">
        <h1
          className="cursor-pointer hover:scale-105 transition-all"
          onClick={() => {
            setToday(currentDate);
          }}
        >
          <div className="mt-10 mb-4 text-2xl font-bold text-center">
            วันหยุดประจำปี {today.year() + 543}
          </div>
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center h-screen">
        <div className="grid grid-cols-4 gap-4 w-full h-full text-xs">
          {months.map((month, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 border py-6 rounded-lg 
            transform transition duration-300 
            hover:scale-105 hover:shadow-md hover:border-black"
              onClick={() => {
                navigate(`/calendar?month=${month}`);
              }}
            >
              <div className="w-auto h-auto ">
                <div className="flex justify-between items-center">
                  <h1 className="select-none font-semibold text-center w-full">
                    {month}
                  </h1>
                </div>
                <div className="grid grid-cols-7 w-full">
                  {days.map((day, index) => (
                    <h1
                      key={index}
                      className={cn(
                        "text-sm text-center h-10 w-10 grid place-content-center text-gray-500 select-none",
                        day === "SUN" ? "text-red-500" : "",
                        day === "SAT" ? "text-red-500" : ""
                      )}
                    >
                      {day}
                    </h1>
                  ))}
                </div>

                <div className=" grid grid-cols-7 ">
                  {generateDate(index, today.year()).map(
                    ({ date, currentMonth, today }, index) => (
                      <div
                        key={index}
                        className="p-2 text-center h-10 grid place-content-center text-sm border-t"
                      >
                        <h1
                          className={cn(
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FullCalendar;
