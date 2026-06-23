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
};