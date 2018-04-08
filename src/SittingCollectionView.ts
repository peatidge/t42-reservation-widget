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
        this.$el = $("#t42-control-sittings");
        this.sittings.on('sync',(e:any)=> { this.render.apply(this); });
        this.sittings.on('request',(e:any)=> { this.$el.html(' ');this.$el.html('<div style="text-align:center;padding:2.5px;"><i>fetching...</i></div>'); });
        this.sittings.fetch(); 
    }

    render(): Backbone.View<any> {
        
        let el = $('<div id="t42-control-sittings-container-items"></div>');

        if(this.sittings.models.length > 0){

            $.each(this.sittings.models,(i,m)=> {
                let sittingVM:SittingVM = <SittingVM>{ ... new SittingVM(), ...m };
                sittingVM.Restaurant = this.sittings.restaurant; 
                el.append(new SittingView(<SittingVM>{ ... new SittingVM(), ...m }).el); 
            })
        }
        else{
            el = $('<div style="text-align:center;padding:2.5px;"><i>there are no times available for the selected month</i></div>')
        }
        
        this.$el.html(' '); this.$el.append(el);
        return this; 
    }

}