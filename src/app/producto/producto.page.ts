import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';//toas
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage implements OnInit {

  public producto: any = {
    nombre: '',
    presupuesto: '',
    unidad: '',
    cantidad: '',
    valorUnitario: '',
    proveedor: ''
  };
  public esNuevo: boolean = true;
  private id: number;

  constructor(
    private sqlite: SqliteService,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');
    if (this.id !== 0) {
      this.esNuevo = false;
      this.cargarProducto();
    }
  }

  cargarProducto() {
    this.sqlite.read().then((productos: any[]) => {
      this.producto = productos.find(p => p.id === this.id);
    }).catch(err => {
      console.error(err);
    });
  }

  /*guardarProducto() {
    if (this.esNuevo) {
      this.sqlite.create(this.producto).then(() => {
        this.router.navigate(['/inicio']);
      }).catch(err => {
        console.error(err);
      });
    } else {
      this.sqlite.update(this.producto, this.id).then(() => {
        this.router.navigate(['/inicio']);
      }).catch(err => {
        console.error(err);
      });
    }
  }*/
  
  /*async guardarProducto() {
    // Validar campos numéricos
    if (!this.camposNumericosValidos()) {
      await this.presentToast('Los campos numéricos deben contener valores numéricos.');
      return;
    }
  
    // Validar campos obligatorios
    if (!this.todosLosCamposDiligenciados()) {
      await this.presentToast('Por favor, diligencia todos los campos.');
      return;
    }
  
    if (this.esNuevo) {
      this.sqlite.create(this.producto).then(() => {
        this.router.navigate(['/inicio']);
      }).catch(async err => {
        await this.presentToast('Error al crear el producto.');
        console.error(err);
      });
    } else {
      this.sqlite.update(this.producto, this.id).then(() => {
        this.router.navigate(['/inicio']);
      }).catch(async err => {
        await this.presentToast('Error al actualizar el producto.');
        console.error(err);
      });
    }
  }*/

  async guardarProducto() {
    // Validar campos numéricos
    if (!this.camposNumericosValidos()) {
      await this.presentToast('Los campos numéricos deben contener valores numéricos.');
      return;
    }
  
    // Validar campos obligatorios
    if (!this.todosLosCamposDiligenciados()) {
      await this.presentToast('Por favor, diligencia todos los campos.');
      return;
    }
  
    // Validar que el valor total no exceda el presupuesto
    if (!this.presupuestoValido()) {
      await this.presentToast('El valor total (Valor Unitario x Cantidad) no debe exceder el presupuesto.');
      return;
    }
  
    if (this.esNuevo) {
      this.sqlite.create(this.producto).then(() => {
        this.router.navigate(['/inicio']);
      }).catch(async err => {
        await this.presentToast('Error al crear el producto.');
        console.error(err);
      });
    } else {
      this.sqlite.update(this.producto, this.id).then(() => {
        this.router.navigate(['/inicio']);
      }).catch(async err => {
        await this.presentToast('Error al actualizar el producto.');
        console.error(err);
      });
    }
  }
  
  camposNumericosValidos(): boolean {
    
    return !isNaN(Number(this.producto.presupuesto)) &&
           !isNaN(Number(this.producto.cantidad)) &&
           !isNaN(Number(this.producto.valorUnitario));
  }
  
  todosLosCamposDiligenciados(): boolean {
    
    return this.producto.nombre.trim() !== '' &&
           this.producto.presupuesto.trim() !== '' &&
           this.producto.unidad.trim() !== '' &&
           this.producto.cantidad.trim() !== '' &&
           this.producto.valorUnitario.trim() !== '' &&
           this.producto.proveedor.trim() !== '';
  }

  presupuestoValido(): boolean {
    const presupuesto = Number(this.producto.presupuesto);
    const cantidad = Number(this.producto.cantidad);
    const valorUnitario = Number(this.producto.valorUnitario);
    const total = cantidad * valorUnitario;
    return total <= presupuesto;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
  

  eliminarProducto() {
    this.sqlite.delete(this.id).then(() => {
      this.router.navigate(['/inicio']);
    }).catch(err => {
      console.error(err);
    });
  }
}

