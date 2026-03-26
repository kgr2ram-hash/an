import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const sidebarLinks = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { path: '/admin/import-export', label: 'Import/Export', icon: '📦' },
  { path: '/admin/bus-schedules', label: 'Bus Schedules', icon: '🚌' },
  { path: '/admin/categories', label: 'Categories', icon: '📂' },
  { path: '/admin/services', label: 'Services', icon: '🏪' },
  { path: '/admin/jobs', label: 'Jobs', icon: '💼' },
  { path: '/admin/healthcare', label: 'Health Care', icon: '🏥' },
  { path: '/admin/articles', label: 'Articles', icon: '📰' },
  { path: '/admin/officials', label: 'Officials', icon: '👤' },
  { path: '/admin/emergency-numbers', label: 'Emergency Numbers', icon: '🚨' },
  { path: '/admin/healthcare-facilities', label: 'Facilities', icon: '🏨' },
  { path: '/admin/service-submissions', label: 'Submissions', icon: '📋' },
  { path: '/admin/events', label: 'Events', icon: '📅' },
  { path: '/admin/complaints', label: 'Complaints', icon: '📢' },
  { path: '/admin/contacts', label: 'Contacts', icon: '📞' },
  { path: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
  { path: '/admin/blood-donors', label: 'Blood Donors', icon: '🩸' },
  { path: '/admin/reviews', label: 'Reviews', icon: '⭐' },
  { path: '/admin/users', label: 'Admin Users', icon: '👥' },
  { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

export default function AdminLayout() {
  const { isAuthenticated, admin, logout } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) return <Navigate to="/admin/login" />

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="font-bold text-lg">Admin Panel</h2>
          <p className="text-xs text-gray-400 mt-1">Welcome, {admin?.username}</p>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {sidebarLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                location.pathname === link.path
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Link to="/" className="block text-sm text-gray-400 hover:text-white mb-2">
            ← View Site
          </Link>
          <button
            onClick={logout}
            className="w-full text-left text-sm text-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden bg-gray-900 text-white w-full px-4 py-2 flex items-center gap-3 overflow-x-auto fixed top-16 z-40">
        {sidebarLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs ${
              location.pathname === link.path ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {link.icon} {link.label}
          </Link>
        ))}
        <button onClick={logout} className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs bg-red-800">
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:p-8 mt-12 md:mt-0 bg-gray-100">
        <Outlet />
      </div>
    </div>
  )
}
