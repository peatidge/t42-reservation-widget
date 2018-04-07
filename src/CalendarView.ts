import * as $ from 'jquery';
import * as Backbone from 'backbone';
import { SittingVM } from './SittingVM'; 
import * as _ from 'underscore';
import * as moment from 'moment';
import * as momentTimzone from 'moment-timezone';
import { DEFAULT_ECDH_CURVE } from 'tls';

export class CalendarView extends Backbone.View<any> {

    model:any;
    month:number;
    months:string[] = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    year:number; 
    years:number[] = []; 

    constructor(startYear:number,endYear:number,month:number){    

        super(); 
        this.year = startYear;
        this.month = month; 
        while(startYear <= endYear){ this.years.push(startYear++); }
        this.render();    
    }

    events(){

        return <Backbone.EventsHash>{
            "change #t42-control-month-select": "calendarChanged",
            "change #t42-control-year-select": "calendarChanged"
        }
    }

    calendarChanged(e:any){
        this.month = <number>$("#t42-control-month-select").val(); 
        this.year = <number>$("#t42-control-year-select").val(); 
        this.trigger("calendarChanged",{month:this.month,year:this.year});
    }

    render(): Backbone.View<any> {
        
        var monthSelect = $('<select id="t42-control-month-select"></select>');
        $.each(this.months,(i,m)=>{monthSelect.append('<option value="' + i + '">' + m + '</option>'); });
        monthSelect.val(this.month);

        var yearSelect = $('<select id="t42-control-year-select"></select>');
        $.each(this.years,(i,y)=>{ yearSelect.append('<option value="' + y + '">' + y + '</option>'); });
        yearSelect.val(this.year);

        this.$el.html('');
        this.$el.append(monthSelect); 
        this.$el.append(yearSelect); 
    
        return this; 
    }
}