import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, X } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadProducts(isRefresh = false) {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(
        "http://localhost:3001/api/products"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim();

    if (!query) {
      return products;
    }

    return products.filter((product) =>
      Object.values(product).some((value) =>
        String(value ?? "")
          .includes(query)
      )
    );
  }, [products, search]);

  function clearSearch() {
    setSearch("");
  }

  if (loading) {
    return (
      <div className="page">
        <h1>Products</h1>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>Products</h1>

        <p className="error-message">{error}</p>

        <button
          className="primary-button"
          onClick={() => loadProducts(true)}
        >
          <RefreshCw size={17} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>
            {search
              ? `${filteredProducts.length} of ${products.length} products`
              : `${products.length} products`}
          </p>
        </div>

        <div className="page-actions">
          <button
            className="secondary-button refresh-button"
            onClick={() => loadProducts(true)}
            disabled={refreshing}
          >
            <RefreshCw
              size={17}
              className={refreshing ? "spin" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <button className="primary-button">
            + Add Product
          </button>
        </div>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div>
            <h2>All Products</h2>
            <span>
              {filteredProducts.length} displayed
            </span>
          </div>

          <div className="search-wrapper">
            <Search size={17} className="search-icon" />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="search-input"
            />

            {search && (
              <button
                className="clear-search"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="table-wrapper">
          <table className="customers-table">
            <thead>
              <tr>
                {products.length > 0 &&
                  Object.keys(products[0]).map((column) => (
                    <th key={column}>{column}</th>
                  ))}
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  {Object.entries(product).map(([column, value]) => (
                    <td key={column}>
                      {value === null ? "-" : String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="empty-state">
              {search ? (
                <>
                  <strong>No products found</strong>
                  <p>
                    No products match "{search}".
                  </p>

                  <button
                    className="secondary-button"
                    onClick={clearSearch}
                  >
                    Clear search
                  </button>
                </>
              ) : (
                "No products found."
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}