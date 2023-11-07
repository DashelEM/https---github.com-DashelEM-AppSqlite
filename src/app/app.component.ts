import { Component } from '@angular/core';
import { DatabaseService } from './services/database.service';
import { Platform } from '@ionic/angular';
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public isWeb: boolean;
  public load: boolean;

  constructor(private platform: Platform, private database: DatabaseService) {
    this.isWeb = false;
    this.load = false;
    this.initAPP();
  }

  async initAPP(){

    this.platform.ready().then( async() => {
      const info = await Device.getInfo();
      this.isWeb = info.platform == 'web';

      this.database.init();
      this.database.dbReady.subscribe(load =>{
        this.load = load;
      })
    })
  }
}
