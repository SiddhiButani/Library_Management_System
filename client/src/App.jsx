import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Member Pages
import MemberDashboard from './pages/member/Dashboard';
import Profile from './pages/member/Profile';
import EditProfile from './pages/member/EditProfile';
import SearchBooks from './pages/member/SearchBooks';
import BookDetails from './pages/member/BookDetails';
import BookCategories from './pages/member/BookCategories';
import BorrowedBooks from './pages/member/BorrowedBooks';
import ReturnRenew from './pages/member/ReturnRenew';
import Fines from './pages/member/Fines';
import PayFine from './pages/member/PayFine';
import TransactionHistory from './pages/member/TransactionHistory';
import WaitingList from './pages/member/WaitingList';
import JournalsMagazines from './pages/member/JournalsMagazines';
import Membership from './pages/member/Membership';
import CheckoutMembership from './pages/member/CheckoutMembership';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import BookManagement from './pages/admin/BookManagement';
import AddEditBook from './pages/admin/AddEditBook';
import MemberManagement from './pages/admin/MemberManagement';
import IssueReturn from './pages/admin/IssueReturn';
import FineManagement from './pages/admin/FineManagement';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';
import CategoryManagement from './pages/admin/CategoryManagement';
import ContactMessages from './pages/admin/ContactMessages';

// Shared / Public Pages
import LandingPage from './pages/shared/LandingPage';
import AboutUs from './pages/shared/AboutUs';
import ContactUs from './pages/shared/ContactUs';
import BookAvailability from './pages/shared/BookAvailability';
import NotFound from './pages/shared/NotFound';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return <DashboardLayout>{children}</DashboardLayout>;
};

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Member Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><MemberDashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><SearchBooks /></ProtectedRoute>} />
      <Route path="/book/:id" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
      <Route path="/categories" element={<ProtectedRoute><BookCategories /></ProtectedRoute>} />
      <Route path="/borrowed-books" element={<ProtectedRoute><BorrowedBooks /></ProtectedRoute>} />
      <Route path="/return-renew" element={<ProtectedRoute><ReturnRenew /></ProtectedRoute>} />
      <Route path="/fines" element={<ProtectedRoute><Fines /></ProtectedRoute>} />
      <Route path="/pay-fine/:id" element={<ProtectedRoute><PayFine /></ProtectedRoute>} />
      <Route path="/transaction-history" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
      <Route path="/waiting-list" element={<ProtectedRoute><WaitingList /></ProtectedRoute>} />
      <Route path="/journals" element={<ProtectedRoute><JournalsMagazines /></ProtectedRoute>} />
      <Route path="/membership" element={<ProtectedRoute><Membership /></ProtectedRoute>} />
      <Route path="/checkout-membership/:plan" element={<ProtectedRoute><CheckoutMembership /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/books" element={<ProtectedRoute adminOnly><BookManagement /></ProtectedRoute>} />
      <Route path="/admin/books/new" element={<ProtectedRoute adminOnly><AddEditBook /></ProtectedRoute>} />
      <Route path="/admin/books/edit/:id" element={<ProtectedRoute adminOnly><AddEditBook /></ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute adminOnly><CategoryManagement /></ProtectedRoute>} />
      <Route path="/admin/members" element={<ProtectedRoute adminOnly><MemberManagement /></ProtectedRoute>} />
      <Route path="/admin/issue-return" element={<ProtectedRoute adminOnly><IssueReturn /></ProtectedRoute>} />
      <Route path="/admin/fines" element={<ProtectedRoute adminOnly><FineManagement /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute adminOnly><Reports /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute adminOnly><Settings /></ProtectedRoute>} />
      <Route path="/admin/messages" element={<ProtectedRoute adminOnly><ContactMessages /></ProtectedRoute>} />

      {/* Public Pages — accessible without login */}
      <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} /> : <LandingPage />} />
      <Route path="/about" element={user ? <ProtectedRoute><AboutUs /></ProtectedRoute> : <AboutUs />} />
      <Route path="/contact" element={user ? <ProtectedRoute><ContactUs /></ProtectedRoute> : <ContactUs />} />

      {/* Protected Shared */}
      <Route path="/book-availability" element={<ProtectedRoute><BookAvailability /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
