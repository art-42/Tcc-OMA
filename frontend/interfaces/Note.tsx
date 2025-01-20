export interface Note {
  title: string;
  type: "texto" | "arquivo" | "foto" | "desenho";
  groupId: string;
  text?: string; 
  fileUri?: string;
  fileName?: string;
  base64?: string;
}

export interface NoteResponse {
  title: string;
  content: string;
  type: "texto" | "arquivo" | "foto" | "desenho";
  groupId: string;
  userId: string;
  date: string; 
}
