import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { Web3Provider } from './contexts/Web3Context';
import { TransactionProvider } from './contexts/TransactionContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { TransactionModal } from './components/TransactionModal';
import { useTransaction } from './contexts/TransactionContext';
import { AppRoutes } from './routes';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html, body {
    width: 100%;
    height: 100%;
    background: #000000;
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

const AppContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 60px; // 为底部导航留出空间
  padding-top: 70px; // 为固定的Header留出空间

  @media (max-width: 768px) {
    padding-top: 60px;
  }
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const AppContent: React.FC = () => {
  const { isOpen, title, loading, closeTransaction } = useTransaction();

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header />
        <MainContent>
          <AppRoutes />
        </MainContent>
        <BottomNav />
      </AppContainer>
      <TransactionModal
        isOpen={isOpen}
        title={title}
        onClose={closeTransaction}
        loading={loading}
      />
      <ToastContainer position="bottom-right" theme="dark" />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <LanguageProvider>
        <Web3Provider>
          <TransactionProvider>
            <NotificationProvider>
              <AppContent />
            </NotificationProvider>
          </TransactionProvider>
        </Web3Provider>
      </LanguageProvider>
    </Router>
  );
}; 