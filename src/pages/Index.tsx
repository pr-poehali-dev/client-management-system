import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type Language = 'ru' | 'en' | 'zh';
type Currency = 'RUB' | 'USD' | 'CNY';

type Client = {
  id: string;
  name: string;
  city: string;
  theme: string;
  type: 'ФЛ' | 'ЮЛ';
  company?: string;
  commission: number;
  serviceType: string;
  status: string;
  manager: string;
};

type Supplier = {
  id: string;
  name: string;
  country: string;
  category: string;
  contact: string;
  rating: number;
  paymentTerms: string;
  status: string;
};

type Product = {
  id: string;
  sku: string;
  name: string;
  price: number;
  unit: string;
  weight: number;
  material: string;
  image: string;
};

type Order = {
  id: string;
  clientName: string;
  supplierName?: string;
  status: string;
  total: number;
  items: number;
  date: string;
  shipping: string;
  service: string;
};

const translations = {
  ru: {
    dashboard: 'Дашборд',
    clients: 'Клиенты',
    orders: 'Заказы',
    products: 'Товары',
    suppliers: 'Поставщики',
    logistics: 'Логистика',
    finance: 'Финансы',
    analytics: 'Аналитика',
    activeOrders: 'Активные заказы',
    totalClients: 'Всего клиентов',
    monthRevenue: 'Выручка (месяц)',
    warehouseChina: 'На складе в КНР',
    addClient: 'Добавить клиента',
    addSupplier: 'Добавить поставщика',
    createOrder: 'Создать заказ',
    addProduct: 'Добавить товар',
    overview: 'Обзор ключевых метрик и аналитики',
    clientManagement: 'Управление базой клиентов',
    supplierManagement: 'Управление поставщиками',
    orderManagement: 'Управление заказами клиентов',
    productCatalog: 'Номенклатура товаров',
    logisticsManagement: 'Управление отправками и доставками',
    financialAnalytics: 'Финансовая аналитика и платежи',
    detailedAnalytics: 'Детальная аналитика и отчёты',
  },
  en: {
    dashboard: 'Dashboard',
    clients: 'Clients',
    orders: 'Orders',
    products: 'Products',
    suppliers: 'Suppliers',
    logistics: 'Logistics',
    finance: 'Finance',
    analytics: 'Analytics',
    activeOrders: 'Active Orders',
    totalClients: 'Total Clients',
    monthRevenue: 'Revenue (Month)',
    warehouseChina: 'China Warehouse',
    addClient: 'Add Client',
    addSupplier: 'Add Supplier',
    createOrder: 'Create Order',
    addProduct: 'Add Product',
    overview: 'Overview of key metrics and analytics',
    clientManagement: 'Client database management',
    supplierManagement: 'Supplier management',
    orderManagement: 'Client order management',
    productCatalog: 'Product nomenclature',
    logisticsManagement: 'Shipping and delivery management',
    financialAnalytics: 'Financial analytics and payments',
    detailedAnalytics: 'Detailed analytics and reports',
  },
  zh: {
    dashboard: '仪表板',
    clients: '客户',
    orders: '订单',
    products: '产品',
    suppliers: '供应商',
    logistics: '物流',
    finance: '财务',
    analytics: '分析',
    activeOrders: '活跃订单',
    totalClients: '客户总数',
    monthRevenue: '月收入',
    warehouseChina: '中国仓库',
    addClient: '添加客户',
    addSupplier: '添加供应商',
    createOrder: '创建订单',
    addProduct: '添加产品',
    overview: '关键指标和分析概览',
    clientManagement: '客户数据库管理',
    supplierManagement: '供应商管理',
    orderManagement: '客户订单管理',
    productCatalog: '产品目录',
    logisticsManagement: '运输和交付管理',
    financialAnalytics: '财务分析和付款',
    detailedAnalytics: '详细分析和报告',
  },
};

const currencySymbols = {
  RUB: '₽',
  USD: '$',
  CNY: '¥',
};

const exchangeRates = {
  RUB: 1,
  USD: 0.011,
  CNY: 0.078,
};

