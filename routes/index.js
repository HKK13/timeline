var express = require('express');
var router = express.Router(),
    tlTool = require('../public/javascripts/tlDataTool'),
    fs = require('fs'),
    pathP = require('path'),
    checker = require('../public/javascripts/checker'),
    excelTool = require('../public/javascripts/excelTool');
    multer = require('multer'),//Multer handles multipart/form data.
    storage = multer.diskStorage({
        destination: function (req, file, cb) { //Set destination for file upload.
            cb(null, 'public/uploads')
        },
        filename: function (req, file, cb) { //Set unique filenames and add necessary extensions.
            var extension = file.originalname.split(".").pop();
            cb(null, file.fieldname + '-' + Date.now() + "." + extension)
        }
    }),
    upload = multer({storage: storage}); // Set multer.


__dir = pathP.join(__dirname, "/..", "public", "json");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: "Timeline"});
});


//upload.array('photo) is used for to get only parameters due to multipart/form data.
router.post('/InsertItem', upload.single('photo'), function (req, res) {
    if (checker.isDateBigger(req.body.bDate, req.body.eDate)) { //If dates are valid
        if (checker.dateCheck(req.body.bDate) && checker.dateCheck(req.body.eDate) && req.body.title && req.body.description && req.body.jiraId && req.body.timelineName && req.body.teamMembers) {
            var filename;
            if (req.file)
                filename = req.file.filename;
            else
                filename = "bsh.png"
            tlTool.createItem(req.body.bDate, req.body.eDate, req.body.title, req.body.description, req.body.jiraId, req.body.timelineName, req.body.teamMembers, filename, function (err, event) {//Create event
                if (!err) {
                    var status = checker.statusCheck(event.start_date, event.end_date, event.text.isClosed);
                    var text = "<p class='statusBarText'><a href='https://issuetracking.bsh-sdd.com/browse/" + event.text.jiraId + "' target='_blank'>JIRA ID: " + event.text.jiraId + "</a>  |  STATUS: " + status + "</p><p>" + event.text.description + "</p> <input style='display: none;' type='text' value='" + event.docId + "'><p class='teamMembers'>" + event.text.teamMembers + "</p></p>";
                    event.text.text = text;
                    res.send(event); //Send event back.
                }
                else
                    res.json({ServerResponse: "Item Insert Failed."}).send();
            });
        }
    } else
        res.status(400).send("Invalid Date Interval.");
});

router.get('/getImage/:id', function (req, res) {
    res.sendFile(pathP.join(__dir, "/..", "uploads", req.params.id));
});


/**************  Send info of related section.   *************/
router.get('/Boogle', function (req, res) {
    fs.readFile(pathP.join(__dir, "boogle/boogle.json"), 'utf-8', function (err, data) {
        if (!err) {
            var obj = JSON.parse(data); //Parse string into json.
            obj.events.forEach(function (item) {
                status = checker.statusCheck(item.start_date, item.end_date, item.text.isClosed); //Check status of each event.
                if (item.text.headline != "TODAY") {
                    var text = "<p class='statusBarText'><a href='https://issuetracking.bsh-sdd.com/browse/" + item.text.jiraId + "' target='_blank'>JIRA ID: " + item.text.jiraId + "</a>  |  STATUS: " + status + "</p><p>" + item.text.description + "</p> <input style='display: none;' type='text' value='" + item.docId + "'><p class='teamMembers'>" + item.text.teamMembers + "</p></p>";
                    item.text.text = text;
                }
            });
            tlTool.getTimeNow(obj); //Add today slide.
            res.send(obj);
        } else {
            res.status(400).send();
        }
    });
});

