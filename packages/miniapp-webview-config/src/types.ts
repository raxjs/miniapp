export interface AppItemType {
  entryName: string;
  url?: string;
  source: string;
  name?: string
}

export interface AppConfigType {
  routes: AppItemType[]
}