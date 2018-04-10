import * as $ from 'jquery';
import * as _ from 'underscore';
import * as Backbone from 'backbone';
import * as moment from 'moment';
import * as momentTimzone from 'moment-timezone';
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
        this.appVM.get('sittings').on('sync',(e:any)=> { this.render.apply(this); });
        this.appVM.get('sittings').on('request',(e:any)=> { 
            let msg = $('<div ><i>fetching...</i></div>');
            msg.css({ 'text-align':'center','padding':'15px','background-color':this.appVM.get('css-bg-color'),'color': this.appVM.get('css-color') });
            this.$el.html(' ');
            this.$el.append(msg); 
        });
        this.appVM.get('sittings').fetch(); 
    }


    initialize(){
        this.setElement($("#t42-control-sittings"));
    }

    events(){

        return <Backbone.EventsHash>{
            "click .sitting-btn": "sittingClicked"
        }
    }

    sittingClicked(e:JQuery.Event){


        let sittingId:number = parseInt($(e.currentTarget).attr('id').split('-')[2]); 

        let sitting = _.find(this.appVM.get('sittings').models, function(obj) {
            if((<any>obj).get('Id') == sittingId){ return true; }
            return false;         
        }); 
        this.appVM.set('sitting',sitting);
        this.appVM.set('view','timeslots')
        this.render(); 
    }

    render(): Backbone.View<any> {
        
        let el:JQuery<HTMLElement> = $('<div id="t42-control-sittings-container-items"></div>');

        if(this.appVM.get('sitting')){

            var s= this.appVM.get('sitting');
            var sittingTemplate = 
            _.template(`<div class="sitting-btn" id="sitting-id-<%=Id%>" style="text-align:center;padding:5px;border:1px solid #000;margin-bottom:2.5px;">
                            <div><%= Name %></div>
                            <div><%= Start %></div>                                
                        </div>`
                    );

            var date = momentTimzone.tz( s.get('StartTimeUtc'),this.appVM.get('restaurant').TimeZoneIANA); 
            let start =  date.format("ddd Do MMM @ h:mm a") ;    
            var model = {Id:s.get('Id'), Name:s.get('Name'),Start:start};  

            let sittingBtn = $(sittingTemplate(model)); 
            sittingBtn.css({
                'text-align':'center','padding':'5px','margin-bottom':'2.5px',
                'border':'1px solid ' + this.appVM.get('css-color'), 
                'background-color': this.appVM.get('css-color'),
                'color': this.appVM.get('css-bg-color'),
            }); 

            el.append(sittingBtn);
        }

        if(this.appVM.get('view') === 'sittings'){
            
            let scroll = $('<div style="overflow-y: scroll; height:500px;">')

            if(this.appVM.get('sittings').length > 0){

                $.each(this.appVM.get('sittings').models,(i,m)=> {
                    let sittingVM:SittingVM = <SittingVM>{ ... new SittingVM(), ...m };
                    scroll.append(new SittingView(<SittingVM>{ ... new SittingVM(), ...m }).el); 
                })
            }
            else{
                let msg = $('<div><i>there are no times available for the selected month</i></div>');
                msg.css({ 'text-align':'center',
                            'padding':'2.5px',
                            'background-color':this.appVM.get('css-bg-color'), 
                            'color': this.appVM.get('css-color') 
                        });
                scroll.append(msg);
            }
            el.append(scroll);
        }
      
      
        this.$el.html(' '); this.$el.append(el);
        return this; 
    }

}