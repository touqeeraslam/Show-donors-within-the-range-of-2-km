import { Component,ViewChild,ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { MapsModel } from "../../models/maps-model";
import { ManageMapsProvider } from '../../providers/manage-maps/manage-maps';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  mapsModel: MapsModel;
map:any;
kilometersRange:number = 2;
  donorsPosition:Array<MapsModel>=[];
  @ViewChild('map') mapElement: ElementRef;
  constructor(public navCtrl: NavController,private geolocation: Geolocation,
    public MapsProvider:ManageMapsProvider) {
    this.mapsModel = new  MapsModel();

  }
  ionViewDidLoad(){

    this.getCurrentPosition();
  }
  showDonorsMarks(){
    
    this.MapsProvider.getNearByDonors(this.mapsModel)
    .subscribe(data=>{
      if(data){
        data.forEach(element => {
          if(element.distance <= this.kilometersRange){
            this.donorsPosition.push(element);
  
          }
        });
        this.showMarker();

      }
     
        },error=>{
      console.log(error)
    })
  }
  showMarker(){
    
      for(let marker of this.donorsPosition) {
        var position = new google.maps.LatLng(marker.lat, marker.lng);
        var donorsMarker = new google.maps.Marker({position: position, title: marker.name});
        donorsMarker.setMap(this.map);
      }
}
  loadMap(){
 
    let latLng = new google.maps.LatLng(this.mapsModel.lat, this.mapsModel.lng);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
 
   this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

 
  }
getCurrentPosition(){

  this.geolocation.getCurrentPosition().then((resp) => {
    // 
    // 
    // this.mapsModel.lat =    resp.coords.latitude
    // this.mapsModel.lng =     resp.coords.longitude

    // for testing  hard_coded values of lat,lng of Isb

    this.mapsModel.lat =    33.738045
    this.mapsModel.lng =      73.084488

    this.loadMap();
   }).catch((error) => {
     console.log('Error getting location', error);
   });

}
 
}
