export function scrollToSection(sectionId: string): void {
  const element = document.getElementById(sectionId);
  if (!element) return;
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function isValidHttpUrl(value?: string | null): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isValidMediaUrl(value?: string | null): value is string {
  if (!value) return false;
  if (value.startsWith('/')) return true;
  return isValidHttpUrl(value);
}

export function sanitizePhoneHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, '')}`;
}
