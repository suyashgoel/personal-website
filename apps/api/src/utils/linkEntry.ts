export function getLinkSubtype(url: string): string | null {
  const urlObj = new URL(url);
  const hostname = urlObj.hostname.toLowerCase();

  if (hostname.includes('spotify.com')) {
    return 'spotify';
  }
  if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
    return 'youtube';
  }
  if (hostname.includes('instagram.com')) {
    return 'instagram';
  }
  if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
    return 'twitter';
  }
  if (hostname.includes('github.com')) {
    return 'github';
  }
  if (hostname.includes('linkedin.com')) {
    return 'linkedin';
  }
  return null;
}
