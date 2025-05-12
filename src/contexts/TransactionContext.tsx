import React, { createContext, useContext, useState } from 'react';

interface TransactionState {
  isOpen: boolean;
  title: string;
  loading: boolean;
  error: string | null;
}

interface TransactionContextType extends TransactionState {
  openTransaction: (title: string) => void;
  closeTransaction: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const initialState: TransactionState = {
  isOpen: false,
  title: '',
  loading: false,
  error: null
};

const TransactionContext = createContext<TransactionContextType>({
  ...initialState,
  openTransaction: () => {},
  closeTransaction: () => {},
  setLoading: () => {},
  setError: () => {}
});

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TransactionState>(initialState);

  const openTransaction = (title: string) => {
    setState(prev => ({ ...prev, isOpen: true, title, error: null }));
  };

  const closeTransaction = () => {
    setState(prev => ({ ...prev, isOpen: false, loading: false, error: null }));
  };

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  return (
    <TransactionContext.Provider
      value={{
        ...state,
        openTransaction,
        closeTransaction,
        setLoading,
        setError
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => useContext(TransactionContext); 