export default function Index() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('ru');
  const [currency, setCurrency] = useState<Currency>('RUB');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    const savedCurrency = localStorage.getItem('currency') as Currency;
    if (savedLang) setLanguage(savedLang);
    if (savedCurrency) setCurrency(savedCurrency);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleCurrencyChange = (curr: Currency) => {
    setCurrency(curr);
    localStorage.setItem('currency', curr);
  };

  const formatPrice = (price: number) => {
    const converted = price * exchangeRates[currency];
    return `${currencySymbols[currency]}${converted.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const t = translations[language];

  const clients: Client[] = [
    { id: '1', name: 'Анна Смирнова', city: 'Москва', theme: 'Электроника', type: 'ФЛ', commission: 15, serviceType: 'Закуп + Логистика', status: 'Активный', manager: 'Иванов И.' },
    { id: '2', name: 'ООО "ТехноПром"', city: 'Санкт-Петербург', theme: 'Оборудование', type: 'ЮЛ', company: 'ТехноПром', commission: 12, serviceType: 'Логистика', status: 'Активный', manager: 'Петров П.' },
    { id: '3', name: 'Дмитрий Козлов', city: 'Казань', theme: 'Текстиль', type: 'ФЛ', commission: 18, serviceType: 'Закуп', status: 'Активный', manager: 'Сидорова С.' },
  ];

  const suppliers: Supplier[] = [
    { id: '1', name: 'Shenzhen Electronics Ltd', country: 'Китай', category: 'Электроника', contact: 'contact@shenzhen-elec.cn', rating: 4.8, paymentTerms: '30% аванс, 70% по готовности', status: 'Активный' },
    { id: '2', name: 'Guangzhou Textile Co', country: 'Китай', category: 'Текстиль', contact: 'info@gz-textile.com', rating: 4.5, paymentTerms: '50/50', status: 'Активный' },
    { id: '3', name: 'Beijing Tech Industries', country: 'Китай', category: 'Оборудование', contact: 'sales@beijing-tech.cn', rating: 4.9, paymentTerms: 'Предоплата 100%', status: 'Активный' },
  ];

  const products: Product[] = [
    { id: '1', sku: 'ELEC-001', name: 'Bluetooth наушники TWS', price: 450, unit: 'шт', weight: 0.05, material: 'Пластик, силикон', image: '🎧' },
    { id: '2', sku: 'TEXT-045', name: 'Постельное белье сатин', price: 1200, unit: 'комплект', weight: 1.2, material: 'Хлопок 100%', image: '🛏️' },
    { id: '3', sku: 'TECH-123', name: 'LED лампа 12W', price: 180, unit: 'шт', weight: 0.15, material: 'Алюминий, пластик', image: '💡' },
  ];

  const orders: Order[] = [
    { id: 'ORD-2024-001', clientName: 'Анна Смирнова', supplierName: 'Shenzhen Electronics Ltd', status: 'На складе в Китае', total: 45000, items: 8, date: '2024-12-05', shipping: 'Авто', service: 'Закуп + Логистика' },
    { id: 'ORD-2024-002', clientName: 'ООО "ТехноПром"', supplierName: 'Beijing Tech Industries', status: 'В процессе', total: 128000, items: 15, date: '2024-12-07', shipping: 'ЖД', service: 'Логистика' },
    { id: 'ORD-2024-003', clientName: 'Дмитрий Козлов', supplierName: 'Guangzhou Textile Co', status: 'Ожидает депозита', total: 32000, items: 5, date: '2024-12-08', shipping: 'Море', service: 'Закуп' },
    { id: 'ORD-2024-004', clientName: 'Анна Смирнова', supplierName: 'Shenzhen Electronics Ltd', status: 'Готов к отправке', total: 67000, items: 12, date: '2024-12-04', shipping: 'Авто', service: 'Закуп + Логистика' },
  ];

  const monthlyData = [
    { month: 'Июль', orders: 12, revenue: 450000 },
    { month: 'Август', orders: 18, revenue: 620000 },
    { month: 'Сентябрь', orders: 15, revenue: 580000 },
    { month: 'Октябрь', orders: 22, revenue: 780000 },
    { month: 'Ноябрь', orders: 28, revenue: 920000 },
    { month: 'Декабрь', orders: 16, revenue: 540000 },
  ];

  const serviceData = [
    { name: 'Закуп', value: 45 },
    { name: 'Логистика', value: 30 },
    { name: 'Оба', value: 25 },
  ];

  const COLORS = ['#0EA5E9', '#8B5CF6', '#F97316'];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Запущен': 'bg-gray-500',
      'Ожидает депозита': 'bg-yellow-500',
      'В процессе': 'bg-blue-500',
      'Ждёт подтверждения': 'bg-purple-500',
      'На складе в Китае': 'bg-indigo-500',
      'Готов к отправке': 'bg-green-500',
      'Активный': 'bg-green-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-[#1A1F2C] text-white p-6 animate-fade-in">
          <div className="mb-8">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Icon name="Package" size={28} />
              LogisticsPro
            </h1>
            <p className="text-gray-400 text-sm mt-1">Управление закупками</p>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'dashboard', icon: 'LayoutDashboard', label: t.dashboard },
              { id: 'clients', icon: 'Users', label: t.clients },
              { id: 'suppliers', icon: 'Building2', label: t.suppliers },
              { id: 'orders', icon: 'ShoppingCart', label: t.orders },
              { id: 'products', icon: 'Box', label: t.products },
              { id: 'logistics', icon: 'Truck', label: t.logistics },
              { id: 'finance', icon: 'DollarSign', label: t.finance },
              { id: 'analytics', icon: 'BarChart3', label: t.analytics },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover-scale ${
                  activeTab === item.id ? 'bg-[#0EA5E9] text-white' : 'hover:bg-gray-800'
                }`}
              >
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="flex justify-end gap-3 mb-6 animate-fade-in">
            <Select value={language} onValueChange={(value) => handleLanguageChange(value as Language)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ru">🇷🇺 Русский</SelectItem>
                <SelectItem value="en">🇬🇧 English</SelectItem>
                <SelectItem value="zh">🇨🇳 中文</SelectItem>
              </SelectContent>
            </Select>

            <Select value={currency} onValueChange={(value) => handleCurrencyChange(value as Currency)}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RUB">₽ RUB</SelectItem>
                <SelectItem value="USD">$ USD</SelectItem>
                <SelectItem value="CNY">¥ CNY</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {activeTab === 'dashboard' && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#1A1F2C]">{t.dashboard}</h2>
                <p className="text-gray-600">{t.overview}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { title: t.activeOrders, value: '16', icon: 'ShoppingCart', color: 'text-blue-600', bg: 'bg-blue-50' },
                  { title: t.totalClients, value: '48', icon: 'Users', color: 'text-purple-600', bg: 'bg-purple-50' },
                  { title: t.monthRevenue, value: formatPrice(540000), icon: 'TrendingUp', color: 'text-green-600', bg: 'bg-green-50' },
                  { title: t.warehouseChina, value: '23', icon: 'Package', color: 'text-orange-600', bg: 'bg-orange-50' },
                ].map((stat, idx) => (
                  <Card key={idx} className="hover-scale">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                          <p className="text-3xl font-bold text-[#1A1F2C]">{stat.value}</p>
                        </div>
                        <div className={`${stat.bg} ${stat.color} p-3 rounded-full`}>
                          <Icon name={stat.icon} size={24} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Динамика заказов и выручки</CardTitle>
                    <CardDescription>За последние 6 месяцев</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#0EA5E9" strokeWidth={2} />
                        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Распределение услуг</CardTitle>
                    <CardDescription>Типы оказываемых услуг</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={serviceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {serviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Последние заказы</CardTitle>
                  <CardDescription>Актуальные заказы в работе</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover-scale">
                        <div className="flex items-center gap-4">
                          <div className="bg-[#0EA5E9] text-white p-3 rounded-lg">
                            <Icon name="ShoppingCart" size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-[#1A1F2C]">{order.id}</p>
                            <p className="text-sm text-gray-600">{order.clientName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={`${getStatusColor(order.status)} text-white`}>{order.status}</Badge>
                          <p className="font-bold text-[#1A1F2C]">{formatPrice(order.total)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-[#1A1F2C]">{t.clients}</h2>
                  <p className="text-gray-600">{t.clientManagement}</p>
                </div>
                <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90">
                      <Icon name="Plus" size={20} className="mr-2" />
                      {t.addClient}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Новый клиент</DialogTitle>
                      <DialogDescription>Заполните информацию о клиенте</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label>ФИО / Название компании</Label>
                        <Input placeholder="Иванов Иван Иванович" />
                      </div>
                      <div>
                        <Label>Город</Label>
                        <Input placeholder="Москва" />
                      </div>
                      <div>
                        <Label>Тематика</Label>
                        <Input placeholder="Электроника" />
                      </div>
                      <div>
                        <Label>Тип клиента</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите тип" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fl">Физическое лицо</SelectItem>
                            <SelectItem value="ul">Юридическое лицо</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Комиссия (%)</Label>
                        <Input type="number" placeholder="15" />
                      </div>
                      <div>
                        <Label>Тип услуги</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите услугу" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="purchase">Закуп</SelectItem>
                            <SelectItem value="logistics">Логистика</SelectItem>
                            <SelectItem value="both">Оба</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Ответственный менеджер</Label>
                        <Input placeholder="Иванов И.И." />
                      </div>
                      <div>
                        <Label>Статус</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Статус" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Активный</SelectItem>
                            <SelectItem value="inactive">Неактивный</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-[#0EA5E9]">Создать клиента</Button>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {clients.map((client) => (
                  <Card key={client.id} className="hover-scale">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#0EA5E9] text-white p-3 rounded-full">
                            <Icon name="User" size={24} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{client.name}</CardTitle>
                            <CardDescription>{client.city}</CardDescription>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(client.status)} text-white`}>{client.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Тематика:</span>
                          <span className="font-medium">{client.theme}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Тип:</span>
                          <span className="font-medium">{client.type}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Комиссия:</span>
                          <span className="font-medium">{client.commission}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Услуга:</span>
                          <span className="font-medium">{client.serviceType}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Менеджер:</span>
                          <span className="font-medium">{client.manager}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        <Icon name="Eye" size={16} className="mr-2" />
                        Подробнее
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'suppliers' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-[#1A1F2C]">{t.suppliers}</h2>
                  <p className="text-gray-600">{t.supplierManagement}</p>
                </div>
                <Dialog open={isSupplierDialogOpen} onOpenChange={setIsSupplierDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90">
                      <Icon name="Plus" size={20} className="mr-2" />
                      {t.addSupplier}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Новый поставщик</DialogTitle>
                      <DialogDescription>Заполните информацию о поставщике</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label>Название компании</Label>
                        <Input placeholder="Shenzhen Electronics Ltd" />
                      </div>
                      <div>
                        <Label>Страна</Label>
                        <Input placeholder="Китай" />
                      </div>
                      <div>
                        <Label>Категория</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electronics">Электроника</SelectItem>
                            <SelectItem value="textile">Текстиль</SelectItem>
                            <SelectItem value="equipment">Оборудование</SelectItem>
                            <SelectItem value="household">Товары для дома</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Контактные данные</Label>
                        <Input placeholder="email@company.com" />
                      </div>
                      <div>
                        <Label>Рейтинг (1-5)</Label>
                        <Input type="number" min="1" max="5" step="0.1" placeholder="4.5" />
                      </div>
                      <div>
                        <Label>Условия оплаты</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите условия" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="prepay">Предоплата 100%</SelectItem>
                            <SelectItem value="5050">50/50</SelectItem>
                            <SelectItem value="3070">30% аванс, 70% по готовности</SelectItem>
                            <SelectItem value="custom">Индивидуальные</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label>Комментарий</Label>
                        <Input placeholder="Дополнительная информация" />
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-[#0EA5E9]">Создать поставщика</Button>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {suppliers.map((supplier) => (
                  <Card key={supplier.id} className="hover-scale">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] text-white p-3 rounded-full">
                            <Icon name="Building2" size={24} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{supplier.name}</CardTitle>
                            <CardDescription>{supplier.country}</CardDescription>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(supplier.status)} text-white`}>{supplier.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Категория:</span>
                          <span className="font-medium">{supplier.category}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Рейтинг:</span>
                          <span className="font-medium flex items-center gap-1">
                            ⭐ {supplier.rating}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Контакт:</span>
                          <span className="font-medium text-xs">{supplier.contact}</span>
                        </div>
                        <Separator />
                        <div className="text-sm">
                          <span className="text-gray-600">Условия оплаты:</span>
                          <p className="font-medium mt-1">{supplier.paymentTerms}</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        <Icon name="Eye" size={16} className="mr-2" />
                        Подробнее
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-[#1A1F2C]">{t.orders}</h2>
                  <p className="text-gray-600">{t.orderManagement}</p>
                </div>
                <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90">
                      <Icon name="Plus" size={20} className="mr-2" />
                      {t.createOrder}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Новый заказ</DialogTitle>
                      <DialogDescription>Создание заказа для клиента</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label>Клиент</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите клиента" />
                          </SelectTrigger>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Поставщик</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите поставщика" />
                          </SelectTrigger>
                          <SelectContent>
                            {suppliers.map((supplier) => (
                              <SelectItem key={supplier.id} value={supplier.id}>
                                {supplier.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Тип услуги</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите услугу" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="purchase">Закуп</SelectItem>
                            <SelectItem value="logistics">Логистика</SelectItem>
                            <SelectItem value="both">Оба</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Способ отправки</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите способ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="auto">Авто</SelectItem>
                            <SelectItem value="rail">ЖД</SelectItem>
                            <SelectItem value="sea">Море</SelectItem>
                            <SelectItem value="container">Контейнер</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label>Оператор заказа</Label>
                        <Input placeholder="ФИО оператора" />
                      </div>
                      <div className="col-span-2">
                        <Label>Комментарий</Label>
                        <Input placeholder="Особенности упаковки, полёты и т.д." />
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-[#0EA5E9]">Создать заказ</Button>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Номер заказа</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Клиент</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Поставщик</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Статус</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Товаров</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Сумма</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Доставка</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Дата</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Действия</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-[#1A1F2C]">{order.id}</td>
                            <td className="px-6 py-4 text-gray-700">{order.clientName}</td>
                            <td className="px-6 py-4 text-gray-700">{order.supplierName}</td>
                            <td className="px-6 py-4">
                              <Badge className={`${getStatusColor(order.status)} text-white`}>{order.status}</Badge>
                            </td>
                            <td className="px-6 py-4 text-gray-700">{order.items} шт</td>
                            <td className="px-6 py-4 font-semibold text-[#1A1F2C]">{formatPrice(order.total)}</td>
                            <td className="px-6 py-4">
                              <Badge variant="outline">{order.shipping}</Badge>
                            </td>
                            <td className="px-6 py-4 text-gray-600 text-sm">{order.date}</td>
                            <td className="px-6 py-4">
                              <Button variant="ghost" size="sm">
                                <Icon name="Eye" size={16} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-[#1A1F2C]">{t.products}</h2>
                  <p className="text-gray-600">{t.productCatalog}</p>
                </div>
                <Button className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90">
                  <Icon name="Plus" size={20} className="mr-2" />
                  {t.addProduct}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="hover-scale">
                    <CardContent className="pt-6">
                      <div className="text-6xl mb-4 text-center">{product.image}</div>
                      <h3 className="text-lg font-semibold text-[#1A1F2C] mb-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">Артикул: {product.sku}</p>
                      <Separator className="mb-4" />
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Цена:</span>
                          <span className="font-semibold">{formatPrice(product.price)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ед. изм.:</span>
                          <span className="font-medium">{product.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Вес:</span>
                          <span className="font-medium">{product.weight} кг</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Материал:</span>
                          <span className="font-medium">{product.material}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        <Icon name="Edit" size={16} className="mr-2" />
                        Редактировать
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'logistics' && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#1A1F2C]">{t.logistics}</h2>
                <p className="text-gray-600">{t.logisticsManagement}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { title: 'На складе в КНР', count: 23, icon: 'Warehouse', color: 'bg-blue-500' },
                  { title: 'В пути', count: 12, icon: 'Truck', color: 'bg-orange-500' },
                  { title: 'Готово к выдаче', count: 8, icon: 'PackageCheck', color: 'bg-green-500' },
                ].map((stat, idx) => (
                  <Card key={idx} className="hover-scale">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className={`${stat.color} text-white p-4 rounded-lg`}>
                          <Icon name={stat.icon} size={28} />
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-[#1A1F2C]">{stat.count}</p>
                          <p className="text-sm text-gray-600">{stat.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Заказы для логистики</CardTitle>
                  <CardDescription>Заказы готовые к отправке</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders
                      .filter((o) => ['На складе в Китае', 'Готов к отправке'].includes(o.status))
                      .map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover-scale">
                          <div className="flex items-center gap-4">
                            <div className="bg-[#0EA5E9] text-white p-3 rounded-lg">
                              <Icon name="Package" size={24} />
                            </div>
                            <div>
                              <p className="font-semibold text-[#1A1F2C]">{order.id}</p>
                              <p className="text-sm text-gray-600">{order.clientName} • {order.supplierName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Способ доставки</p>
                              <p className="font-medium">{order.shipping}</p>
                            </div>
                            <Badge className={`${getStatusColor(order.status)} text-white`}>{order.status}</Badge>
                            <Button size="sm" className="bg-[#0EA5E9]">
                              <Icon name="Send" size={16} className="mr-2" />
                              Отправить
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#1A1F2C]">{t.finance}</h2>
                <p className="text-gray-600">{t.financialAnalytics}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { title: 'Общая выручка', value: formatPrice(3890000), icon: 'TrendingUp', color: 'bg-green-500' },
                  { title: 'Ожидается оплат', value: formatPrice(542000), icon: 'Clock', color: 'bg-yellow-500' },
                  { title: 'Оплачено (месяц)', value: formatPrice(540000), icon: 'CheckCircle', color: 'bg-blue-500' },
                  { title: 'Задолженности', value: formatPrice(87000), icon: 'AlertCircle', color: 'bg-red-500' },
                ].map((stat, idx) => (
                  <Card key={idx} className="hover-scale">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">{stat.title}</p>
                        <div className={`${stat.color} text-white p-2 rounded-lg`}>
                          <Icon name={stat.icon} size={20} />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-[#1A1F2C]">{stat.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Выручка по месяцам</CardTitle>
                  <CardDescription>Динамика поступлений</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#0EA5E9" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Последние платежи</CardTitle>
                  <CardDescription>История поступлений от клиентов</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { client: 'Анна Смирнова', amount: 45000, date: '2024-12-09', status: 'Получено' },
                      { client: 'ООО "ТехноПром"', amount: 128000, date: '2024-12-08', status: 'Получено' },
                      { client: 'Дмитрий Козлов', amount: 32000, date: '2024-12-07', status: 'Ожидается' },
                    ].map((payment, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="bg-[#0EA5E9] text-white p-3 rounded-lg">
                            <Icon name="DollarSign" size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-[#1A1F2C]">{payment.client}</p>
                            <p className="text-sm text-gray-600">{payment.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-bold text-[#1A1F2C]">{formatPrice(payment.amount)}</p>
                          <Badge className={payment.status === 'Получено' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#1A1F2C]">{t.analytics}</h2>
                <p className="text-gray-600">{t.detailedAnalytics}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Топ клиентов по выручке</CardTitle>
                    <CardDescription>За последний месяц</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'ООО "ТехноПром"', revenue: 328000, orders: 8 },
                        { name: 'Анна Смирнова', revenue: 245000, orders: 12 },
                        { name: 'Дмитрий Козлов', revenue: 187000, orders: 6 },
                      ].map((client, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="bg-[#0EA5E9] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                              {idx + 1}
                            </div>
                            <div>
                              <p className="font-semibold text-[#1A1F2C]">{client.name}</p>
                              <p className="text-sm text-gray-600">{client.orders} заказов</p>
                            </div>
                          </div>
                          <p className="font-bold text-[#1A1F2C]">{formatPrice(client.revenue)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Популярные товары</CardTitle>
                    <CardDescription>Наиболее заказываемые позиции</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'Bluetooth наушники TWS', count: 145, icon: '🎧' },
                        { name: 'LED лампа 12W', count: 98, icon: '💡' },
                        { name: 'Постельное белье сатин', count: 76, icon: '🛏️' },
                      ].map((product, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{product.icon}</div>
                            <div>
                              <p className="font-semibold text-[#1A1F2C]">{product.name}</p>
                              <p className="text-sm text-gray-600">Заказано: {product.count} шт</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Эффективность менеджеров</CardTitle>
                  <CardDescription>Статистика работы команды</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { name: 'Иванов И.', orders: 24, revenue: 680000, clients: 12 },
                      { name: 'Петров П.', orders: 18, revenue: 520000, clients: 9 },
                      { name: 'Сидорова С.', orders: 15, revenue: 450000, clients: 8 },
                    ].map((manager, idx) => (
                      <Card key={idx} className="bg-gradient-to-br from-blue-50 to-purple-50">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-[#0EA5E9] text-white w-12 h-12 rounded-full flex items-center justify-center">
                              <Icon name="User" size={24} />
                            </div>
                            <div>
                              <p className="font-semibold text-[#1A1F2C]">{manager.name}</p>
                              <p className="text-sm text-gray-600">Менеджер</p>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Заказов:</span>
                              <span className="font-semibold">{manager.orders}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Выручка:</span>
                              <span className="font-semibold">{formatPrice(manager.revenue)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Клиентов:</span>
                              <span className="font-semibold">{manager.clients}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
