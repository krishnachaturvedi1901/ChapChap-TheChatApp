export const isDateValid = (inputDate) => {
  const dateArr = inputDate.split("/");
  if (dateArr.length !== 3) {
    return { valid: false, date: "" };
  }
  const [day, month, year] = dateArr.map((num) => {
    num = num.trim();
    if (isNaN(+num)) {
      return false;
    }
    return +num;
  });
  const currentYear = new Date().getFullYear();
  if (
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12 ||
    year < 1950 ||
    year > +currentYear
  ) {
    return { valid: false, date: "" };
  }
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return { valid: false, date: "" };
  }
  return { valid: true, date: date };
};

export const checkAndCompareDates = (joinDate, endDate) => {
  const joinResult = isDateValid(joinDate);
  const endResult = isDateValid(endDate);
  if (joinResult.valid && endResult.valid) {
    return joinResult.date < endResult.date;
  }
  return false;
};
