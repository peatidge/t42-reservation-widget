import * as $ from 'jquery';
import * as _ from 'underscore';
import * as Backbone from 'backbone';
import * as moment from 'moment';
import * as momentTimzone from 'moment-timezone';
import { CalendarView } from './CalendarView';
import { SittingVM } from './SittingVM';
import { SittingView } from './SittingView';
import { SittingCollectionVM } from './SittingCollectionVM';
import { SittingCollectionView } from './SittingCollectionView';

export class AppView extends Backbone.View<any> {

    hash:string; 
    uuid:string;
    restaurant:any;
    month:number; 
    year:number;
    sittings:SittingCollectionVM;

    constructor(options?:any) {
        super(options);

        this.hash = $('#t42-control').data('hash').split('-')[1]; 
        this.uuid = $('#t42-control').data('uuid').split('-')[1]; 
        
        let container:JQuery<HTMLElement> = 
        $(
            `<div id="t42-control-container">
                <div id="t42-control-calendar"></div>
                <div id="t42-control-pax"></div>
                <div id="t42-control-sittings"></div>
            </div>`
        );

        $('#t42-control').append(container);
        
        this.$el = container; 
        var me = this; 
        
        $.ajax({
            url: 'http://localhost:20915/api/v1/services/reservations/restaurant?hash='+ this.hash + '&id='+ this.uuid,
            type:'GET',
            dataType: "jsonp",
           contentType: "application/json",
           success:function(r){  
                
                me.restaurant = r;                  
                me.year = me.now().year();
                me.month = me.now().month();
                me.render.apply(me); 
            },
           error:function(e){ debugger; },
        })
       
      
    }

    render(){
        this.renderCalendar(); 
        this.renderSittings();
        return this;
    }

    now = () :moment.Moment => { return momentTimzone.tz(new Date(),this.restaurant.TimeZoneIANA); }

    renderSittings(){
        this.sittings = new SittingCollectionVM(this.hash,this.uuid,this.month,this.year,this.restaurant);  
        let sittingsView =  new SittingCollectionView(this.sittings);  
        this.$el.find("#t42-control-sittings").append(sittingsView.$el);

    }

    renderCalendar(){
        let until = this.now(); 
        until.add(this.restaurant.DaysAheadAllowed,'days');
        debugger;
        let calendar = new CalendarView(this.year,until.year(),this.month);  
        calendar.on("calendarChanged",(e:any)=>{
            let wtf = e; 
            this.year = e.year;
            this.month = e.month;
            this.sittings.year = this.year;
            this.sittings.month = this.month;
            this.sittings.fetch(); 
        }); 
        this.$el.find("#t42-control-calendar").append(calendar.$el);

    }


}