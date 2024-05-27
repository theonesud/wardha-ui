"use client";
import Image from "next/image";
import React from "react";
import logo from "@/app/assets/images/logo.png";
import chat from "../assets/svg/chat-with-ai.svg";
import scan from "../assets/svg/scan.svg";
import talk from "../assets/svg/talk-to-human.svg";
import DashboardOption from "@/app/components/dashboardOption";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  const options = [
    {
      image: chat,
      heading: "Chat with AI assistant",
      description:
        "Chat with an AI assistant for skincare advice and personalized product recommendations.",
      buttonText: "Chat",
      handleClick: () => {
        router.push("/aiChat");
      },
    },
    {
      image: scan,
      heading: "Scan a wardah product",
      description:
        "Scan your product and get instant details or ask any questions about it.",
      buttonText: "Scan a Product",
      handleClick: () => {
        router.push("/scanProduct"); // Navigate to ScanProduct component
      },
    },
    {
      image: talk,
      heading: "Talk to a human.",
      description:
        "Consult our Virtual Beauty Advisor for expert insights tailored to your skin.",
      buttonText: "Chat",
      handleClick: () => {
        router.push("/talkWithHuman");
      },
    },
  ];
  return (
    <div className="bg-[#D0EEEE] min-h-screen p-4 pt-10 max-w-[100vw] overflow-x-hidden">
      <div className="w-full ">
        <Image src={logo} alt="logo" />
      </div>
      <div className="text-headerText font-medium text-3xl leading-10 mt-14 mb-5">
        Hello there.
        <br /> How can we help?
      </div>
      <div className="flex flex-col gap-4 mt-2 w-full">
        {options.map((option, id) => (
          <DashboardOption
            image={option.image}
            heading={option.heading}
            description={option.description}
            handleClick={option.handleClick}
            buttonText={option.buttonText}
            key={id}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
