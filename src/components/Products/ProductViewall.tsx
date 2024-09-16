import { useEffect, useState } from "react";
import Header from "../shared/Header";
import "./style.css"; // Assuming the styles are shared
import { useParams } from "react-router-dom";
import {
  listProductsApi,
  ProductSearchPayload,
} from "../../services/api/products";
// Dummy Data for Products and Categories
const categories = [
  "All",
  "Electronics",
  "Clothing",
  "Books",
  "Home Goods",
  "Groceries",
  "Vegetables",
  "Fruits",
];

// ProductCard Component
const ProductCard = ({
  product,
}: {
  product: {
    id: number;
    name: string;
    weight: string;
    price: number;
    image: string;
  };
}) => {
  return (
    <div className="product-card">
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={`http://localhost:8080/${product.image}`}
          alt={product.name}
          className="product-image"
          style={{ width: "150px", height: "150px" }}
        />
      </div>
      <div className="product-details">
        <h4>{product.name}</h4>
        <p
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {product.weight}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p>₹{product.price}</p>
          <button className="add-button">Add</button>
        </div>
      </div>
    </div>
  );
};

// Main ProductViewAll Component
const ProductViewAll: React.FC = () => {
  const [category, setCategory] = useState(categories[0]);
  const [products, setProducts] = useState<any[]>([]);
  const param = useParams();

  console.log(param.shopId, param.category);

  useEffect(() => {
    const fetchData = async () => {
      const data: ProductSearchPayload = {
        searchText: "",
        shopId: param.shopId,
        category: category,
        nearby: false,
        page: 1,
        limit: 50,
      };

      const response = await listProductsApi(data);

      console.log(response, ": response");
      setProducts(response[0].products);
    };

    fetchData();
  }, [category]);

  return (
    <div>
      <Header />
      <div
        className="product-view-all"
        style={{ paddingTop: "86px", paddingRight: "0", paddingLeft: "0" }}
      >
        <div
          className="category-bar"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            // borderBottom: "1px solid red",
            paddingLeft: "3rem",
            paddingRight: "3rem",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {categories.map((category) => (
              <button
                key={category}
                className={"category-button"}
                onClick={() => {
                  setCategory(category);
                }}
                style={{ border: "none", width: "10rem" }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductViewAll;
