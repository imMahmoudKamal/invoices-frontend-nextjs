import { createContext, useContext, useState, useMemo } from 'react';

const AppContext = createContext(null);
export const useAppContext = () => useContext(AppContext);

function AppContextProvider({ children }) {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [updateUI, setUpdateUI] = useState(false);

  const contextValue = useMemo(
    () => ({
      form: {
        isOpenForm,
        setIsOpenForm,
        editFormData,
        setEditFormData,
      },

      ui: {
        updateUI,
        setUpdateUI,
      },
    }),
    [isOpenForm, updateUI, editFormData]
  );

  return <AppContext.Provider value={{ ...contextValue }}>{children}</AppContext.Provider>;
}

export default AppContextProvider;
