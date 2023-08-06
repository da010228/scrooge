import React, { useState, useEffect } from "react";
import styles from "./ProgressBar.module.css";

const ProgressBar = ({ goal, consum, setGoal }) => {
  const [progress, setProgress] = useState(0);
  const [inputValue, setWeeklyGoal] = useState("");

  const handleChange = (event) => {
    setWeeklyGoal(event.target.value);
  };
  const handleSave = () => {
    console.log(inputValue);
    setGoal(inputValue);
  };

  useEffect(() => {
    console.log(goal, consum);
    setProgress(consum / goal);
  }, [consum, goal]);

  return (
    <div className={styles["progress-bar-container"]}>
      <div className={styles["progress-bar-bg"]}>
        {goal === 0 || progress < 1 ? (
          <div
            className={styles["progress-bar"]}
            style={{
              width: `${progress * 100}%`,
            }}
          />
        ) : (
          <div className={styles["progress-bar-red"]} />
        )}
      </div>
      <div>
        {goal ? (
          <p className={styles["progress-text"]}>
            이번 주 남은 금액: {goal - consum}원
          </p>
        ) : (
          <div className={styles.setting}>
            <span>주간목표 </span>
            <input value={inputValue} onChange={handleChange} />
            <span>원 </span>
            <button onClick={handleSave}>설정</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;