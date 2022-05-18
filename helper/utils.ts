import { formatInTimeZone } from "date-fns-tz"

export const dateFormat = (date: string, format: string = 'yyyy-MM-dd HH:mm:ss') => {
  return formatInTimeZone(date, 'Asia/Seoul', format);
}

export const countdown = (time: number) => {
  const now = Date.now();
  const timeDist = time - now;
  const days = Math.floor(timeDist / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDist % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDist % (1000 * 60)) / 1000);
  return {days, hours, minutes, seconds}
}

export const removeTimeFromDate = (now: Date) => {
  const years = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();
  return new Date(years, month, date, 0, 0, 0);
}