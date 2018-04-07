import * as $ from 'jquery';
import * as Backbone from 'backbone';
import { SittingVM } from './SittingVM'; 
import * as _ from 'underscore';
import * as moment from 'moment';
import * as momentTimzone from 'moment-timezone';

export class SittingView extends Backbone.View<SittingVM> {

    template: (model: any) => string;
    
    model:SittingVM;

    constructor(model:SittingVM){    
        super(); 
        this.model = model; 
        this.template = _.template('<div style="padding:5px;border:1px solid #000;margin-bottom:2.5px;"><%= Name %> <%= Start %></div>');
        this.render();    
    }

    render(): Backbone.View<SittingVM> {
        
        var restaurant = (<any>this.model.collection).restaurant;
 
        var date = momentTimzone.tz(this.model.attributes.StartTimeUtc,restaurant.TimeZoneIANA); 
        
        var model = { Name:this.model.attributes.Name,Start: date.format() };
        this.$el.html(this.template(model)); 
    
        return this; 
    }
}