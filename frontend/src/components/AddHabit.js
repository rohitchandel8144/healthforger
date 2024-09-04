import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

export default function AddHabit({ open, onClose, onSave, title, children }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <div className="p-4">
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}
