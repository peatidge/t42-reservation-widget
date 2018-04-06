import * as $ from 'jquery';
import * as Backbone from 'backbone';
import { SittingVM } from './SittingVM'; 
import * as _ from 'underscore';

export class SittingView extends Backbone.View<SittingVM> {

    template: (sitting: SittingVM) => string;
    
    model:SittingVM;

    constructor(model:SittingVM){     
        super(); 
        this.model = model; 
        this.template = _.template('<%= Name %>');
        this.render();    
    }

    render(): Backbone.View<SittingVM> {
        
        this.$el.html(this.template(this.model.attributes.attributes)); 
        return this; 
    }

  


}