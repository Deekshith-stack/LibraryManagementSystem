import React, { useContext } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { 
  BookOpen, 
  LayoutDashboard, 
  BookMarked, 
  DollarSign, 
  Library, 
  ArrowLeftRight, 
  Bookmark, 
  BarChart3, 
  Users, 
  Settings2 
} from 'lucide-react';

export const Sidebar = ({ currentTab, setCurrentTab }) => {
  const { currentUser } = useContext(LibraryContext);

  // Define tabs based on role
  const getTabsByRole = (role) => {
    switch (role) {
      case 'student':
        return [
          { id: 'student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'student-catalog', label: 'Library Catalog', icon: BookOpen },
          { id: 'student-fines', label: 'Fines & Payments', icon: DollarSign }
        ];
      case 'librarian':
        return [
          { id: 'lib-catalog', label: 'Book Cataloger', icon: BookMarked },
          { id: 'lib-issue-return', label: 'Issue & Return', icon: ArrowLeftRight },
          { id: 'lib-reservations', label: 'Reservations', icon: Bookmark }
        ];
      case 'admin':
        return [
          { id: 'admin-dashboard', label: 'System Analytics', icon: BarChart3 },
          { id: 'admin-users', label: 'User Directory', icon: Users },
          { id: 'admin-settings', label: 'Library Settings', icon: Settings2 }
        ];
      default:
        return [];
    }
  };

  const menuItems = getTabsByRole(currentUser.role);

  // Set default tab if current one is not applicable to current role
  React.useEffect(() => {
    const ids = menuItems.map(m => m.id);
    if (!ids.includes(currentTab)) {
      setCurrentTab(ids[0]);
    }
  }, [currentUser.role, currentTab, setCurrentTab]);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Library size={20} />
        </div>
        <span className="sidebar-title gradient-text">LIBRARY LMS</span>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <li key={item.id}>
              <a
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setCurrentTab(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="sidebar-user-name" title={currentUser.name}>
              {currentUser.name}
            </div>
            <span className="sidebar-user-role">
              {currentUser.role === 'admin' ? 'System Administrator' : currentUser.role}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
