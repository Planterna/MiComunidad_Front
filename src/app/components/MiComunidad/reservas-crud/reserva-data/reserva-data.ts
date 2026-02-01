import { Component, inject, OnInit, signal } from '@angular/core';
import { Tarjetas } from '../../../shared/tarjetas/tarjetas';
import { ReservaService } from '../../../../services/reserva.service';
import { ReservaResponse } from '../../../../models/reserva.model';
import { dataInformation, tarjetasConfig } from '../../../../models/tarjetas-config.model';
import { ModalsAlert } from '../../../shared/modals-alert/modals-alert';
import { AuthService } from '../../../../services/auth.service';
import { Roles } from '../../../../models/usuario.model';

@Component({
  selector: 'app-reserva-data',
  imports: [Tarjetas, ModalsAlert],
  templateUrl: './reserva-data.html',
})
export class ReservaData implements OnInit {
  //! DI
  reservaServicio = inject(ReservaService);
  authServicio = inject(AuthService);

  //! Config
  confReserva: tarjetasConfig = {
    id: 'id',
    titulo: 'nombreRecurso',
    subtitulo: 'fecha',
    horaInicio: 'horaInicio',
    horaFin: 'horaFin',
    descripcion: 'motivo',
    imagenUrl: 'imagenUrl',
    estado: 'estado',
    status: 'activo',
  };
  modalId = 'modal-reserva';
  tituloModal = signal<string>('');
  dataModal = signal<dataInformation | null>(null);
  reservaIdForEliminated = signal<number | null>(null);

  //! Data
  reservas = signal<ReservaResponse[]>([]);
  rolUser = signal<Roles | null>(null);
  idUser = signal<number | null>(null);


  //! Metodos Crud
  ngOnInit(): void {
      this.cargarData();
  }

  cargarData() {
    const rol = this.authServicio.getRole();
    const id = this.authServicio.getId(); 
    if(rol && id){
      this.rolUser.set(rol);
      this.idUser.set(id);
      if((rol === 'Administrador' || rol === 'Encargado')){
        this.reservaServicio.getReservasDataFull().subscribe((data) => this.reservas.set(data));
      }
      if(rol === 'Vecino' && id !== null){
        this.reservaServicio.getReservasDataFullForId(id).subscribe((data) => {this.reservas.set(data)});
      }


    }
  }



  eliminarData() {
    const id = this.reservaIdForEliminated();
    if (id) {
      this.reservaServicio.deleteReserva(id).subscribe(() => {
        this.modalStatusSuccess();
      });
    } else {
      this.modalStatusError();
    }
  }

  activarData(valueId: number) {
    if (valueId) {
      this.reservaServicio.activedReserva(valueId).subscribe(() => {
        this.modalStatusSuccess();
      });
    } else {
      this.modalStatusError();
    }
  }

  //! Filtro y Busqueda
  buscarDato(event: any) {
    const texto = event.target.value.toLowerCase().trim();

    if (texto === '') {
      this.cargarData();
      return;
    }

    const rol = this.authServicio.getRole();
    const id = this.authServicio.getId(); 
    if(rol && id) {
      if(rol === 'Vecino'){
        this.reservaServicio.buscarReservasPorMotivoPorId(texto, id).subscribe((res) => {
        this.reservas.set(res);
        });
      }
      if(rol === 'Administrador' || rol === 'Encargado'){
        this.reservaServicio.buscarReservasPorMotivo(texto).subscribe((res) => {
        this.reservas.set(res);
        });
      }

    }

  }

  FiltarDato(event: any) {
    const texto = event.target.value.trim();

    if (texto === '') {
      this.cargarData();
      return;
    }
    const rol = this.authServicio.getRole();
    const id = this.authServicio.getId(); 

    if(rol && id) {
      if(rol === 'Vecino'){
        this.reservaServicio.filtarReservaPorEstadoPorId(texto, id).subscribe((res) => {
        this.reservas.set(res);
        });
      }
      if(rol === 'Administrador' || rol === 'Encargado'){
        this.reservaServicio.filtarReservaPorEstado(texto).subscribe((res) => {
        this.reservas.set(res);
        });
      }

    }
  }

  //! Modal
  abrirConfirmacion(id: number) {
    this.tituloModal.set('Confirmar Eliminación');
    this.dataModal.set('confirm');
    this.reservaIdForEliminated.set(id);
    const check = document.getElementById(`${this.modalId}`) as HTMLInputElement;
    if (check) check.checked = true;
  }

  modalStatusSuccess() {
    this.tituloModal.set('Éxitoso');
    this.dataModal.set('success');
    const check = document.getElementById(`${this.modalId}`) as HTMLInputElement;
    if (check) check.checked = true;
    this.cargarData();
    setTimeout(() => {
      const check = document.getElementById(`${this.modalId}`) as HTMLInputElement;
      if (check) {
        check.checked = false;
        this.dataModal.set(null);
        this.tituloModal.set('');
        this.reservaIdForEliminated.set(null);
      }
    }, 1500);
  }

  modalStatusError() {
    this.tituloModal.set('Error');
    this.dataModal.set('error');

    const check = document.getElementById(`${this.modalId}`) as HTMLInputElement;
    if (check) check.checked = true;
    this.cargarData();
    setTimeout(() => {
      const check = document.getElementById(`${this.modalId}`) as HTMLInputElement;
      if (check) {
        check.checked = false;
        this.dataModal.set(null);
        this.tituloModal.set('');
        this.reservaIdForEliminated.set(null);
      }
    }, 1500);
  }
}
