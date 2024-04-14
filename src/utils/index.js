function getHoursSelectList() {
  return Array.from({ length: 24 }, (_, i) => {
    return {
      value: i,
      label: i.toString().padStart(2, "0") + ":00",
    };
  });
}

function dateToYYYYMMDD(date, separator = "-") {
  return `${date.getFullYear()}${separator}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${separator}${date
    .getDate()
    .toString()
    .padStart(2, "0")}`;
}

function getFirstDateAllowedToReserve() {
  const today = new Date();
  if (today.getHours() >= 23) {
    today.setDate(today.getDate() + 1);
  }
  today.setHours(0, 0, 0, 0);
  return today;
}
function getFirstHourAllowedToReserve(date) {
  const today = new Date();
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    if (today.getSeconds() > 0) {
      return today.getHours() + 1;
    }
    return today.getHours();
  }
  return 0;
}
export {
  getFirstHourAllowedToReserve,
  getHoursSelectList,
  dateToYYYYMMDD,
  getFirstDateAllowedToReserve,
};
