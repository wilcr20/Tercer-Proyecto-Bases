import { Component } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from '@angular/common/http';
import * as $ from 'jquery';

import swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {


 tablasUser:any=[];
 geomMapa:any=[];

 // Validadores ngIf
 nuevoForm= false;
 WS= false;
 btnSaveWS=false;
 showMapa= false;

 // Usadas para graficar mapa
 ws = {
   nombre:"",
   fecha:"",
   capas: new Array(),
   xmin:0.0,
   ymin:0.0,
   xmax:0.0,
   ymax:0.0,
   width:0.0,
   height:0.0,
   factorP:0.0
 };



 widthSVG=0;
 heightSVG=0;
 //ws.capas=new Array();



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
    this.showMapa= false;
  }
  generaMapa(){
    this.btnSaveWS= true;
    this.showMapa= true;
    this.init();  

  }





  obtenerEsquema(mapaN){  // dado el nombre del mapa, retorna el schema que le corresponde xd
    for(var i =0; i<this.tablasUser.length;i++){
      if(this.tablasUser[i].table_name == mapaN){ // reccore lisat de mapas que tiene
        return this.tablasUser[i].table_schema; //y retorna el que coincida con el nombre buscado
      }
    }
  }


  init(){
    this.widthSVG=600;  // se obtienen tamaños del canvas a usar
    this.heightSVG=600;
    this.cargarCapa();
}



  cargarCapa(){

     let nmapa= document.getElementById("mapa").value;

     var n_capa = {  // objeto capa a crear
       mapa: nmapa,
       schema: this.obtenerEsquema(nmapa),
       color:document.getElementById('color').value,
       transparencia:parseInt(document.getElementById('opacity').value)/100,
       figuras:{},
       visible:true,
       actualizarFiguras:function() // se le asina un metodo a la capa , para actualizarse a si misma
        {
            this.actualizarFiguras(this);
        }
     };

    // let n_capa= new Object();
    // n_capa.mapa= nmapa,
    // n_capa.schema=this.obtenerEsquema(nmapa),
    // n_capa.color=document.getElementById('color').value,
    // n_capa.transparencia=parseInt(document.getElementById('opacity').value)/100,
    // n_capa.figuras=[],
    // n_capa.visible=true,
    // n_capa.actualizarFiguras=function() // se le asina un metodo a la capa , para actualizarse a si misma
    // {
    //      this.actualizarFiguras(this);
    // }

    this.ws.capas.push(n_capa);
    this.actualizarFiguras(n_capa);

    console.log("Wokspace actual: ",this.ws)
  }


  actualizarFiguras(capa){ // recibe un objeto capa, y le realiza el seteo de las figuras correspondientes
    this.obtenerTablaMapa(capa);// Llama endpoint para obtener la geometria del mapa a dibujar
    setTimeout(() => {
       capa.figuras =this.geomMapa;
       this.dibujarPoligonos();
     }, 1500);
  }



  dibujarPoligonos(){  // dibuja todas las figuras del WS
    this.actualizaLimites(); // primero se actualizan los limites del mapa :v

    var misvg=document.getElementById('misvg');

    for (var i=0;i<this.ws.capas.length;i++)
    {
        for (var j=0; j< this.ws.capas[i].figuras.length; j++)
        {
            var n_poly=document.createElementNS("http://www.w3.org/2000/svg",'polygon');
            n_poly.setAttribute('style','fill:'+this.ws.capas[i].color+';stroke:gray;stroke-width:1');
            n_poly.setAttribute('opacity',this.ws.capas[i].transparencia);

            var geom = this.ws.capas[i].figuras[j].geom;
            var ymax = parseFloat(this.ws.capas[i].figuras[j].ymax);
            var ymin = parseFloat(this.ws.capas[i].figuras[j].ymin);
            var CRTM05coords=geom.coordinates[0][0];
            var coords="";
            for (var k in CRTM05coords)
            {
                var coord=CRTM05coords[k];
                coords+=coord[0]+','+(((this.ws.ymax)-coord[1])+this.ws.ymin)+' ';
            }
            n_poly.setAttribute('points',coords);
            misvg.appendChild(n_poly);
            this.ws.capas[i].figuras[j].poligono=n_poly;
        }
    }

  }



  actualizaLimites(){  // actualiza los limites del mapa
    for (var i in this.ws.capas)
    {
        for (var j in this.ws.capas[i].figuras)
        {
                if ((this.ws.xmin==0.0) || (this.ws.xmin>this.ws.capas[i].figuras[j].xmin))
                this.ws.xmin=parseFloat(this.ws.capas[i].figuras[j].xmin);
                if ((this.ws.ymin==0.0) || (this.ws.ymin>this.ws.capas[i].figuras[j].ymin))
                this.ws.ymin=parseFloat(this.ws.capas[i].figuras[j].ymin);
                    if ((this.ws.xmax==0.0) || (this.ws.xmax<this.ws.capas[i].figuras[j].xmax))
                    this.ws.xmax=parseFloat(this.ws.capas[i].figuras[j].xmax);
                if ((this.ws.ymax==0.0) || (this.ws.ymax<this.ws.capas[i].figuras[j].ymax))
                this.ws.ymax=parseFloat(this.ws.capas[i].figuras[j].ymax);
        }
    }
    this.ws.width=this.ws.xmax-this.ws.xmin;
    this.ws.height=this.ws.ymax-this.ws.ymin;
    this.ws.factorP=0.0;
    var misvg=document.getElementById('misvg');
    misvg.setAttribute('viewBox',this.ws.xmin+' '+this.ws.ymin+' '+this.ws.width+' '+this.ws.height);

    console.log("this.ws.width ", this.ws.width);
    console.log("this.ws.height ", this.ws.height);
    console.log("this.ws.factorP ", this.ws.factorP);


  }


  limpiar(){  // resetae el WS y actualiza en pantalla
    for (var i=0; i<this.ws.capas.length;i++){
      this.ws.capas[i].figuras="";
    }
  }


  guardarWS(){
    let nombre = document.getElementById("name").value;
    let fecha = document.getElementById("fecha").value;
    if(nombre == "" || fecha == ""){
      alert("Debe de colocar un nombre y fecha válido para guardar");
    }else{
      this.ws.nombre= nombre;
      this.ws.fecha = fecha;
      console.log("SAVE: ", this.ws);
    }

  }









/// ----------------------- Llamadas de endPoints


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

  obtenerTablaMapa(capa){  // se envia un json con la info a pedir
    let json ={
      n_tabla:capa.mapa,
      n_schema:capa.schema
    }

    // Realiza llamada al endpoint definido en server.js  .. y le envia un JSON de inforamcióna utilizar en consulta
    return this.http.put("http://localhost:3000/obtenerTablaMapa",json)
    .subscribe(
      success => {
        this.geomMapa= success;

      },
      err => {
       swal('Incorrecto...', "Error de conexion con endpoint /obtenerTablaMapa.", 'error');
        console.log("Error ",err);
      }
    )
  }

}