router.get('/ClipUniverse', function (req, res) {
    fs.readFile(pathP.join(__dir, "clipuniverse/clipuniverse.json"), 'utf-8', function (err, data) {
        if (!err) {
            var obj = JSON.parse(data); //Parse string into json.
            obj.events.forEach(function (item) {
                status = checker.statusCheck(item.start_date, item.end_date, item.text.isClosed); //Check status of each event.
                if (item.text.headline != "TODAY") {
                    var text = "<p class='statusBarText'><a href='https://issuetracking.bsh-sdd.com/browse/" + item.text.jiraId + "' target='_blank'>JIRA ID: " + item.text.jiraId + "</a>  |  STATUS: " + status + "</p><p>" + item.text.description + "</p> <input style='display: none;' type='text' value='" + item.docId + "'><p class='teamMembers'>" + item.text.teamMembers + "</p></p>";
                    item.text.text = text;
                }
            });
            tlTool.getTimeNow(obj); //Add today slide.
            res.send(obj);
        } else {
            res.status(400).send();
        }
    });
});

router.get('/eTeam', function (req, res) {
    fs.readFile(pathP.join(__dir, "eteam/eteam.json"), 'utf-8', function (err, data) {
        if (!err) {
            var obj = JSON.parse(data); //Parse string into json.
            obj.events.forEach(function (item) {
                status = checker.statusCheck(item.start_date, item.end_date, item.text.isClosed); //Check status of each event.
                if (item.text.headline != "TODAY") {
                    var text = "<p class='statusBarText'><a href='https://issuetracking.bsh-sdd.com/browse/" + item.text.jiraId + "' target='_blank'>JIRA ID: " + item.text.jiraId + "</a>  |  STATUS: " + status + "</p><p>" + item.text.description + "</p> <input style='display: none;' type='text' value='" + item.docId + "'><p class='teamMembers'>" + item.text.teamMembers + "</p></p>";
                    item.text.text = text;
                }
            });
            tlTool.getTimeNow(obj); //Add today slide.
            res.send(obj);
        } else {
            res.status(400).send();
        }
    });
});

router.get('/EOS', function (req, res) {
    fs.readFile(pathP.join(__dir, "eos/eos.json"), 'utf-8', function (err, data) {
        if (!err) {
            var obj = JSON.parse(data); //Parse string into json.
            obj.events.forEach(function (item) {
                status = checker.statusCheck(item.start_date, item.end_date, item.text.isClosed); //Check status of each event.
                if (item.text.headline != "TODAY") {
                    var text = "<p class='statusBarText'><a href='https://issuetracking.bsh-sdd.com/browse/" + item.text.jiraId + "' target='_blank'>JIRA ID: " + item.text.jiraId + "</a>  |  STATUS: " + status + "</p><p>" + item.text.description + "</p> <input style='display: none;' type='text' value='" + item.docId + "'><p class='teamMembers'>" + item.text.teamMembers + "</p></p>";
                    item.text.text = text;
                }
            });
            tlTool.getTimeNow(obj); //Add today slide.
            res.send(obj);
        } else {
            res.status(400).send();
        }
    });
});

router.get('/InBetween', function (req, res) {
    fs.readFile(pathP.join(__dir, "inbetween/inbetween.json"), 'utf-8', function (err, data) {
        if (!err) {
            var obj = JSON.parse(data); //Parse string into json.
            obj.events.forEach(function (item) {
                status = checker.statusCheck(item.start_date, item.end_date, item.text.isClosed); //Check status of each event.
                if (item.text.headline != "TODAY") {
                    var text = "<p class='statusBarText'><a href='https://issuetracking.bsh-sdd.com/browse/" + item.text.jiraId + "' target='_blank'>JIRA ID: " + item.text.jiraId + "</a>  |  STATUS: " + status + "</p><p>" + item.text.description + "</p> <input style='display: none;' type='text' value='" + item.docId + "'><p class='teamMembers'>" + item.text.teamMembers + "</p></p>";
                    item.text.text = text;
                }
            });
            tlTool.getTimeNow(obj); //Add today slide.
            res.send(obj);
        } else {
            res.status(400).send();
        }
    });
});

