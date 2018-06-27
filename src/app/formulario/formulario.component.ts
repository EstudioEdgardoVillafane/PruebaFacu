import { Component, OnInit, Input } from '@angular/core';
import {FormularioService} from '../formulario.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import { catchError, map, tap } from 'rxjs/operators';
import { isNull } from 'util';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  flagAdd = false; // inputs para agregar elementos al formulario arrancan desactivados
  flagEdit = false; // inputs para editar elementos al formulario arrancan desactivados
  auto = new Object; // objeto auto, contiene [nombre,marca,modelo]
  listado;
  pivot;
  
  constructor(private FormularioService:FormularioService) { }

  ngOnInit() {
    console.log("Se listo todo de nuevo.");
   this.listarenformulario(); // listar en formulario al inciar la pagina y al modificar
  }


  flagAddON(){
  this.flagAdd = true; //activar inputs en el html para agregar elementos al formulario 
  };
  flagsOFF(){
    this.flagAdd = false; //desactivar inputs en el html para agregar elementos al formulario
    this.flagEdit = false; //desactivar inputs en el html para editar elementos en formulario
  };  

  formAdd(){
    this.flagsOFF(); // desactivar visibilidad de inputs
    this.pivot = document.getElementById("nombre");
    this.auto["nombre"] = this.pivot.value;  //leer nombre y guardar en el objeto
    this.pivot = document.getElementById("marca");
    this.auto["marca"] = this.pivot.value;//leer marca y guardar en el objeto
    this.pivot = document.getElementById("modelo");
    this.auto["modelo"] = this.pivot.value;//leer modelo y guardar en el objeto

    this.FormularioService.enviarpost(this.auto) //enviar el objeto a metodo del servicio

    .subscribe((data) => {
      console.log(data); //checkear funcionamiento
      this.listarenformulario();
    });  
  };
  /**
   * Usamos el objeto auto para guardar los valores de los input que estan en patanlla.
   * usamos un auxiliar
   * 3 parametros objeto.
   */
  formEdit(){
    this.flagsOFF(); // desactivar visibilidad de inputs
    this.pivot = document.getElementById("nombreEditar");
    (this.pivot == isNull)? false :
    this.auto["nombre"] = this.pivot.value;  //leer nombre y guardar en el objeto
    this.pivot = document.getElementById("marcaEditar");
    (this.pivot == isNull)? false :
    this.auto["marca"] = this.pivot.value;//leer marca y guardar en el objeto
    this.pivot = document.getElementById("modeloEditar");
    (this.pivot == isNull)? false : 
    this.auto["modelo"] = this.pivot.value;//leer modelo y guardar en el objeto 
    this.auto["id"] = this.id;
    this.FormularioService.editPost(this.auto) //enviar el objeto a metodo del servicio

    .subscribe((data) => {
      console.log(data); //checkear funcionamiento
      this.listarenformulario();
    });
  };

id;
//toma valor de un checkbox tildado 
handleFunctionEdit(id : number):any{
  this.id = id;
  this.FormularioService.getJsonForID(id, this.listado) //Enviamos una id para buscar en el listado de autos
  .subscribe((Data) => {     //Tomamos el valor de repuesta
    this.pivot = Data;       //Guardamos la respuesta en una variable auxiliar
    console.log(this.pivot)  //Mostramos la variable auxiliar (que es un objeto) en consola
    this.flagEdit =  (Data == isNull)? false : true;    
  });
}; 

listarenformulario(){
  this.FormularioService.listarpost() // llamar a "listarpost()" del servicio
  .map((Response) => Response.json()) //transformar a json
  .subscribe((data) => {
    console.log(data);
    this.listado = data; // listado se carga con toda la info
    
    this.CantidadDePaginas = this.listado.length/5;
    this.CantidadDePaginas = Math.ceil(this.CantidadDePaginas)
  });
};


Booleano;
CheckAcumulador = new Array;
NumberAux = 0;
i = 0;
onCheck(id : number){  
  console.log(this.CheckAcumulador);
  this.Booleano=true;    
  if(this.NumberAux == 0){
    this.CheckAcumulador[0] = id;
    this.NumberAux++;
  }else{
    for(this.i = 0; this.i<this.NumberAux ; this.i++){
      if(id == this.CheckAcumulador[this.i]){
        this.CheckAcumulador.splice(this.i, 1);
        this.Booleano = false;
        this.NumberAux++;
      };
    };
    if(this.Booleano){
        this.CheckAcumulador[this.NumberAux] = id;
        this.NumberAux++;
      };
    };
  };

  borrar(){
    for(this.i=0; this.i<this.NumberAux; this.i++){
      if(this.CheckAcumulador[this.i] == undefined){
        console.log("Indefinido");
      }else{
        this.FormularioService.delete(this.CheckAcumulador[this.i])
        .subscribe((data) => { 
       });
      }
    }
    this.listarenformulario();
  }


//Paginador
CantidadDePaginas : number;
PaginaActual = 1;
Desde = 0;
Hasta = 5;

nextPag(){
  if(this.PaginaActual < this.CantidadDePaginas){
    this.PaginaActual++;
    this.Desde = this.Desde + 5;
    this.Hasta = this.Hasta + 5;
  }
}
prevPag(){
  if(this.PaginaActual > 1){
    this.PaginaActual--;
    this.Desde = this.Desde - 5;
    this.Hasta = this.Hasta - 5;
  }
}


}
