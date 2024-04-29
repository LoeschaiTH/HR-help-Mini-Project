import React, { useState } from "react";
import { Button, DatePicker, Form, Input, Upload, Space, message } from "antd";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 14,
    },
  },
};

const PostNews = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [dateString, setDateString] = useState();
  const [DateT, setDate] = useState();
  // const [fileList, setFileList] = useState([])
  // const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState();

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("publicized_topic", values.publicized_topic);
    formData.append("publicized_detail", values.publicized_detail);
    formData.append("publicized_start", new Date().toISOString());
    formData.append("publicized_end", DateT);
    formData.append("publicized_file", values.publicized_file.file);

    console.log("ResData...1", values.publicized_file.file.status);
    console.log("ResData...2", values.publicized_file.file);
    console.log("ResData...3", values.publicized_file);

    if (values.publicized_file.file.status === 'error') {
      message.error('ไฟล์นี้ไม่สามารถอัพโหลดได้');
      return;
    }
    if (values.publicized_file.file.status === 'removed') {
      message.error('กรุณาอัพโหลดไฟล์');
      return;
    }
    else{
          try {
          const response = await fetch("/api/addNews", {
            method: 'POST',
            body: formData,
          });
          const responseData = await response.json(); // ดึงข้อมูล JSON จาก response.

          if (response.ok) {
            navigate('/Dashboard/2');
            alert('success');
            form.resetFields();
            console.log("บันทึกสำเร็จ")
          } else {
            alert('failed');
            console.log("ไม่บันทึกสำเร็จ!!!")
          }
        } catch (error) {
          console.error('เกิดข้อผิดพลาด:', error.message);
        }
    }
  };

  const handleDatePicker = (date, dateString) => {
    setDateString(dateString);
    setDate(date);
  };

  const formRef = React.useRef(null);
  const onReset = () => {
    formRef.current?.resetFields();
  };

  const handleRemove = (file) => {
    form.resetFields();
    console.log('Removing file:', file);
  };

  return (
    <div className="py-8 pl-72 ">
      <Form
        form={form}
        ref={formRef}
        onFinish={onFinish}
        {...formItemLayout}
        variant="filled"
        style={{
          maxWidth: 600,
        }}
        hideRequiredMark
        enctype="multipart/form-data"
      >
        <Form.Item
          label="หัวข้อข่าว"
          name="publicized_topic"
          rules={[
            {
              required: true,
              message: "Please input!",
            },
          ]}
        >
          <Input placeholder="หัวข้อข่าว" maxLength={50} />
        </Form.Item>

        <Form.Item
          label="รายละเอียดข่าว"
          name="publicized_detail"
          rules={[
            {
              required: true,
              message: "Please input!",
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="สิ้นสุดวันประกาศข่าว"
          name="publicized_end"
          rules={[
            {
              required: true,
              message: "Please input!",
            },
          ]}
        >
          <DatePicker onChange={handleDatePicker} />
        </Form.Item>

        <Form.Item
          label="แนบไฟล์"
          name="publicized_file"
          rules={[
            {
              required: true,
              message: "Please input!",
            },
          ]}
        >
          <Upload
            enctype="multipart/form-data"
            maxCount={1}
            type="file"
            listType="picture"
            action={"http://http://localhost:3000/api/addNews"}
            onRemove={handleRemove}
            accept=".pdf"
            valuePropName="fileList"
            // getValueFromEvent={(e) => {
            //   setFile(e.fileList[0]); // เมื่อมีการเลือกไฟล์อัปโหลดใหม่
            //   return e && e.fileList;
            // }}
            rules={[{ required: true, message: "กรุณาแนบไฟล์" }]}
            beforeUpload={(file) => {
              console.log({ file });
              const englishLetters = /^[A-Za-z0-9 _.-]*$/;
              const isEnglishFilename = englishLetters.test(file.name);
              if (!isEnglishFilename) {
                message.error("ชื่อไฟล์ต้องเป็นภาษาอังกฤษเท่านั้น");
                return true; // ยกเลิกการอัปโหลดไฟล์
              }

              // ตรวจสอบว่าเป็นไฟล์ PDF หรือไม่
              const isPDF = file.type === "application/pdf";
              if (!isPDF) {
                message.error("ไฟล์ต้องเป็นประเภท .pdf");
                return true; // ยกเลิกการอัปโหลดไฟล์
              }

              // ตรวจสอบขนาดของไฟล์ (ไม่เกิน 15MB)
              const isLt15M = file.size / 1024 / 1024 < 15; // 15MB
              if (!isLt15M) {
                message.error("ไฟล์ต้องมีขนาดน้อยกว่า 15MB");
                return true; // ยกเลิกการอัปโหลดไฟล์
              }

              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 6,
            span: 16,
          }}
        >
          <Space size={30}>
            <button type="primary" htmlType="submit" className="btn ">
              บันทึก
            </button>

            <button
              className="btn btn-active btn-ghost "
              type="reset"
              onClick={onReset}
            >
              รีเช็ต
            </button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PostNews;
