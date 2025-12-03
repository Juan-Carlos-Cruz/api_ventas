import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
    }).format(value);
};

export const calculateTax = (subtotal: number) => {
    return subtotal * 0.19;
};

export const calculateTotal = (subtotal: number, tax: number) => {
    return subtotal + tax;
};
