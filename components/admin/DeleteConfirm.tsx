"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  itemTitle: string;
}

export default function DeleteConfirm({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  itemTitle,
}: DeleteConfirmProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Deletion"
      className="max-w-md"
    >
      <div className="space-y-5">
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-dragon-text font-medium">
              Are you sure you want to delete this content?
            </p>
            <p className="text-dragon-text-secondary text-sm mt-1">
              <span className="text-dragon-neon font-medium">&ldquo;{itemTitle}&rdquo;</span> will be permanently
              removed. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Permanently"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
