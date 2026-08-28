/**
 * Mock notification data for the Admin Notification Center.
 * Replace with real API calls when the backend endpoint is ready.
 */

export const NOTIFICATION_CATEGORIES = {
  USERS: "users",
  JOBS: "jobs",
  APPLICATIONS: "applications",
  SYSTEM: "system",
  REVENUE: "revenue",
  ADMIN: "admin",
};

export const NOTIFICATION_PRIORITIES = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  CRITICAL: "critical",
};

const CATEGORY_META = {
  [NOTIFICATION_CATEGORIES.USERS]: {
    label: "Users",
    color: "#3b82f6",
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-400",
  },
  [NOTIFICATION_CATEGORIES.JOBS]: {
    label: "Jobs",
    color: "#16730F",
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-400",
  },
  [NOTIFICATION_CATEGORIES.APPLICATIONS]: {
    label: "Applications",
    color: "#8b5cf6",
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-400",
  },
  [NOTIFICATION_CATEGORIES.SYSTEM]: {
    label: "System",
    color: "#f59e0b",
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-400",
  },
  [NOTIFICATION_CATEGORIES.REVENUE]: {
    label: "Revenue",
    color: "#ec4899",
    bg: "bg-pink-50",
    text: "text-pink-600",
    border: "border-pink-400",
  },
  [NOTIFICATION_CATEGORIES.ADMIN]: {
    label: "Admin",
    color: "#14b8a6",
    bg: "bg-teal-50",
    text: "text-teal-600",
    border: "border-teal-400",
  },
};

export function getCategoryMeta(category) {
  return (
    CATEGORY_META[category] || {
      label: "Other",
      color: "#6b7280",
      bg: "bg-gray-50",
      text: "text-gray-600",
      border: "border-gray-400",
    }
  );
}

const PRIORITY_META = {
  [NOTIFICATION_PRIORITIES.INFO]: {
    label: "Info",
    accent: "#3b82f6",
    accentClass: "border-l-blue-500",
  },
  [NOTIFICATION_PRIORITIES.SUCCESS]: {
    label: "Success",
    accent: "#16730F",
    accentClass: "border-l-green-600",
  },
  [NOTIFICATION_PRIORITIES.WARNING]: {
    label: "Warning",
    accent: "#f59e0b",
    accentClass: "border-l-amber-500",
  },
  [NOTIFICATION_PRIORITIES.CRITICAL]: {
    label: "Critical",
    accent: "#ef4444",
    accentClass: "border-l-red-500",
  },
};

export function getPriorityMeta(priority) {
  return (
    PRIORITY_META[priority] || PRIORITY_META[NOTIFICATION_PRIORITIES.INFO]
  );
}

