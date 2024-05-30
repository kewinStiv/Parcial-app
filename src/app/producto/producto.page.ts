import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router
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

  guardarProducto() {
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
  }

  eliminarProducto() {
    this.sqlite.delete(this.id).then(() => {
      this.router.navigate(['/inicio']);
    }).catch(err => {
      console.error(err);
    });
  }
}

