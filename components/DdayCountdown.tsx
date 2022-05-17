import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";

const DdayCountdown: NextPage<{dDay: Date}> = ({dDay}) => {
  const [dDayTime, setDDayTime] = useState(dDay.getTime());
  const daysRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const secondsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInterval(() => {
      const now = Date.now();
      const timeDist = dDayTime - now;
      const days = Math.floor(timeDist / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDist % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDist % (1000 * 60)) / 1000);
      (daysRef.current as HTMLDivElement).innerText = `${days}일`;
      (hoursRef.current as HTMLDivElement).innerText = `${hours}시`;
      (minutesRef.current as HTMLDivElement).innerText = `${minutes}분`;
      (secondsRef.current as HTMLDivElement).innerText = `${seconds}초`;
    }, 1000);
  }, []); 

  return <div>
    <span ref={daysRef}>0일</span>
    <span ref={hoursRef}>0시</span>
    <span ref={minutesRef}>0분</span>
    <span ref={secondsRef}>0초</span>
  </div>
}

export default DdayCountdown;