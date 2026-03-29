import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <Sidebar />
      <div style={{
        flex: 1,
        overflow: 'auto',
        minHeight: '100vh',
      }}>
        {children}
      </div>
    </div>
  );
}
