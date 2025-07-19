import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const REASONS = [
  { value: 'spam', label: 'Spam' },
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'other', label: 'Other' },
];

export interface ReportChatModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  loading?: boolean;
}

const ReportChatModal = ({ open, onClose, onSubmit, loading }: ReportChatModalProps) => {
  const [selectedReason, setSelectedReason] = useState('spam');
  const [otherReason, setOtherReason] = useState('');

  const handleSubmit = () => {
    const reason = selectedReason === 'other' ? otherReason : selectedReason;
    onSubmit(reason);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report this chat</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {REASONS.map((r) => (
            <label key={r.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="report-reason"
                value={r.value}
                checked={selectedReason === r.value}
                onChange={() => setSelectedReason(r.value)}
                className="accent-primary"
              />
              <span>{r.label}</span>
            </label>
          ))}
          {selectedReason === 'other' && (
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mt-2"
              placeholder="Describe the issue..."
              value={otherReason}
              onChange={e => setOtherReason(e.target.value)}
              maxLength={200}
            />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading || (selectedReason === 'other' && !otherReason.trim())}>
            Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportChatModal; 