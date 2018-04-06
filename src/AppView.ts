import * as $ from 'jquery';
import * as _ from 'underscore';
import * as Backbone from 'backbone';
import { SittingVM } from './sittingvm';
import { SittingView } from './sittingview';
import { SittingCollectionVM } from './sittingcollectionvm';

export class AppView extends Backbone.View<any> {

    hash:string; 
    uuid:string;
    sittings:SittingCollectionVM;
        

    constructor(options?:any) {
        super(options);

        this.hash = $('#t42-control').data('hash').split('-')[1]; 
        this.uuid = $('#t42-control').data('uuid').split('-')[1]; 

        let container:JQuery<HTMLElement> = $('<div id="t42-control-container"></div>');
        $('#t42-control').append(container);
        let controlBody:JQuery<HTMLElement> = $('<div id="control-body"></div>');
        container.append(controlBody); 
        this.$el = container; 
        this.sittings = new SittingCollectionVM(this.hash,this.uuid);  
        this.sittings.on('sync',(e:any)=> { this.render.apply(this); });
        this.sittings.fetch(); 
    }

    render(){

        $("#control-body").html('');

        var sittings = this.sittings; 
        $.each(sittings.models,function(i,m){
          
            $("#control-body").append(new SittingView(new SittingVM(m)).el); 
        })
        return this;
    }


}