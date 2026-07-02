<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;

class FileUploadService
{
    private const ALLOWED_MIMES = [
        'image/jpeg',
        'image/png',
        'application/pdf',
    ];

    private const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

    /** File magic byte signatures keyed by MIME type */
    private const MAGIC_SIGNATURES = [
        'image/jpeg'      => ["\xFF\xD8\xFF"],
        'image/png'       => ["\x89PNG\r\n\x1A\n"],
        'application/pdf' => ['%PDF-'],
    ];

    /**
     * Patterns that indicate code-injection attempts hidden inside files.
     * Checked against the raw file bytes.
     */
    private const DANGEROUS_PATTERNS = [
        '/<\?php/i',
        '/<\?=/i',
        '/<script[\s>]/i',
        '/\beval\s*\(/i',
        '/\bsystem\s*\(/i',
        '/\bexec\s*\(/i',
        '/\bpassthru\s*\(/i',
        '/\bshell_exec\s*\(/i',
        '/\bpopen\s*\(/i',
        '/\bproc_open\s*\(/i',
        '/\bbase64_decode\s*\(/i',
        '/\bfile_put_contents\s*\(/i',
        '/javascript\s*:/i',
        '/vbscript\s*:/i',
        '/data\s*:\s*text\/html/i',
    ];

    public function storeReceipt(UploadedFile $file): string
    {
        $this->assertSize($file);
        $this->assertMimeType($file);
        $this->assertMagicBytes($file);
        $this->assertNoCodeInjection($file);
        $this->assertFileIntegrity($file);

        // Force a safe extension derived from the server-detected MIME — never trust the client extension
        $safeExt = match ($file->getMimeType()) {
            'image/jpeg'      => 'jpg',
            'image/png'       => 'png',
            'application/pdf' => 'pdf',
            default           => abort(422, 'Unsupported file type.'),
        };

        // Store under a cryptographically random name to prevent enumeration
        $filename = bin2hex(random_bytes(20)) . '.' . $safeExt;

        return $file->storeAs('receipts', $filename, 'public');
    }

    // ─── Private guards ─────────────────────────────────────────────────────

    private function assertSize(UploadedFile $file): void
    {
        abort_if(
            $file->getSize() > self::MAX_SIZE_BYTES,
            422,
            'File size must not exceed 5 MB.'
        );
    }

    private function assertMimeType(UploadedFile $file): void
    {
        // getMimeType() uses PHP's finfo — it reads the actual bytes, not the client header
        abort_unless(
            in_array($file->getMimeType(), self::ALLOWED_MIMES, true),
            422,
            'Only JPG, PNG, and PDF files are accepted.'
        );
    }

    private function assertMagicBytes(UploadedFile $file): void
    {
        $mime       = $file->getMimeType();
        $signatures = self::MAGIC_SIGNATURES[$mime] ?? [];

        $handle = fopen($file->getRealPath(), 'rb');
        $header = fread($handle, 8);
        fclose($handle);

        $matched = false;
        foreach ($signatures as $sig) {
            if (str_starts_with($header, $sig)) {
                $matched = true;
                break;
            }
        }

        abort_unless(
            $matched,
            422,
            'File signature does not match its declared type. Upload rejected.'
        );
    }

    private function assertNoCodeInjection(UploadedFile $file): void
    {
        $content = file_get_contents($file->getRealPath());

        foreach (self::DANGEROUS_PATTERNS as $pattern) {
            if (preg_match($pattern, $content)) {
                abort(422, 'File contains disallowed content and was rejected.');
            }
        }
    }

    private function assertFileIntegrity(UploadedFile $file): void
    {
        $mime = $file->getMimeType();

        if (in_array($mime, ['image/jpeg', 'image/png'], true)) {
            // Re-decode the image with GD — corrupted or disguised files will return false
            $image = @imagecreatefromstring(file_get_contents($file->getRealPath()));
            abort_unless(
                $image !== false,
                422,
                'Image file is corrupted or invalid.'
            );
            imagedestroy($image);
        }

        if ($mime === 'application/pdf') {
            // PDF must start with %PDF-1.x header and contain a cross-reference table
            $head = file_get_contents($file->getRealPath(), false, null, 0, 1024);
            abort_unless(
                preg_match('/^%PDF-1\.[0-9]/', $head),
                422,
                'PDF file is invalid or corrupted.'
            );
        }
    }
}
