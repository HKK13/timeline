/**
 * Created by Kaan on 06/08/15.
 */

var express = require('express'),
    fs = require('fs'),
    pathP = require('path');
__dir = pathP.join(__dirname, "/..", "json");
__downloadDir = pathP.join(__dirname, "/..");

var getEventTemplate = function () {
    var eventTemplate = {
        "media": {
            "url": "",
            "caption": "",
            "credit": ""
        },
        "start_date": {
            "month": "",
            "day": "",
            "year": ""
        },
        "end_date": {
            "year": "",
            "month": "",
            "day": ""
        },
        "text": {
            "headline": "",
            "text": "",
            "jiraId": "",
            "teamMembers": "",
            "color": {
                r: "",
                g: "",
                b: ""
            },
            "docId": ""
        }
    };
    return eventTemplate;
};


//Create an event and write it into json.
var createItem = function (bDate, eDate, title, description, jiraId, timeline, teamMembers, filename, callback) {
    filePath = pathP.join(__dir, timeline, timeline + ".json");
    fs.readFile(filePath, 'utf-8', function (err, data) {
        if (!err) {
            var obj = JSON.parse(data); //Parse file string into json.
            var tempArr = bDate.split("/"); //split date.
            var eventTemplate = getEventTemplate();
            if (obj.events.length === 0) //If there is no events in json.
                eventTemplate.text.docId = 1;
            else {
                eventTemplate.text.docId = (obj.events[obj.events.length - 1].text.docId + 1)
            }
            if (filename != null) // If there is a file -> Due to default image is it necessary? If it works don't fix it.
                eventTemplate.media.url = "/getImage/" + filename;

            eventTemplate.start_date.year = tempArr.pop();
            eventTemplate.start_date.month = tempArr.pop();
            eventTemplate.start_date.day = tempArr.pop();

            tempArr = eDate.split("/");
            eventTemplate.end_date.year = tempArr.pop();
            eventTemplate.end_date.month = tempArr.pop();
            eventTemplate.end_date.day = tempArr.pop();

            eventTemplate.text.headline = title;
            eventTemplate.text.jiraId = jiraId;
            eventTemplate.text.description = description;
            eventTemplate.text.createdOn = Date.now();

            var members = splitTeamMembers(teamMembers);

            eventTemplate.text.teamMembers = members;

            obj.events.push(eventTemplate); //Add event into json.
            fs.writeFile(filePath, JSON.stringify(obj), {flag: "w"}, function (err) { //Write it into file.
                if (!err)
                    callback(false, eventTemplate);
                else
                    callback(err);
            });
        } else {
            callback(err);
        }
    });
};


var editItem = function (bDate, eDate, title, description, jiraId, teamMembers, timeline, postId, callback) {
    //Read json from file.
    fs.readFile(pathP.join(__dir, timeline.toLowerCase(), timeline.toLowerCase() + ".json"), 'utf-8', function (err, data) {
        if (!err) {
            var obj = JSON.parse(data),//Parse file string into json object.
                singleEvent;
            obj.events.forEach(function (element) { //Get specified event by id.
                if (element.text.docId == postId)
                    singleEvent = element;
            });
            if (bDate) { //Edit begin date.
                var sDate = bDate.split("/");
                singleEvent.start_date.year = sDate.pop();
                singleEvent.start_date.month = sDate.pop();
                singleEvent.start_date.day = sDate.pop();
            }
            if (eDate) { //Edit end date.
                var fDate = eDate.split("/");
                singleEvent.end_date.year = fDate.pop();
                singleEvent.end_date.month = fDate.pop();
                singleEvent.end_date.day = fDate.pop();
            }
            if (title)
                singleEvent.text.headline = title;
            if (description)
                singleEvent.text.description = description;
            if (jiraId)
                singleEvent.text.jiraId = jiraId;
            if (teamMembers) {
                var team = splitTeamMembers(teamMembers);
                singleEvent.text.teamMembers = team;
            }
            singleEvent.text.latestUpdate = Date.now();
            //Write json into file.
            writeElement(pathP.join(__dir, timeline.toLowerCase(), timeline.toLowerCase() + ".json"), (obj), function (err) {
                if (!err)
                    callback(false, singleEvent);
                else
                    callback(err);
            });
        }
    });
};


