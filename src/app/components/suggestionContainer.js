import React from "react";

const SuggestionContainer = ({ text, handleClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`${
        hover
          ? " bg-suggestionsBorder text-white"
          : "border border-suggestionsBorder bg-white text-suggestionsBorder"
      } text-sm font-light`}
    >
      {text}
    </div>
  );
};

export default SuggestionContainer;
