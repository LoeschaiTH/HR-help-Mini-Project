import '../Componect/test.css'
import * as React from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Space, DatePicker, ConfigProvider } from 'antd'
import { useNavigate } from 'react-router-dom'
const { RangePicker } = DatePicker;

const rangeConfig = {
  rules: [
    {
      type: 'array',
      required: true,
      message: 'Please select time!',
    },
  ],
};
const isWeekend = (current) => {
  return current.day() === 0 || current.day() === 6;
};

export default function HolidayForm() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const Changeinput = (e) => {
    console.log(e);
    console.log(form.getFieldsValue(), null, 2);
  };
  const onFinish = () => {
    try {
      const dataHoliday = form.getFieldsValue();
      console.log(dataHoliday.items[0]);
      fetch('/api/addHoliday', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dataHoliday }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'success') {
            navigate('/Dashboard/3');
            alert('success');
          } else {
            alert('failed');
          }
        });
    } catch {}
  };
  return (
    <div className=''>
      <Form
      labelCol={{
        span: 7,
      }}
      wrapperCol={{
        span: 8,
      }}
      form={form}
      name="dynamic_form_complex"
      autoComplete="off"
      initialValues={{
        items: [{}],
      }}
      onFinish={onFinish}
      className=' mx-16 py-12 my-8'
    >
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: 16,
              fontSize: '16px', // Set default font size
            }}
          >
            {fields.map((field) => (
              <Card  title={`ฟอร์มกําหนดวันหยุด`} key={field.key}>
                {/* Nest Form.List */}

                <Form.Item label="รายละเอียดวันหยุด" >
                  <Form.List name={[field.name, 'list']}>
                    {(subFields, subOpt) => (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          rowGap: 16,
                        }}
                        className=''
                      >
                        {subFields.map((subField) => (
                          <Space key={subField.key} >
                            <Form.Item noStyle name={[subField.name, 'Holiday']} label="RangePicker" {...rangeConfig} className='p-64'>
                              <RangePicker disabledDate={(current) => isWeekend(current)} className='  w-44' />
                            </Form.Item >
                            <Form.Item noStyle name={[subField.name, 'first']}>
                              <Input placeholder="รายละเอียด" className=' w-72' onChange={(e) => Changeinput(subField.name)} />
                            </Form.Item>
                            <CloseOutlined
                              onClick={() => {
                                subOpt.remove(subField.name);
                              }}
                            />
                          </Space>
                        ))}
                        <div className=' w-36'>
                           <Button type="dashed" onClick={() => subOpt.add()} block>
                          + เพิ่มวันหยุด
                        </Button>
                        </div>
                       
                      </div>
                    )}
                  </Form.List>
                </Form.Item>
              </Card>
            ))}
          </div>
        )}
      </Form.List>

      <br />
      <div className=' flex justify-center'>
        <Button className='px-16' type="primary" htmlType="submit">
          ยืนยัน
        </Button>
      </div>

    </Form>
    </div>
    
  );
}
