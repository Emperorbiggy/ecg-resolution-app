import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
    show,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'primary',
    loading = false,
    children,
}) {
    return (
        <Modal show={show} onClose={onClose} size="sm" title={title}>
            <div className="space-y-4">
                {message && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">{message}</p>
                )}
                {children}
                <div className="flex gap-3 justify-end pt-2">
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        {cancelLabel}
                    </Button>
                    <Button variant={variant} onClick={onConfirm} loading={loading}>
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
