export function slugify(text: string) {
  return text.toLowerCase().replace(/ /g, '-');
}

export function unslugify(slug: string) {
  return slug.replace(/-/g, ' ');
}
