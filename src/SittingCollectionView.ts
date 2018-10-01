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
        this.setElement($("#t42-control-sittings"));
    }

    render(): Backbone.View<any> {
        
        let el:JQuery<HTMLElement> = $('<div id="t42-control-sittings-container-items"></div>');

        // check which view is selected and render it i.e. sitting view, timeslot view ...
        switch(this.appVM.get('view')){
            case 'sittings': this.renderSittingsView(el); break; 
            case 'timeslots': this.renderTimeslotsView(el); break; 
            case 'information': this.renderInformationView(el); break; 
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
        
        this.renderSelectedSitting(el); 

        // check if there are any available timeslots, if so display them, if not show message
        if(this.appVM.get('sitting').attributes.Timeslots.length > 0){

            $.each(this.appVM.get('sitting').attributes.Timeslots,(i,t)=> {
                var time = momentTimezone.tz(t.Time,this.appVM.get('restaurant').TimeZoneIANA); 
                var slot = $('<div class="timeslot-btn" id="'+ t.Time +'" >'+ time.format("h:mm a") + '</div>'); 
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

    renderInformationView(el:JQuery<HTMLElement>){
        
        this.renderSelectedSitting(el); 
        var template = 
        _.template(`<div class="update-timeslot" id="selected-timeslot-uat-<%=utc%>">
                        <span style="display:inline-block;margin-right:5px;"><i class="material-icons">watch_later</i></span>
                        <span style="display:inline-block;position:relative;bottom:7.5px;"><%=local %></span>                          
                    </div>`);
         let timeslotBtn = $(template(this.appVM.get('timeslot'))); 
         timeslotBtn.css({
            'padding':'7.5px','margin-bottom':'5px','font-weight':'bold',
            'border':'1px solid ' + this.appVM.get('css-bg-color'), 
            'background-color': this.appVM.get('css-color'),
            'color': this.appVM.get('css-bg-color'),
            'cursor':'pointer'
        });
        el.append(timeslotBtn);

        let form = $(_.template(`<form>
                                    <label for="forename">First name</label>
                                    <input type="text" name="forename" id="forename" class="form-input"/>
                                    <label for="surname">Last name</label>
                                    <input type="text" name="surname" id="surname" class="form-input"/>
                                    <label for="email">Email</label>
                                    <input type="text" name="email" id="email" class="form-input"/>
                                    <label for="email-confirmation">Email Confirmation</label>
                                    <input type="text" name="email-confirmation" id="email-confirmation" class="form-input"/>
                                    <label for="guests">Guests</label>
                                    <select id="guests" name="guests" class="form-input"></select>
                                    <label for="notes">Notes</label>
                                    <textarea id="notes" name="notes" class="form-input"></textarea> 
                                </form>`)());

        for(let i=1;i<=this.appVM.get('restaurant').MaxGuests;i++){form.find('#guests').append('<option value="'+i+'">'+i+'</option>'); }

        form.css({'background-color':this.appVM.get('css-bg-color'),'color':this.appVM.get('css-color'),'padding':'15px' }); 
        form.find('.form-input').css({'color':'#000','min-width':'100%','max-width':'100%','min-height':'35px','margin-bottom':'5px','border-radius':'2.5px','padding':'2.5px','border':'1px solid ' + this.appVM.get('css-bg-color')}); 

        let submit = $('<input type="button" value="Next" />');
        submit.css({'min-width':'100%','padding':'5px','margin-bottom':'5px','border':'1px solid ' + this.appVM.get('css-color'),'color': this.appVM.get('css-color'),'background-color': this.appVM.get('css-bg-color')}); 

        form.append(submit); 
        el.append(form); 
        
    }

    events(){
        //bind the sitting btn clicked event to the sittingClicked function
        return <Backbone.EventsHash>{ 
            "click .sitting-btn": "sittingClicked",
            "click .update-sitting" : "displaySittings",
            "click .timeslot-btn":"timeslotClicked" ,
            "click .update-timeslot":"displayTimeslots"
        }; 
    }

    displaySittings(){
        this.appVM.set('sitting',null);
        this.appVM.set('view','sittings');
        this.render(); 
    }

    displayTimeslots(){
        this.appVM.set('timeslot',null);
        this.appVM.set('view','timeslots');
        this.render(); 
    }

    renderSelectedSitting(el:JQuery<HTMLElement>){

        var s = this.appVM.get('sitting');
        var template = 
        _.template(`<div class="update-sitting" id="sitting-id-<%=Id%>">
                        <div>
                            <span style="display:inline-block;margin-right:5px;"><i class="material-icons">calendar_today</i></span>
                            <span style="display:inline-block;position:relative;bottom:7.5px;"><%= Name %> <%= Start %></span>
                        </div> 
                    </div>`);

        var date = momentTimezone.tz(s.get('StartTimeUTC'),this.appVM.get('restaurant').TimeZoneIANA); 
        let start =  date.format("ddd Do MMM @ h:mm a") ;    
        var model = {Id:s.get('Id'), Name:s.get('Name'),Start:start,bgcolor:this.appVM.get('css-bg-color')};  
        let sittingBtn = $(template(model)); 
        sittingBtn.css({
            'padding':'7.5px','margin-bottom':'5px','font-weight':'bold',
            'border':'1px solid ' + this.appVM.get('css-bg-color'), 
            'background-color': this.appVM.get('css-color'),
            'color': this.appVM.get('css-bg-color'),
            'cursor':'pointer'
        }); 
        el.append(sittingBtn);
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
        this.appVM.set('timeslot',{'utc':$(e.currentTarget).attr('id'),'local':$(e.currentTarget).html()}); 
        this.appVM.set('view','information');
        this.render(); 
    }

}