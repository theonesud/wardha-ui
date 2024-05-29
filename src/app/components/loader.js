import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

const Loader = () => {

    return (
        
        <div className="rounded-2xl bg-aiChatBg px-4 py-2 mx-5 my-2 inline-flex items-center gap-2">
            
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
