import React, { useState } from "react";
import DialogContext from "./DialogContext";

const DialogProvider = ({ children }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);

  const openDialog = (content) => {
    setDialogContent(content);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogContent(null);
  };

  return (
    <DialogContext.Provider value={{ isDialogOpen, openDialog, closeDialog }}>
      {children}
      {isDialogOpen && dialogContent}
    </DialogContext.Provider>
  );
};

export default DialogProvider;
