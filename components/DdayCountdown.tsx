import { setYear } from "date-fns";
import { NextPage } from "next";
import { useEffect, useState } from "react";

let timer: any;
const DdayCountdown: NextPage<{dDay: Date}> = ({dDay}) => {
  const [now, setNow] = useState<Date>();

  const timeDist = dDay.getTime() - (setYear(now as Date, dDay.getFullYear()).getTime());

  useEffect(() => {
    setNow(new Date())
    timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    }
  }, []); 

  const getDays = () => {
    return Math.floor(timeDist / (1000 * 60 * 60 * 24));
  }
  const getHours = () => {
    return Math.floor((timeDist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  }
  const getMinutes = () => {
    return Math.floor((timeDist % (1000 * 60 * 60)) / (1000 * 60));
  }
  const getSeconds = () => {
    return Math.floor((timeDist % (1000 * 60)) / 1000);
  }

  return <div>
    <span>{getDays()}일</span>
    <span>{getHours()}시</span>
    <span>{getMinutes()}분</span>
    <span>{getSeconds()}초</span>
  </div>
}

export default DdayCountdown;