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
 geomMapa:any=[];

 // Validadores ngIf
 nuevoForm= false;
 WS= false;
 btnSaveWS=false;
 showMapa= false;

 // Usadas para graficar mapa
 ws = {
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
    this.widthSVG=550;  // se obtienen tamaños del canvas a usar
    this.heightSVG=550;
    this.cargarCapa();
}



  cargarCapa(){

     let nmapa= document.getElementById("mapa").value;

    // var n_capa = {  // objeto capa a crear
    //   mapa: nmapa,
    //   schema: this.obtenerEsquema(nmapa),
    //   color:document.getElementById('color').value,
    //   transparencia:parseInt(document.getElementById('opacity').value)/100,
    //   figuras:{},
    //   visible:true,
    //   actualizarFiguras:function() // se le asina un metodo a la capa , para actualizarse a si misma
    //    {
    //        this.actualizarFiguras(this);
    //    }
    // };

    let n_capa= new Object();
    n_capa.mapa= nmapa,
    n_capa.schema=this.obtenerEsquema(nmapa),
    n_capa.color=document.getElementById('color').value,
    n_capa.transparencia=parseInt(document.getElementById('opacity').value)/100,
    n_capa.figuras="",
    n_capa.visible=true,
    n_capa.actualizarFiguras=function() // se le asina un metodo a la capa , para actualizarse a si misma
    {
         this.actualizarFiguras(this);
    }

    this.ws.capas.push(n_capa);
    this.actualizarFiguras(n_capa);

    console.log("Wokspace actual: ",this.ws)
  }


  actualizarFiguras(capa){ // recibe un objeto capa, y le realiza el seteo de las figuras correspondientes

    this.obtenerTablaMapa(capa);// Llama endpoint para obtener la geometria del mapa a dibujar

    setTimeout(() => {
       //capa.figuras=eval('({"geometria":'+this.geomMapa+'})');
       capa.figuras =this.geomMapa;
       for (var i=0; i< capa.figuras.length; i++){
         //console.log("CAPA FOR: ",capa.figuras[i]);
         //capa.figuras[i].geom=  eval('('+capa.figuras[i].geom+')');
         capa.figuras[i].geom= capa.figuras[i].geom;
       }
       this.dibujarPoligonos();
     }, 1500);
  }

  dibujarPoligonos(){
    this.actualizaLimites();
  }

  actualizaLimites(){
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
        //console.log("datos: ", success);
        this.geomMapa= success;
        // let xd= eval(this.geomMapa[0].geom.toString());
        // console.log(xd);
        //console.log(this.geomMapa);
      },
      err => {
       swal('Incorrecto...', "Error de conexion con endpoint /obtenerTablaMapa.", 'error');
        console.log("Error ",err);
      }
    )
  }

}
