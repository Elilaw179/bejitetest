export function formatAdProCurrency(amount) {
  const value = Number(amount) || 0;
  return `₦${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function getCampaignProgress(campaign) {
  if (!campaign || !campaign.reachPurchased) return 0;
  return (campaign.reachDelivered / campaign.reachPurchased) * 100;
}
