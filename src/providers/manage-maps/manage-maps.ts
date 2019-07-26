import { Http,Response } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';


declare var google;
@Injectable()
export class ManageMapsProvider {
  path:Array<number>=[];
  distance:number;

  constructor(public http: Http) {
  }
  getNearByDonors(userLocation){

    
   return this.http.get('assets/api/lat-lng.json')
    .map((res :Response) => {

      let data = res.json().data
        var donorsData = this.applyHaversine(data, userLocation);
      donorsData.sort((locationA, locationB) => {
          return locationA.distance - locationB.distance;
        });
        return donorsData

  })
  .catch(this.handleError)
    

  }
  applyHaversine(locations, userLocation) {


    locations.forEach(element => {
      
      element.distance = this.getDistanceBetweenPoints(
        userLocation,
        element,
        'kilometers'
      )

    });
   
      return locations;
  }
  getDistanceBetweenPoints(start, end, units) {
    
     
    this.path.push( new google.maps.LatLng(start.lat, start.lng));
    this.path.push( new google.maps.LatLng(end.lat, end.lng));
   this.distance = (google.maps.geometry.spherical.computeDistanceBetween(this.path[0], this.path[1]) / 1000);
    return this.distance

  } 
  
  public handleError(error :Response){
    return Observable.throw(error);
  }
}
