import React from 'react';
import { Form, Input, Button } from 'antd';
import bcrypt from 'bcryptjs';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


const AddAdminForm = () => {
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    const { username, password } = values;
    const dataToSend = { Token: 'ad137900ph', username, password };
   
    
    try {
      const response = await fetch("/api/checkUsername", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();

      if (!data.exists) {
        const responseAdd = await fetch("/api/addUsers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });
        const dataAdd = await responseAdd.json();

        if (dataAdd.status === "sussess") {
          console.log("Admin added successfully");
          form.resetFields();
          alert("เพิ่ม admin สำเร็จแล้ว");
        } else {
          console.error("Failed to add admin:", dataAdd.error);
          alert("ไม่สามารถเพิ่ม admin ได้ กรุณาลองใหม่อีกครั้ง1");
        }
      } else {
        console.error("Username is already taken");
        alert("ชื่อผู้ใช้งานนี้มีอยู่แล้ว กรุณาเลือกชื่ออื่น");
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      alert("ไม่สามารถเพิ่ม admin ได้ กรุณาลองใหม่อีกครั้ง2");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto' }}>
      <Form
        form = {form}
        name="addAdminForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ width: '300px' }}
      >
      
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "กรุณากรอก username!" }]}
          style={{ width: '100%' }}
          className='w-28'
        >
          <Input />
        </Form.Item>
      
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "กรุณากรอก password!" }]}
          style={{ width: '100%' }}
        >
          <Input.Password />
        </Form.Item>
  
        <Form.Item
          label="Confirm Password"
          name="confirm"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "กรุณากรอก password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("password ไม่เหมือนกัน!")
                );
              },
            }),
          ]}
          style={{ width: '100%' }}
          className='w-72'
        >
          <Input.Password />
        </Form.Item>
  
        <Form.Item style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit">
            บันทึก
          </Button>
        </Form.Item>
      </Form>

    </div>
  );
  
};

export default AddAdminForm;
