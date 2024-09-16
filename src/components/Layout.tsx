import { useEffect } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import BrandPromotion from './BrandPromotion';
import { CartPanel } from './cart';
import CartButtonBig from './cart/CartButtonBig';
import Modal from './Modal';
import Footer from './shared/Footer';
import Header from './shared/Header';

type Props = {
  noFooter?: boolean;
  component: React.ReactElement;
};

const Layout = ({ noFooter, component }: Props) => {
  const modalShown = useAppSelector((state) => state.modal.visible);
  const cartShown = useAppSelector((state) => state.ui.cartPanel);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div>
        <Header />
        <main className="pt-28 sm:pt-24">{component}</main>
        {!noFooter && (
          <>
            <BrandPromotion />
            <Footer />
          </>
        )}
        <CartButtonBig />
      </div>
      {cartShown && <CartPanel />}
      {modalShown && <Modal />}
    </>
  );
};

export default Layout;
