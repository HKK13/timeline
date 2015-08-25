/**
 * Created by Kaan on 03/08/15.
 */

var boolList = [],
    isOpen = false,
    isEditOpen = false,
    timelines = [],
    timelineSlideID,
    currentSectionNum,
    anchors = ['Boogle', 'ClipUniverse', 'eTeam', 'EOS', 'InBetween', 'MAM', 'Mantra', 'PDP', 'PICenter', 'TMS'];


$(document).ready(function () {
    var currentSection;
    $('#fullpage').fullpage({
        autoScrolling: true,
        fitToSection: true,
        scrollBar: true,
        touchSensitivity: 15,
        scrollingSpeed: 500,
        anchors: ['Boogle', 'ClipUniverse', 'eTeam', 'EOS', 'InBetween', 'MAM', 'Mantra', 'PDP', 'PICenter', 'TMS'],
        afterLoad: function (anchorLink, index) {
            currentSection = anchorLink;
            currentSectionNum = index;
            var links = document.getElementsByTagName("a");
            for (var i = 0; i < 10; i++) {
                links[i].style.color = "#ffffff";
                if (links[i].href.indexOf(anchorLink) !== -1)
                    links[i].style.color = "#000000";
            }
            getContent(index);
        }
    });

    document.getElementById("editItemForm").reset();

    //ITEM ADD
    document.getElementById("itemAddButton").addEventListener("click", function () {
        var form = document.getElementById("addItemForm").getElementsByTagName("select");
        form[0].value = currentSection;
        $('#loadingBackground').fadeIn(1000);
        $('#addItemDialog').show().animate({
            marginTop: "+=56px",
            width: "+=290px",
            height: "+=460px",
            opacity: 1
        }, 1000);
        $('#addItemForm').fadeIn(2000);
        isOpen = true;
    });

    var isBusy = false;
    $('#addItemForm').submit(function (event) {
        event.preventDefault();
        isBusy = true;
        var data = new FormData(this);
        $.ajax({
            'url': '/InsertItem',
            'type': 'POST',
            'data': data,
            contentType: false,
            processData: false,
            'success': function (res) {
                isBusy = false;
                timelines[currentSectionNum - 1].add(res);
                timelines[currentSectionNum - 1].goToId(convertStringEng(res.text.headline.toLowerCase().replace(" ", "-")));
                closePops();
                $('.editButton').click(function () {
                    $('#loadingBackground').fadeIn(800);
                    $('#editItemDialog').show().animate({
                        opacity: 1
                    }, 500);
                    $('#editItemForm').fadeIn(1000);
                    var inputs = document.getElementById('editItemForm').getElementsByTagName("input");
                    var obj = timelines[currentSectionNum - 1].getDataById(timelineSlideID);
                    var docId = obj.text.docId;
                    var date = obj.start_date.data;
                    inputs[0].value = date.day + "/" + date.month + "/" + date.year;
                    date = obj.end_date.data;
                    inputs[1].value = date.day + "/" + date.month + "/" + date.year;
                    inputs[2].value = obj.text.headline;
                    inputs[3].value = obj.text.jiraId;
                    inputs[4].value = docId;
                    inputs[5].value = currentSection;
                    var textareas = document.getElementById('editItemForm').getElementsByTagName("textarea");
                    textareas[0].value = obj.text.description;
                    textareas[1].value = obj.text.teamMembers.substr(6) + ", ";
                    isEditOpen = true;
                });
            },
            'error': function () {
                isBusy = false;
                alert("Something went wrong :(");
            }
        });
    });

    //ITEM DELETE
    document.getElementById('deletePostButton').addEventListener('click', function () {
        isBusy = true;
        var data = new FormData(document.getElementById('editItemForm'));//Create multipart-form data
        $("#dialog-confirm").dialog({//Juery-UI Dialog
            autoOpen: true,
            height: 220,
            width: 300,
            modal: true,
            buttons: {
                "Yes, I am.": function () {
                    $("#dialog-confirm").dialog("close");
                    $.ajax({
                        'url': '/DeleteItem',
                        'type': 'POST',
                        'data': data,
                        contentType: false,
                        processData: false,
                        'success': function (res) {
                            isBusy = false;
                            timelines[currentSectionNum - 1].removeId(timelineSlideID);
                            timelines[currentSectionNum - 1].goToId("-1");
                            closePops();
                        },
                        'error': function (err) {
                            isBusy = false;
                            alert("Something went wrong. Message: " + err);
                        }
                    });
                },
                Cancel: function () {
                    $(this).dialog("close");

                }
            }
        });
    });

    //PICTURE CHANGE
    $('#editPicture').change(function () {
        var data = new FormData(document.getElementById('editItemForm'));//Create multipart-form data
        $.ajax({
            'url': '/ChangePicture',
            'type': 'POST',
            'data': data,
            contentType: false,
            processData: false,
            'success': function (res) {
                isBusy = false;
                document.querySelector("img[src$='" + res.oldUrl + "']").src = res.newUrl;
            },
            'error': function () {
                isBusy = false;
                alert("Something went wrong :(");
            }
        });
    });

    //ITEM EDIT
    $('#editItemForm').submit(function (event) {
        event.preventDefault();
        isBusy = true;
        var data = new FormData(this);//Create multipart-form data
        $.ajax({
            'url': '/EditItem',
            'type': 'POST',
            'data': data,
            contentType: false,
            processData: false,
            'success': function (res) {
                isBusy = false;
                timelines[currentSectionNum - 1].removeId(timelineSlideID);
                timelines[currentSectionNum - 1].add(res);
                timelines[currentSectionNum - 1].goToId(convertStringEng(res.text.headline.toLowerCase().replace(" ", "-")));
                closePops();
                $('.editButton').click(function () {
                    $('#loadingBackground').fadeIn(800);
                    $('#editItemDialog').show().animate({
                        opacity: 1
                    }, 500);
                    $('#editItemForm').fadeIn(1000);
                    var inputs = document.getElementById('editItemForm').getElementsByTagName("input");
                    var obj = timelines[currentSectionNum - 1].getDataById(timelineSlideID);
                    var docId = obj.text.docId;
                    var date = obj.start_date.data;
                    inputs[0].value = date.day + "/" + date.month + "/" + date.year;
                    date = obj.end_date.data;
                    inputs[1].value = date.day + "/" + date.month + "/" + date.year;
                    inputs[2].value = obj.text.headline;
                    inputs[3].value = obj.text.jiraId;
                    inputs[4].value = docId;
                    inputs[5].value = currentSection;
                    var textareas = document.getElementById('editItemForm').getElementsByTagName("textarea");
                    textareas[0].value = obj.text.description;
                    textareas[1].value = obj.text.teamMembers.substr(6) + ", ";
                    isEditOpen = true;
                });
            },
            'error': function () {
                isBusy = false;
                alert("Something went wrong :(");
            }
        });
    });

    $('#itemCloseButton').click(function (event) {
        $.ajax({
            'url': '/CloseItem/' + anchors[currentSectionNum - 1] + "/" + timelines[currentSectionNum - 1].getDataById(timelineSlideID).text.docId,
            'type': 'GET',
            'success': function (res) {
                closePops();
                window.location.reload();
            },
            'error': function () {
                isBusy = false;
                alert("Something went wrong :(");
            }
        });
    });

    //Keyboard arrow key listener
    $(document).keydown(function (e) {
        switch (e.which) {
            case 37: // left
                timelines[currentSectionNum - 1].goToPrev();
                break;
            case 39: // right
                timelines[currentSectionNum - 1].goToNext();
                break;
            default:
                return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
});


function getContent(index) {
    if (!boolList[index - 1]) {
        requestContent(anchors[index - 1], index);
        boolList[index - 1] = true;
    }
    if (!boolList[index] && index < 10) {
        requestContent(anchors[index], index + 1);
        boolList[index] = true;
    }
    if (!boolList[index - 2] && index > 1) {
        requestContent(anchors[index - 2], index - 1);
        boolList[index - 2] = true;
    }
}


function requestContent(anchor, current) {
    var timeline;
    $.ajax({
        'url': '/' + anchor,
        'type': 'GET',
        'success': function (data) {
            timeline = new VCO.Timeline(('embed' + current), data, {
                width: "100%",
                timenav_position: "bottom",
                relative_date: false,
                duration: 1000,
                ease: VCO.Ease.easeIn(100),
                dragging: true,
                trackResize: true,
                optimal_tick_width: 50,
                slide_padding_lr: 100,
                timenav_height_percentage: 50,
                marker_height_min: 30,
                trackResize: true,
                language: "en"
            });
            timelines[current - 1] = timeline;
            timeline.goToId("-1");
            timeline.on('change', function (object) {
                timelineSlideID = object.uniqueid;
            });
            window.onresize = function (event) {
                timelines[current - 1].updateDisplay();
            };
            $('.editButton').click(function () {
                $('#loadingBackground').fadeIn(800);
                $('#editItemDialog').show().animate({
                    opacity: 1
                }, 500);
                $('#editItemForm').fadeIn(1000);
                var inputs = document.getElementById('editItemForm').getElementsByTagName("input");
                var obj = timelines[current - 1].getDataById(timelineSlideID);
                var docId = obj.text.docId;
                var date = obj.start_date.data;
                inputs[0].value = date.day + "/" + date.month + "/" + date.year;
                date = obj.end_date.data;
                inputs[1].value = date.day + "/" + date.month + "/" + date.year;
                inputs[2].value = obj.text.headline;
                inputs[3].value = obj.text.jiraId;
                inputs[4].value = docId;
                inputs[5].value = anchor;
                var textareas = document.getElementById('editItemForm').getElementsByTagName("textarea");
                textareas[0].value = obj.text.description;
                textareas[1].value = obj.text.teamMembers.substr(6) + ", ";
                isEditOpen = true;
            });
        }
    });

    $(".datepickers").datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: "dd/mm/yy"
    });

    var availableTags = [];
    $.ajax({
        'url': '/TeamMembers',
        'type': 'GET',
        'success': function (res) {
            res.members.forEach(function (item) {
                availableTags.push(item.name);
            });
            function split(val) {
                return val.split(/,\s*/);
            }

            function extractLast(term) {
                return split(term).pop();
            }

            $(".tags").bind("keydown", function (event) {
                if (event.keyCode === $.ui.keyCode.TAB &&
                    $(this).autocomplete("instance").menu.active) {
                    event.preventDefault();
                }
            })
                .autocomplete({
                    minLength: 0,
                    source: function (request, response) {
                        response($.ui.autocomplete.filter(
                            availableTags, extractLast(request.term)));
                    },
                    focus: function () {
                        return false;
                    },
                    select: function (event, ui) {
                        var terms = split(this.value);
                        terms.pop();
                        terms.push(ui.item.value);
                        terms.push("");
                        this.value = terms.join(", ");
                        return false;
                    }
                });
        },
        'error': function () {
            alert("Something went wrong :(");
        }
    });
}


$(document).mouseup(function (e) {
    var container = $("#addItemDialog"),
        container2 = $("#editItemDialog");
    if ((!container.is(e.target) && container.has(e.target).length === 0 && (isOpen || isEditOpen) && !$(e.target).is(".ui-datepicker") && $(e.target).parents(".ui-datepicker").size() == 0) &&
        (!container2.is(e.target) && container2.has(e.target).length === 0) && (!$(e.target).is(".ui-menu-item ") && $(e.target).parents(".ui-menu-item ").size() == 0)) // ... nor a descendant of the container
    {
        closePops();
    }
});

function closePops() {
    if (isOpen) {
        $('#addItemForm').fadeOut(500);
        $('#addItemDialog').hide().animate({
            marginTop: "-=56px",
            width: "-=290px",
            height: "-=460px",
            opacity: 0
        }, 200);
        isOpen = false;
    } else if (isEditOpen) {
        $('#editItemDialog').hide().animate({
            opacity: 0
        }, 200);
        $('#editItemForm').fadeOut(100);
        isEditOpen = false;
    }
    $('#loadingBackground').fadeOut(200);
}

function convertStringEng(returnString) {
    returnString = returnString.replace(/ö/g, 'o');
    returnString = returnString.replace(/ç/g, 'c');
    returnString = returnString.replace(/ş/g, 's');
    returnString = returnString.replace(/ı/g, 'i');
    returnString = returnString.replace(/ğ/g, 'g');
    returnString = returnString.replace(/ü/g, 'u');
    return returnString
}