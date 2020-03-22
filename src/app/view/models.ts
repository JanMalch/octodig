export type RendererType = 'codemirror' | 'marked' | 'image' | 'table' | null;

export interface Renderer {
  type: RendererType;
  mode?: any;
  name: string | null;
}
