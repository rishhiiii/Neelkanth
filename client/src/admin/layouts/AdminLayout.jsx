import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Grid3x3,
  Tag,
  ShoppingCart,
  Users,
  Image,
  MessageSquareQuote,
  FileText,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import './AdminLayout.css';

const navSections = [
  {
    label: 'MAIN',
    items: [
      { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    ],
  },
  {
    label: 'CATALOG',
    items: [
      { to: '/admin/products', icon: Package, label: 'Products' },
      { to: '/admin/categories', icon: Grid3x3, label: 'Categories' },
      { to: '/admin/health-tags', icon: Tag, label: 'Health Tags' },
    ],
  },
  {
    label: 'SALES',
    items: [
      { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
      { to: '/admin/customers', icon: Users, label: 'Customers' },
    ],
  },
  {
    label: 'CONTENT',
    items: [
      { to: '/admin/banners', icon: Image, label: 'Banners' },
      { to: '/admin/testimonials', icon: MessageSquareQuote, label: 'Testimonials' },
      { to: '/admin/blog', icon: FileText, label: 'Blog' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { to: '/admin/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

function getInitials(name) {
  if (!name) return 'A';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getPageTitle(pathname) {
  const segment = pathname.replace('/admin', '').replace(/^\//, '').split('/')[0];
  if (!segment) return 'Dashboard';
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminLayout() {
  const { admin, logout, role } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageTitle = getPageTitle(location.pathname);

  const handleLogout = async () => {
    await logout();
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__header">
          <h1 className="admin-sidebar__logo">NGW Admin</h1>
          <button
            className="admin-sidebar__close"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {navSections.map((section) => (
            <div key={section.label} className="admin-nav-section">
              <span className="admin-nav-section__label">{section.label}</span>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `admin-nav-item ${isActive ? 'admin-nav-item--active' : ''}`
                  }
                  onClick={closeSidebar}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}

          {/* Developer-only: Admin Users */}
          {role === 'developer' && (
            <div className="admin-nav-section">
              <NavLink
                to="/admin/admin-users"
                className={({ isActive }) =>
                  `admin-nav-item ${isActive ? 'admin-nav-item--active' : ''}`
                }
                onClick={closeSidebar}
              >
                <Shield size={18} />
                <span>Admin Users</span>
              </NavLink>
            </div>
          )}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-avatar admin-avatar--sm">
              {getInitials(admin?.name)}
            </div>
            <div className="admin-sidebar__user-info">
              <span className="admin-sidebar__user-name">{admin?.name || 'Admin'}</span>
              <span className={`admin-role-badge admin-role-badge--${role}`}>
                {role}
              </span>
            </div>
          </div>
          <button className="admin-sidebar__logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-header__left">
            <button
              className="admin-header__hamburger"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            <h2 className="admin-header__title">{pageTitle}</h2>
          </div>
          <div className="admin-header__right">
            <span className={`admin-role-badge admin-role-badge--${role}`}>
              {role}
            </span>
            <span className="admin-header__name">{admin?.name || 'Admin'}</span>
            <div className="admin-avatar">
              {getInitials(admin?.name)}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
