import React from "react";

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 text-gray-500 px-3 py-2">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
      <span
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></span>
      <span
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "0.4s" }}
      ></span>
    </div>
  );
};

export default TypingIndicator;
