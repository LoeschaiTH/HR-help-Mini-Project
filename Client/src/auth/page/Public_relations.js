import Teble from '../Componect/Teble';
import React, { useEffect } from 'react';


const Title = () => 
{/* <h1 className="front text-black  text-xl flex justify-center"></h1> */}
export default function Public_relations() {
    useEffect(() => {
        document.title = 'หน้าบอร์ดประชาสัมพันธ์';
      }, []);
    return (
      <div className='m-0 bg-white p-3'>
            <div className ="m-2 rounded-md ">
                <Title/>
                <div>
                <Teble/>
              </div>
            </div>
      </div>
    );
  }