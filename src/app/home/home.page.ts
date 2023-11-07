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

}
