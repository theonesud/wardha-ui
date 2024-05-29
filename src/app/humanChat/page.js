"use client";
import React, { useState, useEffect, useRef } from "react";
import backArrow from "../assets/svg/barrow.svg";
import Image from "next/image";
import refresh from "../assets/svg/refresh.svg";
import cam from "../assets/svg/cam.svg";
import send from "../assets/svg/send.svg";
import dot from "../assets/svg/aiDot.svg";
import { useRouter } from "next/navigation";
import CameraCapture from "../components/cameraCapture";

const TalkToHuman = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messagesList, setMessagesList] = useState([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
      textareaRef.current.scrollHeight + "px";
      textareaRef.current.focus();
    }
  }, [message]);

  useEffect(() => {
    const initialMessage = {
      type: 1,
      message: "Connecting you to a beauty advisor. Please wait a moment.",
    };
    setMessagesList([initialMessage]);
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;

    setMessagesList([...messagesList, { type: 0, message }]);
    setMessage("");
  };

  const handleRefresh = () => {
    const initialMessage = {
      type: 1,
      message: "Connecting you to a beauty advisor. Please wait a moment.",
    };
    setMessagesList([initialMessage]);
    setMessage("");
  };

  const handleCapture = (file) => {
    setIsCameraOpen(false);
    const imageUrl = URL.createObjectURL(file);
    setMessagesList((prevMessagesList) => [
      ...prevMessagesList,
      { type: 0, message: "Photo captured", images: [imageUrl] },
    ]);

    // You can handle the captured image further if needed
  };

  return (
    <div className="h-screen flex flex-col bg-[#F4FBFB]">
      {isCameraOpen && (
        <CameraCapture
          onCapture={handleCapture}
          onClose={() => setIsCameraOpen(false)}
        />
      )}
      {/* Header */}
      <div className="sticky top-0 bg-[#F4FBFB] z-10">
        <div className="flex justify-between px-3 pt-3">
          <div onClick={() => router.push("/dashboard")}>
            <Image src={backArrow} alt="back" />
          </div>
          <div onClick={handleRefresh}>
            <Image src={refresh} alt="refresh" />
          </div>
        </div>
        <hr className="border-[0.3px] border-customCyan mt-3" />
      </div>

      {/* Chat Area */}
      <div className="flex-grow font-sans overflow-y-auto p-3">
        {messagesList.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.type === 0 ? "justify-end" : "justify-start"
            } mb-2`}
          >
            {msg.type === 1 && (
              <div className="flex flex-col items-start">
                <div className="flex gap-4 font-light ">
                  <div>
                    <Image src={dot} alt="dot" />
                  </div>
                  <div className="text-xs text-black opacity-60">
                    Wardah AI Assistant -
                  </div>
                </div>
                <div
                  className={`rounded-2xl mx-4 my-2 px-4 py-2 max-w-[80%] text-base font-light text-black ${
                    msg.type === 0 ? "bg-white" : "bg-aiChatBg"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            )}

            {msg.type === 0 && (
              <div className="flex flex-col items-end">
                <div className="rounded-2xl drop-shadow-md bg-white mx-2 px-4 py-2 text-base font-light text-black">
                  {msg.message}
                </div>
                {msg.images && msg.images.length > 0 && (
                  <div className="mt-2">
                    {msg.images.map((image, idx) => (
                      <div key={idx} className="w-[150px] p-2 font-light">
                        <img src={image} alt="Captured" width={150} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      {/* <div className="bg-white flex items-center gap-4 p-3 px-4 shadow-md sticky bottom-0">
        <div onClick={() => setIsCameraOpen(true)}>
          <Image src={cam} alt="cam" />
        </div>
        <div className="relative flex-grow">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder="Type a message"
            className="w-full bg-gray-100 rounded-full py-2 px-4 text-gray-800 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
          />
          <div
            onClick={sendMessage}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          >
            <Image src={send} alt="send" />
          </div>
        </div>
      </div> */}
      <div className="w-screen flex items-center justify-center gap-4 py-4 px-5 bg-white">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Type a message"
          className=" w-full h-auto  flex-1 outline-none focus:outline-none resize-none bg-none no-scrollbar"
          rows={1}
        />
        {!message ? (
          <div
            onClick={() => setIsCameraOpen(true)}
            className=" w-10 h-10 flex justify-center items-center cursor-pointer"
          >
            <Image src={cam} alt="cam" />
          </div>
        ) : (
          <div
            onClick={sendMessage}
            // className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            className="w-10 h-10 cursor-pointer"
          >
            <Image src={send} alt="send" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TalkToHuman;
