import * as $ from 'jquery';
import * as Backbone from 'backbone';
import{ AppVM } from './AppVM';

export class PaxView extends Backbone.View<any> {

   appVM:AppVM;

    constructor(appVM:AppVM){     
        super(); 
        
        this.appVM = appVM; 
        let max:number = this.appVM.get('restaurant').MaxGuests;
        this.appVM.set('pax',2 <=  max ? 2 :  max); 
        this.render.apply(this);
    }

    events(){
        return <Backbone.EventsHash>{ "change #t42-control-pax-select": "paxChanged" }
    }

    initialize(){
        this.setElement($("#t42-control-pax"));
    }
    paxChanged(e:any){
        this.appVM.set("pax" ,<number>$("#t42-control-pax-select").val()); 
    }

    render(): Backbone.View<any> {      
        let select = $('<select id="t42-control-pax-select" name="t42-control-pax-select" title="click to select the number of guests" ></select>');
        for(var i=1;i<=this.appVM.get('restaurant').MaxGuests;i++){ select.append('<option value="' + i + '" ' + (i==2 ? 'selected' : '') + '>' + i + (i > 1 ? ' People' : ' Person') +' </option>') }
        select.css({"background-color":  this.appVM.get('css-bg-color'),"color": this.appVM.get('css-color'),'border':'none','cursor':'pointer'});
        $(this.el).html(' '); 
        $(this.el).append(select);
        return this; 
    }
}