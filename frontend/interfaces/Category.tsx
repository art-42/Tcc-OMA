export interface Category {
  name?: string;
  userId?: string;
}

export interface CategoriesResponse {
  categorias: {
    _id: string,
    name: string,
  }[];
}

    
  