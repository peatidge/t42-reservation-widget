import * as $ from 'jquery';
import * as Backbone from 'backbone';
import { AppVM } from './AppVM'; 
import { SittingVM } from './SittingVM'; 
import * as _ from 'underscore';
import * as moment from 'moment';
import * as momentTimzone from 'moment-timezone';
import { DEFAULT_ECDH_CURVE } from 'tls';

export class CalendarView extends Backbone.View<any> {

    appVM:AppVM;
    months:string[] = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    years:number[] = []; 

    constructor(appVM:AppVM){    
        super(); this.appVM = appVM;
        let begin = appVM.get('now').year(); let until = appVM.get('now'); 
        until.add(appVM.get('restaurant').DaysAheadAllowed,'days');
        while(begin <= until.year()){ this.years.push(begin++); }
        this.render();    
    }

    events(){

        return <Backbone.EventsHash>{
            "change #t42-control-month-select": "calendarChanged",
            "change #t42-control-year-select": "calendarChanged"
        }
    }

    initialize(){
        this.setElement($("#t42-control-calendar"));
    }

    calendarChanged(e:any){
        this.appVM.set('month',<number>$("#t42-control-month-select").val()); 
        this.appVM.set('year', <number>$("#t42-control-year-select").val()); 
        this.appVM.get('sittings').fetch();  
        this.appVM.set('view','sittings');  
    }

    render(): Backbone.View<any> {
        
        var monthSelect = $('<select id="t42-control-month-select" style="cursor:pointer;margin-right:7.5px;border:#fff;" title="click to select month" ></select>');
        $.each(this.months,(i,m)=>{monthSelect.append('<option value="' + i + '">' + m + '</option>'); });
        monthSelect.val(this.appVM.get('month'));
        monthSelect.css({"background-color":  this.appVM.get('css-bg-color'),"color": this.appVM.get('css-color'),'border':'none'});

        var yearSelect = $('<select id="t42-control-year-select" style="cursor:pointer" title="click to select year" ></select>');
        $.each(this.years,(i,y)=>{ yearSelect.append('<option value="' + y + '">' + y + '</option>'); });
        yearSelect.val(this.appVM.get('year'));
        yearSelect.css({"background-color":  this.appVM.get('css-bg-color'),"color": this.appVM.get('css-color'),'border':'none'});

        this.$el.html('');
        this.$el.append(monthSelect); 
        this.$el.append(yearSelect); 
    
        return this; 
    }
}