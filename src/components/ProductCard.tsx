import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { convertTextToURLSlug } from "../utils/helper";
import { CartProduct, ProductItem } from "../utils/types";
import AddToCartButton from "./shared/AddToCartButton";

const ProductCard = ({ data }: { data: ProductItem }) => {
  const navigate = useNavigate();
  const {
    name = "",
    description = "",
    price = 0,
    image = [],
    _id = "",
    startDate,
    endDate,
    discountPercent = 0,
  } = data || {};
  const [discountStatus, setDiscountStatus] = useState<boolean>(false);
  const [discountedPrice, setDiscountedPrice] = useState<number>(price);
  const [cartProduct, setCartProduct] = useState<CartProduct>({
    id: _id || "",
    title: name || "",
    subTitle: description || "",
    image: image[0] || "",
    price: price || 0,
    discount: 0,
  });

  useEffect(() => {
    const checkDiscount = (startDate: string, endDate: string) => {
      const currentDate = Date.now();
      const startTimestamp = new Date(startDate).getTime();
      const endTimestamp = new Date(endDate).getTime();

      if (discountPercent > 0) {
        const discountValue = price * (discountPercent / 100);
        const newPrice = price - discountValue;

        setDiscountStatus(true);
        setDiscountedPrice(newPrice);
        setCartProduct((prevProduct) => ({
          ...prevProduct,
          discount: newPrice,
        }));
      } else {
        setDiscountStatus(false);
        setDiscountedPrice(price);
        setCartProduct((prevProduct) => ({
          ...prevProduct,
          discount: 0,
        }));
      }
    };

    checkDiscount(startDate, endDate);
  }, [
    startDate,
    endDate,
    discountPercent,
    price,
    _id,
    name,
    description,
    image,
  ]);

  const handleProductClick = () => {
    const pname = convertTextToURLSlug(name);
    navigate({
      pathname: `/prn/${pname}/prid/${_id}`,
    });
  };

  return (
    <div
      className="_card h-[270px] w-[180px] relative flex cursor-pointer mb-2 mx-auto sm:mx-0"
      onClick={handleProductClick}
    >
      {discountPercent > 0 && (
        <div className="absolute bg-blue-600 text-white px-3 py-1 text-xs font-medium -left-[1px] top-4 rounded-tr-xl rounded-br-xl uppercase">
          {discountPercent}% OFF
        </div>
      )}
      <div className="h-[154px] w-154px">
        <img
          src={`http://localhost:8080/${image[0]}`}
          alt={name}
          className="h-full w-full p-2"
        />
      </div>
      <div
        className="overflow-hidden text-left flex flex-col mt-auto"
        style={{ margin: "0" }}
      >
        <div
          className="_text-default text-[13px] font-medium leading-tight line-clamp-2 mb-0.5"
          style={{
            display: "flex",
            marginTop: "5px",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          {name}
        </div>

        <div
          className="_text-default text-[13px] font-medium leading-tight line-clamp-2 mb-0.5"
          style={{
            display: "flex",
            marginTop: "5px",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {description}
        </div>

        <div
          className="flex items-center justify-between mt-auto"
          style={{ marginTop: "5px" }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {discountStatus && (
              <span
                className="text-[13px] _text-default"
                style={{ fontWeight: "bold" }}
              >
                ₹{discountedPrice}
              </span>
            )}
            <span
              className={
                discountStatus
                  ? `text-[12px] _text-default text-decoration-line: line-through`
                  : `text-[13px] _text-default`
              }
              style={{ color: discountStatus ? '#9c9c9c' : 'inherit' }}
            >
              ₹{price}
            </span>
          </div>
          <div className="h-9 w-[90px]">
            <AddToCartButton product={cartProduct} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
