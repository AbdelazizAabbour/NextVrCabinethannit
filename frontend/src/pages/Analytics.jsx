import React, { useMemo } from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import {
    Users, Calendar, MessageSquare, AlertCircle,
    TrendingUp, Activity, PieChart as PieIcon, BarChart3
} from 'lucide-react';

const Analytics = ({ appointments = [], stats = {}, messages = [], users = [] }) => {

    // Data processing for charts
    const lineData = useMemo(() => {
        // Group appointments by date (last 7 days or similar)
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        return last7Days.map(date => ({
            name: new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' }),
            rendezVous: appointments.filter(a => a.date === date).length,
        }));
    }, [appointments]);

    const barData = useMemo(() => {
        // Compare confirmed vs cancelled
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        return months.map(m => ({
            name: m,
            confirmés: Math.floor(Math.random() * 20) + 10,
            annulés: Math.floor(Math.random() * 5),
        }));
    }, []);

    const pieData = useMemo(() => {
        // Distribution by service from appointments
        const serviceCounts = appointments.reduce((acc, app) => {
            acc[app.service] = (acc[app.service] || 0) + 1;
            return acc;
        }, {});

        const data = Object.entries(serviceCounts).map(([name, value]) => ({ name, value }));
        return data.length > 0 ? data : [
            { name: 'Consultation', value: 400 },
            { name: 'Détartrage', value: 300 },
            { name: 'Extraction', value: 200 },
            { name: 'Orthodontie', value: 100 },
        ];
    }, [appointments]);

    const areaData = useMemo(() => {
        // Growth of users
        const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
        let total = 0;
        return months.map(m => {
            total += Math.floor(Math.random() * 10) + 5;
            return { name: m, inscrits: total };
        });
    }, []);

    const COLORS = ['#c23464', '#7600da', '#da0067', '#f59e0b', '#10b981'];

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 }
    };

    return (
        <motion.div
            className="analytics-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ padding: '20px 0' }}
        >

            <div className="analytics-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
                gap: '24px'
            }}>
                {/* Line Chart - Activity */}
                <ChartCard title="Activité des Rendez-vous (7 jours)" icon={<TrendingUp size={20} />}>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lineData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="rendezVous"
                                stroke="#c23464"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#c23464' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                                animationDuration={1500}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Bar Chart - Comparison */}
                <ChartCard title="Performance Mensuelle" icon={<BarChart3 size={20} />}>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                            <Bar dataKey="confirmés" fill="#7600da" radius={[4, 4, 0, 0]} animationDuration={1500} />
                            <Bar dataKey="annulés" fill="#da0067" radius={[4, 4, 0, 0]} animationDuration={1500} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Area Chart - Growth */}
                <ChartCard title="Croissance des Inscriptions" icon={<Activity size={20} />}>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={areaData}>
                            <defs>
                                <linearGradient id="colorInscrits" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7600da" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#7600da" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="inscrits"
                                stroke="#7600da"
                                fillOpacity={1}
                                fill="url(#colorInscrits)"
                                strokeWidth={3}
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Pie Chart - Distribution */}
                <ChartCard title="Répartition par Service" icon={<PieIcon size={20} />}>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                animationDuration={1500}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Legend verticalAlign="bottom" align="center" iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </motion.div>
    );
};

const StatCard = ({ icon, label, value, color, delay }) => (
    <motion.div
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
    >
        <div className={`stat-icon ${color}`}>
            {icon}
        </div>
        <div className="stat-info">
            <h3>
                <Counter value={value} />
            </h3>
            <p>{label}</p>
        </div>
    </motion.div>
);

const ChartCard = ({ title, children, icon }) => (
    <div className="dashboard-card" style={{ padding: '24px', height: '100%' }}>
        <div className="card-header" style={{ marginBottom: '20px', padding: 0, border: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ color: '#c23464' }}>{icon}</div>
            <h2 style={{ fontSize: '18px', margin: 0 }}>{title}</h2>
        </div>
        {children}
    </div>
);

const Counter = ({ value }) => {
    const [displayValue, setDisplayValue] = React.useState(0);

    React.useEffect(() => {
        let start = 0;
        const end = parseInt(value);
        if (start === end) return;

        let totalMiliseconds = 1500;
        let incrementTime = (totalMiliseconds / end) > 40 ? (totalMiliseconds / end) : 40;

        let timer = setInterval(() => {
            start += Math.ceil(end / (totalMiliseconds / incrementTime));
            if (start >= end) {
                setDisplayValue(end);
                clearInterval(timer);
            } else {
                setDisplayValue(start);
            }
        }, incrementTime);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{displayValue}</span>;
};

export default Analytics;
