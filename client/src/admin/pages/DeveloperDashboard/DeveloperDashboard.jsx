import { Link } from 'react-router-dom';
import {
  Upload, Package, Grid3x3, Tag, Shield, Users, Database,
  FileSpreadsheet, Download, Settings, ArrowRight, TrendingUp,
  HardDrive, Code2, AlertTriangle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import './DeveloperDashboard.css';

const sysStats = [
  { label: 'Total Products', value: '120', icon: Package, color: '#1b4332', bg: '#d8f3dc' },
  { label: 'Categories', value: '13', icon: Grid3x3, color: '#3b82f6', bg: '#dbeafe' },
  { label: 'Health Tags', value: '21', icon: Tag, color: '#8b5cf6', bg: '#ede9fe' },
  { label: 'Admin Users', value: '3', icon: Shield, color: '#f59e0b', bg: '#fef3c7' },
];

const devTools = [
  { label: 'Bulk Upload', desc: 'Import products from CSV or Excel', icon: Upload, to: '/admin/developer/bulk-upload', accent: true },
  { label: 'Export Data', desc: 'Download products, orders as CSV', icon: Download, to: '/admin/developer/export' },
  { label: 'Admin Users', desc: 'Manage admin accounts & roles', icon: Users, to: '/admin/admin-users' },
  { label: 'System Settings', desc: 'Site config, shipping, SEO', icon: Settings, to: '/admin/settings' },
];

const recentOps = [
  { action: 'Bulk upload', detail: '45 products imported from products_july.csv', time: '2 hours ago', status: 'success' },
  { action: 'Data export', detail: 'Full product catalog exported as CSV', time: '1 day ago', status: 'success' },
  { action: 'Bulk upload', detail: '12 products failed validation — missing SKU', time: '3 days ago', status: 'error' },
  { action: 'Stock update', detail: 'Bulk stock update for 30 items', time: '5 days ago', status: 'success' },
];

const cardAnim = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
};

export default function DeveloperDashboard() {
  const { admin } = useAdminAuth();

  return (
    <div className="dev-dash">
      {/* Header */}
      <div className="dev-dash__header">
        <div>
          <h1 className="dev-dash__title">Developer Dashboard</h1>
          <p className="dev-dash__sub">Welcome back, {admin?.name || 'Developer'}. System overview and tools.</p>
        </div>
        <span className="dev-dash__role-badge">
          <Code2 size={14} /> Developer
        </span>
      </div>

      {/* System Stats */}
      <div className="dev-dash__stats">
        {sysStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              className="dev-stat"
              key={stat.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardAnim}
            >
              <div className="dev-stat__icon" style={{ backgroundColor: stat.bg }}>
                <Icon size={20} color={stat.color} />
              </div>
              <div className="dev-stat__info">
                <span className="dev-stat__value">{stat.value}</span>
                <span className="dev-stat__label">{stat.label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bulk Upload Hero */}
      <motion.div
        className="dev-dash__upload-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="dev-dash__upload-info">
          <div className="dev-dash__upload-icon">
            <FileSpreadsheet size={32} />
          </div>
          <div>
            <h2>Bulk Product Upload</h2>
            <p>Import products from CSV or Excel files. Map columns, validate data, and upload in bulk.</p>
            <div className="dev-dash__upload-tags">
              <span>.csv</span>
              <span>.xlsx</span>
              <span>.xls</span>
            </div>
          </div>
        </div>
        <Link to="/admin/developer/bulk-upload" className="dev-dash__upload-btn">
          <Upload size={18} />
          Start Bulk Upload
          <ArrowRight size={16} />
        </Link>
      </motion.div>

      {/* Developer Tools + Recent Ops */}
      <div className="dev-dash__row">
        <motion.div
          className="dev-dash__card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <h2 className="dev-dash__card-title">
            <HardDrive size={16} /> Developer Tools
          </h2>
          <div className="dev-tools-grid">
            {devTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  to={tool.to}
                  className={`dev-tool-card ${tool.accent ? 'dev-tool-card--accent' : ''}`}
                  key={tool.label}
                >
                  <Icon size={22} className="dev-tool-card__icon" />
                  <div>
                    <strong>{tool.label}</strong>
                    <span>{tool.desc}</span>
                  </div>
                  <ArrowRight size={14} className="dev-tool-card__arrow" />
                </Link>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="dev-dash__card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <h2 className="dev-dash__card-title">
            <Database size={16} /> Recent Operations
          </h2>
          <div className="dev-ops-list">
            {recentOps.map((op, i) => (
              <div className="dev-op-row" key={i}>
                <div className={`dev-op-dot dev-op-dot--${op.status}`} />
                <div className="dev-op-info">
                  <strong>{op.action}</strong>
                  <span>{op.detail}</span>
                </div>
                <span className="dev-op-time">{op.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* System Health */}
      <motion.div
        className="dev-dash__card dev-dash__card--full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <h2 className="dev-dash__card-title">
          <AlertTriangle size={16} /> System Notes
        </h2>
        <div className="dev-notes">
          <div className="dev-note dev-note--info">
            <TrendingUp size={16} />
            <span>Backend API must be running for bulk upload to work. Start with <code>npm run dev</code> in <code>server/</code></span>
          </div>
          <div className="dev-note dev-note--warn">
            <AlertTriangle size={16} />
            <span>Bulk upload uses <code>POST /api/v1/admin/products/bulk</code> — Module 15 endpoint. Currently sends individual create requests as fallback.</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
