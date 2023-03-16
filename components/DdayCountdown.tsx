import { setYear } from "date-fns";
import { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";

let timer: any;
let dayBefore: boolean = false;
const DdayCountdown: NextPage<{dDay: Date}> = ({dDay}) => {
  const [now, setNow] = useState<Date>();

  const timeDist = useMemo(() => {
    const getTime = () => dDay.getTime() - (setYear(now as Date, dDay.getFullYear()).getTime());
    return getTime();
  }, [ dDay, now ]);

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
    const days = Math.floor(timeDist / (1000 * 60 * 60 * 24));
    (days <= 1) && (dayBefore = true);
    return days;
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

  return <div className={`inline-block pl-3 text-base ${dayBefore ? 'text-gray-500' : 'text-pink'}`}>
    <span>{getDays()}일</span>
    <span>{getHours()}시</span>
    <span>{getMinutes()}분</span>
    <span>{getSeconds()}초</span>
  </div>
}

export default DdayCountdown;