router.get('/MAM', function (req, res) {
    fs.readFile(pathP.join(__dir, "mam/mam.json"), 'utf-8', function (err, data) {
        if (!err) {
            var obj = JSON.parse(data); //Parse string into json.
            obj.events.forEach(function (item) {
                status = checker.statusCheck(item.start_date, item.end_date, item.text.isClosed); //Check status of each event.
                if (item.text.headline != "TODAY") {
                    var text = "<p class='statusBarText'><a href='https://issuetracking.bsh-sdd.com/browse/" + item.text.jiraId + "' target='_blank'>JIRA ID: " + item.text.jiraId + "</a>  |  STATUS: " + status + "</p><p>" + item.text.description + "</p> <input style='display: none;' type='text' value='" + item.docId + "'><p class='teamMembers'>" + item.text.teamMembers + "</p></p>";
                    item.text.text = text;
                }
            });
            tlTool.getTimeNow(obj); //Add today slide.
            res.send(obj);
        } else {
            res.status(400).send();
        }
    });
});

router.get('/Mantra', function (req, res) {
    fs.readFile(pathP.join(__dir, "mantra/mantra.json"), 'utf-8', function (err, data) {
        if (!err) {
            var obj = JSON.parse(data); //Parse string into json.
            obj.events.forEach(function (item) {
                status = checker.statusCheck(item.start_date, item.end_date, item.text.isClosed); //Check status of each event.
                if (item.text.headline != "TODAY") {
                    var text = "<p class='statusBarText'><a href='https://issuetracking.bsh-sdd.com/browse/" + item.text.jiraId + "' target='_blank'>JIRA ID: " + item.text.jiraId + "</a>  |  STATUS: " + status + "</p><p>" + item.text.description + "</p> <input style='display: none;' type='text' value='" + item.docId + "'><p class='teamMembers'>" + item.text.teamMembers + "</p></p>";
                    item.text.text = text;
                }
            });
            tlTool.getTimeNow(obj); //Add today slide.
            res.send(obj);
        } else {
            res.status(400).send();
        }
    });
});

router.get('/PDP', function (req, res) {
    fs.readFile(pathP.join(__dir, "pdp/pdp.json"), 'utf-8', function (err, data) {
        if (!err) {
            var obj = JSON.parse(data); //Parse string into json.
            obj.events.forEach(function (item) {
                status = checker.statusCheck(item.start_date, item.end_date, item.text.isClosed); //Check status of each event.
                if (item.text.headline != "TODAY") {
                    var text = "<p class='statusBarText'><a href='https://issuetracking.bsh-sdd.com/browse/" + item.text.jiraId + "' target='_blank'>JIRA ID: " + item.text.jiraId + "</a>  |  STATUS: " + status + "</p><p>" + item.text.description + "</p> <input style='display: none;' type='text' value='" + item.docId + "'><p class='teamMembers'>" + item.text.teamMembers + "</p></p>";
                    item.text.text = text;
                }
            });
            tlTool.getTimeNow(obj); //Add today slide.
            res.send(obj);
        } else {
            res.status(400).send();
        }
    });
});

router.get('/PICenter', function (req, res) {
    fs.readFile(pathP.join(__dir, "picenter/picenter.json"), 'utf-8', function (err, data) {
        if (!err) {
            var obj = JSON.parse(data); //Parse string into json.
            obj.events.forEach(function (item) {
                status = checker.statusCheck(item.start_date, item.end_date, item.text.isClosed); //Check status of each event.
                if (item.text.headline != "TODAY") {
                    var text = "<p class='statusBarText'><a href='https://issuetracking.bsh-sdd.com/browse/" + item.text.jiraId + "' target='_blank'>JIRA ID: " + item.text.jiraId + "</a>  |  STATUS: " + status + "</p><p>" + item.text.description + "</p> <input style='display: none;' type='text' value='" + item.docId + "'><p class='teamMembers'>" + item.text.teamMembers + "</p></p>";
                    item.text.text = text;
                }
            });
            tlTool.getTimeNow(obj); //Add today slide.
            res.send(obj);
        } else {
            res.status(400).send();
        }
    });
});

