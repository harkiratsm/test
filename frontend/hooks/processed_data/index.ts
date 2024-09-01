import { axios_api } from "@/libs/utils";

export const getCategories = async () => {
    return await axios_api.get('/processed_data');
}

export const getReimbursements = async () => {
    return await axios_api.get('/processed_data/reimbursements');
}

export const getTransactions = async () => {
    return await axios_api.get('/processed_data/transactions');
}

export const getBlankOrders = async () => {
    return await axios_api.get('/processed_data/blank_orders');
}

export const getReturns = async () => {
    return await axios_api.get('/processed_data/returns');
}

export const getTolerances = async () => {
    return await axios_api.get('/processed_data/tolerance_breached');
}

export const getNegativePayouts = async () => {
    return await axios_api.get('/processed_data/negative_payouts');
}

export const getPaymentPending = async () => {
    return await axios_api.get('/processed_data/payment_pending');
}