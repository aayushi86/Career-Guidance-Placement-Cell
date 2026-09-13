import { request } from "./api";

export const notificationApi = {
  getStudentNotifications: () => request("/notifications"),

  markAsRead: (id) =>
    request(`/notifications/${id}/read`, {
      method: "PATCH",
    }),
};