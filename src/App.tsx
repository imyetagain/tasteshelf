import { Route, Routes } from 'react-router-dom';

import { Header } from './components/Header';
import { Landing } from './pages/Landing';
import { Product } from './pages/Product';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/product/:id" element={<Product />} />
      </Routes>
    </div>
  );
}

export default App;
