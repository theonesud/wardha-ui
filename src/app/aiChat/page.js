"use client";
import React, { useState, useEffect } from "react";
import backArrow from "../assets/svg/barrow.svg";
import Image from "next/image";
import refresh from "../assets/svg/refresh.svg";
import cam from "../assets/svg/cam.svg";
import send from "../assets/svg/send.svg";
import dot from "../assets/svg/aiDot.svg";
import SuggestionContainer from "../components/suggestionContainer";
import Loader from "../components/loader";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CameraCapture from "../components/cameraCapture";

const AiChat = ({ searchParams }) => {
  console.log(searchParams)
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messagesList, setMessagesList] = useState([]);
  const [threadId, setThreadId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(searchParams?.isScan);

  useEffect(() => {
    const initialMessage = {
      type: 1,
      message:
        "👋 Welcome to Wardah's skincare assistant! How can I help you today?",
      suggestions: [],
    };
    setMessagesList([initialMessage]);
  }, []);

  const makeApiCall = async (messageText, showResponse = false) => {
    console.log(showResponse, "showResponse")
    if (showResponse) {
      const res = await fetch(
        "https://walrus-app-hs2a9.ondigitalocean.app/assistant/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            thread_id: threadId,
            question: JSON.stringify(messageText),
          })
        }
      );
    } else {
      const userMessage = messageText || message;
      setMessagesList([...messagesList, { type: 0, message: userMessage }]);
      setMessage("");
      setLoading(true);

      const res = await fetch(
        "https://walrus-app-hs2a9.ondigitalocean.app/assistant/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            thread_id: threadId,
            question: userMessage,
          }),
        }
      );

      const data = await res.json();
      setLoading(false);
      setThreadId(data.thread_id || threadId);
      addBotMessage(data.response, data.suggestions, data?.products);
    }
  };

  const handleRefresh = () => {
    const initialMessage = {
      type: 1,
      message:
        "👋 Welcome to Wardah's skincare assistant! How can I help you today?",
      suggestions: [],
    };
    setMessagesList([initialMessage]);
    setThreadId("");
    setMessage("");
  };

  console.log(messagesList, "messagesList");

  const addBotMessage = (response, suggestions, products) => {
    let currentIndex = 0;
    const botMessage = {
      type: 1,
      message: "",
      suggestions: suggestions || [],
      image: products ? products : null,
    };

    const typingEffect = setInterval(() => {
      if (currentIndex < response?.length) {
        botMessage.message += response[currentIndex];
        setMessagesList((prevMessagesList) => [
          ...prevMessagesList.slice(0, -1),
          botMessage,
        ]);
        currentIndex++;
      } else {
        clearInterval(typingEffect);
      }
    }, 25);

    setMessagesList((prevMessagesList) => [...prevMessagesList, botMessage]);
  };

  const handleCapture = (file) => {
    setIsCameraOpen(false);
    setMessagesList([
      ...messagesList,
      { type: 0, message: "Photo captured", images: [URL.createObjectURL(file)] },
    ]);
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file, "captured.jpeg");

    fetch("https://walrus-app-hs2a9.ondigitalocean.app/assistant/scan", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        console.log(response, 'lkfjdslkf')
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json()
      })
      .then((res) => {
        makeApiCall(res, true)
        console.log(res, 'lkfjdslkf')
        setLoading(false);
        setThreadId(res.thread_id || threadId);
        addBotMessage("", [], [{ featured_image: res.image_url, title: res.product_name, benefits: res.benefits, url: res.product_url, description: res.description }]);
        console.log("Scan result:", data);

      })
      .catch((error) => {
        console.error("Error during file upload:", error);
      });
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
          <div
            onClick={() => {
              router.push("/dashboard");
            }}
          >
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
            className={`flex ${msg.type === 0 ? "justify-end" : "justify-start"
              } mb-2`}
          >
            {msg.type === 1 && (
              <div className="flex flex-col items-start">
                <div className="flex gap-4 font-light">
                  <div>
                    <Image src={dot} alt="dot" />
                  </div>
                  <div className="text-xs text-black opacity-60">
                    Wardah AI Assistant -
                  </div>
                </div>
                {msg.image && msg.image.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    <div className="rounded-2xl bg-aiChatBg px-4 py-2 mx-5 my-2 max-w-[80%] text-base font-light text-black">
                      Based on your skin type these are the suggested products
                    </div>
                    <div className="flex flex-row flex-wrap gap-6">
                      {msg.image.map((img, idx) => (
                        <Link href={img.url} target="_blank" key={idx}>
                          <div className="w-[150px] border rounded-md p-2 font-light">
                            <img
                              src={img.featured_image}
                              alt="Product"
                              width={150}
                              height={150}
                            />
                            <div className="text-[12px] font-medium">
                              {img.title}
                            </div>
                            <div className="text-wrap text-[12px]">
                              {img.benefits}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-aiChatBg px-4 py-2 mx-5 my-2 max-w-[80%] text-base font-light text-black">
                    {msg.message}
                  </div>
                )}

                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mx-4 max-w-[80%]">
                    {msg.suggestions.map((suggestion, idx) => (
                      <SuggestionContainer
                        key={idx}
                        text={suggestion}
                        handleClick={() => makeApiCall(suggestion)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {msg.type === 0 && (
              <div className="flex flex-col items-end">
                <div className="rounded-2xl drop-shadow-md  bg-white mx-2 px-4 py-2  text-base font-light text-black">
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
        {loading && (
          <div className="rounded-2xl bg-aiChatBg px-4 py-2 mx-5 my-2 max-w-[20%] ">
            <Loader />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white flex items-center gap-4 p-3 px-4 shadow-md sticky bottom-0">
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
            onClick={() => makeApiCall()}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          >
            <Image src={send} alt="send" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChat;
