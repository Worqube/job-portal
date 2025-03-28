"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

function Navheader() {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <div>
      <ul
        className="relative mx-auto flex w-fit rounded-full border-2 border-black bg-white p-0"
        onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
      >
        <Tab setPosition={setPosition}>Home</Tab>
        <Tab setPosition={setPosition}>Settings</Tab>
        <Cursor position={position} />
      </ul>
    </div>
  );
}

const Tab = ({ children, setPosition }) => {
  const ref = useRef(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase text-white mix-blend-difference md:px-5 md:py-3 md:text-base"
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-7 rounded-full bg-black md:h-12"
    />
  );
};

export default Navheader;
