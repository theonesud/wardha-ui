'use client';
import React, { useState, useEffect, useRef } from 'react';
import backArrow from '../assets/svg/barrow.svg';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import refresh from '../assets/svg/refresh.svg';
import cam from '../assets/svg/cam.svg';
import dot from '../assets/svg/aiDot.svg';
import whiteball from '../assets/svg/whiteball.svg';
import SuggestionContainer from '../components/suggestionContainer';
import Loader from '../components/loader';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CameraCapture from '../components/cameraCapture';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import Button from '../assets/svg/Button.svg';
import rocket from '../assets/svg/rocket.svg';
import headerLogo from '../assets/svg/headerlogo.svg';

const AiChat = ({ searchParams }) => {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [messagesList, setMessagesList] = useState([]);
    const [threadId, setThreadId] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(searchParams?.isScan);
    const textareaRef = useRef(null);
    const chatEndRef = useRef(null);
    const chatAreaRef = useRef(null);
    const headerRef = useRef(null);
    const inputAreaRef = useRef(null);
    const [isTextAreaFocused, setIsTextAreaFocused] = useState(false);
    const isKeyboardOpen = useDetectKeyboardOpen();
    const [initialFocus, setInitialFocus] = useState(true);
    const [showScrollDownArrow, setShowScrollDownArrow] = useState(false);

    useEffect(() => {
        const initialMessage = {
            type: 1,
            message:
                'Thank you for visiting our store! 😊 How can I help with your skincare needs today?',
            suggestions: [],
        };
        setMessagesList([initialMessage]);
    }, []);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            if (!searchParams?.isScan) {
                if (textareaRef.current && initialFocus) {
                    textareaRef.current.focus();
                    setInitialFocus(false); // Prevent future auto-focus
                }
            }
        }
    }, [message, initialFocus]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messagesList]);

    useEffect(() => {
        const handleScroll = () => {
            if (chatAreaRef.current) {
                const { scrollTop, scrollHeight, clientHeight } =
                    chatAreaRef.current;
                setShowScrollDownArrow(
                    scrollHeight > clientHeight &&
                        scrollTop < scrollHeight - clientHeight
                );
            }
        };

        if (chatAreaRef.current) {
            chatAreaRef.current.addEventListener('scroll', handleScroll);
        }

        // Initial check to set arrow visibility
        handleScroll();

        return () => {
            if (chatAreaRef.current) {
                chatAreaRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const handleFocus = () => {
        setIsTextAreaFocused(true);
    };

    const handleBlur = () => {
        setIsTextAreaFocused(false);
    };

    const makeApiCall = async (messageText, showResponse = false) => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }

        const userMessage = messageText || message;
        setMessagesList([...messagesList, { type: 0, message: userMessage }]);
        setMessage('');
        setLoading(true);

        const res = await fetch('http://localhost:8000/assistant/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                thread_id: threadId,
                question: userMessage,
                chat_history: messagesList.map((msg) => ({
                    role: msg.type === 0 ? 'user' : 'assistant',
                    content: msg.message,
                })),
            }),
        });
        const data = await res.json();
        setLoading(false);
        setThreadId(data.thread_id || threadId);
        addBotMessage(data.response, data.suggestions, data?.products);
    };

    const handleRefresh = () => {
        const initialMessage = {
            type: 1,
            message:
                'Thank you for visiting our store! 😊 How can I help with your skincare needs today?',
            suggestions: [],
        };
        setMessagesList([initialMessage]);
        setThreadId('');
        setMessage('');
    };

    const addBotMessage = (response, suggestions, products) => {
        let currentIndex = 0;
        const botMessage = {
            type: 1,
            message: '',
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
                // Ensure both message and image are shown
                setMessagesList((prevMessagesList) => [
                    ...prevMessagesList.slice(0, -1),
                    botMessage,
                ]);
            }
        }, 3);
    };

    const handleCapture = (file) => {
        setIsCameraOpen(false);
        setMessagesList([
            ...messagesList,
            {
                type: 0,
                message: 'Photo captured',
                images: [URL.createObjectURL(file)],
            },
        ]);
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file, 'captured.jpeg');

        fetch('http://localhost:8000/assistant/scan', {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((res) => {
                makeApiCall(res, true);
                setLoading(false);
                setThreadId(res.thread_id || threadId);
                addBotMessage(
                    '',
                    [],
                    [
                        {
                            featured_image: res.image_url,
                            title: res.product_name,
                            benefits: res.benefits,
                            url: res.product_url,
                            description: res.description,
                        },
                    ]
                );
            })
            .catch((error) => {
                console.error('Error during file upload:', error);
            });
    };

    const handleScrollDown = () => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div>
            <div className={`flex flex-col bg-[#F4FBFB] ${'h-screen'}`}>
                {isCameraOpen && (
                    <CameraCapture
                        onCapture={handleCapture}
                        onClose={() => setIsCameraOpen(false)}
                    />
                )}
                <div
                    ref={headerRef}
                    className="header fixed w-full top-0 bg-[#F4FBFB] z-10"
                >
                    <div className="flex justify-between px-3 pt-[2px]">
                        <div onClick={() => router.push('/dashboard')}>
                            <Image src={backArrow} alt="back" />
                        </div>
                        <div className="flex justify-center items-center">
                            <Image src={headerLogo} alt="logo" />
                        </div>
                        <div onClick={handleRefresh}>
                            <Image src={refresh} alt="refresh" />
                        </div>
                    </div>
                    <hr className="border-[0.3px] border-customCyan mt-1" />
                </div>

                <div
                    ref={chatAreaRef}
                    className="flex-grow font-sans overflow-y-auto p-3"
                    style={{ paddingTop: '5rem', paddingBottom: '2rem' }}
                >
                    {messagesList.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                msg.type === 0 ? 'justify-end' : 'justify-start'
                            } mb-2`}
                        >
                            {msg.type === 1 && (
                                <div className="flex flex-col items-start">
                                    <div className="flex gap-4 justify-center items-center font-light">
                                        <div>
                                            <Image src={dot} alt="dot" />
                                        </div>
                                        <div className="text-xs text-black opacity-60">
                                            Wardah AI Assistant -
                                        </div>
                                    </div>
                                    {msg.message && (
                                        <div
                                            style={{
                                                borderRadius:
                                                    '0 16px 16px 16px',
                                            }}
                                            className="bg-aiChatBg px-4 py-2 mx-5 my-2 max-w-[80%] text-base font-light text-black"
                                        >
                                            <ReactMarkdown>
                                                {msg.message}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                    {msg.image && msg.image.length > 0 && (
                                        <div className="flex flex-col gap-2 mx-5 my-2">
                                            <div className="flex flex-row flex-wrap gap-6">
                                                {msg.image.map((img, idx) => (
                                                    <Link
                                                        href={img.url}
                                                        target="_blank"
                                                        key={idx}
                                                    >
                                                        <div className="w-[150px] border rounded-md p-2 font-light">
                                                            <img
                                                                src={
                                                                    img.featured_image
                                                                }
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
                                    )}
                                    {msg.suggestions &&
                                        msg.suggestions.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mx-5 max-w-[80%]">
                                                {msg.suggestions.map(
                                                    (suggestion, idx) => (
                                                        <SuggestionContainer
                                                            key={idx}
                                                            text={suggestion}
                                                            handleClick={() =>
                                                                makeApiCall(
                                                                    suggestion
                                                                )
                                                            }
                                                        />
                                                    )
                                                )}
                                            </div>
                                        )}
                                </div>
                            )}

                            {msg.type === 0 && (
                                <div className="flex relative flex-col items-end overflow-x-hidden">
                                    <div className="flex justify-end items-end">
                                        <div
                                            ref={chatEndRef}
                                            style={{
                                                borderRadius:
                                                    '16px 16px 0 16px',
                                            }}
                                            className="drop-shadow-sm bg-white px-5 py-2 mx-2 max-w-[75%] text-base font-light text-black"
                                        >
                                            {msg.message}
                                        </div>
                                        <div className="">
                                            <Image src={whiteball} alt="dot" />
                                        </div>
                                    </div>
                                    {msg.images && msg.images.length > 0 && (
                                        <div className="mt-2">
                                            {msg.images.map((image, idx) => (
                                                <div
                                                    key={idx}
                                                    className="w-[150px] p-2 font-light"
                                                >
                                                    <img
                                                        src={image}
                                                        alt="Captured"
                                                        width={150}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {loading && <Loader />}
                </div>
                <div
                    onClick={handleScrollDown}
                    className={`fixed bottom-16 left-[48%] cursor-pointer ${
                        showScrollDownArrow ? 'block' : 'hidden'
                    }`}
                >
                    <Image src={Button} alt="button" />
                </div>

                <div style={{ background: '#F4FBFB', minHeight: '57px' }}>
                    <div
                        ref={inputAreaRef}
                        className={`input-area ${
                            !isKeyboardOpen && 'fixed bottom-0'
                        } flex w-[95%] ml-3 py-2 h-auto items-end border border-[#E6E6E6] justify-center gap-4 px-6 bg-white`}
                        style={{
                            minHeight: '40px',
                            border: '2px solid #E8E8E8',
                            borderRadius: '16px',
                            paddingLeft: '8px',
                            paddingTop: '4px',
                            paddingBottom: '4px',
                            paddingRight: '5px',
                            marginBottom: '4px',
                        }}
                    >
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onFocus={handleFocus}
                            onChange={(e) => setMessage(e.target.value)}
                            type="text"
                            placeholder="Type a message"
                            className="w-full h-auto flex-1 outline-none focus:outline-none resize-none bg-none no-scrollbar"
                            style={{
                                height: '40px',
                                padding: '8px 0',
                                margin: '0 8px',
                                fontSize: '16px',
                            }}
                            rows={1}
                        />
                        {!message ? (
                            <div
                                onClick={() => setIsCameraOpen(true)}
                                className="w-10 h-10 flex justify-center items-center cursor-pointer"
                            >
                                <Image src={cam} alt="cam" />
                            </div>
                        ) : (
                            <div
                                onClick={() => {
                                    makeApiCall();
                                }}
                                className="w-10 h-10 flex justify-center items-center cursor-pointer"
                            >
                                <Image src={rocket} alt="send" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiChat;
