import * as $ from 'jquery';
import * as _ from 'underscore';
import * as Backbone from 'backbone';
import * as moment from 'moment';
import * as momentTimezone from 'moment-timezone';
import { AppVM } from './AppVM'; 
import { SittingVM } from './SittingVM'; 
import { SittingView } from './SittingView'; 

import { SittingCollectionVM } from './SittingCollectionVM';

export class SittingCollectionView extends Backbone.View<any> {

    template: (sittings: SittingCollectionVM) => string;
    
    appVM:AppVM;

    constructor(appVM:AppVM){     
        super(); 
        this.appVM = appVM;
        // call the render function on the event of the sittings collection being synced (fetched from the server)
        this.appVM.get('sittings').on('sync',(e:any)=> { this.render.apply(this); });
        // display the loading message on the event of the ajax request to fetch sittings
        this.appVM.get('sittings').on('request',(e:any)=> { 
            let msg = $('<div ><i>fetching...</i></div>');
            msg.css({ 'text-align':'center','padding':'15px','background-color':this.appVM.get('css-bg-color'),'color': this.appVM.get('css-color') });
            this.$el.html(' ');
            this.$el.append(msg); 
        });
        // explicitly fetch the sittings from the server (this will make the ajax call and  trigger the request & sync events)
        this.appVM.get('sittings').fetch(); 
    }

    initialize(){
        // bind this view object to the #t42-control-sittings element
        this.setElement($("#t42-control-sittings"));
    }

    render(): Backbone.View<any> {
        
        let el:JQuery<HTMLElement> = $('<div id="t42-control-sittings-container-items"></div>');

        // check which view is selected and render it i.e. sitting view, timeslot view ...
        switch(this.appVM.get('view')){
            case 'sittings': this.renderSittingsView(el); break; 
            case 'timeslots': this.renderTimeslotsView(el); break; 
            default: throw new Error();

        }

       this.$el.html(' '); this.$el.append(el);
        return this; 
    }

    renderSittingsView(el:JQuery<HTMLElement>){
        
        if(this.appVM.get('sittings').length > 0){

            $.each(this.appVM.get('sittings').models,(i,m)=> {
                let sittingVM:SittingVM = <SittingVM>{ ... new SittingVM(), ...m };
                el.append(new SittingView(<SittingVM>{ ... new SittingVM(), ...m }).el); 
            })
        }
        else{
            let msg = $('<div><i>there are no times available for the selected month</i></div>');
            msg.css({'text-align':'center','padding':'2.5px','background-color':this.appVM.get('css-bg-color'),'color':this.appVM.get('css-color')});
            el.append(msg);
        }
       
    }

    renderTimeslotsView(el:JQuery<HTMLElement>){
        
        // display the selected sitting above the timeslots
        var s = this.appVM.get('sitting');
        var sittingTemplate = 
        _.template(`<div class="timeslot-sitting" id="sitting-id-<%=Id%>" style="text-align:center;padding:5px;border:1px solid #000;margin-bottom:2.5px;">
                        <div><%= Name %></div>
                        <div><%= Start %></div>                                
                    </div>`);

        var date = momentTimezone.tz(s.get('StartTimeUTC'),this.appVM.get('restaurant').TimeZoneIANA); 
        let start =  date.format("ddd Do MMM @ h:mm a") ;    
        var model = {Id:s.get('Id'), Name:s.get('Name'),Start:start};  
        let sittingBtn = $(sittingTemplate(model)); 
        sittingBtn.css({
            'text-align':'center','padding':'5px','margin-bottom':'2.5px',
            'border':'1px solid ' + this.appVM.get('css-bg-color'), 
            'background-color': this.appVM.get('css-color'),
            'color': this.appVM.get('css-bg-color'),
            'cursor':'pointer'
        }); 
        el.append(sittingBtn);

        // check if there are any available timeslots, if so display them, if not show message
        if(this.appVM.get('sitting').attributes.Timeslots.length > 0){

            $.each(this.appVM.get('sitting').attributes.Timeslots,(i,t)=> {
                var time = momentTimezone.tz(t.Time,this.appVM.get('restaurant').TimeZoneIANA); 
                var slot = $('<div class="timeslot-btn" id="'+ t.Time +'">'+ time.format("h:mm a") + '</div>'); 
                slot.css({
                    'text-align':'center','padding':'10px','margin-bottom':'2.5px',
                    'border':'1px solid ' + this.appVM.get('css-bg-color'), 
                    'min-width':'100%',
                    'background-color': this.appVM.get('css-bg-color'),
                    'color': this.appVM.get('css-color'),
                    'cursor':'pointer'
                }); 
               // slot.click(function(e){ alert('clicked'); }); 
                el.append(slot); 
            })
        }
        else{
            let msg = $('<div><i>there are no times available for the selected sitting</i></div>');
            msg.css({ 'text-align':'center',
                        'padding':'2.5px',
                        'background-color':this.appVM.get('css-bg-color'), 
                        'color': this.appVM.get('css-color') 
                    });
            el.append(msg);
        }
    }

    events(){
        //bind the sitting btn clicked event to the sittingClicked function
        return <Backbone.EventsHash>{ 
            "click .sitting-btn": "sittingClicked",
            "click .timeslot-sitting" : "displaySittings",
            "click .timeslot-btn":"timeslotClicked" 
        }; 
    }

    displaySittings(){
        this.appVM.set('sitting',null);
        // change to the sittings view
        this.appVM.set('view','sittings');
        // render the view again
        this.render(); 

    }
    sittingClicked(e:JQuery.Event){
        // get the sitting id from the sitting button that was clicked
        let sittingId:number = parseInt($(e.currentTarget).attr('id').split('-')[2]); 

        // find the associated sitting from the app vm sittings collection
        let sitting = _.find(this.appVM.get('sittings').models,function(obj) {
            if((<any>obj).get('Id') == sittingId){ return true; }
            return false;         
        }); 
        // set the app vm's selected sitting to the one that was selected (clicked)
        this.appVM.set('sitting',sitting);
        // change to the timeslots view for the selected sitting
        this.appVM.set('view','timeslots');
        // render the view again
        this.render(); 
    }

    timeslotClicked(e:JQuery.Event){
        
        alert('really'); 
    }

}