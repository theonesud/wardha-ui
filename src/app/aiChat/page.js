"use client";
import React, { useState } from "react";
import backArrow from "../assets/svg/barrow.svg";
import Image from "next/image";
import refresh from "../assets/svg/refresh.svg";
import cam from "../assets/svg/cam.svg";
import send from "../assets/svg/send.svg";
import dot from "../assets/svg/aiDot.svg";
import SuggestionContainer from "../components/suggestionContainer";

const AiChat = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState([]);
  const [messagesList, setMessagesList] = useState([]);
  const [threadId, setThreadId] = useState("");

  console.log(messagesList, 'fkljdslf')

  const makeApiCall = async () => {
    setMessagesList([...messagesList, { type: 0, message: message }]);
    setMessage("");
    const res = await fetch(
      "https://walrus-app-hs2a9.ondigitalocean.app/assistant/ask",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          thread_id: threadId,
          question: message,
        }),
      }
    );

    const data = await res.json();
    setMessagesList([
      ...messagesList,
      { type: 1, message: data.response, suggestions: data.suggestions },
    ]);
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
      <div className="flex-grow overflow-y-auto p-3">
      {messagesList.map(msg => console.log(msg))}
        {messagesList.map((msg, index) => {
          msg.type ? (
            <div>
              <div className="flex items-start justify-start gap-1">
                <div>
                  <img src={dot} />
                </div>
                <div className="flex flex-col gap-4 font-light">
                  <div className=" text-xs text-black opacity-60">
                    Wardah AI Assistant -
                  </div>
                </div>
                <div className="rounded-2xl bg-aiChatBg px-4 py-2 max-w-[80%] text-base font-light text-black">
                  {msg.message}
                </div>
                {msg?.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 max-w-[80%]">
                    {msg.suggestions.map((suggestion) => (
                      <SuggestionContainer
                        text={suggestion}
                        handleClick={() => makeApiCall(suggestion)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white px-4 py-2 max-w-[80%] text-base font-light text-black">
              {msg.message}
            </div>
          );
        })}
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
            onClick={makeApiCall}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <Image src={send} alt="send" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChat;
