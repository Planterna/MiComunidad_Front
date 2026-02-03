import { Component } from '@angular/core';
import { RecursoData } from "../../../../components/MiComunidad/recursos-crud/recurso-data/recurso-data";

@Component({
  selector: 'app-recurso-vista',
  standalone: true,
  imports: [RecursoData],
  templateUrl: './recurso-vista.html',
})
export class RecursoVista { }