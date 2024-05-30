import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss'],
})
export class InicioPage implements OnInit {

  public productos: any[] = [];

  constructor(
    private sqlite: SqliteService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  ionViewWillEnter() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.sqlite.read().then((productos: any[]) => {
      this.productos = productos;
    }).catch(err => {
      console.error(err);
    });
  }

  agregarProducto() {
    this.router.navigate(['/producto', 0]);
  }

  verProducto(id: number) {
    this.router.navigate(['/producto', id]);
  }

  editarProducto(id: number) {
    this.router.navigate(['/producto', id]);
  }

  eliminarProducto(id: number) {
    this.sqlite.delete(id).then(() => {
      this.cargarProductos();
    }).catch(err => {
      console.error(err);
    });
  }
}

