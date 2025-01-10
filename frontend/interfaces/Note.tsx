export interface Note {
  title: string;
  content: string | { id: string; [key: string]: any }; // String para texto, objeto para arquivos
  type: "texto" | "arquivo";
  groupId: string;
}

export interface NoteResponse {
  title: string;
  content: string | { id: string; [key: string]: any };
  type: "texto" | "arquivo";
  groupId: string;
  userId: string;
  date: string; 
}