router.get('/TMS', function (req, res) {
    fs.readFile(pathP.join(__dir, "tms/tms.json"), 'utf-8', function (err, data) {
        if (!err) {
            var obj = JSON.parse(data); //Parse string into json.
            obj.events.forEach(function (item) {
                status = checker.statusCheck(item.start_date, item.end_date, item.text.isClosed); //Check status of each event.
                if (item.text.headline != "TODAY") {
                    var text = "<p class='statusBarText'><a href='https://issuetracking.bsh-sdd.com/browse/" + item.text.jiraId + "' target='_blank'>JIRA ID: " + item.text.jiraId + "</a>  |  STATUS: " + status + "</p><p>" + item.text.description + "</p> <input style='display: none;' type='text' value='" + item.docId + "'><p class='teamMembers'>" + item.text.teamMembers + "</p></p>";
                    item.text.text = text;
                }
            });
            tlTool.getTimeNow(obj); //Add today slide.
            res.send(obj);
        } else {
            res.status(400).send();
        }
    });
});

router.post('/EditItem', upload.array(), function (req, res) {
    if (checker.isDateBigger(req.body.bDate, req.body.eDate)) {
        tlTool.editItem(req.body.bDate, req.body.eDate, req.body.title, req.body.description, req.body.jiraId, req.body.teamMembers, req.body.postTimeline, req.body.postId, function (err, event) {
            if (!err) {
                var status = checker.statusCheck(event.start_date, event.end_date, event.text.isClosed);
                var text = "<p class='statusBarText'><a href='https://issuetracking.bsh-sdd.com/browse/" + event.text.jiraId + "' target='_blank'>JIRA ID: " + event.text.jiraId + "</a>  |  STATUS: " + status + "</p><p>" + event.text.description + "</p> <input style='display: none;' type='text' value='" + event.docId + "'><p class='teamMembers'>" + event.text.teamMembers + "</p></p>";
                event.text.text = text;
                res.send(event);
            }
            else {
                res.status(400).send("Nope");
            }
        });
    } else
        res.status(400).send("Nope");
});

router.post('/ChangePicture', upload.single('photoEdit'), function (req, res) {
    tlTool.changePicture(req.file.filename, req.body.postTimeline, req.body.postId, function (err, link, oldLink) {
        if (!err) {
            res.json({oldUrl: oldLink, newUrl: link}).send();
        } else
            res.status(500).send("Nope");
    });
});

router.get('/TeamMembers', function (req, res) {
    fs.readFile(pathP.join(__dir, "teammembers.json"), 'utf-8', function (err, data) {
        if (!err) {
            var obj = JSON.parse(data);
            res.send(obj);
        } else {
            res.status(400).send();
        }
    });
});
/****************  END JSON GET  **************/


router.post('/DeleteItem', upload.array(), function (req, res) {//upload.array() is used for to get only parameters due to multipart/form data.
    tlTool.deleteItem(req.body.postId, req.body.postTimeline, function (err) {
        if (!err)
            res.send("OK");
        else
            res.status(500).send(err);
    });
});

router.get('/CloseItem/:timeline/:postId', function (req, res) {
    var filePath = pathP.join(__dir, req.params.timeline.toLowerCase(), req.params.timeline.toLowerCase()+".json");
    fs.readFile(filePath, 'utf-8', function (err, data) {
        data = JSON.parse(data);    //Parse string into json.
        data.events.forEach(function(object){
            if(object.text.docId == req.params.postId){ //Search for specified file.
                if(!object.text.isClosed || object.text.isClosed == undefined)
                    object.text.isClosed = true;
                else if(object.text.isClosed != undefined && object.text.isClosed == true)
                    object.text.isClosed = false;
                object.text.latestUpdate = Date.now();
                tlTool.writeElement(filePath, data, function (err) { //Write into file.
                    if(!err)
                        res.send('/#' + req.params.timeline); //Send response.
                });
            }
        });
    });
});

//Sends an Excel document that contains all timelines.
router.get('/GetXLSX/:file', function (req, res) {
    excelTool.createWorkBook(function (err, file) {
        if(!err)
            res.sendFile(file, file.split('/').pop());
        else
            res.status(500).send();
    })
});

module.exports = router;
