import dayjs, { Dayjs } from "dayjs";

export class DateService {
  /**
   * Converts a string to a Dayjs or Date object.
   * @param date - The date string to convert.
   * @param toNativeDate - If true, returns a native Date object; otherwise, returns a Dayjs object.
   * @returns A Dayjs or Date object representing the input date string.
   */
  static stringToDate(
    date: string,
    toNativeDate: boolean = false
  ): Dayjs | Date {
    const dayJSDate = dayjs(date);
    return toNativeDate ? dayJSDate.toDate() : dayJSDate;
  }

  /**
   * Converts a Unix timestamp to a formatted date string.
   * @param unix - The Unix timestamp to convert.
   * @param format - The format string to use for the output.
   * @returns A formatted date string.
   */
  static unixToFormat(unix: number, format: string): string {
    return dayjs.unix(unix).format(format);
  }

  /**
   * Converts a Unix timestamp to a date.
   * @param unix - The Unix timestamp to convert.
   * @param toNativeDate - If true, returns a native Date object; otherwise, returns a Dayjs object.
   * @returns A Dayjs or Date object representing the input date string.
   */
  static unixToDate(unix: number, toNativeDate: boolean = false): Dayjs | Date {
    const dayJSDate = dayjs.unix(unix);
    return toNativeDate ? dayJSDate.toDate() : dayJSDate;
  }
}
