export interface NotificationChannel {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  channels: NotificationChannel[];
}
