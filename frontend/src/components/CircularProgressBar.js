import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircularProgressBar = ({ percentage, size }) => {
  return (
    <div style={{ width: size, height: size }}>
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={buildStyles({
          textSize: "16px",
          pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
          textColor: "#3e98c7",
          trailColor: "#d6d6d6",
          backgroundColor: "#3e98c7",
        })}
      />
    </div>
  );
};

export default CircularProgressBar;
