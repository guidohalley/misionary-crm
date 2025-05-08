export type Persona = {
    id: number;
    nombre: string;
    tipo: "CLIENTE" | "PROVEEDOR" | "INTERNO";
    email: string;
    telefono?: string;
    cvu?: string;
    roles: ("ADMIN" | "CONTADOR" | "PROVEEDOR")[];
  };
  
  export type Producto = {
    id: number;
    nombre: string;
    precio: number;
  };
  
  export type Servicio = {
    id: number;
    nombre: string;
    precio: number;
  };
  
  export type Item = {
    productoId?: number;
    servicioId?: number;
    precio: number;
  };

  export type Presupuesto = {
    id: number;
    clienteId: number;
    subtotal: number;
    impuestos: number;
    total: number;
    estado: "BORRADOR" | "ENVIADO" | "APROBADO" | "FACTURADO";
    createdAt: string;
    updatedAt: string;
    cliente: Persona;
    items: {
      id: number;
      productoId?: number;
      servicioId?: number;
      cantidad: number;
      precioUnitario: number;
      producto?: Producto;
      servicio?: Servicio;
    }[];
  };
  
  