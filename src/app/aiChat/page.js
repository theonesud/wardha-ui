"use client";
import React, { useState, useEffect } from "react";
import backArrow from "../assets/svg/barrow.svg";
import Image from "next/image";
import refresh from "../assets/svg/refresh.svg";
import cam from "../assets/svg/cam.svg";
import send from "../assets/svg/send.svg";
import dot from "../assets/svg/aiDot.svg";
import SuggestionContainer from "../components/suggestionContainer";
import Loader from "../components/loader"; // Assume you have a loader component

const AiChat = () => {
  const [message, setMessage] = useState("");
  const [messagesList, setMessagesList] = useState([]);
  const [threadId, setThreadId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialMessage = {
      type: 1,
      message: "👋 Welcome to Wardah's skincare assistant! How can I help you today?",
      suggestions: [],
    };
    setMessagesList([initialMessage]);
  }, []);

  const makeApiCall = async (messageText) => {
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
    setThreadId(data.thread_id);
    addBotMessage(data.response, data.suggestions);
  };

  const addBotMessage = (response, suggestions) => {
    let currentIndex = 0;
    const botMessage = { type: 1, message: "", suggestions: suggestions || [] };

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

  return (
    <div className="h-screen flex flex-col bg-[#F4FBFB]">
      {/* Header */}
      <div className="sticky top-0 bg-[#F4FBFB] z-10">
        <div className="flex justify-between px-3 pt-3">
          <div>
            <Image src={backArrow} alt="back" />
          </div>
          <div
            onClick={() => {
              setMessagesList([]);
              setThreadId("");
            }}
          >
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
                <div className="flex gap-4 font-light">
                  <div>
                    <Image src={dot} />
                  </div>
                  <div className="text-xs text-black opacity-60">
                    Wardah AI Assistant -
                  </div>
                </div>
                <div className="rounded-2xl bg-aiChatBg px-4 py-2 mx-5 my-2 max-w-[80%] text-base font-light text-black">
                  {msg.message}
                </div>
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
              <div className="rounded-2xl drop-shadow-md bg-white px-4 py-2 max-w-[80%] text-base font-light text-black">
                {msg.message}
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
        <div>
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
}

export default AiChat;