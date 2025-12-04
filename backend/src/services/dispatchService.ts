import axios from 'axios';

const DISPATCH_API_URL = process.env.DISPATCH_API_URL || 'http://localhost:3002';

/**
 * Interface for delivery availability response
 */
export interface DeliveryAvailability {
    available: boolean;
    estimatedDeliveryDate: string;
    deliveryDays: number;
}

/**
 * Interface for dispatch creation request
 */
export interface CreateDispatchRequest {
    saleId: string;
    customerName: string;
    customerPhone?: string;
    customerAddress: string;
    customerEmail: string;
    deliveryDate: string;
    items: Array<{
        productId: string;
        quantity: number;
        description?: string;
    }>;
}

/**
 * Interface for dispatch creation response
 */
export interface CreateDispatchResponse {
    dispatchId: string;
    status: string;
    trackingNumber?: string;
    estimatedDeliveryDate: string;
}

/**
 * Check delivery availability for a given address
 * 
 * @param address - Customer delivery address
 * @returns Delivery availability information
 */
export const checkDeliveryAvailability = async (address: string): Promise<DeliveryAvailability> => {
    try {
        const response = await axios.post(`${DISPATCH_API_URL}/api/dispatch/check-availability`, {
            address,
        });

        return response.data;
    } catch (error) {
        console.error('Error checking delivery availability:', error);

        // Fallback: return mock data if dispatch API is not available
        const estimatedDate = new Date();
        estimatedDate.setDate(estimatedDate.getDate() + 3); // 3 days from now

        return {
            available: true,
            estimatedDeliveryDate: estimatedDate.toISOString(),
            deliveryDays: 3,
        };
    }
};

/**
 * Create a dispatch record in the dispatch system
 * 
 * @param dispatchData - Dispatch creation data
 * @returns Dispatch creation response with tracking info
 */
export const createDispatch = async (dispatchData: CreateDispatchRequest): Promise<CreateDispatchResponse> => {
    try {
        // Transform data to match dispatch team's expected format
        const dispatchPayload = {
            id_venta: dispatchData.saleId,
            cliente_nombre: dispatchData.customerName,
            cliente_telefono: dispatchData.customerPhone || dispatchData.customerEmail,
            direccion_entrega: dispatchData.customerAddress,
            productos: dispatchData.items.map(item => ({
                id_producto: item.productId,
                nombre: item.description || item.productId,
                cantidad: item.quantity
            })),
            fecha_estimada_envio: new Date(dispatchData.deliveryDate).toISOString().split('T')[0] // Format: YYYY-MM-DD
        };

        const response = await axios.post(`${DISPATCH_API_URL}/api/despachos`, dispatchPayload);

        return {
            dispatchId: response.data.id_despacho || `DISPATCH-${Date.now()}`,
            status: response.data.estado || 'PENDING',
            trackingNumber: response.data.numero_seguimiento || `TRK-${Date.now()}`,
            estimatedDeliveryDate: dispatchData.deliveryDate,
        };
    } catch (error) {
        console.error('Error creating dispatch:', error);

        // Fallback: return mock data if dispatch API is not available
        const estimatedDate = new Date(dispatchData.deliveryDate);

        return {
            dispatchId: `DISPATCH-${Date.now()}`,
            status: 'PENDING',
            trackingNumber: `TRK-${Date.now()}`,
            estimatedDeliveryDate: estimatedDate.toISOString(),
        };
    }
};

/**
 * Get dispatch status by dispatch ID
 * 
 * @param dispatchId - Dispatch ID to query
 * @returns Dispatch status information
 */
export const getDispatchStatus = async (dispatchId: string) => {
    try {
        const response = await axios.get(`${DISPATCH_API_URL}/api/dispatch/${dispatchId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting dispatch status:', error);
        return null;
    }
};
