"use client";
import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';
import backArrow from "../assets/svg/barrow.svg";
import Image from "next/image";

const ScanProduct = () => {
  const webcamRef = useRef(null);
  const router = useRouter();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc); // You can handle the captured image here
  }, [webcamRef]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#D0EEEE]">
      <div className="absolute top-0 left-0 p-4" onClick={() => { router.push('/dashboard') }}>
        <Image src={backArrow} alt="back" />
      </div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-full h-full"
        
      />
      <button
        onClick={capture}
        className="mt-4 px-4 py-2 bg-[#067A6F] text-white rounded-lg"
      >
        Capture
      </button>
    </div>
  );
};

export default ScanProduct;
