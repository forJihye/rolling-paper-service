import { formatInTimeZone } from "date-fns-tz"

export const dateFormat = (date: string, format: string = 'yyyy-MM-dd HH:mm:ss') => {
  return formatInTimeZone(date, 'Asia/Seoul', format);
}