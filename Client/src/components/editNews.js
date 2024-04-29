import React, { useEffect, useState } from "react";
import { UploadOutlined } from '@ant-design/icons';
import { Space, Table, Modal, Input, Button, DatePicker, Upload, Form } from "antd";
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';


export default function EditNewsForm() {
    const [DataNews, setDataNews] = useState([]);
    const [editData, setEditData] = useState(null);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const showDeleteConfirm = (record) => {
        Modal.confirm({
            title: "Confirm",
            content: "คุณต้องการลบใช่หรือไม่?",
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
    const normFile = (e) => {
        if (e === null) {
            setFile(null);
            return null;
        }

        if (Array.isArray(e)) {
            return e;
        }

        setFile(e.fileList);
        return e.fileList;
    };
    function isWeekend(current) {
        return current.day() === 0 || current.day() === 6; // 0 แทนวันอาทิตย์, 6 แทนวันเสาร์
    }
    const handleFileClick = (ID) => {
        // navigate(window.open(`PdfViewer/${ID}`, '_blank'));
        navigate(window.open(`/Public_relations/PdfViewer/${ID}`));
    };


    const handleDelete = (record) => {
        fetch(`/api/delPublicized?key=${record.ID_publicized}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response) => response.json())
        .then(() => {
            const oldFileName = record.publicized_file;
            fetch(`/api/delete-file/${oldFileName}`, {
                method: 'DELETE'
            })
            .then(response => response.text())
            .then(data => {
                console.log('File deleted successfully:', data);
                window.location.reload();
            })
            .catch(error => {
                console.error("Error deleting file:", error);
            });
        })
        .catch((error) => {
            console.error("Error deleting publicized:", error);
        });
    };
    

    const columns = [
        {
            title: "หัวข้อข่าว",
            dataIndex: "publicized_topic",
            key: "ID_publicized",
        },
        {
            title: "รายละเอียดข่าว",
            dataIndex: "publicized_detail",
            key: "ID_publicized",
            width : 400,

        },
        {
            title: "ชื่อไฟล์",
            dataIndex: "publicized_file",
            key: "ID_publicized",
            render: (text, record) => (
                <a href="" onClick={() => {
                    handleFileClick(record.ID_publicized);
                  }}>{text}</a>
            ),
        },
        {
            title: "วันลงข่าว",
            dataIndex: "publicized_start",
            key: "publicized_start",
        },
        {
            title: "สิ้นสุดวันประกาศข่าว",
            dataIndex: "publicized_end",
            key: "publicized_end",
        },
        {
            title: "Action",
            key: "action",
            render: (record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => showEditModal(record)}>แก้ไข</Button>
                    <Button type="dashed" danger onClick={() => showDeleteConfirm(record)} >ลบ</Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        fetch("/api/ReadaddNews")
            .then((response) => response.json())
            .then((data) => {
                if (data.length) {
                    // เพิ่ม 1 วันลงไปในข้อมูลวันหยุดที่ได้รับ
                    const modifiedData = data.map((item) => {
                        const startDate = new Date(item.publicized_start);
                        const endDate = new Date(item.publicized_end);
                        startDate.setDate(startDate.getDate() + 1);
                        endDate.setDate(endDate.getDate() + 1);
                        return {
                            ...item,
                            publicized_start: startDate.toISOString().split("T")[0],
                            publicized_end: endDate.toISOString().split("T")[0],
                        };
                    });
                    console.log(modifiedData);
                    setDataNews(modifiedData);
                } else {
                    console.log(data);
                }
            });
    }, []);

    const showEditModal = (record) => {
        setEditData(record);
    };

    const handleEdit = () => {
        console.log("Edit data:", editData);
    
        const formData = new FormData();
    
        // เพิ่มข้อมูลสำหรับการแก้ไข
        formData.append('ID_publicized', editData.ID_publicized);
        formData.append('Headline', editData.publicized_topic);
        formData.append('Description', editData.publicized_detail);
        formData.append('endDate', editData.publicized_end);
    
        // ตรวจสอบว่ามีการเปลี่ยนแปลงไฟล์หรือไม่
        if (file && file[0]?.originFileObj !== null) {
            // ลบไฟล์เดิม
            const oldFileName = editData.publicized_file;
            fetch(`/api/delete-file/${oldFileName}`, {
                method: 'DELETE'
            })
            .then(response => response.text())
            .then(data => {
                console.log('File deleted successfully:', data);
                // อัปโหลดไฟล์ใหม่
                formData.append('publicized_file', file[0]?.originFileObj);
                fetch('/api/updateNewsPDF', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        console.log(data);
                        alert('success');
                    } else {
                        alert('failed');
                    }
                })
                .catch(error => {
                    console.error("Error updating news:", error);
                    alert('Error updating news');
                });
            })
            .catch(error => {
                console.error("Error deleting file:", error);
                console.log('NewFile', file[0]?.originFileObj);
                alert('Error deleting file');
            });
        } else {
            // ถ้าไม่มีการเปลี่ยนแปลงไฟล์ ส่งข้อมูลแบบปกติ
            fetch('/api/updateNewsPDF', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    console.log(data);
                    alert('success');
                } else {
                    alert('failed');
                }
            })
            .catch(error => {
                console.error("Error updating news:", error);
                alert('Error updating news');
            });
        }
    };
    
    

    return (
        <>
            <Table columns={columns} 
            dataSource={DataNews} 
            rowKey="ID_publicized" 
            bordered 
            scroll={{
                y: 800,
              }}
            pagination={{
                pageSize: 15, 
            }}  
            />

            <Modal
                key={`edit-holiday-modal-${editData?.ID_publicized}`}
                title="Edit Holiday"
                visible={editData !== null}
                onCancel={() => setEditData(null)}
                footer={[
                    <Button key="back" onClick={() => setEditData(null)}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => handleEdit(editData?.ID_publicized)}
                    >
                        Save
                    </Button>,
                ]}
            >
                <babel>หัวข้อข่าว :</babel>
                <Input
                    placeholder="หัวข้อข่าว"
                    value={editData ? editData.publicized_topic : ""}
                    onChange={(e) =>
                        setEditData({ ...editData, publicized_topic: e.target.value })
                    }
                />
                <br></br>
                <br></br>
                <babel>รายละเอียดข่าว:</babel>
                <Input.TextArea 
                    placeholder="รายละเอียดข่าว"
                    value={editData ? editData.publicized_detail : ""}
                    onChange={(e) =>
                        setEditData({ ...editData, publicized_detail: e.target.value })
                    }
                />
                <br></br>
                <br></br>
                <babel>ไฟล์ข่าว:</babel>
                <br></br>

                <Form.Item
                    name="pdfFile"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[
                        {
                            required: false, // ตั้งค่าเป็น false เพื่อไม่บังคับการอัปโหลดไฟล์
                            message: 'Please upload a PDF file!',
                        },
                    ]}
                >
                    <Upload
                        name="pdfFile"
                        action="/upload.do"
                        accept="application/pdf"
                        maxCount={1} // กำหนดให้สามารถอัปโหลดได้เพียงหนึ่งไฟล์เท่านั้น
                        value={editData ? editData.publicized_file : ""}
                        defaultFileList={[
                            {
                                uid: '1',
                                name: editData ? editData.publicized_file : "", // ใช้เงื่อนไขเพื่อตรวจสอบว่า editData มีค่าหรือไม่
                                status: 'done',
                            },
                        ]}
                        beforeUpload={(file)=>{
                            console.log({file});
                            return false;
                          }}
                    >
                        <Button icon={<UploadOutlined />}>Click to upload PDF</Button>
                    </Upload>
                </Form.Item>
                <br></br>

                <babel>วันประกาศข่าว : วันสิ้นสุดการประกาศข่าว</babel>
                <DatePicker
                    disabledDate={(current) => isWeekend(current)}
                    style={{ width: '468px' }}
                    value={editData ? dayjs(editData.publicized_end, 'YYYY-MM-DD') : null}
                    format="DD/MM/YYYY" // กำหนดรูปแบบที่ต้องการ
                    onChange={(date) => {
                        if (date !== null) {
                            console.log(date.format('YYYY-MM-DD'));
                            setEditData({
                                ...editData,
                                publicized_end: date.format('YYYY-MM-DD')
                            });
                        }
                    }}
                />
            </Modal>
        </>

    );
}