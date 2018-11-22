import { Component, OnInit } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from '@angular/common/http';


import swal from'sweetalert2';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private http: HttpClient) { }

  createUser(){
    let nameUser= document.getElementById("inputnameUser").value;
    let password= document.getElementById("inputpassword").value;
    let mapas=[];
    let sqlmapas="";

    let edificios =document.getElementById("edificios").checked;
    let fincastec =document.getElementById("fincastec").checked;
    let islas =document.getElementById("islas").checked;
    let vialidad =document.getElementById("vialidad").checked;

    if(edificios==true){
      mapas.push("edificios");
    }

    if(fincastec==true){
      mapas.push("fincastec");
    }

    if(islas==true){
      mapas.push("islas");
    }

    if(vialidad==true){
      mapas.push("vialidad");
    }

    for(var i=0;i<mapas.length;i++){
      sqlmapas += "grant select on "+mapas[i]+" to "+ nameUser +";";
    }
    

    let json = {
      nombre:nameUser,
      contraseña: password,
      sqlmapas: sqlmapas
    }

    console.log(json)

    // Realiza llamada al endpoint definido en server.js  .. y le envia un JSON de inforamcióna utilizar en consulta
    return this.http.put("http://localhost:3000/crearUsuario",json) 
    .subscribe(
      success => {
       console.log(success)
      },
      err => {
       swal('Incorrecto...', "Error de conexion con endpoint /crearUsuario.", 'error');
        console.log("Error ",err);
      }
    )
  }




  ngOnInit() {
  }

}
