import * as $ from 'jquery';
import * as Backbone from 'backbone';
import { AppVM } from './AppVM'; 
import * as _ from 'underscore';

export class TimeSlotCollectionVM extends Backbone.Collection<any> {


    appVM:AppVM;

    constructor(appVM:AppVM){
        super(); 
        this.appVM = appVM;
    
        this.url = function(){ return 'http://localhost:20915/api/v1/services/reservations/sitting?hash='+  this.appVM.get('hash') +'&id=' +  this.appVM.get('uuid')  + '&year='+  this.year + '&month=' + this.month; }; 
        this.parse =  function(data:any) { return data.Sittings; }       
        this.sync = function(method:any, model:any, options:any) {
            this.trigger('request');
            var params = _.extend({type:'GET',dataType:'jsonp',contentType: "application/json", url:model.url() }, options);
            return $.ajax(params);
        };

    }


}