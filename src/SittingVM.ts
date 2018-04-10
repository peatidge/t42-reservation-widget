import * as Backbone from 'backbone';

export class SittingVM extends Backbone.Model{

    Id:number;
    RestaurantId :number;
    Restaurant:any;
    StartTimeLocal: Date
    EndTimeLocal: Date
    StartTimeUtc: Date
    EndTimeUtc: Date
    TimeZoneOffset:number;
    Name: string;
    Capacity :number;
    VacancyStrategyId :number;
    ReservationCutOff :number;
    ShowVacancies: boolean
    BookingIncrement :number;
    BookingDuration :number;
    SittingPeriodName: string;
    Message: string;
    Pax:number;
}