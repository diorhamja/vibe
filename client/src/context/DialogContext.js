import { createContext, useContext } from 'react';

const DialogContext = createContext();

export const useDialog = () => {
    return useContext(DialogContext);
};

export default DialogContext;