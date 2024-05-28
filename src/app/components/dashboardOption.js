import React from 'react'
import Button from './button'
import Link from 'next/link'

const DashboardOption = ({href, image, heading, description, buttonText, handleClick}) => {
    console.log(image)
  return (
    <Link href={href} className='border-0.6 border-customCyan rounded-[0.6px] p-5'>
        <div className='flex items-start justify-start gap-4'>
            <div className=' bg-white p-2 rounded-[4px]'>
                <img src={image.src} className='w-8 object-cover' alt="image"/>
            </div>
            <div className='flex flex-col gap-1 items-start justify-start'>
                <div className='text-sm font-light text-customIndigo'>{heading}</div>
                <div className='font-light text-xs text-customDarkGrey w-56'>{description}</div>
            </div>
        </div>
        <div className='flex items-center justify-end mt-3'>
            <Button text={buttonText} onClick={handleClick} color='bg-[#067A6F]' textColor='text-white' size='sm' additionalClasses='w-32' />
            {/* <Button text={buttonText} onClick={handleClick} additionalClasses='w-[280px]' /> */}
        </div>
    </Link>
  )
}

export default DashboardOption
