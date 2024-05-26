import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public producto: string;
  public productos: string[];

  constructor(
    private sqlite: SqliteService,
    private toastController: ToastController
  ) {
    this.producto = '';
    this.productos = [];
  }

  // Al entrar, leemos la base de datos
  ionViewWillEnter(){
    this.read();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duración del toast en milisegundos
      position: 'bottom' // Posición del toast en la pantalla
    });
    toast.present();
  }

  create(){
    // Creamos un elemento en la base de datos
    /*if(this.producto && this.producto.trim() !== ''){
      this.sqlite.create(this.producto.toUpperCase()).then( (changes) =>{
        console.log(changes);
        console.log("Creado");
        this.producto = '';
        this.read(); // Volvemos a leer
      }).catch(err => {
        console.error(err);
        console.error("Error al crear");
      })
    }else {
      console.warn("El producto no puede estar vacío");
    }*/
    
    if (this.producto && this.producto.trim() !== '') {
      this.sqlite.create(this.producto.toUpperCase()).then((changes) => {
        console.log(changes);
        console.log("Creado");
        this.producto = '';
        this.read(); // Volvemos a leer
      }).catch(err => {
        console.error(err);
        console.error("Error al crear");
      });
    } else {
      this.presentToast("El producto no puede estar vacío");
    }
    
  }

  read(){
    // Leemos los datos de la base de datos
    this.sqlite.read().then( (productos: string[]) => {
      this.productos = productos;
      console.log("Leido");
      console.log(this.productos);
    }).catch(err => {
      console.error(err);
      console.error("Error al leer");
    })
  }
  
  update(producto: string){
    // Actualizamos el elemento (language) por el nuevo elemento (this.language)
    this.sqlite.update(this.producto.toUpperCase(), producto).then( (changes) => {
      console.log(changes);
      console.log("Actualizado");
      this.producto = '';
      this.read(); // Volvemos a leer
    }).catch(err => {
      console.error(err);
      console.error("Error al actualizar");
    })
  }

  delete(producto: string){
    // Borramos el elemento
    this.sqlite.delete(producto).then( (changes) => {
      console.log(changes);
      console.log("Borrado");
      this.read(); // Volvemos a leer
    }).catch(err => {
      console.error(err);
      console.error("Error al borrar");
    })
  }

}
