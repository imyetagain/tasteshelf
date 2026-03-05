import { useLayoutEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';

import { Header } from './components/Header';
import { Dialog } from './components/Dialog';
import { Landing } from './pages/Landing';
import { Product } from './pages/Product';
import { useDialog } from './hooks/useDialogStore';
import { useRegion } from './hooks/useRegionStore';
import { getCountryCode } from './services/regionService';
import { Action } from './types/dialogType';

function Wrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return <>{children}</>;
}

function App() {
  const { action, setAction } = useDialog();
  const { setCountryCode } = useRegion();

  useLayoutEffect(() => {
    getCountryCode().then((countryCode) => {
      setCountryCode(countryCode);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <AnimatePresence>
        {action !== null && (
          <motion.div
            key="dialog-overlay"
            className="fixed inset-0 backdrop-blur-sm bg-white/0 z-10"
            onClick={() => setAction(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
        {action === Action.Reviewing && <Dialog key="dialog" />}
      </AnimatePresence>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/item/:company/:product" element={<Product />} />
      </Routes>
    </Wrapper>
  );
}

export default App;
