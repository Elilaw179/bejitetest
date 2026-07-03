import { toast } from "react-toastify";
import { getSocialShareUrl, openShareWindow } from "./postShare";

export function getJobShareUrl(jobId) {
  return `${window.location.origin}/j/${encodeURIComponent(jobId)}`;
}

export function buildJobShareText(job) {
  const title = job?.title?.trim() || "Job opportunity";
  const company = job?.company?.trim();
  if (company) {
    return `${title} at ${company} on Bejite`;
  }
  return `${title} on Bejite`;
}

export async function copyJobLink(jobId) {
  const url = getJobShareUrl(jobId);
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard.");
    } else {
      toast.success("Share link ready.");
    }
  } catch {
    toast.success("Share link ready.");
  }
  return url;
}

export async function shareJobToPlatform(job, platform) {
  const url = getJobShareUrl(job.id);
  const text = buildJobShareText(job);

  if (platform === "copy") {
    await copyJobLink(job.id);
    return;
  }

  openShareWindow(getSocialShareUrl(platform, url, { text, title: job.title }));
}

export async function nativeShareJob(job) {
  if (!navigator.share) return false;

  const url = getJobShareUrl(job.id);
  await navigator.share({
    title: job.title,
    text: buildJobShareText(job),
    url,
  });
  return true;
}
