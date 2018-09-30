import * as $ from 'jquery';
import * as _ from 'underscore';
import * as Backbone from 'backbone';
import { AppView } from './appview';

$(()=>{  var view = new AppView(); });

/*
index.ts
-- AppView
        - now (current local time of restaurant's timezone)
        - model (AppVM)
            - hash (the hash set in the script element)
            - uuid (the unique identifier set in the script element)
            - css-bg-color (the bgcolor set in script element)
            - css-color (the color set in script element)
            - view (a string value of the current view selected)
            - restaurant (the restaurant object fetched from the server)
            - year (the current year)
            - month (the current month)
            - sittings (SittingCollectionVM)
            - events
                - all (console logs set date/time)
    -- CalendarView
    -- PaxView





*/

