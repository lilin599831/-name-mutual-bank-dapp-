import React from 'react';
import { BrowserRouter as Router, HashRouter } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { Web3Provider } from './contexts/Web3Context';
import { LanguageProvider } from './contexts/LanguageContext';
import { TransactionProvider } from './contexts/TransactionContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AppRoutes } from './routes';
import { TransactionModal } from './components/TransactionModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    width: 100vw;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d3436 100%);
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  #root {
    min-height: 100vh;
    padding-top: 70px;
    box-sizing: border-box;

    @media (max-width: 768px) {
      padding-top: 60px;
    }
  }

  * {
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

const AppContent: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <Header />
      <AppRoutes />
      <BottomNav />
      <ToastContainer position="bottom-right" theme="dark" />
    </>
  );
};

const App: React.FC = () => {
  // 检测是否在钱包环境中
  const isInWallet = /TokenPocket|MetaMask|imToken/i.test(navigator.userAgent);

  return (
    // 在钱包中使用 HashRouter，否则使用 BrowserRouter
    isInWallet ? (
      <HashRouter>
        <LanguageProvider>
          <Web3Provider>
            <TransactionProvider>
              <NotificationProvider>
                <AppContent />
              </NotificationProvider>
            </TransactionProvider>
          </Web3Provider>
        </LanguageProvider>
      </HashRouter>
    ) : (
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
    )
  );
};

export { App };
export default App;