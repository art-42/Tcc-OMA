export interface Note {
  title: string;
  type: "texto" | "arquivo" | "foto";
  groupId: string;
  text?: string; 
  fileUri?: string;
}

export interface NoteResponse {
  title: string;
  content: string;
  type: "texto" | "arquivo";
  groupId: string;
  userId: string;
  date: string; 
}
