'use client'
import Image from 'next/image'
import React from 'react'
import logo from '@/app/assets/images/logo.png'

const Dashboard = () => {
  return (
    <div className='bg-[#D0EEEE] min-h-screen p-4 pt-10'>
      <div>
        <Image src={logo} alt="logo" className="w-[120px] " />
      </div>
    </div>
  )
}

export default Dashboard