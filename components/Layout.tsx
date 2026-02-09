
import React from 'react';
import { 
  LayoutDashboard, 
  Mic2, 
  History, 
  CreditCard, 
  User, 
  Menu, 
  X, 
  LogOut,
  Settings
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: any) => void;
  userName: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate, userName }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navItems = [
    { id: 'editor', label: 'المحرر الصوتي', icon: Mic2 },
    { id: 'voices', label: 'مكتبة الأصوات', icon: User },
    { id: 'projects', label: 'مشاريعي', icon: History },
    { id: 'pricing', label: 'الخطط والأسعار', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Mic2 size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-indigo-900">صوتك</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 right-0 z-40 w-64 bg-white border-l transition-transform duration-300 md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 hidden md:flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
              <Mic2 size={24} className="text-white" />
            </div>
            <span className="font-extrabold text-2xl text-indigo-900">صوتك</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                  ${currentPage === item.id 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                {userName.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-500">خطة المحترفين</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <Settings size={16} />
              </button>
            </div>
            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 font-medium hover:bg-red-50 rounded-lg transition-colors">
              <LogOut size={16} />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto w-full h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
