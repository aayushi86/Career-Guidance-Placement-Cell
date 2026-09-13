import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { notificationApi } from "../../services/notificationApi";

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const dropdownRef = useRef(null);

  const fetchAlerts = async () => {
    // Avoid triggering calls if the user is logged out
    const token = localStorage.getItem("token") || localStorage.getItem("career_token");
    if (!token) return;

    try {
      const res = await (notificationApi.getNotifications 
        ? notificationApi.getNotifications() 
        : notificationApi.getStudentNotifications());

      console.log("🔔 NOTIFICATION RESPONSE:", res);

      if (res?.success) {
        setNotifications(res.notifications || []);
        setUnread(res.unreadCount || 0);
      }
    } catch (err) {
      console.error("🔔 Notification error:", err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 20000); // Polling every 20s
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getBadgeStyle = (type) => {
    switch (type) {
      case "INTERVIEW":
        return "bg-purple-100 text-purple-700";
      case "OFFER":
      case "SHORTLISTED":
        return "bg-emerald-100 text-emerald-700";
      case "REJECTED":
        return "bg-rose-100 text-rose-700";
      case "JOB_POSTED":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          if (!open) setUnread(0);
        }}
        className="relative w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200/80 flex items-center justify-center text-slate-700 transition"
        title="Placement Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md animate-pulse">
            {unread}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 z-50 space-y-3">
          <div className="flex justify-between items-center px-2 pt-1 border-b border-slate-100 pb-2">
            <h4 className="text-sm font-black text-slate-900">Placement Alerts</h4>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {notifications.length} Updates
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 space-y-1">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div key={item._id || item.id} className="p-2.5 rounded-2xl hover:bg-slate-50 transition space-y-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${getBadgeStyle(
                        item.type
                      )}`}
                    >
                      {item.type?.replaceAll("_", " ") || item.status || "NOTIFICATION"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 leading-snug">{item.message}</p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 font-medium">
                No active placement alerts yet.
              </div>
            )}
          </div>

          <Link
            to="/my-applications"
            onClick={() => setOpen(false)}
            className="block w-full text-center py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition"
          >
            View All Applications →
          </Link>
        </div>
      )}
    </div>
  );
}