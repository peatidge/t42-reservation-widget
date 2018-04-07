import * as $ from 'jquery';
import * as Backbone from 'backbone';
import { SittingVM } from './SittingVM'; 
import { SittingView } from './SittingView'; 
import * as _ from 'underscore';
import { SittingCollectionVM } from './SittingCollectionVM';

export class SittingCollectionView extends Backbone.View<any> {

    template: (sittings: SittingCollectionVM) => string;
    
    sittings: SittingCollectionVM;

    constructor(sittings: SittingCollectionVM){     
        super(); 
        this.sittings = sittings; 
        this.sittings.on('sync',(e:any)=> { this.render.apply(this); });
        this.sittings.fetch(); 
 
    }

    fetch(){
        this.sittings.fetch(); 
    }

    initialize(){
     
    }

    render(): Backbone.View<any> {
        
      
        let sittingDatesContainer = $('<div id="t42-control-sittings-container"></div>');
      
        let restaurant = this.sittings.restaurant; 
        $.each(this.sittings.models,function(i,m){
    
            let sittingVM:SittingVM = <SittingVM>{ ... new SittingVM(), ...m };
            sittingVM.Restaurant = restaurant;
            sittingDatesContainer.append(new SittingView(<SittingVM>{ ... new SittingVM(), ...m }).el); 
        })
        this.$el.html(' '); 
        this.$el.append(sittingDatesContainer);

        return this; 
    }

  

}