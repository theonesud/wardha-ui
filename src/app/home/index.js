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
        <div className='flex flex-col justify-center items-center gap-10 mt-14'>
            <div className='flex justify-center '>
                <Image src={logo} alt="logo" className="w-40 " />
            </div>
            <div className='flex justify-center'>
                <Image src={mainImg} alt="logo" className="w-[300px] " />
            </div>
            <div className='w-[280px] flex justify-center items-center'>
                <div className='flex  flex-col gap-5 '>
                    <div className='font-medium text-[20px] text-center text-[#181818] font-sans'>
                        Welcome to Beauty Advisor
                    </div>
                    <div className=' flex text-wrap text-center justify-center font-medium text-[12px] text-[#79798C] font-sans'>
                        AI Beauty Advisors analyze your skin type, concerns, and preferences to suggest the most suitable products.
                    </div>
                </div>
            </div>
            <div>
                <Button text='Get Started' onClick={handleNavigate} color='bg-[#067A6F]' textColor='text-white' size='md' additionalClasses='w-[280px]' />
            </div>
        </div>
    )
}

export default HomePage