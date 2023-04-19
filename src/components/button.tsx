import React, { FC, MouseEvent } from "react";

interface ButtonProps {
  color?: "red" | "green" | "yellow" | "blue" | "black" | "white";
  text: string;
  handleClick?: (event?: MouseEvent) => void;
  type?: "button" | "submit" | "reset";
  full?: boolean;
}

const buttonColors = {
  red: "bg-red-800 active:ring-red-800 active:ring-2 text-white",
  green: "bg-green-800 active:ring-green-800 active:ring-2 text-white",
  yellow: "bg-yellow-800 active:ring-yellow-800 active:ring-2 text-white",
  black: "bg-black active:ring-black active:ring-2 text-white",
  blue: "bg-blue-800 active:ring-blue-800 active:ring-2 text-white",
  white: "bg-white active:ring-white active:ring-2 text-black",
};

export const Button: FC<ButtonProps> = ({ type, color, text, full, handleClick }) => {
  return (
    <button
      className={`py-2 px-3 lg:px-4 rounded-md my-2 ${full ? "w-full" : ""} ${
        color ? buttonColors[color] : buttonColors["black"]
      }`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};
