import { Component } from '@angular/core';
import { DatabaseService} from '../services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],

})
export class HomePage {

  public name: string;
  public names: string[];
/*vivencias = this.database.getVivencias();

newVivenciaTitle='-';
newVivenciaDate ='';
newVivenciaDescription ='';
newVivenciaPhoto ='';
newVivenciaAudio ='';*/


  constructor(private database: DatabaseService) {
    this.name = '';
  this.names = [];
  }

  create(){

  }

  read(){
    
  }

  update(name: string){

  }

  delete(name: string){

  }
  
 /* async createVivencia(){
    await this.database.addVivencias(this.newVivenciaTitle, this.newVivenciaDate, this.newVivenciaDescription, this.newVivenciaPhoto, this.newVivenciaAudio);
    this.newVivenciaTitle ='';
    this.newVivenciaDate='';
    this.newVivenciaDescription= '';
    this.newVivenciaPhoto='';
    this.newVivenciaAudio='';
  }

  updateVivencia(vivencia: Vivencia){
    this.database.updateVivenciasById(vivencia.id.toString());
  }

  deleteVivencia(vivencia: Vivencia){
    this.database.deleteVivencias(vivencia.id.toString());
  }*/
}
