export function fileId(item: any): string {
  return encodeURIComponent(item.path);
}
