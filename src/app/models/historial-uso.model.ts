export interface HistorialUsoResponse {
  id?: number;
  usuarioId: number;
  recursoId: number;
  fechaUso: string;        // SIEMPRE string YYYY-MM-DD
  horaInicio: string;      // HH:mm
  horaFin: string;         // HH:mm
  estado: string;
  notas: string;
  activo: boolean;
  fechaCreacion?: string;
  fechaModificacion?: string | null;
  usuario?: any;
  recurso?: any;
}

export enum estado {
  Devuelto = 'Devuelto',
  Dañado = 'Dañado',
  Retrasado = 'Retrasado'
}
