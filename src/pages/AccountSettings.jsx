import React, { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  LogOut,
  UserX,
  Bell,
  Globe,
  Smartphone,
  ChevronRight,
  Shield,
  Mail,
  AlertTriangle,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NewsFeedLayout from "../components/layout/NewsFeedLayout";
import {
  ChangeEmailModal,
  ChangePasswordModal,
  ConfirmModal,
  ProfileVisibilityModal,
  TwoFactorModal,
} from "../components/modal/confirmBadgeModal";
import { SettingRow } from "../components/SettingsRow";

export default function AccountSettings() {
  const [modal, setModal] = useState(null);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });
  const [profileVisibility, setProfileVisibility] = useState("Public");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const toggleNotif = (key) =>
    setNotifications((n) => ({ ...n, [key]: !n[key] }));

  const showToast = (message) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleConfirmAction = (action) => {
    setModal(null);
    showToast(`${action} successful`);
  };

  const sections = [
    {
      title: "Security",
      rows: [
        {
          icon: Lock,
          iconBg: "bg-[#1A3E32]/10",
          label: "Change Password",
          sublabel: "Update your login password",
          onClick: () => setModal("password"),
        },
        // {
        //   icon: Mail,
        //   iconBg: "bg-blue-50",
        //   label: "Change Email",
        //   sublabel: "Your current email: abel@bejite.com",
        //   onClick: () => setModal("email"),
        // },
        {
          icon: Smartphone,
          iconBg: "bg-purple-50",
          label: "Two-Factor Authentication",
          sublabel: "Add an extra layer of security",
          onClick: () => setModal("2fa"),
        },
      ],
    },
    {
      title: "Notifications",
      rows: [
        {
          icon: Bell,
          iconBg: "bg-amber-50",
          label: "Email Notifications",
          sublabel: "Receive updates via email",
          action: (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNotif("email");
              }}
              className={`relative w-11 h-6 rounded-full transition-colors ${notifications.email ? "bg-[#1A3E32]" : "bg-gray-200"}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notifications.email ? "left-6" : "left-1"}`}
              />
            </button>
          ),
        },
        {
          icon: Bell,
          iconBg: "bg-amber-50",
          label: "Push Notifications",
          sublabel: "In-app alerts and updates",
          action: (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNotif("push");
              }}
              className={`relative w-11 h-6 rounded-full transition-colors ${notifications.push ? "bg-[#1A3E32]" : "bg-gray-200"}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notifications.push ? "left-6" : "left-1"}`}
              />
            </button>
          ),
        },
        {
          icon: Smartphone,
          iconBg: "bg-amber-50",
          label: "SMS Notifications",
          sublabel: "Get alerts on your phone",
          action: (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNotif("sms");
              }}
              className={`relative w-11 h-6 rounded-full transition-colors ${notifications.sms ? "bg-[#1A3E32]" : "bg-gray-200"}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notifications.sms ? "left-6" : "left-1"}`}
              />
            </button>
          ),
        },
      ],
    },
    {
      title: "Privacy",
      rows: [
        {
          icon: Globe,
          iconBg: "bg-sky-50",
          label: "Profile Visibility",
          sublabel: `Currently: ${profileVisibility}`,
          onClick: () => setModal("visibility"),
        },
      ],
    },
    {
      title: "Account",
      rows: [
        {
          icon: LogOut,
          iconBg: "bg-orange-50",
          label: "Log Out",
          sublabel: "Sign out of your account",
          onClick: () => setModal("logout"),
        },
        {
          icon: UserX,
          iconBg: "bg-red-50",
          label: "Deactivate Account",
          sublabel: "Temporarily hide your profile",
          danger: true,
          onClick: () => setModal("deactivate"),
        },
        {
          icon: AlertTriangle,
          iconBg: "bg-red-50",
          label: "Delete Account",
          sublabel: "Permanently remove your account & data",
          danger: true,
          onClick: () => setModal("delete"),
        },
      ],
    },
  ];

  return (
    <NewsFeedLayout classes={false} showSidebars={false}>
      <div className="h-full w-full max-w-screen-xl mx-auto flex flex-col">
        {/* Header */}
        <div className="bg-[#1A3E32] px-6 py-4 flex-shrink-0">
          <h1 className="text-white font-bold text-xl">Account Settings</h1>
          <p className="text-green-200 text-sm mt-0.5">
            Manage your account preferences
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
            {/* Profile preview */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1A3E32] to-[#2d6a54] flex items-center justify-center text-white text-xl font-bold shrink-0">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-base">Abel Bejite</p>
                <p className="text-sm text-gray-400 truncate">
                  abel@bejite.com
                </p>
              </div>
            </div>

            {/* Settings sections */}
            {sections.map((section) => (
              <div key={section.title} className="space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1">
                  {section.title}
                </p>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                  {section.rows.map((row, i) => (
                    <SettingRow key={i} {...row} />
                  ))}
                </div>
              </div>
            ))}

            <p className="text-center text-xs text-gray-300 pb-6">
              Bejite v2.6.0 · © 2026 Bejite Inc.
            </p>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-green-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {modal === "password" && (
          <ChangePasswordModal key="pw" onClose={() => setModal(null)} />
        )}
        {modal === "email" && (
          <ChangeEmailModal
            key="email"
            onClose={() => {
              setModal(null);
              showToast("Email updated successfully");
            }}
          />
        )}
        {modal === "2fa" && (
          <TwoFactorModal
            key="2fa"
            onClose={() => {
              setModal(null);
              showToast("2FA setup completed");
            }}
          />
        )}
        {modal === "visibility" && (
          <ProfileVisibilityModal
            key="visibility"
            currentVisibility={profileVisibility}
            onUpdate={(visibility) => {
              setProfileVisibility(visibility);
              showToast(`Profile visibility changed to ${visibility}`);
            }}
            onClose={() => setModal(null)}
          />
        )}
        {modal === "logout" && (
          <ConfirmModal
            key="logout"
            title="Log Out"
            description="Are you sure you want to log out of your Bejite account?"
            confirmLabel="Log Out"
            onClose={() => setModal(null)}
            onConfirm={() => handleConfirmAction("Log out")}
          />
        )}
        {modal === "deactivate" && (
          <ConfirmModal
            key="deactivate"
            title="Deactivate Account"
            description="Your profile will be hidden from other users. You can reactivate at any time by logging back in."
            confirmLabel="Deactivate"
            danger
            onClose={() => setModal(null)}
            onConfirm={() => handleConfirmAction("Account deactivated")}
          />
        )}
        {modal === "delete" && (
          <ConfirmModal
            key="delete"
            title="Delete Account"
            description="This action is permanent and cannot be undone. All your data, posts, and connections will be removed."
            confirmLabel="Delete Forever"
            danger
            onClose={() => setModal(null)}
            onConfirm={() => handleConfirmAction("Account deleted")}
          />
        )}
      </AnimatePresence>
    </NewsFeedLayout>
  );
}
