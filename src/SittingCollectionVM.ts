import * as $ from 'jquery';
import * as Backbone from 'backbone';
import { SittingVM } from './SittingVM'; 
import * as _ from 'underscore';

export class SittingCollectionVM extends Backbone.Collection<SittingVM> {

    hash:string;
    uuid:string;

    constructor(hash:string, uuid:string){
        super(); 
        this.hash = hash; 
        this.uuid = uuid;   
        this.url = function(){ return 'http://localhost:20915/api/v1/services/reservations/dates?hash='+hash+'&id='+uuid + '&year=2018&month=2'; }; 
        this.parse =  function(data:any) { return data.Sittings; }       
        this.sync = function(method:any, model:any, options:any) {
            var params = _.extend({type:'GET',dataType:'jsonp',contentType: "application/json", url:model.url() }, options);
            return $.ajax(params);
        };

    }

}