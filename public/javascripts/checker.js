/**
 * Created by Kaan on 06/08/15.
 */
var express = require('express');

var dateCheck = function (date, callback) {
    var dateArr = splitDate(date),
        year = dateArr.pop(),
        month = dateArr.pop(),
        day = dateArr.pop();

    if ((day.length == 2 && day < 32 && day > 0) && (month.length == 2 && month < 13 && month > 0) && (year.length == 4))
        return true;
    else
        return false;
};

var isDateBigger = function (date1, date2) { //Check if date2 is bigger than date1
    var dateArr1 = splitDate(date1),
        dateArr2 = splitDate(date2);
    if (dateCheck(date1) && dateCheck(date2)) {
        if (dateArr2[2] > dateArr1[2])
            return true;
        else if (dateArr2[2] == dateArr1[2]) {
            if (dateArr2[1] > dateArr1[1])
                return true;
            else if (dateArr2[1] == dateArr1[1]) {
                if (dateArr2[0] >= dateArr1[0])
                    return true;
            }
        }
        return false;
    } else {
        throw("Date is not valid.");
    }
};

var splitDate = function (date) { //Splits date into 3 parts "02/10/2015" into ["02", "10", "2015"].
    if (date.indexOf("-") !== -1)
        item = "-";
    else
        item = "/";
    return date.split(item);
};

var statusCheck = function (startDate, endDate, isClosed) { //Check status of event.
    var date = new Date();
    var status;
    if(isClosed == undefined || !isClosed) {
        if ((startDate.year > date.getFullYear()) || (startDate.year == date.getFullYear() &&
            (startDate.month > (date.getMonth() + 1))) || ((startDate.year == date.getFullYear() &&
            (startDate.month == (date.getMonth() + 1))) && startDate.day >= date.getDate()))
            status = "UPCOMING";
        else if ((endDate.year > date.getFullYear()) || (endDate.year == date.getFullYear() &&
            (endDate.month > (date.getMonth() + 1))) || (endDate.year == date.getFullYear() &&
            (endDate.month == (date.getMonth() + 1)) && endDate.day >= date.getDate()))
            status = "IN PROGRESS";
        else
            status = "DELAYED";
    }else
        status = "CLOSED"
    return status;
}

module.exports = {
    dateCheck: dateCheck,
    statusCheck: statusCheck,
    isDateBigger: isDateBigger
};