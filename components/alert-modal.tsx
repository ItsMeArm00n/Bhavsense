"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  description,
  actionLabel,
  onAction,
}: AlertModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {actionLabel && onAction && (
            <Button variant="default" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}