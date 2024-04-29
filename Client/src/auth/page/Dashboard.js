import * as React from 'react';
import { useParams } from "react-router-dom"
import HolidayForm from '../Componect/holidayForm'
import EditHolidayForm from '../Componect/editHolidayForm'
import EditNews from '../Componect/editNews'
import PostNews from '../Componect/PostNews'
import AddAdmin from '../Componect/addAdminForm';


export default function Dashboard() {
    const { form } = useParams();

    return (
        <div>
            {form === '1' && (
                <div >
                    <h2 className=' flex justify-center pr-2'>ลงวันหยุดประจําปี</h2>
                    <HolidayForm />
                </div>
            )}
            {form === '2' && (
                <div>
                    <h2 className='flex justify-center pr-72 '>ลงข่าวประชาสัมพันธ์</h2>
                    <PostNews />
                    
                </div>
            )}
            {form === '3' && (
                <div >
                    <h1>ข้อมูลวันหยุดที่ถูกเพิ่ม</h1>
                    <EditHolidayForm />
                </div>
            )}
            {form === '4' && (
                <div>
                    <h1>ประวัติข่าวประชาสัมพันธ์</h1>
                    <EditNews/>
                </div>
            )}
            {form === '5' && (
                <div>
                    <h1>เพิ่ม Admin</h1>
                    <AddAdmin />
                </div>
            )}
        </div>
    )
}
