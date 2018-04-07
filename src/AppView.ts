import * as $ from 'jquery';
import * as _ from 'underscore';
import * as Backbone from 'backbone';
import { SittingVM } from './sittingvm';
import { SittingView } from './sittingview';
import { SittingCollectionVM } from './sittingcollectionvm';
import { SittingCollectionView } from './SittingCollectionView';

export class AppView extends Backbone.View<any> {

    hash:string; 
    uuid:string;
    restaurant:any;
    
   
        

    constructor(options?:any) {
        super(options);

        this.hash = $('#t42-control').data('hash').split('-')[1]; 
        this.uuid = $('#t42-control').data('uuid').split('-')[1]; 

        let container:JQuery<HTMLElement> = $('<div id="t42-control-container"></div>');
        $('#t42-control').append(container);
        let controlBody:JQuery<HTMLElement> = $('<div id="control-body"></div>');
        container.append(controlBody); 
        this.$el = container; 

        var that = this; 

        $.ajax({
            url: 'http://localhost:20915/api/v1/services/reservations/restaurant?hash='+ this.hash + '&id='+ this.uuid,
            type:'GET',
            dataType: "jsonp",
           contentType: "application/json",
           success:function(r){ that.restaurant = r; that.render.apply(that); },
           error:function(e){ debugger; },
        })
       
      
    }

    render(){

        let sittings = new SittingCollectionVM(this.hash,this.uuid,this.restaurant);  
        let sittingsView =  new SittingCollectionView(sittings);  
        this.$el.html('');
        this.$el.append(sittingsView.$el);
        return this;
    }


}