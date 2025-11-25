export enum ThemeStyle {
  FUN = 'fun',
  ELEGANT = 'elegant',
  MINIMAL = 'minimal',
  SPACE = 'space',
  NATURE = 'nature'
}

export interface InvitationData {
  name: string;
  age: string;
  date: string;
  time: string;
  location: string;
  theme: ThemeStyle;
  customMessage: string;
}

export interface GenerationRequest {
  name: string;
  age: string;
  theme: ThemeStyle;
  tone: 'funny' | 'formal' | 'excited';
}