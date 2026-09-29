export type AppType = "internal" | "external";

export interface SystemApp {
  id: string;
  label: string;
  iconName: string;
  type: AppType;
}

export const APP_REGISTRY: SystemApp[] = [
  { id: "files", label: "SYS_FILES", iconName: "Folder", type: "external" }, // Example: uses pcmanfm
  { id: "browser", label: "NET_NAV", iconName: "Globe", type: "external" },  // Example: uses firefox
  { id: "search", label: "OMNI_FIND", iconName: "Search", type: "internal" },
  { id: "media", label: "MEDIA_CORE", iconName: "PlayCircle", type: "internal" },
  { id: "audio", label: "AUDIO_SYS", iconName: "Music", type: "internal" },
  { id: "comms", label: "COMMS_LINK", iconName: "Mail", type: "internal" },
  { id: "gallery", label: "VISUALS", iconName: "Image", type: "internal" },
  { id: "map", label: "GEO_LOC", iconName: "Map", type: "internal" },
  { id: "settings", label: "SYS_CONFIG", iconName: "Settings", type: "internal" },
  { id: "terminal", label: "SYS_TERM", iconName: "Terminal", type: "external" },
];
