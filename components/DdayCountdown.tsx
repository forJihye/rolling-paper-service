import { countdown } from "helper/utils";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";

let timer: any;
const DdayCountdown: NextPage<{dDay: Date}> = ({dDay}) => {
  const [dDayTime, setDDayTime] = useState(dDay.getTime());
  const daysRef = useRef<HTMLSpanElement>(null);
  const hoursRef = useRef<HTMLSpanElement>(null);
  const minutesRef = useRef<HTMLSpanElement>(null);
  const secondsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!daysRef.current || !hoursRef.current || !minutesRef.current || !secondsRef.current) return;
    timer = setInterval(() => {
      const now = Date.now();
      const timeDist = dDayTime - now;
      const days = Math.floor(timeDist / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDist % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDist % (1000 * 60)) / 1000);
      (daysRef.current as HTMLSpanElement).innerText = `${days}일`;
      (hoursRef.current as HTMLSpanElement).innerText = `${hours}시`;
      (minutesRef.current as HTMLSpanElement).innerText = `${minutes}분`;
      (secondsRef.current as HTMLSpanElement).innerText = `${seconds}초`;
    }, 1000);
    return () => {
      clearInterval(timer);
    }
  }, []); 

  const renderTime = () => {
    const {days, hours, minutes, seconds} = countdown(dDayTime);
    return <>
      <span ref={daysRef}>{days}일</span>
      <span ref={hoursRef}>{hours}시</span>
      <span ref={minutesRef}>{minutes}분</span>
      <span ref={secondsRef}>{seconds}초</span>
    </>
  }
  return <div>
    {renderTime()}
  </div>
}

export default DdayCountdown;