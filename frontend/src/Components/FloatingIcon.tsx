import React from "react";

interface FloatingIconProps {
  image: string;
  posx: string;
  posy: string;
  rotate: string;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({
  image,
  posx,
  posy,
  rotate,
}) => {
  return (
    <img
      src={image}
      alt="icon"
      className={`size-20 rounded-3xl fixed ${posx} ${posy} ${rotate} border-gray-400 border-2 p-1.5 z-10`}
    />
  );
};

export default FloatingIcon;
