import React,{useState} from "react";

const SuggestionContainer = ({ text, handleClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <div 
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => handleClick(text)}
      className={`${
        hover
          ? " bg-suggestionsBorder  text-white"
          : "border border-suggestionsBorder bg-white text-suggestionsBorder"
      } text-sm px-4 py-2 rounded-full font-light`}
    >
      {text}
    </div>
  );
};

export default SuggestionContainer;
