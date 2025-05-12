import React from 'react';
import { HashRouter } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { Web3Provider } from './contexts/Web3Context';
import { TransactionProvider } from './contexts/TransactionContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AppRoutes } from './routes';
import { Header } from './components/Header';
import { TransactionModal } from './components/TransactionModal';
import { useTransaction } from './contexts/TransactionContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastStyles = createGlobalStyle`
  :root {
    --toastify-color-light: rgba(255, 255, 255, 0.1);
    --toastify-color-dark: rgba(255, 255, 255, 0.1);
    --toastify-color-info: rgba(52, 152, 219, 0.1);
    --toastify-color-success: rgba(46, 204, 113, 0.1);
    --toastify-color-warning: rgba(241, 196, 15, 0.1);
    --toastify-color-error: rgba(231, 76, 60, 0.1);
    --toastify-text-color-light: #fff;
    --toastify-text-color-dark: #fff;
    --toastify-background-color-light: rgba(255, 255, 255, 0.1);
    --toastify-background-color-dark: rgba(255, 255, 255, 0.1);
    --toastify-background-color-info: rgba(52, 152, 219, 0.1);
    --toastify-background-color-success: rgba(46, 204, 113, 0.1);
    --toastify-background-color-warning: rgba(241, 196, 15, 0.1);
    --toastify-background-color-error: rgba(231, 76, 60, 0.1);
    --toastify-border-radius: 12px;
    --toastify-font-family: inherit;
    --toastify-z-index: 9999;
    --toastify-spinner-color: #3498db;
    --toastify-spinner-color-empty-area: rgba(255, 255, 255, 0.1);
    --toastify-color-progress-light: linear-gradient(to right, #3498db, #2ecc71);
    --toastify-color-progress-dark: linear-gradient(to right, #3498db, #2ecc71);
    --toastify-color-progress-info: linear-gradient(to right, #3498db, #2ecc71);
    --toastify-color-progress-success: linear-gradient(to right, #3498db, #2ecc71);
    --toastify-color-progress-warning: linear-gradient(to right, #3498db, #2ecc71);
    --toastify-color-progress-error: linear-gradient(to right, #3498db, #2ecc71);
  }

  .Toastify__toast {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15) !important;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: #fff;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const App: React.FC = () => {
  const { isOpen, title, loading, closeTransaction } = useTransaction();

  return (
    <HashRouter>
      <ToastStyles />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Web3Provider>
        <TransactionProvider>
          <NotificationProvider>
            <AppContainer>
              <Header />
              <MainContent>
                <AppRoutes />
              </MainContent>
              <TransactionModal
                isOpen={isOpen}
                title={title}
                onClose={closeTransaction}
                loading={loading}
              />
            </AppContainer>
          </NotificationProvider>
        </TransactionProvider>
      </Web3Provider>
    </HashRouter>
  );
};

export default App; 