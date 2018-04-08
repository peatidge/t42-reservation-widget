import * as $ from 'jquery';
import * as _ from 'underscore';
import * as Backbone from 'backbone';
import * as moment from 'moment';
import * as momentTimzone from 'moment-timezone';
import { PaxView } from './PaxView';
import { CalendarView } from './CalendarView';
import { SittingVM } from './SittingVM';
import { SittingView } from './SittingView';
import { SittingCollectionVM } from './SittingCollectionVM';
import { SittingCollectionView } from './SittingCollectionView';

export class AppView extends Backbone.View<any> {

    hash:string; uuid:string;
    month:number; year:number; pax:number;
    restaurant:any; sittings:SittingCollectionVM;

    constructor(options?:any) { super(options); this.bootstrap() }

    render(){
        this.renderCalendar(); 
        this.renderPax(); 
        this.renderSittings(); 
        return this;
    }

    initialize(){ this.setElement($("#t42-control")); }

    bootstrap(){
        this.$el.css({
            'max-width':'300px',
            'z-index':'10000',
            'position': 'absolute',
            'top':'0',
            'bottom': '0',
            'left': '0',
            'right': '0',
            'margin': 'auto',
            'height': '500px',
        });

        let container:JQuery<HTMLElement> = 
        $(
            `<div id="t42-control-container">
                <div id="t42-control-header" style="padding:5px;background-color:#000;">
                    <span id="t42-control-calendar"></span>
                    <span id="t42-control-pax"></span>
                </div>
                <div id="t42-control-sittings"></div>
            </div>`
        );

        this.$el.append(container);
        this.hash = this.$el.data('hash').split('-')[1]; 
        this.uuid = this.$el.data('uuid').split('-')[1]; 
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

    now = () :moment.Moment => { return momentTimzone.tz(new Date(),this.restaurant.TimeZoneIANA); }

    renderCalendar(){
        let until = this.now(); 
        until.add(this.restaurant.DaysAheadAllowed,'days');
        let calendarView = new CalendarView(this.year,until.year(),this.month);  
        calendarView.on("calendarChanged",(e:any)=>{
            this.year = e.year; this.month = e.month;
            this.sittings.setMonthYearAndFetch(e.month,e.year);
        }); 
    }

    renderPax(){  
        var paxView = new PaxView(this.restaurant.MaxGuests);
        paxView.on("paxChanged",(e:any)=>{ this.pax = e.pax; }); 
    }

    renderSittings(){
        this.sittings = new SittingCollectionVM(this.hash,this.uuid,this.month,this.year,this.restaurant);  
        let sittingsView =  new SittingCollectionView(this.sittings);  
        //this.$el.find("#t42-control-sittings").append(sittingsView.$el);
    }
}