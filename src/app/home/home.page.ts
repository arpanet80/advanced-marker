import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})

export class HomePage  implements AfterViewInit{

  private renderer = inject(Renderer2);

  @ViewChild('map', {static: true}) mapElementRef!: ElementRef;

  map: any;           // mapa en toda la pagina
  mapListener: any;
  // tribunalElectoralPoint  =  {lat: -19.577337590136207, lng: -65.75577817299181 };         //TED
  tribunalElectoralPoint = new google.maps.LatLng(-19.577337590136207, -65.75577817299181);

  constructor() {}

  ngAfterViewInit() {

    this.loadMap();


    var m = this.addDefaultAdvancedMaker(this.tribunalElectoralPoint);

  }

  async addLegacyMarker(location: { lat: number; lng: number}) {

      return  await new google.maps.Marker({
        position: this.tribunalElectoralPoint,
        map: this.map,
        draggable: true,
        animation: google.maps.Animation.DROP
      });

  }

  async addDefaultAdvancedMaker(location: { lat: number; lng: number}) {

    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    const markerPin = new PinElement({
      scale: 1,
      background: "#76ba1b",
      borderColor: "#137333",
      glyphColor: "#137333",
    });

    const marker = new AdvancedMarkerElement({
      map: this.map,
      position: location,
      gmpDraggable: false,
      content: markerPin.element,
    });

    marker.addListener("click", (event: any) => {
      // console.log("Posicion Marcado: ", event.latLng.lat());

      let content = "<h4>Information!</h4>";

      let infoWindow = new google.maps.InfoWindow({
        content: content
      });

      infoWindow.open(this.map, marker);

      console.log("Posicion Marcado: ", event.latLng.lat());
    });

    return marker;
  }

  async addAdvancedMakerCustomIcon(location: { lat: number; lng: number}, icon: string) {

    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    /// Configura el icono ////////////////
    const markerIcon = document.createElement('img');
    markerIcon.src = icon; /// 'assets/imgs/oep.png';
    markerIcon.height = 40;
    markerIcon.width = 40;

    ////// Aplica el arquer //////////
    const marker = new AdvancedMarkerElement({
      map: this.map,
      position: location,
      gmpDraggable: false,
      content: markerIcon
    });

    // this.map.panTo(location);

    marker.addListener("click", () => {
      // Remove AdvancedMarkerElement from Map
      marker.map = null;
    });

    return marker;
  }


  async loadMap() {
    try {

      const { Map } = await google.maps.importLibrary("maps");

      const mapOptions = {
        center:  this.tribunalElectoralPoint,
        // center: new google.maps.LatLng(0, 0),
        zoom: 17,
        mapId: "4504f8b37365c3d0",
        disableDefaultUI: true,          // Esconde el controlador de zoom del mapa
        // mapTypeId:'satellite'
        // scaleControl: false,
        // streetViewControl: false,
        // zoomControl: false,
        // overviewMapControl: false,
        // mapTypeControl: false,
        // fullscreenControl: false,

      };

      this.map = new Map(this.mapElementRef.nativeElement, mapOptions);

      // this.addLegacyMarker(this.tribunalElectoralPoint);

      // Map listeners
      this.mapListener = this.map.addListener("click", (event: any) => {
        this.map.panTo(event.latLng);         /// Centra donde hace click
        console.log(event.latLng.lat());
      });

    } catch(e) {
      console.log(e);
    }
  }


}