// ────────────────────────────────────────────────
// Relative-time formatting
// ────────────────────────────────────────────────
export function relativeTime(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatFullDate(dateStr) {
  return new Date(dateStr).toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ────────────────────────────────────────────────
// Generate timestamps relative to "now"
// ────────────────────────────────────────────────
function ago(minutes) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

// ────────────────────────────────────────────────
// Mock notifications
// ────────────────────────────────────────────────
export function generateMockNotifications() {
  return [
    {
      id: "n-001",
      category: NOTIFICATION_CATEGORIES.USERS,
      priority: NOTIFICATION_PRIORITIES.SUCCESS,
      title: "New User Registered",
      message:
        "Adewale Johnson has signed up as a Jobseeker and completed profile verification.",
      timestamp: ago(2),
      read: false,
    },
    {
      id: "n-002",
      category: NOTIFICATION_CATEGORIES.SYSTEM,
      priority: NOTIFICATION_PRIORITIES.CRITICAL,
      title: "Server Load Spike Detected",
      message:
        "API response times exceeded 3s threshold. Auto-scaling triggered for 2 additional instances.",
      timestamp: ago(8),
      read: false,
    },
    {
      id: "n-003",
      category: NOTIFICATION_CATEGORIES.JOBS,
      priority: NOTIFICATION_PRIORITIES.INFO,
      title: "New Job Posting Published",
      message:
        'TechVentures Ltd posted "Senior React Developer" — awaiting initial applicant traction.',
      timestamp: ago(15),
      read: false,
    },
    {
      id: "n-004",
      category: NOTIFICATION_CATEGORIES.APPLICATIONS,
      priority: NOTIFICATION_PRIORITIES.SUCCESS,
      title: "Application Milestone Reached",
      message:
        "The position 'Product Designer at Bejite' has received 50+ applications this week.",
      timestamp: ago(22),
      read: false,
    },
    {
      id: "n-005",
      category: NOTIFICATION_CATEGORIES.REVENUE,
      priority: NOTIFICATION_PRIORITIES.SUCCESS,
      title: "New Subscription Payment",
      message:
        "Afrotech Recruiting subscribed to AdPro Premium plan — ₦45,000/month recurring.",
      timestamp: ago(35),
      read: false,
    },
    {
      id: "n-006",
      category: NOTIFICATION_CATEGORIES.ADMIN,
      priority: NOTIFICATION_PRIORITIES.WARNING,
      title: "Admin Permission Changed",
      message:
        "Super Admin elevated user 'sarah.obi' from Admin to Super Admin role.",
      timestamp: ago(48),
      read: true,
    },
    {
      id: "n-007",
      category: NOTIFICATION_CATEGORIES.USERS,
      priority: NOTIFICATION_PRIORITIES.INFO,
      title: "Bulk User Import Completed",
      message:
        "CSV import processed 142 new recruiter accounts. 3 duplicates skipped, 139 created.",
      timestamp: ago(65),
      read: true,
    },
    {
      id: "n-008",
      category: NOTIFICATION_CATEGORIES.SYSTEM,
      priority: NOTIFICATION_PRIORITIES.WARNING,
      title: "Email Service Degradation",
      message:
        "Outbound email delivery rate dropped to 87%. Investigating SMTP provider issues.",
      timestamp: ago(90),
      read: false,
    },
    {
      id: "n-009",
      category: NOTIFICATION_CATEGORIES.JOBS,
      priority: NOTIFICATION_PRIORITIES.INFO,
      title: "Job Post Flagged for Review",
      message:
        'User-reported job listing "Remote Data Entry Clerk" flagged as potentially misleading.',
      timestamp: ago(120),
      read: true,
    },
    {
      id: "n-010",
      category: NOTIFICATION_CATEGORIES.APPLICATIONS,
      priority: NOTIFICATION_PRIORITIES.INFO,
      title: "Interview Scheduled",
      message:
        "Candidate Blessing Nwosu's interview with GreenTech Solutions is set for tomorrow at 10:00 AM.",
      timestamp: ago(180),
      read: true,
    },
    {
      id: "n-011",
      category: NOTIFICATION_CATEGORIES.REVENUE,
      priority: NOTIFICATION_PRIORITIES.CRITICAL,
      title: "Payment Gateway Error",
      message:
        "Paystack webhook returned 3 consecutive failures. Payment processing may be disrupted.",
      timestamp: ago(210),
      read: false,
    },
    {
      id: "n-012",
      category: NOTIFICATION_CATEGORIES.USERS,
      priority: NOTIFICATION_PRIORITIES.SUCCESS,
      title: "User Verification Approved",
      message:
        "Corporate verification for 'NairaTech Limited' has been approved and badge issued.",
      timestamp: ago(300),
      read: true,
    },
    {
      id: "n-013",
      category: NOTIFICATION_CATEGORIES.ADMIN,
      priority: NOTIFICATION_PRIORITIES.INFO,
      title: "Scheduled Maintenance Reminder",
      message:
        "Database maintenance window scheduled for Saturday 2:00 AM — 4:00 AM WAT.",
      timestamp: ago(420),
      read: true,
    },
    {
      id: "n-014",
      category: NOTIFICATION_CATEGORIES.JOBS,
      priority: NOTIFICATION_PRIORITIES.SUCCESS,
      title: "Job Posting Reached 100 Views",
      message:
        "'UX Researcher at DesignHub Africa' crossed 100 unique views in 48 hours.',",
      timestamp: ago(500),
      read: true,
    },
    {
      id: "n-015",
      category: NOTIFICATION_CATEGORIES.SYSTEM,
      priority: NOTIFICATION_PRIORITIES.SUCCESS,
      title: "SSL Certificate Renewed",
      message:
        "Auto-renewal of SSL certificate for api.bejite.com completed successfully. Valid until Aug 2027.",
      timestamp: ago(720),
      read: true,
    },
    {
      id: "n-016",
      category: NOTIFICATION_CATEGORIES.APPLICATIONS,
      priority: NOTIFICATION_PRIORITIES.WARNING,
      title: "Application Spam Detected",
      message:
        "Automated spam filter blocked 12 suspicious applications from IP range 192.168.x.x.",
      timestamp: ago(840),
      read: true,
    },
    {
      id: "n-017",
      category: NOTIFICATION_CATEGORIES.REVENUE,
      priority: NOTIFICATION_PRIORITIES.INFO,
      title: "Monthly Revenue Report Ready",
      message:
        "July 2026 revenue report generated — total ₦2.4M, up 18% from June. Available for download.",
      timestamp: ago(1440),
      read: true,
    },
    {
      id: "n-018",
      category: NOTIFICATION_CATEGORIES.USERS,
      priority: NOTIFICATION_PRIORITIES.WARNING,
      title: "Inactive User Cleanup Pending",
      message:
        "346 accounts with no login in 90+ days identified. Pending admin review before archival.",
      timestamp: ago(2880),
      read: true,
    },
    {
      id: "n-019",
      category: NOTIFICATION_CATEGORIES.ADMIN,
      priority: NOTIFICATION_PRIORITIES.SUCCESS,
      title: "Email Campaign Sent Successfully",
      message:
        "'August Recruiter Onboarding' email blast sent to 1,230 recipients. Open rate tracking started.",
      timestamp: ago(4320),
      read: true,
    },
    {
      id: "n-020",
      category: NOTIFICATION_CATEGORIES.SYSTEM,
      priority: NOTIFICATION_PRIORITIES.INFO,
      title: "Platform Update v3.2.1 Deployed",
      message:
        "New release deployed with improved search indexing, 2 bug fixes, and recruiter dashboard enhancements.",
      timestamp: ago(5760),
      read: true,
    },
  ];
}
