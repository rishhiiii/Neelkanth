import { Link } from 'react-router-dom';
import {
  IndianRupee,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  FileText,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import './Dashboard.css';

// --- Static Dummy Data ---

const stats = [
  {
    label: 'Total Revenue',
    value: '₹4,85,230',
    change: '+12.5%',
    icon: IndianRupee,
    color: '#1b4332',
    bg: '#d8f3dc',
  },
  {
    label: 'Total Orders',
    value: '384',
    change: '+8.2%',
    icon: ShoppingCart,
    color: '#3b82f6',
    bg: '#dbeafe',
  },
  {
    label: 'Total Customers',
    value: '1,247',
    change: '+15.3%',
    icon: Users,
    color: '#8b5cf6',
    bg: '#ede9fe',
  },
  {
    label: 'Total Products',
    value: '120',
    change: '+4.1%',
    icon: Package,
    color: '#f59e0b',
    bg: '#fef3c7',
  },
];

const recentOrders = [
  { id: '#NGW-1042', customer: 'Priya Sharma', date: '18 Jul 2026', amount: '₹2,340', status: 'delivered', payment: 'paid' },
  { id: '#NGW-1041', customer: 'Rahul Verma', date: '17 Jul 2026', amount: '₹890', status: 'processing', payment: 'paid' },
  { id: '#NGW-1040', customer: 'Ananya Iyer', date: '17 Jul 2026', amount: '₹1,560', status: 'shipped', payment: 'paid' },
  { id: '#NGW-1039', customer: 'Vikram Singh', date: '16 Jul 2026', amount: '₹3,210', status: 'confirmed', payment: 'paid' },
  { id: '#NGW-1038', customer: 'Meera Patel', date: '16 Jul 2026', amount: '₹720', status: 'pending', payment: 'pending' },
  { id: '#NGW-1037', customer: 'Arjun Nair', date: '15 Jul 2026', amount: '₹4,100', status: 'delivered', payment: 'paid' },
  { id: '#NGW-1036', customer: 'Sneha Kulkarni', date: '15 Jul 2026', amount: '₹1,890', status: 'cancelled', payment: 'failed' },
  { id: '#NGW-1035', customer: 'Karan Malhotra', date: '14 Jul 2026', amount: '₹2,650', status: 'shipped', payment: 'paid' },
];

const topProducts = [
  { name: 'Ashwagandha Capsules', category: "Men's Health", sold: 142, initials: 'AC', color: '#1b4332' },
  { name: 'Chyawanprash Premium', category: 'Immunity', sold: 128, initials: 'CP', color: '#8b5cf6' },
  { name: 'Triphala Churna', category: 'Digestive Care', sold: 98, initials: 'TC', color: '#3b82f6' },
  { name: 'Brahmi Vati Gold', category: 'Herbal Supplements', sold: 87, initials: 'BV', color: '#f59e0b' },
  { name: 'Mahanarayan Oil', category: 'Joint Care', sold: 76, initials: 'MO', color: '#ef4444' },
];

const lowStockItems = [
  { name: 'Karela Jamun Juice', stock: 3 },
  { name: 'Shilajit Resin', stock: 5 },
  { name: 'Kumkumadi Face Oil', stock: 7 },
  { name: 'Neem Face Wash', stock: 2 },
];

const quickActions = [
  { label: 'Add Product', icon: Package, to: '/admin/products/new' },
  { label: 'Manage Orders', icon: ShoppingCart, to: '/admin/orders' },
  { label: 'Add Blog Post', icon: FileText, to: '/admin/blog/new' },
  { label: 'View Reports', icon: BarChart3, to: '/admin/reports' },
];

// --- Helper Components ---

function StatusBadge({ status }) {
  const map = {
    delivered: 'badge-green',
    shipped: 'badge-blue',
    processing: 'badge-yellow',
    confirmed: 'badge-teal',
    pending: 'badge-gray',
    cancelled: 'badge-red',
  };
  return <span className={`dash-badge ${map[status] || 'badge-gray'}`}>{status}</span>;
}

function PaymentBadge({ payment }) {
  const map = {
    paid: 'badge-green',
    pending: 'badge-yellow',
    failed: 'badge-red',
  };
  return <span className={`dash-badge ${map[payment] || 'badge-gray'}`}>{payment}</span>;
}

function StockBadge({ stock }) {
  const cls = stock <= 3 ? 'badge-red' : 'badge-yellow';
  return <span className={`dash-badge ${cls}`}>{stock} left</span>;
}

// --- Main Component ---

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
};

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back. Here is what is happening today.</p>
      </div>

      {/* Row 1: Stat Cards */}
      <div className="stat-cards">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              className="stat-card"
              key={stat.label}
              style={{ borderTopColor: stat.color }}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <div className="stat-card-top">
                <div className="stat-icon" style={{ backgroundColor: stat.bg }}>
                  <Icon size={20} color={stat.color} />
                </div>
                <span className="stat-change">
                  <TrendingUp size={12} />
                  {stat.change}
                </span>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Row 2: Recent Orders + Top Products */}
      <div className="dashboard-row row-60-40">
        <motion.div
          className="dash-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="dash-card-header">
            <h2 className="dash-card-title">Recent Orders</h2>
            <Link to="/admin/orders" className="dash-view-all">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">{order.id}</td>
                    <td>{order.customer}</td>
                    <td className="text-muted">{order.date}</td>
                    <td className="order-amount">{order.amount}</td>
                    <td><StatusBadge status={order.status} /></td>
                    <td><PaymentBadge payment={order.payment} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          className="dash-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="dash-card-header">
            <h2 className="dash-card-title">Top Selling Products</h2>
            <Link to="/admin/products" className="dash-view-all">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="top-products-list">
            {topProducts.map((product, i) => (
              <div className="top-product-row" key={i}>
                <div className="top-product-avatar" style={{ backgroundColor: product.color + '1a', color: product.color }}>
                  {product.initials}
                </div>
                <div className="top-product-info">
                  <div className="top-product-name">{product.name}</div>
                  <div className="top-product-category">{product.category}</div>
                </div>
                <div className="top-product-sold">{product.sold} sold</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 3: Low Stock + Quick Actions */}
      <div className="dashboard-row row-50-50">
        <motion.div
          className="dash-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div className="dash-card-header">
            <h2 className="dash-card-title">
              <AlertTriangle size={16} className="alert-icon" />
              Low Stock Alerts
            </h2>
          </div>
          <div className="low-stock-list">
            {lowStockItems.map((item, i) => (
              <div className="low-stock-row" key={i}>
                <span className="low-stock-name">{item.name}</span>
                <StockBadge stock={item.stock} />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="dash-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <div className="dash-card-header">
            <h2 className="dash-card-title">Quick Actions</h2>
          </div>
          <div className="quick-actions-grid">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link to={action.to} className="quick-action-card" key={action.label}>
                  <Icon size={22} className="quick-action-icon" />
                  <span className="quick-action-label">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
