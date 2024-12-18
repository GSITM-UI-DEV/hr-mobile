export const getDaysBetweenDates = (startDate: any, endDate: any) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const differenceInMs = end.getTime() - start.getTime();
  const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
  return Math.floor(differenceInDays + 1);
}