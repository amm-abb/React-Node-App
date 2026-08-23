import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, X } from "lucide-react";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadCustomers(isRefresh = false) {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(
        "http://localhost:3001/api/customers"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = search.trim();

    if (!query) {
      return customers;
    }

    return customers.filter((product) =>
      Object.values(product).some((value) =>
        String(value ?? "")
          .includes(query)
      )
    );
  }, [customers, search]);

  function clearSearch() {
    setSearch("");
  }

  if (loading) {
    return (
      <div className="page">
        <h1>Customers</h1>
        <p>Loading customers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>Customers</h1>

        <p className="error-message">{error}</p>

        <button
          className="primary-button"
          onClick={() => loadCustomers(true)}
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
          <h1>Customers</h1>
          <p>
            {search
              ? `${filteredCustomers.length} of ${customers.length} customers`
              : `${customers.length} customers`}
          </p>
        </div>

        <div className="page-actions">
          <button
            className="secondary-button refresh-button"
            onClick={() => loadCustomers(true)}
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
            <h2>All Customers</h2>
            <span>
              {filteredCustomers.length} displayed
            </span>
          </div>

          <div className="search-wrapper">
            <Search size={17} className="search-icon" />

            <input
              type="text"
              placeholder="Search customers..."
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
                {customers.length > 0 &&
                  Object.keys(customers[0]).map((column) => (
                    <th key={column}>{column}</th>
                  ))}
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((product) => (
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

          {filteredCustomers.length === 0 && (
            <div className="empty-state">
              {search ? (
                <>
                  <strong>No customers found</strong>
                  <p>
                    No customers match "{search}".
                  </p>

                  <button
                    className="secondary-button"
                    onClick={clearSearch}
                  >
                    Clear search
                  </button>
                </>
              ) : (
                "No customers found."
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}