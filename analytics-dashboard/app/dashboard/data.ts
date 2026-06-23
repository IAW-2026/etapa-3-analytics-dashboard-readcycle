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
    admins: number;
  };
  totalAmountMoved: number;
  sections: {
    datos: SectionDetail;
    compras: SectionDetail;
    envios: SectionDetail;
    pagos: SectionDetail;
  };
};