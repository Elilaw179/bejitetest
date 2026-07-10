/** Format message timestamp for chat bubble header. */
export function formatChatMessageTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  const day = date
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
  const time = date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();

  return `${day} AT ${time}`;
}
