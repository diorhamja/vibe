import { createContext, useContext } from 'react';

const EventContext = createContext(null);

export const useEvents = () => {
  return useContext(EventContext);
};

export default EventContext;