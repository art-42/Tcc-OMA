export interface Note {
  title: string;
  type: "texto" | "arquivo";
  groupId: string;
  text?: string; 
  fileUri?: string;
}

export interface NoteResponse {
  title: string;
  content: string | { id: string; [key: string]: any };
  type: "texto" | "arquivo";
  groupId: string;
  userId: string;
  date: string; 
}
