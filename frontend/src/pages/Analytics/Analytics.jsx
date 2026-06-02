import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Select, Spin, Typography, Tag } from 'antd';
import {
  FileTextOutlined,
  DollarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import api from '../../services/api';
import { ORDER_STATUS_LABELS } from '../../utils/orderStatus';
import './Analytics.css';


const { Title, Text } = Typography;
const { Option } = Select;

const STATUS_COLORS = {
  new: '#667eea',
  in_progress: '#f6ad55',
  ready: '#48bb78',
  completed: '#38a169',
  cancelled: '#fc8181',
};

const GRADIENT_COLORS = [
  '#667eea', '#764ba2', '#f6ad55', '#48bb78', '#fc8181',
];

const formatMoney = (val) =>
  new Intl.NumberFormat('ru-KZ', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 }).format(val);

const CustomAreaTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="analytics-tooltip">
      <p className="analytics-tooltip__label">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color, margin: '2px 0' }}>
          {p.name}: <strong>{formatMoney(p.value)}</strong>
        </p>
      ))}
    </div>
  );
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="analytics-tooltip">
      <p className="analytics-tooltip__label">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color, margin: '2px 0' }}>
          {p.name}: <strong>{p.dataKey === 'order_count' ? p.value : formatMoney(p.value)}</strong>
        </p>
      ))}
    </div>
  );
};

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Analytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [statusData, setStatusData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthRange, setMonthRange] = useState(12);
  const [trendDays, setTrendDays] = useState(30);

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    fetchMonthly();
  }, [monthRange]);

  useEffect(() => {
    fetchTrend();
  }, [trendDays]);

  const fetchAll = async () => {
    setLoading(true);
    const [dash, status, monthly, clients, trend] = await Promise.allSettled([
      api.get('/analytics/dashboard'),
      api.get('/analytics/orders-by-status'),
      api.get(`/analytics/monthly-stats?months=${monthRange}`),
      api.get('/analytics/top-clients?limit=10'),
      api.get(`/analytics/revenue-trend?days=${trendDays}`),
    ]);
    if (dash.status === 'fulfilled') setDashboard(dash.value.data);
    if (status.status === 'fulfilled')
      setStatusData(status.value.data.map((d) => ({ ...d, name: ORDER_STATUS_LABELS[d.status] || d.status })));
    if (monthly.status === 'fulfilled') setMonthlyData(monthly.value.data);
    if (clients.status === 'fulfilled') setTopClients(clients.value.data);
    if (trend.status === 'fulfilled') setTrendData(trend.value.data);
    setLoading(false);
  };

  const fetchMonthly = async () => {
    try {
      const res = await api.get(`/analytics/monthly-stats?months=${monthRange}`);
      setMonthlyData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTrend = async () => {
    try {
      const res = await api.get(`/analytics/revenue-trend?days=${trendDays}`);
      setTrendData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const topClientsColumns = [
    {
      title: '#',
      key: 'rank',
      width: 48,
      render: (_, __, index) => (
        <div className={`analytics-rank analytics-rank--${index < 3 ? index + 1 : 'rest'}`}>
          {index + 1}
        </div>
      ),
    },
    {
      title: 'Клиент',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Text strong>{name || '—'}</Text>,
    },
    {
      title: 'Заказов',
      dataIndex: 'order_count',
      key: 'order_count',
      align: 'center',
      render: (val) => <Tag color="blue">{val}</Tag>,
    },
    {
      title: 'Сумма',
      dataIndex: 'total_spent',
      key: 'total_spent',
      align: 'right',
      render: (val) => <Text strong style={{ color: '#38a169' }}>{formatMoney(val)}</Text>,
    },
  ];

  if (loading) {
    return (
      <div className="analytics-loading">
        <Spin size="large" tip="Загрузка статистики..." />
      </div>
    );
  }

  const summaryCards = [
    {
      title: 'Заказов за 30 дней',
      value: dashboard?.total_orders ?? 0,
      icon: <FileTextOutlined />,
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'Выручка (завершённые)',
      value: dashboard?.total_revenue ?? 0,
      icon: <DollarOutlined />,
      color: '#38a169',
      gradient: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
      isMoney: true,
    },
    {
      title: 'Всего клиентов',
      value: dashboard?.total_clients ?? 0,
      icon: <UserOutlined />,
      color: '#f6ad55',
      gradient: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)',
    },
    {
      title: 'Новых заказов',
      value: dashboard?.pending_orders ?? 0,
      icon: <ClockCircleOutlined />,
      color: '#fc8181',
      gradient: 'linear-gradient(135deg, #fc8181 0%, #f56565 100%)',
    },
  ];

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <Title level={3} style={{ margin: 0 }}>
          <RiseOutlined style={{ marginRight: 8, color: '#667eea' }} />
          Аналитика и статистика
        </Title>
        <Text type="secondary">Сводка за последние 30 дней</Text>
      </div>

      {/* Summary cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {summaryCards.map((card) => (
          <Col xs={24} sm={12} xl={6} key={card.title}>
            <Card className="analytics-stat-card" bodyStyle={{ padding: '20px 24px' }}>
              <div className="analytics-stat-card__inner">
                <div className="analytics-stat-card__icon" style={{ background: card.gradient }}>
                  {card.icon}
                </div>
                <Statistic
                  title={<span className="analytics-stat-card__title">{card.title}</span>}
                  value={card.isMoney ? card.value : card.value}
                  formatter={card.isMoney ? (val) => formatMoney(val) : undefined}
                  valueStyle={{ color: card.color, fontWeight: 700, fontSize: 24 }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Revenue trend + Orders by status */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={15}>
          <Card
            className="analytics-chart-card"
            title={
              <div className="analytics-card-title">
                <CheckCircleOutlined style={{ color: '#667eea', marginRight: 8 }} />
                Тренд выручки (завершённые заказы)
              </div>
            }
            extra={
              <Select value={trendDays} onChange={setTrendDays} size="small" style={{ width: 120 }}>
                <Option value={7}>7 дней</Option>
                <Option value={14}>14 дней</Option>
                <Option value={30}>30 дней</Option>
                <Option value={90}>3 месяца</Option>
              </Select>
            }
          >
            {trendData.length === 0 ? (
              <div className="analytics-empty">Нет данных за выбранный период</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}к`} />
                  <Tooltip content={<CustomAreaTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Выручка"
                    stroke="#667eea"
                    strokeWidth={2.5}
                    fill="url(#revGradient)"
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card
            className="analytics-chart-card"
            title={
              <div className="analytics-card-title">
                <FileTextOutlined style={{ color: '#764ba2', marginRight: 8 }} />
                Заказы по статусам
              </div>
            }
            style={{ height: '100%' }}
          >
            {statusData.length === 0 ? (
              <div className="analytics-empty">Нет данных</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="count"
                    labelLine={false}
                    label={<CustomPieLabel />}
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={entry.status}
                        fill={STATUS_COLORS[entry.status] || GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name) => [val, name]}
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend
                    formatter={(value) => <span style={{ fontSize: 12 }}>{value}</span>}
                    iconType="circle"
                    iconSize={10}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>

      {/* Monthly bar chart */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <Card
            className="analytics-chart-card"
            title={
              <div className="analytics-card-title">
                <DollarOutlined style={{ color: '#38a169', marginRight: 8 }} />
                Статистика по месяцам
              </div>
            }
            extra={
              <Select value={monthRange} onChange={setMonthRange} size="small" style={{ width: 140 }}>
                <Option value={3}>3 месяца</Option>
                <Option value={6}>6 месяцев</Option>
                <Option value={12}>12 месяцев</Option>
                <Option value={24}>24 месяца</Option>
              </Select>
            }
          >
            {monthlyData.length === 0 ? (
              <div className="analytics-empty">Нет данных за выбранный период</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }} barGap={4}>
                  <defs>
                    <linearGradient id="barRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                    <linearGradient id="barCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#48bb78" />
                      <stop offset="100%" stopColor="#38a169" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="money"
                    orientation="left"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}к`}
                  />
                  <YAxis yAxisId="count" orientation="right" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend iconType="circle" iconSize={10} formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
                  <Bar
                    yAxisId="money"
                    dataKey="revenue"
                    name="Общая сумма"
                    fill="url(#barRevenue)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar
                    yAxisId="money"
                    dataKey="completed_revenue"
                    name="Выручка (выдано)"
                    fill="url(#barCompleted)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar
                    yAxisId="count"
                    dataKey="order_count"
                    name="Кол-во заказов"
                    fill="#f6ad55"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>

      {/* Top clients */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            className="analytics-chart-card"
            title={
              <div className="analytics-card-title">
                <UserOutlined style={{ color: '#f6ad55', marginRight: 8 }} />
                Топ клиентов по выручке
              </div>
            }
          >
            <Table
              columns={topClientsColumns}
              dataSource={topClients}
              rowKey="client_id"
              pagination={false}
              size="middle"
              rowClassName={(_, index) => (index % 2 === 0 ? 'analytics-table-row-even' : '')}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
