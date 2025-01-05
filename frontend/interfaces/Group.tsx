export interface Group {
  userId?: string;
  categoryId?: string;
  name?: string;
}

export interface GroupResponse {
  group: {
    _id: string;
    name: string;
    categoryId: string;
  };
}

export interface GroupsResponse {
  groups: {
    name: string;
    createdAt: string;
  }[];
}

    
  