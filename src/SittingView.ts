import * as $ from 'jquery';
import * as Backbone from 'backbone';
import { AppVM } from './AppVM'; 
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
        this.template = _.template(`<div class="sitting-btn" id="sitting-id-<%=Id%>" style="text-align:center;padding:5px;margin-bottom:5px;cursor:pointer" title="click to select sitting">
                                        <div><%= Name %></div>
                                        <div><%= Start %></div>                                
                                    </div>`
                                  );
        this.render();    
    }

    render(): Backbone.View<SittingVM> {
        
        let appVM:AppVM = (<any>this.model.collection).appVM;

        var date = momentTimzone.tz(this.model.attributes.StartTimeUtc,appVM.get('restaurant').TimeZoneIANA);      
        var model = {Id:this.model.attributes.Id, Name:this.model.attributes.Name,Start: date.format("ddd Do MMM @ h:mm a") };
        var button = $(this.template(model));
        button.css({"background-color": appVM.get('css-bg-color'),"color":appVM.get('css-color')})
        this.$el.html(''); 
        this.$el.append(button); 
        return this; 
    }
}