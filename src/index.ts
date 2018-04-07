import * as $ from 'jquery';
import * as _ from 'underscore';
import * as http from 'http';
import * as moment from 'moment';
import * as Backbone from 'backbone';
import { AppView } from './appview';


$(()=>{   
    var view = new AppView();  
});





let earliest:number = 2017;
let latest: number = new Date().getFullYear(); 
let list = '<select id="t42-year-list">'; 

while(earliest <= latest){
    list += '<option value="'+ earliest + '">'+ earliest + '</option>'; 
    earliest++; 
}
list += '</select>';


/*

$.each(response.Dates,function(index:any,record:any){
    var date = moment.tz(record.StartTimeUtc,response.TimeZoneIANA); 
    dates.append('<div>' + date.format() + '</div>');

}); 

*/