var changePicture = function (filename, timeline, postId, callback) {
    //Read json from file.
    fs.readFile(pathP.join(__dir, timeline.toLowerCase(), timeline.toLowerCase() + ".json"), 'utf-8', function (err, data) {
        if (!err) {
            var obj = JSON.parse(data),//Parse file string into json object.
                singleEvent;
            obj.events.forEach(function (element) {//Get specified event by id.
                if (element.text.docId == postId)
                    singleEvent = element;
            });
            if (filename) { //If file exists.
                var oldUrl = singleEvent.media.url.split("/").pop(); //Update image url.
                singleEvent.media.url = "/getImage/" + filename;
                if (oldUrl != "bsh.png")
                    fs.unlinkSync(pathP.join(__downloadDir, "uploads", oldUrl)); //Remove old file.
            }
            //Write json to file.
            writeElement(pathP.join(__dir, timeline.toLowerCase(), timeline.toLowerCase() + ".json"), obj, function (err) {
                if (!err)
                    callback(false, singleEvent.media.url, oldUrl);
                else
                    callback(err);
            });
        }
    });
};

//Split team members into array. (e.g. ""Selen Akan, Erman Aygün, Ferhat Doğan" intp ["Selen Akan", "Erman Aygün", "Ferhat Doğan"])
var splitTeamMembers = function (teamMembers) {
    var team = teamMembers.split(", "),
        teamString;
    team.forEach(function (member, index) {
        if (index == 0)
            teamString = "Team: " + member;
        else if (member.trim())
            teamString = teamString + ", " + member
    });
    return teamString;
};


var getTimeNow = function (jsonObj) { //Adds today slider.
    var timer = new Date();
    var eventTemplate = {
        "start_date": {
            "month": "",
            "day": "",
            "year": ""
        },
        "text": {
            "headline": "",
            "text": ""
        }
    };
    if (timer.getDate().length != 2) //If day number is less than 10 insert 0 at the beginning. (e.g. if day number is 2 then output is 02)
        eventTemplate.start_date.day = "0" + timer.getDate();
    else
        eventTemplate.start_date.day = timer.getDate();
    if (timer.getMonth().length != 2)//Same for month if is less than 10.
        eventTemplate.start_date.month = "0" + (timer.getMonth() + 1);
    else
        eventTemplate.start_date.month = (timer.getMonth() + 1);
    eventTemplate.start_date.year = "" + timer.getFullYear() + "";
    eventTemplate.text.headline = "Today";
    eventTemplate.text.text = "<p>You are here.</p>";
    eventTemplate.unique_id = "-1";
    jsonObj.events.push(eventTemplate); //Does not write object into file. Will be added to list before sending whole event list every time.
    return jsonObj;
};


var deleteItem = function (postId, timeline, callback) {
    fs.readFile(pathP.join(__dir, timeline.toLowerCase(), timeline.toLowerCase() + ".json"), 'utf-8', function (err, data) {
        if (!err) {
            var obj = JSON.parse(data),
                singleEvent;
            obj.events.forEach(function (item, index) {//Search for post id in specified timeline.
                if (item.text.docId == postId) {
                    singleEvent = item;
                    obj.events.splice(index, 1); //Delete event from events array of json.
                }
            });
            //Write object into file.
            var fileWritePath = pathP.join(__dir, timeline.toLowerCase(), timeline.toLowerCase() + ".json");
            if (singleEvent && singleEvent.media) {
                var photo = singleEvent.media.url.split("/").pop(); //Hold image for deletion.
                writeElement(fileWritePath, obj, function (err) {
                    if (!err) {
                        callback(false);
                        if (photo != "bsh.png") {
                            fs.unlink(pathP.join(__downloadDir, "uploads", photo), function (err) {//Delete image after file is written.
                                if (err)
                                    console.log("Cannot delete:\t" + photo + " \terr: \t" + err);
                            });
                        }
                    } else {
                        callback(err);
                    }
                });
            }
        } else {
            callback(err);
        }
    });
};


var writeElement = function (path, obj, callback) { //Actual file writing.
    fs.writeFile(path, JSON.stringify(obj), function (err) {
        if (!err) {
            callback(false);
        } else
            callback(err);
    });
};

module.exports = {
    createItem: createItem,
    getTimeNow: getTimeNow,
    editItem: editItem,
    deleteItem: deleteItem,
    changePicture: changePicture,
    writeElement: writeElement
};

