export interface AppItemType {
  entryName: string;
  url?: string;
  source: string;
  name?: string
}

export interface AppConfigType {
  routes: AppItemType[]
}

export interface RouteType {
  name?: string;
  source: string;
  url?: string;
  webEntryName?: string;
  entryName: string;
}
