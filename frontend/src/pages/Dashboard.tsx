import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { fetchSales } from '../services/api';
import { DollarSign, ShoppingBag, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
    const [sales, setSales] = useState<any[]>([]);

    useEffect(() => {
        fetchSales().then(setSales);
    }, []);

    // Mock metrics (replace with real data if available)
    const metrics = [
        { title: 'Ventas Hoy', value: formatCurrency(150000), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
        { title: 'Pedidos', value: '12', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Pendientes', value: '3', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
        { title: 'Ticket Promedio', value: formatCurrency(12500), icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Resumen de actividad y ventas recientes</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => (
                    <Card key={index}>
                        <CardContent className="flex items-center p-6">
                            <div className={`${metric.bg} p-4 rounded-full mr-4`}>
                                <metric.icon className={`h-6 w-6 ${metric.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                                <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Sales & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Sales Table */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Ventas Recientes</CardTitle>
                        <Link to="/reportes">
                            <Button variant="outline" size="sm">
                                Ver todas
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left border-b border-gray-200">
                                        <th className="pb-3 font-medium text-gray-600">ID</th>
                                        <th className="pb-3 font-medium text-gray-600">Fecha</th>
                                        <th className="pb-3 font-medium text-gray-600">Cliente</th>
                                        <th className="pb-3 font-medium text-gray-600">Total</th>
                                        <th className="pb-3 font-medium text-gray-600">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {sales.slice(0, 5).map((sale) => (
                                        <tr key={sale.id} className="group hover:bg-gray-50 transition-colors">
                                            <td className="py-4 font-medium text-gray-900">#{sale.id.slice(0, 8)}</td>
                                            <td className="py-4 text-gray-600">{new Date(sale.createdAt).toLocaleDateString()}</td>
                                            <td className="py-4 text-gray-600">Cliente General</td>
                                            <td className="py-4 font-medium text-gray-900">{formatCurrency(sale.total)}</td>
                                            <td className="py-4">
                                                <Badge variant={sale.status === 'COMPLETED' ? 'success' : 'warning'}>
                                                    {sale.status === 'COMPLETED' ? 'Completado' : 'Pendiente'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                    {sales.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-gray-500">
                                                No hay ventas recientes
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Acciones Rápidas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Link to="/nueva-venta" className="w-full">
                                <Button className="w-full justify-between">
                                    Nueva Venta
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Button variant="outline" className="w-full justify-between">
                                Consultar Stock
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="w-full justify-between">
                                Generar Cierre
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
