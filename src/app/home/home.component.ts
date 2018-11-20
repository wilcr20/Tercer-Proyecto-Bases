import { Component } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from '@angular/common/http';


import swal from'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {


 tablasUser:any=[];
 nuevoForm= false;
 WS= false;
 btnSaveWS=false;



  constructor(private http: HttpClient) {
    this.obtenerTablasUser();
  }


  verNuevo(){
    this.nuevoForm= true;
    this.WS=false;
    this.btnSaveWS=false;
  }
  verWS(){
    this.nuevoForm= false;
    this.WS=true;
    this.btnSaveWS=false;
  }
  generaMapa(){
    this.btnSaveWS= true;

  }



  obtenerTablasUser(){

    // Realiza llamada al endpoint definido en server.js  .. y le envia un JSON de inforamcióna utilizar en consulta
    return this.http.get("http://localhost:3000/obtenerTablas")
    .subscribe(
      success => {
       // console.log("datos: ", success);
        this.tablasUser= success;
        console.log("Tablas ",this.tablasUser);
      },
      err => {
       swal('Incorrecto...', "Error de conexion con endpoint /obtenerTablas.", 'error');
        console.log("Error ",err);
      }
    )

  }

}
