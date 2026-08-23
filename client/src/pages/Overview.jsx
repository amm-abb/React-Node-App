import { useEffect, useState } from "react";
import {
  DollarSign,
  Package,
  Users,
  RefreshCw,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadStats() {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3001/api/sales"
      );

      if (!response.ok) {
        throw new Error("Failed to load sales statistics");
      }

      const data = await response.json();

      setStats(data);
      setSalesData(
        data.yearlySales.map((item) => ({
          year: item.year,
          revenue: item.yearly_revenue,
        }))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h1>Overview</h1>
        <p>Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Overview</h1>
          <p>Sales Overview</p>
        </div>

        <button
          className="secondary-button refresh-button"
          onClick={loadStats}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Sales"
          value={`$${stats.totalSales.toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`}
          icon={DollarSign}
        />
      </div>

      <div className="stats-grid">
        <StatCard
          title="Top Revenue Product"
          value={stats.topRevProduct}
          icon={Package}
        />
      </div>

      <div className="stats-grid">
        <StatCard
          title="Top Quantity Product"
          value={stats.topQuaProduct}
          icon={Package}
        />
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <div>
            <h2>Sales Charts</h2>
            <p>Yearly Revenue</p>
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="year" />

              <YAxis
                tickFormatter={(value) =>
                  `$${Number(value).toLocaleString()}`
                }
              />

              <Tooltip
                formatter={(value) => [
                  `$${Number(value).toLocaleString()}`,
                  "Revenue",
                ]}
              />

              <Bar
                dataKey="revenue"
                name="Revenue"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span>{title}</span>
        <div className="stat-icon">
          <Icon size={19} />
        </div>
      </div>
      <strong>{value}</strong>
    </div>
  );
}