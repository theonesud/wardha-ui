'use client'
import React from 'react'
import Webcam from 'react-webcam';

const WebcamCapture = () => {
    const [deviceId, setDeviceId] = React.useState(0);
    const [devices, setDevices] = React.useState([]);
    console.log(devices)
  
    const handleDevices = React.useCallback(
      mediaDevices =>
        setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
      [setDevices]
    );
  
    React.useEffect(
      () => {
        navigator.mediaDevices.enumerateDevices().then(handleDevices);
      },
      [handleDevices]
    );
  
    return (
      <>
        {devices.filter((device, index) => index == deviceId).map((device, index) => (
            <div key={index}>
              <Webcam audio={false} videoConstraints={{ deviceId: device.deviceId }} />
              <button onClick={() => setDeviceId(deviceId < devices.length - 1 ? deviceId + 1 : 0)}>Click</button>
            </div>
  
          ))}
      </>
    );
  };

  export default WebcamCapture
