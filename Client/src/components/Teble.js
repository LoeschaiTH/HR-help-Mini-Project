import React, { useState, useEffect } from "react";
import { Button, DatePicker, Form, Space, Table, Input } from "antd";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

import { useMediaQuery } from "react-responsive";

const Teble = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 431px)" });

  const [tableData, setTableData] = useState([]);
  const [dateString, setDateString] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/ReadaddNews")
      .then((response) => response.json())
      .then((data) => {
        setTableData(data);
      })
      .catch((error) => {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      });
  }, []);

  const downloadfile = (filename) => {
    fetch(`/api/download?filename=${filename}`, {
      method: "GET",
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };

  const handleFileClick = (ID) => {
    navigate(window.open(`Public_relations/PdfViewer/${ID}`));
  };

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDatePicker = (date, dateString) => {
    setDateString(dateString);
    console.log("date = ", dateString);
  };

  function formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, "0");
    const day = String(dateTime.getDate()).padStart(2, "0");
    const hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");
    const formattedDateTime = `${year}${month}${day}${hours}${minutes}`;
    return formattedDateTime;
  }

  function addOneDayToEndDateString(endDateString) {
    const endDate = new Date(endDateString);
    endDate.setDate(endDate.getDate() + 1);
    return endDate.toISOString();
  }

  const currentDate = new Date();
  console.log("tryyyy", formatDateTime(currentDate));
  // console.log("tryyyy",formatDateTime(tableData[4].publicized_end))

  console.log("tableeeeeeeeeeee", tableData);

  const columns = [
    {
      title: "วันที่ลงข่าว",
      dataIndex: "publicized_start",
      key: "publicized_start",
      render: (text) => addOneDayToEndDateString(text).split("T")[0],
      width: 120,
      bordered: true,
    },
    {
      title: "วันสิ้นสุด",
      dataIndex: "publicized_end",
      key: "publicized_end",
      render: (text) => addOneDayToEndDateString(text).split("T")[0],
      width: 120,
    },
    {
      title: "หัวข้อข่าว",
      dataIndex: "publicized_topic",
      key: "publicized_topic",
      width: 200,
      // width: 100,
    },
    // {
    //   title: "รายละเอียดข่าว",
    //   dataIndex: "publicized_detail",
    //   key: "publicized_detail",
    // },
    {
      title: "ดาวน์โหลดไฟล์",
      key: "publicized_file",
      render: (text, record) => (
        <Space size={25}>
          <a
            href=""
            onClick={() => {
              handleFileClick(record.ID_publicized);
            }}
          >
            {"View"}
          </a>
          <img
            src="https://race.nstru.ac.th/home_ex/blog/pic/cover/s6640.jpg"
            onClick={() => {
              downloadfile(record.publicized_file);
            }}
            height="24px"
            width="24px"
          />
        </Space>
      ),
      width: 150,
    },
  ];

  const columnsMoblie = [
    {
      title: "หัวข้อข่าว",
      dataIndex: "publicized_topic",
      key: "publicized_topic",
      width: 150,
    },
    // {
    //   title: "รายละเอียดข่าว",
    //   dataIndex: "publicized_detail",
    //   key: "publicized_detail",
    // },
    {
      title: "ดาวน์โหลดไฟล์",
      key: "publicized_file",
      render: (text, record) => (
        <Space size={25}>
          <a
            href=""
            onClick={() => {
              handleFileClick(record.ID_publicized);
            }}
          >
            {"View"}
          </a>
          <img
            src="https://race.nstru.ac.th/home_ex/blog/pic/cover/s6640.jpg"
            onClick={() => {
              downloadfile(record.publicized_file);
            }}
            height="24px"
            width="24px"
          />
        </Space>
      ),
      width: 140,
    },
  ];

  return (
    <div className="mb-4">
      {/* <Header></Header> */}
      <div className="w-auto">
        <Space>
          {/* <SearchIcon /> */}
          {/* <input
          type="text"
          id="search"
          name="search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="input input-bordered h-8"
          placeholder="ค้นหาข้อมูลจากหัวข้อข่าว"
        /> */}

          <div className="">
            <Input
              placeholder="ค้นหาข้อมูลจากหัวข้อข่าว"
              prefix={<SearchIcon />}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          {/* {!isMobile && (
            <div className="ml-5">
              <p>วันที่ลงข่าว: </p>
            </div>
          )} */}
          {!isMobile && (
            <div className="flex flex-row">
              <DatePicker  placeholder="วันที่ลงข่าว" onChange={handleDatePicker} />
            </div>
          )}
        </Space>
      </div>

      {isMobile && (
        <div className="flex flex-row mt-4">
          <Space>
            {/* <p>วันที่ลงข่าว: </p> */}
            <div className="">
              <DatePicker placeholder="วันที่ลงข่าว" onChange={handleDatePicker} />{" "}
            </div>
          </Space>
        </div>
      )}

      <Table
        className="mt-5"
        bordered
        columns={!isMobile ? columns : columnsMoblie}
        rowKey={(record) => record.ID_publicized}
        dataSource={tableData.filter(
          (row) =>
            row.publicized_topic
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) &&
            (dateString === "" ||
              addOneDayToEndDateString(row.publicized_start).split("T")[0] ===
                dateString) &&
            formatDateTime(addOneDayToEndDateString(row.publicized_end)) >=
              formatDateTime(currentDate)
        )}
        expandable={{
          expandedRowRender: (record) => (
            <>
              {isMobile && (
                <p className="text-sm font-bold">
                  วันที่ลงข่าว:{" "}
                  {
                    addOneDayToEndDateString(record.publicized_start).split(
                      "T"
                    )[0]
                  }
                </p>
              )}
              {isMobile && (
                <p className="text-sm font-bold">
                  วันสิ้นสุด:{" "}
                  {
                    addOneDayToEndDateString(record.publicized_end).split(
                      "T"
                    )[0]
                  }
                </p>
              )}
              <p className="text-sm font-bold">รายละเอียดข่าว</p>
              <p>{record.publicized_detail}</p>
            </>
          ),
        }}
        pagination={{
          pageSize: 10,
        }}
        scroll={{
          y: 1000,
        }}
      />
    </div>
  );
};

export default Teble;
