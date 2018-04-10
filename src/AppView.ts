import * as $ from 'jquery';
import * as _ from 'underscore';
import * as Backbone from 'backbone';
import * as moment from 'moment';
import * as momentTimzone from 'moment-timezone';
import { AppVM } from './AppVM';
import { PaxView } from './PaxView';
import { CalendarView } from './CalendarView';
import { SittingVM } from './SittingVM';
import { SittingView } from './SittingView';
import { SittingCollectionVM } from './SittingCollectionVM';
import { SittingCollectionView } from './SittingCollectionView';

export class AppView extends Backbone.View<AppVM> {

    

    constructor(options?:any) { super(options); this.bootstrap() }

    render(){
        this.renderCalendar(); 
        this.renderPax(); 
        this.renderSittings(); 
        return this;
    }

    initialize(){ this.setElement($("#t42-control")); }

    bootstrap(){

        this.model  = new AppVM();
        _.extend(this.model, Backbone.Events);
        //this.model.on( { "change:sitting":()=> { debugger; } } );
        // triggered when a sitting is selected (or the sitting is removed)
       // this.model.on( { "change:sitting":()=> { } } );

     

        this.model.on( { "all":()=> {  
            console.log('Month:' + this.model.get('month'),' Year:',this.model.get('year') + ' Pax:' + this.model.get('pax') + ' Sittings:' + this.model.get('sittings'));
        } } );

        this.model.set('hash',this.$el.data('hash').split('-')[1]); 
        this.model.set('uuid',this.$el.data('uuid').split('-')[1]); 
        this.model.set('css-bg-color',this.$el.data('css-bg-color'));
        this.model.set('css-color',this.$el.data('css-color'));
        this.model.set('view','sittings');

        this.$el.css({'z-index':'10000' });

        let container:JQuery<HTMLElement> = 
        $(
            `<div id="t42-control-container">
                <div id="t42-control-header" style="padding:25px;margin-bottom:5px;">
                    <span id="t42-control-calendar"></span>
                    <span id="t42-control-pax"></span>
                </div>
                <div id="t42-control-sittings"></div>
                <div id="t42-control-footer" style="padding:25px;margin-top:5px;text-align:center;"></div>
            </div>`
        );

        container.find("#t42-control-header").css({"background-color": this.model.get('css-bg-color'),"color":this.model.get('css-color')}); 
        container.find("#t42-control-footer").css({"background-color": this.model.get('css-bg-color'),"color":this.model.get('css-color')}); 
        
        this.$el.append(container);
        
        var me = this;      
        $.ajax({
            url: 'http://localhost:20915/api/v1/services/reservations/restaurant?hash='+ this.model.get('hash') + '&id='+ this.model.get('uuid'),
            type:'GET',
            dataType: "jsonp",
           contentType: "application/json",
           success:function(r){                 
                me.model.set('restaurant',r);               
                me.model.set('year', me.now().year());
                me.model.set('month', me.now().month());
                me.render.apply(me); 
            },
           error:function(e){ debugger; },
        })
    }

    now = () :moment.Moment => { return momentTimzone.tz(new Date(),this.model.get('restaurant').TimeZoneIANA); }

    renderCalendar(){
        let calendarView = new CalendarView(this.model);  
        //calendarView.on("calendarChanged",(e:any)=>{ this.model.sittings.setMonthYearAndFetch(e.month,e.year); }); 
    }

    renderPax(){  
        var paxView = new PaxView(this.model);
    }

    renderSittings(){
        this.model.set('sittings',new SittingCollectionVM(this.model));  
        let sittingsView =  new SittingCollectionView(this.model);  
        //this.$el.find("#t42-control-sittings").append(sittingsView.$el);
    }
}