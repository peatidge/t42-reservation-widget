import * as $ from 'jquery';
import * as Backbone from 'backbone';

export class PaxView extends Backbone.View<any> {

   pax:number; 
   max:number;

    constructor(max:number){     
        super(); 
        this.max = max;  
        this.pax = 2 <=max ? 2 : max; 
        this.render.apply(this);
    }

    events(){
        return <Backbone.EventsHash>{ "change #t42-control-pax-select": "paxChanged" }
    }

    initialize(){
        this.setElement($("#t42-control-pax"));
    }
    paxChanged(e:any){
        this.pax = <number>$("#t42-control-pax-select").val(); 
        this.trigger("paxChanged",{ pax:this.pax });
    }

    render(): Backbone.View<any> {      
        let select = $('<select id="t42-control-pax-select" name="t42-control-pax-select"></select>');
        for(var i=1;i<=this.max;i++){ select.append('<option value="' + i + '" ' + (i==2 ? 'selected' : '') + '>' + i + '</option>') }
        $(this.el).html(' '); 
        $(this.el).append($('<label for="t42-control-pax-select">Guest(s)</label>'));
        $(this.el).append(select);
        return this; 
    }
}