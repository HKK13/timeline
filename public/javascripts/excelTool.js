/**
 * Created by Kaan on 28/08/15.
 */

var express = require('express'),
    fs = require('fs'),
    pathP = require('path'),
    excel = require('excel4node'),
    checker = require('./checker');
__dir = pathP.join(__dirname, "/..", "json");

var wb;

var sections = ['boogle', 'clipuniverse', 'eteam', 'eos', 'inbetween', 'mam', 'mantra', 'pdp', 'picenter', 'tms'];

var createWorkBook = function (callback) {
    wb = new excel.WorkBook();
    var myStyle = wb.Style();
    myStyle.Font.Alignment.Vertical('center');
    myStyle.Font.Alignment.Horizontal('left');
    myStyle.Font.WrapText(true);
    myStyle.Border({
        top:{
            style:'thin',
            color:'000000'
        },
        bottom:{
            style:'thin',
            color: '000000'
        }
    });

    sections.forEach(function (section) {
        var ws = wb.WorkSheet(section);
        var events;
        if(events = readFile(section)) {
            ws = addCells(ws, events, myStyle);
        }
    });
    writeFile(wb, function (err, file) {
        callback(err, file);
    });
};

var readFile = function (fileName) {
    if (fileName != null && fileName != undefined) {
        var data;
        if(data = fs.readFileSync(pathP.join(__dir, fileName, fileName + ".json"), 'utf-8')) {
            if(data) {
                data = JSON.parse(data);
                return data.events;
            }else
                return null;
        }
    }
};

var writeFile = function (data, callback) {
    var date = new Date(),
        file = pathP.join(__dir, "/..", "exceldocs", date.getDay() + "_" + (date.getMonth()+1) + "_" + date.getFullYear() + "_roadmaps.xlsx");
    data.write(file, function (err) {
        callback(err, file);
    });
};

var addCells = function (worksheet, events, style) {
    var row = events.length;
    if(events.length > 0) {
        var descLen = 0,
            titleLen = 0,
            membersLen = 0;
        for (var i = 1; i <= row; i++) {
            var data = events[i-1];
            if(i==1){
                worksheet.Cell(1,1).String("Start");
                worksheet.Cell(1,2).String("Deadline");
                worksheet.Cell(1,3).String("Status");
                worksheet.Cell(1,4).String("JIRA ID");
                worksheet.Cell(1,5).String("Title");
                worksheet.Cell(1,6).String("Description");
                worksheet.Cell(1,7).String("Contributors");
                worksheet.Cell(1,8).String("Created On");
                worksheet.Cell(1,9).String("Latest Modify");
            }
            var date = data.start_date.day;
            date += "/" + data.start_date.month;
            date += "/" + data.start_date.year;
            worksheet.Cell(i + 1, 1).String(date);
            date = data.end_date.day;
            date += "/" + data.end_date.month;
            date += "/" + data.end_date.year;
            worksheet.Cell(i + 1, 2).String(date);
            worksheet.Cell(i + 1, 4).String(data.text.jiraId);
            worksheet.Cell(i + 1, 5).String(data.text.headline);
            worksheet.Cell(i + 1, 6).String(data.text.description);
            worksheet.Cell(i + 1, 7).String(data.text.teamMembers.substr(5));

            var updatedate = new Date(data.text.createdOn);
            worksheet.Cell(i + 1, 8).String(updatedate.getDate() + "/" + updatedate.getMonth() + "/" + updatedate.getFullYear());

            if(data.text.latestUpdate != undefined){
                updatedate = new Date(data.text.latestUpdate);
                worksheet.Cell(i + 1, 9).String(updatedate.getDate() + "/" + updatedate.getMonth() + "/" + updatedate.getFullYear());
             }
            else
                worksheet.Cell(i + 1, 9).String("None");
            for(var j = 1; j < 8; j++){
                worksheet.Cell(i+1, j).Style(style);
            }
            if(data.text.isClosed == undefined || data.text.isClosed == false) {
                var status = checker.statusCheck(data.start_date, data.end_date);
                if (status == "DELAYED") {
                    worksheet.Cell(i + 1, 3).String(status);
                    worksheet.Cell(i + 1, 3).Format.Fill.Pattern('solid');
                    worksheet.Cell(i + 1, 3).Format.Fill.Color("red");
                }
                else if (status == "UPCOMING") {
                    worksheet.Cell(i + 1, 3).String(status);
                    worksheet.Cell(i + 1, 3).Format.Fill.Pattern('solid');
                    worksheet.Cell(i + 1, 3).Format.Fill.Color("6666ff");
                }
                else
                    worksheet.Cell(i + 1, 3).String(status);
            }else{
                worksheet.Cell(i + 1, 3).String("CLOSED");
                worksheet.Cell(i + 1, 3).Format.Fill.Pattern('solid');
                worksheet.Cell(i + 1, 3).Format.Fill.Color("green");
            }
            if(data.text.teamMembers.length > membersLen)
                membersLen = data.text.teamMembers.length;
            if(data.text.headline.length > titleLen)
                titleLen = data.text.headline.length;

            worksheet.Column(4).Width(data.text.jiraId.length + 5);
            worksheet.Column(5).Width(titleLen + 5);
            worksheet.Column(6).Width(20);
            worksheet.Column(7).Width(membersLen + 5);
            worksheet.Row(i+1).Height(25);
        }
        worksheet.Row(1).Filter();
    }
    return worksheet;
};

module.exports = {
    createWorkBook: createWorkBook
}