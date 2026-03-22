import { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Users as UsersIcon, 
  ShoppingCart, 
  Settings as SettingsIcon,
  ArrowLeft,
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  DollarSign,
  LogOut,
  User,
  ExternalLink,
  CreditCard,
  FileText
} from 'lucide-react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

type Tab = 'overview' | 'categories' | 'products' | 'users' | 'orders' | 'settings';

export default function AdminDashboard({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Categories state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Products state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productFormData, setProductFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
    description: '',
    image: 'https://picsum.photos/seed/firewood/400/300'
  });

  // Real-time listeners
  useEffect(() => {
    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubOrders = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubSettings = onSnapshot(doc(db, 'settings', 'site'), (doc) => {
      if (doc.exists()) setSettings(doc.data());
    });

    setLoading(false);
    return () => {
      unsubCategories();
      unsubProducts();
      unsubUsers();
      unsubOrders();
      unsubSettings();
    };
  }, []);

  const handleLogout = () => {
    signOut(auth);
    onBack();
  };

  const generateInvoice = (order: any, type: 'invoice' | 'receipt' = 'invoice') => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const titleText = type === 'receipt' ? 'RECEIPT' : 'INVOICE';
    const subtitleText = type === 'receipt' ? 'Payment Receipt' : 'Official Invoice';
    const buttonText = type === 'receipt' ? '🖨️ Print Receipt' : '🖨️ Print Invoice';
    const statusText = type === 'receipt' ? 'PAID' : order.status.toUpperCase();

    const html = `
      <html>
        <head>
          <title>${titleText} - Order #${order.id.slice(-8)}</title>
          <style>
            :root {
              --primary: #78350f;
              --primary-light: #fef3c7;
              --text-main: #1c1917;
              --text-muted: #78716c;
              --border: #e7e5e4;
            }
            body { 
              font-family: 'Inter', system-ui, sans-serif; 
              padding: 40px; 
              color: var(--text-main); 
              max-width: 800px; 
              margin: 0 auto; 
            }
            .header { 
              display: flex; 
              justify-content: space-between; 
              align-items: flex-start; 
              margin-bottom: 40px; 
              padding-bottom: 20px; 
              border-bottom: 3px solid var(--primary); 
            }
            .company-name { 
              font-size: 36px; 
              font-weight: 900; 
              color: var(--primary); 
              margin: 0; 
              letter-spacing: -0.02em; 
            }
            .invoice-title { 
              font-size: 16px; 
              text-transform: uppercase; 
              letter-spacing: 0.1em; 
              color: var(--text-muted); 
              margin-top: 8px; 
            }
            .order-info { text-align: right; }
            .order-info p { margin: 4px 0; }
            .grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 40px; 
              margin-bottom: 40px; 
            }
            .section-title { 
              font-size: 12px; 
              font-weight: bold; 
              text-transform: uppercase; 
              letter-spacing: 0.1em; 
              color: var(--primary); 
              margin-bottom: 12px; 
              border-bottom: 1px solid var(--border); 
              padding-bottom: 8px; 
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 40px; 
            }
            th, td { 
              padding: 16px 12px; 
              text-align: left; 
              border-bottom: 1px solid var(--border); 
            }
            th { 
              font-size: 12px; 
              text-transform: uppercase; 
              color: var(--text-muted); 
              background-color: var(--primary-light); 
              font-weight: bold; 
            }
            .text-right { text-align: right; }
            .totals { 
              width: 50%; 
              margin-left: auto; 
              background: var(--primary-light); 
              padding: 24px; 
              border-radius: 12px; 
            }
            .total-row { 
              display: flex; 
              justify-content: space-between; 
              padding: 8px 0; 
            }
            .total-row.grand-total { 
              font-weight: 900; 
              font-size: 24px; 
              color: var(--primary); 
              border-top: 2px solid var(--primary); 
              margin-top: 12px; 
              padding-top: 16px; 
            }
            
            /* Editable field styling */
            .editable { 
              padding: 12px; 
              border: 2px dashed #fbbf24; 
              background-color: #fffbeb; 
              border-radius: 8px; 
              transition: all 0.2s;
              min-height: 1.5em;
              line-height: 1.6;
            }
            .editable:focus { 
              outline: none; 
              border-color: var(--primary); 
              background-color: #fff; 
              box-shadow: 0 0 0 4px var(--primary-light); 
            }
            .editable-label { 
              font-size: 11px; 
              color: #d97706; 
              text-transform: uppercase; 
              letter-spacing: 0.05em; 
              margin-bottom: 8px; 
              display: block; 
              font-weight: bold;
            }

            /* Print Button */
            .print-btn {
              position: fixed;
              bottom: 40px;
              right: 40px;
              background-color: var(--primary);
              color: white;
              border: none;
              padding: 16px 32px;
              font-size: 16px;
              font-weight: bold;
              border-radius: 99px;
              cursor: pointer;
              box-shadow: 0 10px 25px -5px rgba(120, 53, 15, 0.4);
              transition: transform 0.2s, box-shadow 0.2s;
              z-index: 100;
            }
            .print-btn:hover { 
              transform: translateY(-2px); 
              box-shadow: 0 15px 30px -5px rgba(120, 53, 15, 0.5); 
            }

            @media print {
              body { padding: 0; max-width: 100%; }
              .print-btn { display: none; }
              .editable { border: none !important; background: transparent !important; padding: 0 !important; }
              .editable-label { display: none !important; }
              .totals { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <button class="print-btn no-print" onclick="window.print()">${buttonText}</button>
          
          <div class="header">
            <div>
              <h1 class="company-name">Premier Firewood Co.</h1>
              <div class="invoice-title">${subtitleText}</div>
            </div>
            <div class="order-info">
              <p><strong>Order #:</strong> ${order.id.slice(-8).toUpperCase()}</p>
              <p><strong>Date:</strong> ${new Date(order.createdAt?.toDate()).toLocaleDateString()}</p>
              <p><strong>Status:</strong> ${statusText}</p>
            </div>
          </div>

          <div class="grid">
            <div>
              <div class="section-title">Bill To</div>
              <p><strong>${order.deliveryInfo?.firstName} ${order.deliveryInfo?.lastName}</strong></p>
              <p>${order.deliveryInfo?.email}</p>
              <p>${order.deliveryInfo?.phone}</p>
            </div>
            <div>
              <div class="section-title">Ship To</div>
              <p>${order.deliveryInfo?.address}</p>
              <p>${order.deliveryInfo?.city}, ${order.deliveryInfo?.state} ${order.deliveryInfo?.zip}</p>
              <p><strong>Type:</strong> ${order.deliveryInfo?.deliveryType}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items?.map((item: any) => `
                <tr>
                  <td><strong>${item.name}</strong></td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">$${item.price.toFixed(2)}</td>
                  <td class="text-right">$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 40px;">
            <div style="flex: 1;">
              <div class="section-title">Payment Information</div>
              <div class="no-print editable-label">Click below to edit payment details before printing:</div>
              <div class="editable" contenteditable="true">
                <strong>Payment Method:</strong> ${order.paymentMethod ? order.paymentMethod.toUpperCase() : 'CREDIT CARD'}<br/>
                <strong>Account Name:</strong> [Enter Account Name]<br/>
                <strong>Account Number/Handle:</strong> [Enter Account Number/Handle]<br/>
                <strong>Email:</strong> [Enter Email]<br/>
                <strong>Phone:</strong> [Enter Phone]
              </div>

              <div style="margin-top: 24px;">
                <div class="section-title">Payment Instructions</div>
                <div class="no-print editable-label">Click below to edit instructions before printing:</div>
                <div class="editable" contenteditable="true" style="font-style: italic; color: var(--text-muted);">
                  Send payment to this CashApp tag: <strong>$YourCashAppTag</strong> and contact support with a screenshot of payment.
                </div>
              </div>
              
              ${order.deliveryInfo?.notes ? `
                <div style="margin-top: 32px;">
                  <div class="section-title">Customer Notes</div>
                  <p style="color: var(--text-muted); font-style: italic;">"${order.deliveryInfo.notes}"</p>
                </div>
              ` : ''}
            </div>

            <div class="totals">
              <div class="total-row">
                <span>Subtotal</span>
                <span>$${(order.subtotal || order.items?.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0) || 0).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Shipping</span>
                <span>$${(order.shipping || 25).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Tax (7%)</span>
                <span>$${(order.tax || (order.items?.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0) * 0.07) || 0).toFixed(2)}</span>
              </div>
              <div class="total-row grand-total">
                <span>Total Due</span>
                <span>$${order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
  };

  const renderOrderDetails = (order: any) => (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 mt-4">
        <div className="space-y-4">
          <h4 className="font-bold text-stone-900 uppercase tracking-widest text-xs">Customer Information</h4>
          <div className="bg-white p-6 rounded-2xl text-sm space-y-3 shadow-sm border border-stone-100">
            <p className="flex justify-between"><span className="text-stone-500">Name:</span> <span className="font-bold text-stone-900">{order.deliveryInfo?.firstName} {order.deliveryInfo?.lastName}</span></p>
            <p className="flex justify-between"><span className="text-stone-500">Email:</span> <span className="font-bold text-stone-900">{order.deliveryInfo?.email}</span></p>
            <p className="flex justify-between"><span className="text-stone-500">Phone:</span> <span className="font-bold text-stone-900">{order.deliveryInfo?.phone}</span></p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-bold text-stone-900 uppercase tracking-widest text-xs">Delivery Information</h4>
          <div className="bg-white p-6 rounded-2xl text-sm space-y-3 shadow-sm border border-stone-100">
            <p className="flex justify-between"><span className="text-stone-500">Type:</span> <span className="font-bold text-stone-900 capitalize">{order.deliveryInfo?.deliveryType}</span></p>
            <p className="flex justify-between"><span className="text-stone-500">Address:</span> <span className="font-bold text-stone-900 text-right">{order.deliveryInfo?.address}<br/>{order.deliveryInfo?.city}, {order.deliveryInfo?.state} {order.deliveryInfo?.zip}</span></p>
            {order.deliveryInfo?.notes && (
              <div className="pt-3 border-t border-stone-100">
                <span className="text-stone-500 block mb-1">Notes:</span>
                <p className="font-medium text-stone-900">{order.deliveryInfo?.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <h4 className="font-bold text-stone-900 uppercase tracking-widest text-xs">Order Items & Summary</h4>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <div className="divide-y divide-stone-100 mb-6">
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center py-4 first:pt-0">
                <div>
                  <p className="font-bold text-stone-900 text-lg">{item.name}</p>
                  <p className="text-sm text-stone-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                </div>
                <p className="font-bold text-stone-900 text-lg">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          
          <div className="border-t border-stone-100 pt-6 space-y-3 text-base">
            <div className="flex justify-between text-stone-500">
              <p>Subtotal</p>
              <p className="font-bold text-stone-900">${(order.subtotal || order.items?.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0) || 0).toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-stone-500">
              <p>Shipping</p>
              <p className="font-bold text-stone-900">${(order.shipping || 25).toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-stone-500">
              <p>Tax</p>
              <p className="font-bold text-stone-900">${(order.tax || (order.items?.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0) * 0.07) || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-stone-200">
        <div>
          <p className="text-stone-500 text-sm mb-1">Payment Method</p>
          <div className="flex items-center gap-2 font-bold text-stone-900 capitalize">
            <CreditCard size={20} className="text-stone-400" />
            {order.paymentMethod || 'card'}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => generateInvoice(order, 'invoice')}
              className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors"
            >
              <FileText size={16} />
              Invoice
            </button>
            <button
              onClick={() => generateInvoice(order, 'receipt')}
              className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors"
            >
              <CheckCircle2 size={16} />
              Receipt
            </button>
          </div>
          <div className="text-right">
            <p className="text-stone-500 text-sm mb-1">Total Amount</p>
            <p className="text-4xl font-serif font-bold text-amber-900">${order.total?.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderOverview = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    
    const chartData = [
      { name: 'Mon', sales: 400 },
      { name: 'Tue', sales: 300 },
      { name: 'Wed', sales: 600 },
      { name: 'Thu', sales: 800 },
      { name: 'Fri', sales: 500 },
      { name: 'Sat', sales: 900 },
      { name: 'Sun', sales: 700 },
    ];

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-50 text-amber-900 rounded-2xl">
                <DollarSign size={24} />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+12.5%</span>
            </div>
            <p className="text-sm font-bold text-stone-400 uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-3xl font-serif font-bold text-stone-900">${totalRevenue.toLocaleString()}</h3>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 text-blue-900 rounded-2xl">
                <ShoppingCart size={24} />
              </div>
              <span className="text-xs font-bold text-stone-400 bg-stone-50 px-2 py-1 rounded-lg">Today</span>
            </div>
            <p className="text-sm font-bold text-stone-400 uppercase tracking-wider">Orders</p>
            <h3 className="text-3xl font-serif font-bold text-stone-900">{orders.length}</h3>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 text-purple-900 rounded-2xl">
                <UsersIcon size={24} />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+4</span>
            </div>
            <p className="text-sm font-bold text-stone-400 uppercase tracking-wider">Customers</p>
            <h3 className="text-3xl font-serif font-bold text-stone-900">{users.length}</h3>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 text-orange-900 rounded-2xl">
                <Clock size={24} />
              </div>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">Action Required</span>
            </div>
            <p className="text-sm font-bold text-stone-400 uppercase tracking-wider">Pending Orders</p>
            <h3 className="text-3xl font-serif font-bold text-stone-900">{pendingOrders}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
            <h4 className="text-xl font-serif font-bold text-stone-900 mb-8">Sales Overview</h4>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1c1917', border: 'none', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="sales" fill="#78350f" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
            <h4 className="text-xl font-serif font-bold text-stone-900 mb-8">Recent Orders</h4>
            <div className="space-y-4">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="bg-stone-50 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-stone-400 border border-stone-100">
                        <ShoppingCart size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-900">Order #{order.id.slice(-4)}</p>
                        <p className="text-xs text-stone-400">{new Date(order.createdAt?.toDate()).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="text-sm font-bold text-stone-900">${order.total}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg ${
                          order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-stone-100 text-stone-700'
                        }`}>
                          {order.status}
                        </span>
                        <button 
                          onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                          className="text-stone-400 hover:text-amber-900 font-bold text-[10px] uppercase tracking-widest"
                        >
                          {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {selectedOrder?.id === order.id && (
                      <div className="p-6 border-t border-stone-100 bg-stone-50/50">
                        {renderOrderDetails(order)}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCategories = () => {
    const handleAdd = async () => {
      if (!newCategoryName) return;
      await addDoc(collection(db, 'categories'), {
        name: newCategoryName,
        createdAt: serverTimestamp()
      });
      setNewCategoryName('');
      setIsAddingCategory(false);
    };

    const handleDelete = async (id: string) => {
      if (confirm('Are you sure you want to delete this category?')) {
        await deleteDoc(doc(db, 'categories', id));
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-serif font-bold text-stone-900">Categories</h3>
          <button 
            onClick={() => setIsAddingCategory(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>

        <AnimatePresence>
          {isAddingCategory && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex items-center gap-4"
            >
              <input 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category Name"
                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-900"
              />
              <button onClick={handleAdd} className="btn-primary">Save</button>
              <button onClick={() => setIsAddingCategory(false)} className="text-stone-400 hover:text-stone-600">Cancel</button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-900 rounded-2xl flex items-center justify-center">
                  <Tags size={24} />
                </div>
                <button onClick={() => handleDelete(cat.id)} className="text-stone-300 hover:text-red-600 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
              <h4 className="text-lg font-bold text-stone-900">{cat.name}</h4>
              <p className="text-sm text-stone-400">0 Products</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProducts = () => {
    const handleAdd = async () => {
      if (!productFormData.name || !productFormData.price || !productFormData.categoryId) return;
      await addDoc(collection(db, 'products'), {
        ...productFormData,
        price: parseFloat(productFormData.price),
        createdAt: serverTimestamp()
      });
      setIsAddingProduct(false);
      setProductFormData({
        name: '',
        price: '',
        categoryId: '',
        description: '',
        image: 'https://picsum.photos/seed/firewood/400/300'
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-serif font-bold text-stone-900">Products</h3>
          <button onClick={() => setIsAddingProduct(true)} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {isAddingProduct && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input 
                placeholder="Product Name"
                value={productFormData.name}
                className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                onChange={e => setProductFormData({...productFormData, name: e.target.value})}
              />
              <input 
                placeholder="Price"
                type="number"
                value={productFormData.price}
                className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                onChange={e => setProductFormData({...productFormData, price: e.target.value})}
              />
              <select 
                className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                value={productFormData.categoryId}
                onChange={e => setProductFormData({...productFormData, categoryId: e.target.value})}
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input 
                placeholder="Image URL"
                value={productFormData.image}
                className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                onChange={e => setProductFormData({...productFormData, image: e.target.value})}
              />
            </div>
            <textarea 
              placeholder="Description"
              value={productFormData.description}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 h-32"
              onChange={e => setProductFormData({...productFormData, description: e.target.value})}
            />
            <div className="flex gap-4">
              <button onClick={handleAdd} className="btn-primary">Save Product</button>
              <button onClick={() => setIsAddingProduct(false)} className="text-stone-400">Cancel</button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-stone-400">Product</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-stone-400">Category</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-stone-400">Price</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-stone-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <img src={product.image} className="w-12 h-12 rounded-xl object-cover" />
                      <span className="font-bold text-stone-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-stone-600">
                    {categories.find(c => c.id === product.categoryId)?.name || 'Uncategorized'}
                  </td>
                  <td className="px-8 py-4 font-bold text-stone-900">${product.price}</td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-stone-400 hover:text-amber-900"><Edit size={18} /></button>
                      <button onClick={async () => await deleteDoc(doc(db, 'products', product.id))} className="p-2 text-stone-400 hover:text-red-600"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderOrders = () => {
    const updateStatus = async (id: string, status: string) => {
      await updateDoc(doc(db, 'orders', id), { status });
    };

    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-serif font-bold text-stone-900">Orders</h3>
        <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-stone-400">Order ID</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-stone-400">Customer</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-stone-400">Status</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-stone-400">Total</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-stone-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map(order => (
                <Fragment key={order.id}>
                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-8 py-4 font-mono text-xs text-stone-500">#{order.id.slice(-8)}</td>
                    <td className="px-8 py-4">
                      <p className="font-bold text-stone-900">{order.deliveryInfo?.firstName} {order.deliveryInfo?.lastName}</p>
                      <p className="text-xs text-stone-400">{order.deliveryInfo?.email}</p>
                    </td>
                    <td className="px-8 py-4">
                      <select 
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border-none focus:ring-0 cursor-pointer ${
                          order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-stone-100 text-stone-700'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-8 py-4 font-bold text-stone-900">${order.total}</td>
                    <td className="px-8 py-4">
                      <button 
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        className="text-stone-400 hover:text-amber-900 font-bold text-xs uppercase tracking-widest"
                      >
                        {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </td>
                  </tr>
                  <AnimatePresence>
                    {selectedOrder?.id === order.id && (
                      <tr>
                        <td colSpan={5} className="p-0">
                          <div className="bg-stone-50/50 border-y border-stone-100 px-8 py-6">
                            {renderOrderDetails(order)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderUsers = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-serif font-bold text-stone-900">Users</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
            <div key={user.id} className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                <User size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-stone-900">{user.displayName || 'Anonymous'}</h4>
                <p className="text-xs text-stone-400">{user.email}</p>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg ${
                user.role === 'admin' ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-500'
              }`}>
                {user.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-serif font-bold text-stone-900">Settings</h3>
        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm max-w-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Business Name</label>
            <input className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3" defaultValue="Premier Firewood Co." />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Contact Email</label>
              <input className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3" defaultValue="contact@premierfirewood.com" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Contact Phone</label>
              <input className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3" defaultValue="(555) 123-4567" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Delivery Address</label>
            <textarea className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 h-24" defaultValue="123 Firewood Lane, Timber Valley, CT 06830" />
          </div>
          <button className="btn-primary">Save Changes</button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-stone-100 flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-amber-900 rounded-xl flex items-center justify-center text-white">
              <LayoutDashboard size={24} />
            </div>
            <span className="font-serif font-bold text-stone-900">ADMIN PANEL</span>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === 'overview' ? 'bg-amber-900 text-white shadow-lg shadow-amber-900/20' : 'text-stone-400 hover:bg-stone-50 hover:text-stone-900'}`}
            >
              <LayoutDashboard size={20} />
              <span className="text-sm font-bold">Overview</span>
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === 'categories' ? 'bg-amber-900 text-white shadow-lg shadow-amber-900/20' : 'text-stone-400 hover:bg-stone-50 hover:text-stone-900'}`}
            >
              <Tags size={20} />
              <span className="text-sm font-bold">Categories</span>
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === 'products' ? 'bg-amber-900 text-white shadow-lg shadow-amber-900/20' : 'text-stone-400 hover:bg-stone-50 hover:text-stone-900'}`}
            >
              <Package size={20} />
              <span className="text-sm font-bold">Products</span>
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === 'orders' ? 'bg-amber-900 text-white shadow-lg shadow-amber-900/20' : 'text-stone-400 hover:bg-stone-50 hover:text-stone-900'}`}
            >
              <ShoppingCart size={20} />
              <span className="text-sm font-bold">Orders</span>
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === 'users' ? 'bg-amber-900 text-white shadow-lg shadow-amber-900/20' : 'text-stone-400 hover:bg-stone-50 hover:text-stone-900'}`}
            >
              <UsersIcon size={20} />
              <span className="text-sm font-bold">Users</span>
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === 'settings' ? 'bg-amber-900 text-white shadow-lg shadow-amber-900/20' : 'text-stone-400 hover:bg-stone-50 hover:text-stone-900'}`}
            >
              <SettingsIcon size={20} />
              <span className="text-sm font-bold">Settings</span>
            </button>
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-stone-100">
          <button 
            onClick={onBack}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-stone-400 hover:bg-stone-50 hover:text-stone-900 transition-all mb-2"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-bold">Back to Site</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            <span className="text-sm font-bold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-serif font-bold text-stone-900 capitalize">{activeTab}</h2>
            <p className="text-stone-400">Manage your firewood business operations</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
              <input 
                placeholder="Search..."
                className="bg-white border border-stone-100 rounded-full pl-12 pr-6 py-3 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-900 transition-all"
              />
            </div>
          </div>
        </header>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'categories' && renderCategories()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'settings' && renderSettings()}
      </main>
    </div>
  );
}
