import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProductViewAll from "./components/Products/ProductViewall";
import { Loader } from "./components/shared";
import { Error404, Home } from "./pages";
const ProductView = React.lazy(() => import("./pages/ProductView"));

const AppWithRouting = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout component={<Home />} />} />
      <Route
        path="/allproduct/:shopId"
        element={
          // <Suspense fallback={<Loader fullscreen />}>
          //   <Layout component={<ProductViewAll />} />
          // </Suspense>

          <ProductViewAll />
        }
      />
      <Route
        path="/prn/:name/prid/:id"
        element={
          <Suspense fallback={<Loader fullscreen />}>
            <Layout component={<ProductView />} />
          </Suspense>
        }
      />
      <Route
        path="/not-found"
        element={<Layout noFooter={true} component={<Error404 />} />}
      />
      <Route
        path="*"
        element={<Layout noFooter={true} component={<Error404 />} />}
      />
    </Routes>
  );
};

export default AppWithRouting;
