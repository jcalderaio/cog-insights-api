const { startOfMonth, endOfMonth, isBefore, addMonths } = require("date-fns");

const monthsBetween = (xstartDate, xendDate) => {
  var result = [];

  let startDate = startOfMonth(xstartDate);
  let endDate = endOfMonth(xendDate);

  if (isBefore(endDate, startDate)) {
    startDate = startOfMonth(endDate);
  }

  while (isBefore(startDate, endDate)) {
    result.push(startDate);
    startDate = addMonths(startDate, 1);
  }

  return result;
};

exports.monthsBetween = monthsBetween;
