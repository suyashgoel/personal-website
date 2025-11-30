export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric chars (except spaces and hyphens)
    .replace(/\s+/g, '-') // Replace one or more spaces with a single hyphen
    .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}
