
import * as http from 'http';
import * as moment from 'moment';
import * as backbone from 'backbone';



let container:HTMLElement = document.getElementById('t42-control');


let earliest:number = 2017;
let latest: number = new Date().getFullYear(); 
let list = '<select id="t42-year-list">'; 

while(earliest <= latest){
    list += '<option value="'+ earliest + '">'+ earliest + '</option>'; 
    earliest++; 
}
list += '</select>';







/*

cas

function init(w:any) {
    var $ = w.jQuery; var moment = w.moment; 
    debugger;
    if($ && moment){


        let yearDropdownList = initYearDropDownList();

        $("#t42-control").append(yearDropdownList);

        function handleButtonClick(e:any){
            var hash:string = $(e.target).data('hash').split('-')[1]; 
            var id:string = $(e.target).data('id').split('-')[1]; 
            var widget = $('<div>Loading</div>'); 
            widget.css({"z-index":50000,"min-width":"100%","text-align":"center"});       
            $('body').append(widget);
            debugger;
             $.ajax({
                url: 'http://localhost:20915/api/v1/services/reservations/dates?hash='+hash+'&id='+id + '&year=2018&month=2',
                type: 'GET',
                dataType: "jsonp",
                contentType: "application/json",
                success: function (response:any) { debugger; loadDates(widget,response); },
                error: function (data:any) {  debugger; }
            });
    
    
        }
    
        function loadDates(widget:any,response:any){
            var dates = $('<div id="t42-widget-dates"></div>');
                    
            $.each(response.Dates,function(index:any,record:any){
                var date = moment.tz(record.StartTimeUtc,response.TimeZoneIANA); 
                dates.append('<div>' + date.format() + '</div>');
    
            }); 
            widget.html(''); 
            widget.append(dates);
    
    
        }


    }

}


function initYearDropDownList() {
    debugger;
    let earliest:number = 2017;
    let latest: number = new Date().getFullYear(); 
    let list = $('<select id="t42-year-list"></select>'); 

    while(earliest <= latest){
        list.append('<option value="'+ earliest + '">'+ earliest + '</option>'); 
        earliest++; 
    }
    return list; 
}

*/