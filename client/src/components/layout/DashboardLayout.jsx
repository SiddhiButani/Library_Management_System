import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
