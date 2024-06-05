'use client'
import React from 'react'
import logo from '../assets/images/logo.png'
import Image from 'next/image'
import mainImg from '../assets/images/main.png'
import Button from '@/app/components/button'
import { useRouter } from 'next/navigation';

const HomePage = () => {

    const router = useRouter();

    const handleNavigate = () => {
        router.push('/dashboard')
    }
    return (
        <div className=' flex flex-col  items-center gap-6 p-4 pt-[120px]'>
            <div className='flex justify-center '>
                <Image src={logo} alt="logo" className="w-32  " />
            </div>
            <div className='flex justify-center'>
                <Image src={mainImg} alt="main" className="w-64 max-w-[90%] " />
            </div>
            <div className='w-full max-w-[90%] flex justify-center items-center'>
                <div className='flex flex-col gap-4'>
                    <div className='font-medium text-[5vw] text-center text-[#181818] font-sans'>
                        Welcome to Beauty Advisor
                    </div>
                    <div className='flex text-wrap text-center justify-center font-medium text-[3vw] text-[#79798C] font-sans'>
                        AI Beauty Advisors analyze your skin type, concerns, and preferences to suggest the most suitable products.
                    </div>
                </div>
            </div>
            <div className='w-full max-w-[90%] flex justify-center'>
                <Button text='Get Started' onClick={handleNavigate} color='bg-[#067A6F]' textColor='text-white' size='md' additionalClasses='w-full' />
            </div>
        </div>
    )
}

export default HomePage
