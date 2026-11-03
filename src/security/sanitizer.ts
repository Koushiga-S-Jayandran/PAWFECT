/**
 * Input sanitization and XSS prevention utilities.
 * Enforces pure string sanitization without dangerouslySetInnerHTML.
 */

export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function sanitizeCleanDisplay(input: string): string {
  if (typeof input !== 'string') return '';
  // Strips potential markup tags and control characters while leaving friendly typography
  return input
    .replace(/<[^>]*>?/gm, '')
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .trim();
}

/**
 * Validates uploaded files by MIME type, byte size, and magic bytes signature.
 */
export async function validateFileUpload(
  file: File,
  allowedMimes: string[] = ['image/jpeg', 'image/png', 'application/pdf'],
  maxSizeBytes: number = 5 * 1024 * 1024 // 5MB
): Promise<{ valid: boolean; error?: string }> {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  if (file.size > maxSizeBytes) {
    const mbLimit = Math.round(maxSizeBytes / (1024 * 1024));
    return { valid: false, error: `File size exceeds the ${mbLimit}MB limit. Please upload a smaller file.` };
  }

  if (!allowedMimes.includes(file.type)) {
    return { valid: false, error: `Invalid file type: ${file.type}. Allowed formats: JPG, PNG, PDF.` };
  }

  // Magic bytes inspection
  try {
    const buffer = await file.slice(0, 8).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    let isMagicMatch = false;

    // JPEG: FF D8 FF
    if (file.type === 'image/jpeg' && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      isMagicMatch = true;
    }
    // PNG: 89 50 4E 47 0D 0A 1A 0A
    else if (
      file.type === 'image/png' &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    ) {
      isMagicMatch = true;
    }
    // PDF: %PDF (25 50 44 46)
    else if (
      file.type === 'application/pdf' &&
      bytes[0] === 0x25 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x44 &&
      bytes[3] === 0x46
    ) {
      isMagicMatch = true;
    }

    if (!isMagicMatch) {
      return { valid: false, error: 'File header contents do not match its declared extension.' };
    }
  } catch {
    return { valid: false, error: 'Failed to inspect file contents safely.' };
  }

  return { valid: true };
}
