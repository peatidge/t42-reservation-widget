
import * as $ from 'jquery';
import * as _ from 'underscore';
import * as Backbone from 'backbone';
import * as moment from 'moment';
import * as momentTimzone from 'moment-timezone';
import { PaxView } from './PaxView';
import { CalendarView } from './CalendarView';
import { SittingVM } from './SittingVM';
import { SittingView } from './SittingView';
import { SittingCollectionVM } from './SittingCollectionVM';
import { SittingCollectionView } from './SittingCollectionView';

export class AppVM  extends Backbone.Model{


    now = () :moment.Moment => { return momentTimzone.tz(new Date(),this.get('restaurant').TimeZoneIANA); }

}


