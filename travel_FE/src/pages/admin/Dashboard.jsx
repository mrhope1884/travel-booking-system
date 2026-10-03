import React, { useState, useEffect } from 'react';
import { Users, Clock, Compass, DollarSign } from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import ChartCard from '../../components/admin/ChartCard';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import dashboardService from '../../services/dashboardService';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      // Kết nối trực tiếp vào API thật: GET /api/dashboard
      const result = await dashboardService.getDashboardData();
      setData(result);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu dashboard:', err);
      setError(err.response?.data?.message || err.message || 'Không thể tải dữ liệu bảng điều khiển.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const formatVND = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number || 0);
  };

  if (loading) {
    return <LoadingSpinner text="Đang tải dữ liệu Dashboard từ Backend..." minHeight="400px" />;
  }

  if (error && !data) {
    return (
      <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '4px' }}>
        <p style={{ color: '#dc3545', fontSize: '15px' }}>❌ {error}</p>
        <button
          onClick={fetchDashboard}
          style={{
            marginTop: '12px',
            padding: '8px 16px',
            backgroundColor: '#00c0ef',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  const { stats = {}, destinationChart = [], paymentMethodChart = [], topTours = [], recentBookings = [] } = data || {};

  const tourColumns = [
    { header: 'ID', accessor: 'id', width: '70px' },
    { header: 'Tên', accessor: 'title' },
    { header: 'Số chỗ đã đặt', accessor: 'bookedSeats', align: 'center', width: '130px' },
    { header: 'Số chỗ còn trống', accessor: 'availableSeats', align: 'center', width: '140px' },
  ];

  const bookingColumns = [
    { header: 'ID', accessor: 'id', width: '60px' },
    { header: 'Họ và tên', accessor: 'customerName', width: '140px' },
    { header: 'Tên tours', accessor: 'tourTitle' },
    {
      header: 'Tổng tiền',
      accessor: 'totalPrice',
      align: 'right',
      width: '120px',
      render: (item) => `${formatVND(item.totalPrice)} đ`,
    },
    {
      header: 'Trạng thái',
      accessor: 'status',
      align: 'center',
      width: '120px',
      render: (item) => <StatusBadge status={item.status} type="booking" />,
    },
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* 1. TOP 4 STAT CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
        }}
      >
        <StatCard
          icon={<Compass size={16} />}
          title="Tổng số tours đang hoạt động"
          value={stats.activeTours ?? 0}
        />
        <StatCard
          icon={<Clock size={16} />}
          title="Tổng số lượt booking"
          value={stats.totalBookings ?? 0}
        />
        <StatCard
          icon={<Users size={16} />}
          title="Số người dùng tương tác"
          value={formatVND(stats.registeredUsers ?? 0)}
        />
        <StatCard
          icon={<DollarSign size={16} />}
          title="Tổng doanh thu"
          value={formatVND(stats.totalRevenue ?? 0)}
          unit="vnđ"
          isRevenue={true}
        />
      </div>

      {/* 2. MIDDLE ROW: 2 CHARTS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '18px',
        }}
      >
        {/* Biểu đồ 1: Điểm đến */}
        <ChartCard
          title="Điểm đến"
          subtitle="Tổng hợp danh sách tours thực tế"
          data={destinationChart}
          layout="side"
        />

        {/* Biểu đồ 2: Đặt tour */}
        <ChartCard
          title="Đặt tour"
          subtitle="Tỷ lệ trạng thái đơn hàng thực tế"
          data={paymentMethodChart}
          layout="bottom"
          onRefresh={fetchDashboard}
        />
      </div>

      {/* 3. BOTTOM ROW: 2 TABLES */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '18px',
        }}
      >
        {/* Table 1: Tours được đặt nhiều nhất */}
        <DataTable
          title="Tours"
          subtitle="được đặt nhiều nhất"
          columns={tourColumns}
          data={topTours}
          emptyMessage="Chưa có dữ liệu tour nào được đặt."
        />

        {/* Table 2: Đơn đặt mới */}
        <DataTable
          title="Đơn đặt mới"
          columns={bookingColumns}
          data={recentBookings}
          emptyMessage="Chưa có đơn đặt tour nào mới."
        />
      </div>
    </div>
  );
};

export default Dashboard;
