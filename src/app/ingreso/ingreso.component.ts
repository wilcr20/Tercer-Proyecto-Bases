
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
   user:string ="postgres";
   pasw:string="alvarado";
   database:string='proyectoBases';


   conect() {  // meotod para realizar la conexion a DB con credenciales

    let jsonConect ={
      server:this.ipServer,
      username:this.user,
      pasw:this.pasw,
      database:this.database
    }


    return this.http.put("http://localhost:3000/conectar",jsonConect)
    .subscribe(
      success => {
        console.log("datos: ", success);
        if(success == true){
          swal('Correcto...', "Ingreso Exitoso.", 'success');
          document.getElementById("closemodal").click();
          this.router.navigate(['home']);  //  redirecciona a ruta
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
