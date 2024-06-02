import React, { useState, useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';

const Loader = () => {
    const [step, setStep] = useState(0);
    const steps = [
        "Thinking",
        "Almost Done"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(prevStep => {
                if (prevStep < steps.length - 1) {
                    return prevStep + 1;
                } else {
                    clearInterval(interval);
                    return prevStep;
                }
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    };

    return (
        <div className="rounded-2xl bg-aiChatBg px-4 py-2 mx-5 my-2 inline-flex items-center gap-2">
            <p>{steps[step]}</p>
            <ThreeDots
                visible={true}
                height="40"
                width="40"
                color="#4fa94d"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    );
}

export default Loader;