
import { Component } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from '@angular/common/http';
import {Router} from '@angular/router';

import swal from'sweetalert2';


@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent {

  constructor(private http: HttpClient, private router:Router) { }

    // variables NGMODEl para validar form
   ipServer:string="localhost";
   user:string ="wilfred";
   pasw:string="123456";
   database:string='GIS';


   conect() {  // meotod para realizar la conexion a DB con credenciales

    let jsonConect ={
      server:this.ipServer,
      username:this.user,
      pasw:this.pasw,
      database:this.database
    }



    // Realiza llamada al endpoint definido en server.js  .. y le envia un JSON de inforamcióna utilizar en consulta
    return this.http.put("http://localhost:3000/conectar",jsonConect)
    .subscribe(
      success => {
        console.log("datos: ", success);
        if(success == true){
          swal('Correcto...', "Ingreso Exitoso.", 'success');
          document.getElementById("closemodal").click();
          if(this.user == "postgres"){
            console.log("Entra a page admin");  // redirecciona a ruta home admin
            this.router.navigate(['admin']);  //  redirecciona a ruta home user
          }else{
            this.router.navigate(['home']);  //  redirecciona a ruta home user
          }

        }else{
          swal('Incorecto...', "Ingreso erroneo. Verifique sus credenciales.", 'error');
        }

      },
      err => {
       swal('Incorrecto...', "Error de conexion con endpoint /conectar.", 'error');
        console.log("Error ",err);
      }
    )
   }


}
