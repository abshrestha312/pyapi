'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Users, 
  Shield, 
  UserCircle, 
  TicketCheck, 
  AlertTriangle, 
  History,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

interface SidebarProps {
  user?: {
    name: string
    email: string
    role?: { name: string }
    impersonateAs?: string
  }
  onLogout: () => void
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Settings,
    children: []
  },
  {
    name: 'User Management',
    href: '/users',
    icon: Users,
    children: [
      { name: 'Users', href: '/users' },
      { name: 'Roles', href: '/roles' },
      { name: 'Groups', href: '/groups' }
    ]
  },
  {
    name: 'Service Management',
    href: '/tickets',
    icon: TicketCheck,
    children: [
      { name: 'Tickets', href: '/tickets' },
      { name: 'Incidents', href: '/incidents' }
    ]
  },
  {
    name: 'Administration',
    href: '/admin',
    icon: Shield,
    children: [
      { name: 'Audit Logs', href: '/audit-logs' },
      { name: 'System Settings', href: '/settings' }
    ]
  }
]

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(['User Management', 'Service Management'])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <div className="sf-sidebar w-64 flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-sf-navy-800">
        <h1 className="text-xl font-bold text-white">ServiceFlow</h1>
        {user?.impersonateAs && (
          <div className="mt-2 p-2 bg-sf-honey-500 text-sf-navy-900 rounded text-xs font-medium">
            Impersonating: {user.impersonateAs}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => (
          <div key={item.name}>
            <div
              className={`sf-nav-item ${isActive(item.href) ? 'active' : ''}`}
              onClick={() => {
                if (item.children.length > 0) {
                  toggleExpanded(item.name)
                } else {
                  router.push(item.href)
                }
              }}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="flex-1">{item.name}</span>
              {item.children.length > 0 && (
                expandedItems.includes(item.name) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )
              )}
            </div>

            {/* Subnav */}
            {item.children.length > 0 && expandedItems.includes(item.name) && (
              <div className="ml-8 mt-1 space-y-1">
                {item.children.map((child) => (
                  <div
                    key={child.name}
                    className={`sf-nav-item text-sm ${isActive(child.href) ? 'active' : ''}`}
                    onClick={() => router.push(child.href)}
                  >
                    <span>{child.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-sf-navy-800">
        <div className="flex items-center mb-4">
          <UserCircle className="w-8 h-8 mr-3 text-sf-navy-300" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {user?.name || 'Unknown User'}
            </div>
            <div className="text-xs text-sf-navy-300 truncate">
              {user?.role?.name || 'No Role'}
            </div>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center px-3 py-2 text-sm text-sf-navy-300 hover:text-white hover:bg-sf-navy-800 rounded transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  )
}