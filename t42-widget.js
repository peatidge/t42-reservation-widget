/// <reference path="node_modules/@types/jquery/index.d.ts"/>
/// <reference path="node_modules/@types/moment/moment.d.ts"/>
(function () { var w = window; initJQuery(w); })();
function initJQuery(w) {
    if (!w.jQuery) {
        var script = document.createElement("SCRIPT");
        script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
        script.type = 'text/javascript';
        script.onload = function () { initMoment(w); };
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    else {
        initMoment(w);
    }
}
function initMoment(w) {
    if (!w.moment) {
        var script = document.createElement("SCRIPT");
        script.src = 'https://az835663.vo.msecnd.net/Scripts/moment/moment.min.js';
        script.type = 'text/javascript';
        script.onload = function () {
            var tz = document.createElement("SCRIPT");
            tz.src = 'https://az835663.vo.msecnd.net/Scripts/moment/moment-timezone-with-data.min.js';
            tz.type = 'text/javascript';
            tz.onload = function () { init(w); };
            document.getElementsByTagName("head")[0].appendChild(tz);
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    else {
        init(w);
    }
}
function init(w) {
    var $ = w.jQuery;
    var moment = w.moment;
    $("#t42-button").click(handleButtonClick);
    function handleButtonClick(e) {
        var hash = $(e.target).data('hash').split('-')[1];
        var id = $(e.target).data('id').split('-')[1];
        var widget = $('<div>Loading</div>');
        widget.css({ "z-index": 50000, "min-width": "100%", "text-align": "center" });
        $('body').append(widget);
        $.ajax({
            url: 'http://localhost:20915/api/v1/services/reservations/dates?hash=' + hash + '&id=' + id + '&year=2018&month=2',
            type: 'GET',
            dataType: "jsonp",
            contentType: "application/json",
            success: function (response) { loadDates(widget, response); },
            error: function (data) { debugger; }
        });
    }
    function loadDates(widget, response) {
        var dates = $('<div id="t42-widget-dates"></div>');
        $.each(response.Dates, function (index, record) {
            var date = moment.tz(record.StartTimeUtc, response.TimeZoneIANA);
            dates.append('<div>' + date.format() + '</div>');
        });
        widget.html('');
        widget.append(dates);
    }
}
//# sourceMappingURL=t42-widget.js.map