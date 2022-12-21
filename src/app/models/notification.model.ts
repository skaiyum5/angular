export interface INotificationResponse {
    notificationID?:    string;
    NotificationTitle?: string;
    NotificationBody?:  string;
    CreatedAt?:         Date;
    WebUrl?:            null;
    ImgUrl?:            null;
    isRead?:            boolean;
}