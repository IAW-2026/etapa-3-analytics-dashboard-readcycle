export interface TopProduct {
  id: string;
  title: string;
  author: string;
  category: string;
  sales: number;
  revenue: number;
  stock: number;
}

export interface CategoryData {
  label: string;
  value: number;
  color: string;
}

export interface ComprasSectionData {
  title: string;
  statusText: string;
  totalPublishedProducts: {
    value: number;
    delta: string;
  };
  topProducts: TopProduct[];
  categoriesData: CategoryData[];
}

export const mockComprasData: ComprasSectionData = {
  title: "Métricas de Compras y Órdenes",
  statusText: "Tasa de Abandono de Carrito: 24.5% | Stock total: 12,450 ejemplares",
  totalPublishedProducts: {
    value: 4320,
    delta: "+8.3% vs. mes anterior",
  },
  topProducts: [
    { id: "BK-102", title: "Cien años de soledad", author: "Gabriel García Márquez", category: "Ficción", sales: 245, revenue: 3675.00, stock: 18 },
    { id: "BK-405", title: "El principito", author: "Antoine de Saint-Exupéry", category: "Infantiles", sales: 189, revenue: 1512.00, stock: 45 },
    { id: "BK-890", title: "Breve historia del tiempo", author: "Stephen Hawking", category: "Científicos", sales: 142, revenue: 2556.00, stock: 8 },
    { id: "BK-321", title: "Sapiens", author: "Yuval Noah Harari", category: "Historia", sales: 128, revenue: 2304.00, stock: 15 },
    { id: "BK-764", title: "Hábitos atómicos", author: "James Clear", category: "Autoayuda", sales: 115, revenue: 1725.00, stock: 22 },
  ],
  categoriesData: [
    { label: "Ficción", value: 1420, color: "#2C3A27" }, // Forest
    { label: "Infantiles", value: 890, color: "#4A6741" }, // Sage
    { label: "Historia", value: 650, color: "#D97757" }, // Clay
    { label: "Científicos", value: 520, color: "#A78BFA" }, // Purple
    { label: "Autoayuda", value: 430, color: "#FBBF24" }, // Yellow
  ]
};
