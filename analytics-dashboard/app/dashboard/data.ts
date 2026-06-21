export interface SectionDetail {
  title: string;
  metric: string;
  metricLabel: string;
  statusText: string;
  items: Array<{
    id: string;
    label: string;
    subLabel: string;
    value: string;
    status: string;
    statusStyle: string;
  }>;
}

export interface DashboardData {
  registeredUsers: {
    total: number;
    sellers: number;
    buyers: number;
    carriers: number;
    operators: number;
  };
  totalAmountMoved: number;
  sections: {
    datos: SectionDetail;
    compras: SectionDetail;
    envios: SectionDetail;
    pagos: SectionDetail;
  };
}

export const mockDashboardData: DashboardData = {
  registeredUsers: {
    total: 14280,
    sellers: 7120,
    buyers: 5330,
    carriers: 1450,
    operators: 380
  },
  totalAmountMoved: 248500.00,
  sections: {
    datos: {
      title: "Datos Generales del Sistema",
      metric: "45ms",
      metricLabel: "Latencia Promedio API",
      statusText: "Base de Datos: Saludable (99.99% Uptime)",
      items: [
        { id: "LOG-01", label: "Sincronización de API", subLabel: "Sincronización con pasarela de pagos completada", value: "Hace 2 min", status: "Éxito", statusStyle: "bg-emerald-100 text-emerald-800" },
        { id: "LOG-02", label: "Backup de Base de Datos", subLabel: "Respaldo diario automático realizado en AWS S3", value: "Hace 1 hora", status: "Completado", statusStyle: "bg-emerald-100 text-emerald-800" },
        { id: "LOG-03", label: "Limpieza de Sesiones", subLabel: "Purga de 1,240 tokens de sesión expirados", value: "Hace 4 horas", status: "Éxito", statusStyle: "bg-emerald-100 text-emerald-800" },
        { id: "LOG-04", label: "Optimización de Índices", subLabel: "Indexación de tablas de usuarios y transacciones", value: "Ayer, 04:00", status: "Mantenimiento", statusStyle: "bg-amber-100 text-amber-800" }
      ]
    },
    compras: {
      title: "Métricas de Compras y Órdenes",
      metric: "1,840",
      metricLabel: "Órdenes Registradas",
      statusText: "Tasa de Abandono de Carrito: 24.5%",
      items: [
        { id: "COM-92", label: "Orden #1084 - Libros Universitarios", subLabel: "Comprador: martin.gomez", value: "$45.00", status: "Procesada", statusStyle: "bg-emerald-100 text-emerald-800" },
        { id: "COM-91", label: "Orden #1083 - Colección Novelas Fantasía", subLabel: "Comprador: sofia.rod", value: "$120.00", status: "Procesada", statusStyle: "bg-emerald-100 text-emerald-800" },
        { id: "COM-90", label: "Orden #1082 - Enciclopedia Científica", subLabel: "Comprador: lucas.p", value: "$85.00", status: "Cancelada", statusStyle: "bg-rose-100 text-rose-800" },
        { id: "COM-89", label: "Orden #1081 - Novela Histórica", subLabel: "Comprador: camila.d", value: "$18.50", status: "Procesada", statusStyle: "bg-emerald-100 text-emerald-800" }
      ]
    },
    envios: {
      title: "Logística y Despacho de Envíos",
      metric: "850",
      metricLabel: "Envíos Totales Procesados",
      statusText: "En tránsito: 120 | Entregados: 685 | Pendientes: 45",
      items: [
        { id: "ENV-40", label: "Despacho Andreani - ID 9012", subLabel: "Destinatario: martin.gomez", value: "Córdoba", status: "En Tránsito", statusStyle: "bg-blue-100 text-blue-800" },
        { id: "ENV-39", label: "Despacho Correo Argentino - ID 9011", subLabel: "Destinatario: sofia.rod", value: "Buenos Aires", status: "Entregado", statusStyle: "bg-emerald-100 text-emerald-800" },
        { id: "ENV-38", label: "Despacho OCA - ID 9010", subLabel: "Destinatario: lucas.p", value: "Rosario", status: "Entregado", statusStyle: "bg-emerald-100 text-emerald-800" },
        { id: "ENV-37", label: "Retiro en Punto ReadCycle - ID 9009", subLabel: "Destinatario: camila.d", value: "Punto Central", status: "Pendiente", statusStyle: "bg-amber-100 text-amber-800" }
      ]
    },
    pagos: {
      title: "Transacciones Financieras y Pagos",
      metric: "99.4%",
      metricLabel: "Tasa de Éxito de Transacciones",
      statusText: "Pasarelas Activas: Stripe, PayPal, MercadoPago",
      items: [
        { id: "PAG-75", label: "Cargo Stripe - Tarjeta Crédito", subLabel: "Comprador: martin.gomez", value: "$45.00", status: "Aprobado", statusStyle: "bg-emerald-100 text-emerald-800" },
        { id: "PAG-74", label: "Pago PayPal - Fondos cuenta", subLabel: "Comprador: sofia.rod", value: "$120.00", status: "Aprobado", statusStyle: "bg-emerald-100 text-emerald-800" },
        { id: "PAG-73", label: "Cargo MercadoPago - Débito", subLabel: "Comprador: lucas.p", value: "$85.00", status: "Aprobado", statusStyle: "bg-emerald-100 text-emerald-800" },
        { id: "PAG-72", label: "Cargo Stripe - Tarjeta Rechazada", subLabel: "Comprador: camila.d", value: "$18.50", status: "Rechazado", statusStyle: "bg-rose-100 text-rose-800" }
      ]
    }
  }
};
