import React, { useState, useRef, useEffect } from "react";
import Recapture from "../assets/svg/recapture.svg";
import Upload from "../assets/svg/upload.svg";
import Capture from "../assets/svg/capture.svg";
import Toggle from "../assets/svg/toggle.svg";
import Close from "../assets/svg/close.svg";
import UploadFromDevice from "../assets/svg/uploadFromDevice.svg";

const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState("user");

  useEffect(() => {
    if (!capturedImage) {
      const startCamera = async () => {
        if (stream) {
          // Stop the existing stream
          stream.getTracks().forEach((track) => track.stop());
        }
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode },
          });
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }

          // Automatically capture the image after 3 seconds
          // setTimeout(() => {
          //   handleCaptureClick();
          // }, 5000);

        } catch (err) {
          console.error("Error accessing camera: ", err);
        }
      };

      startCamera();

      return () => {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      };
    }
  }, [facingMode, capturedImage]);

  const handleCaptureClick = () => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      const imageDataUrl = canvasRef.current.toDataURL("image/png");
      // setCapturedImage(imageDataUrl);
      fetch(imageDataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "captured.png", { type: "image/png" });
          onCapture(file);
        });
    }
  };

  const handleToggleCamera = () => {
    setFacingMode((prevFacingMode) =>
      prevFacingMode === "user" ? "environment" : "user"
    );
  };

  const handleUploadClick = () => {
    if (capturedImage) {
      fetch(capturedImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "captured.png", { type: "image/png" });
          onCapture(file);
        });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
        onCapture(file);
      };
      reader.readAsDataURL(file); // Corrected this line
    }
  };

  return (
    <div className="camera-overlay">
      {capturedImage ? (
        <>
          <img src={capturedImage} alt="Captured" className="captured-image" />
          <div className="button-container flex items-center justify-center gap-10">
            <div className="flex flex-col items-center gap-3">
              <div
                className=" cursor-pointer"
                onClick={() => setCapturedImage(null)}
              >
                <img src={Recapture.src} />
              </div>
              <div className="text-sm font-light text-suggestionsBorder">
                Click again
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className=" cursor-pointer" onClick={handleUploadClick}>
                <img src={Upload.src} />
              </div>
              <div className="text-sm font-light text-suggestionsBorder">
                Upload
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera-video"
          ></video>
          <canvas
            ref={canvasRef}
            width={640}
            height={620}
            style={{ display: "none" }}
          ></canvas>
          <div className="button-container flex items-center justify-center gap-10">
            <div className="flex flex-col items-center gap-3">
              <div
                className=" cursor-pointer w-20 h-20 flex items-center justify-center rounded-full bg-black opacity-60"
                onClick={handleToggleCamera}
              >
                <img src={Toggle.src} />
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div
                className="cursor-pointer w-20 h-20"
                onClick={handleCaptureClick}
              >
                <img src={Capture.src} />
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className=" cursor-pointer w-20 h-20 flex items-center justify-center rounded-full bg-black opacity-60" onClick={() => fileInputRef.current.click()}>
                <img src={UploadFromDevice.src} />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </>
      )}
      <button
        className="cursor-pointer w-12 h-12 flex items-center justify-center rounded-full bg-black opacity-60 absolute top-5 right-5"
        onClick={() => {
          onClose();
        }}
      >
        <img src={Close.src} />
      </button>
    </div>
  );
};

export default CameraCapture;
