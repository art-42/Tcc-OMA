export interface Group {
  userId?: string;
  categoryId?: string;
  name?: string;
}

export interface GroupResponse {
  message: string;
  group: {
    _id: string;
    name: string;
  };
}

export interface GroupsResponse {
  groups: {
    name: string;
    createdAt: string;
  }[];
}

    
  