import React, { useEffect, useState } from "react";
import { Space, Table, Modal, Input, Button, DatePicker  } from "antd";
import dayjs from 'dayjs';
import 'dayjs/locale/th';
dayjs.locale('th');
export default function EditHolidayForm() {

  const [dataHoliday, setDataHoliday] = useState([]);
  const [editData, setEditData] = useState(null);

  const { RangePicker } = DatePicker;
  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: "Confirm",
      content: "คุณต้องการลบวันหยุดนี้ใช่หรือไม่?",
      okText: "ลบ",
      cancelText: "ยกเลิก",
      onOk() {
        handleDelete(record);
      },
      onCancel() {
        console.log("ยกเลิกการลบ");
      },
    });
  };
  function isWeekend(current) {
    return current.day() === 0 || current.day() === 6; 
  }
  const handleDelete = (record) => {
    console.log("ID_holiday:", record.ID_holiday);
    fetch(`/api/delHoliday?key=${record.ID_holiday}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error deleting holiday:", error);
      });
  };

  const columns = [
    {
      title: "หัวข้อวันหยุด",
      dataIndex: "holiday_topic",
      key: "holiday_topic",
    },
    {
      title: "เริ่มวันหยุด",
      dataIndex: "holiday_date_start",
      key: "holiday_date_start",
      render: (date) => dayjs(date).format("DD MMMM YYYY"),
    },
    {
      title: "สิ้นสุดวันหยุด",
      dataIndex: "holiday_date_end",
      key: "holiday_date_end",
      render: (date) => dayjs(date).format("DD MMMM YYYY"),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => showEditModal(record)}>แก้ไข</Button>
          <Button  danger onClick={() => showDeleteConfirm(record)} >ลบ</Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetch("/api/getHoliday")
      .then((response) => response.json())
      .then((data) => {
        if (data.length) {
          const modifiedData = data.map((item) => {
            const startDate = new Date(item.holiday_date_start);
            const endDate = new Date(item.holiday_date_end);
            startDate.setDate(startDate.getDate() + 1);
            endDate.setDate(endDate.getDate() + 1);
            return {
              ...item,
              holiday_date_start: startDate.toISOString().split("T")[0],
              holiday_date_end: endDate.toISOString().split("T")[0],
            };
          });
          console.log(modifiedData);
          setDataHoliday(modifiedData);
        } else {
          console.log(data);
          alert("login failed");
        }
      });
  }, []);

  const showEditModal = (record) => {
    setEditData(record);
  };

  const handleEdit = () => {
    console.log("ID_holiday:", editData.ID_holiday);
    fetch(
      `/api/editHoliday?key=${editData.ID_holiday}&new_holiday_topic_value=${editData.holiday_topic}&new_holiday_date_start_value=${editData.holiday_date_start}&new_holiday_date_end_value=${editData.holiday_date_end}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error updating holiday:", error);
      });
    setEditData(null);
  };

  return (
    
      <>
        <Table columns={columns} dataSource={dataHoliday} rowKey="ID_holiday" />

        <Modal
        key={`edit-holiday-modal-${editData?.ID_holiday}`}
          title="Edit Holiday"
          visible={editData !== null}
          onCancel={() => setEditData(null)}
          footer={[
            <Button key="back" onClick={() => setEditData(null)}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleEdit}>
              Save
            </Button>,
          ]}
        >
          <babel>หัวข้อวันหยุด :</babel>
          <Input
            placeholder="Holiday Topic"
            value={editData ? editData.holiday_topic : ""}
            onChange={(e) =>
              setEditData({ ...editData, holiday_topic: e.target.value })
            }
          />
          <babel>วันหยุด :</babel>
          <RangePicker
            disabledDate={(current) => isWeekend(current)}
            showTime
            style={{ width: '468px' }}
            defaultValue={[
              editData ? dayjs(editData.holiday_date_start, 'YYYY-MM-DD') : null,
              editData ? dayjs(editData.holiday_date_end, 'YYYY-MM-DD') : null,
            ]}
            format="DD/MM/YYYY" // กำหนดรูปแบบที่ต้องการ

            onChange={(dates) => {
              console.log(dates[0].format('YYYY-MM-DD'))
              if(dates !== null){
                setEditData({
                ...editData,
                holiday_date_start: dates[0].format('YYYY-MM-DD'),
                holiday_date_end: dates[1].format('YYYY-MM-DD')
              });
              }
              
            }}
          />
        </Modal>
      </>
    
  );
}