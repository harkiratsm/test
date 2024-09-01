// we need dashboard, chat, integrations, Purchase Order, Logs, Configure Workflows, Vendors, Pending Approval, Train Agents 

import { orderColumns, ToleranceColumns } from "@/components/table-columns";
import { getNegativePayouts, getPaymentPending, getReturns, getTolerances, getTransactions } from "@/hooks";
import { NavItem } from "@/types";

export const navItems: NavItem[] =  [
    {
        title : "Dashboard",
        icon : "dashboard",
        href : "/dashboard",
        label : "Dashboard"
    },
    {
        title : "Chat",
        icon : "chat",
        href : "/chat",
        label : "Chat",
        disable: true 
    },
    {
        title : "Integrations",
        icon : "integrations",
        href : "/integrations",
        label : "Integrations",
        disable: true 
    },
    {
        title : "Purchase Order",
        icon : "purchaseOrder",
        href : "/purchase-order",
        label : "Purchase Order",
        disable: true 
    },
    {
        title : "Logs",
        icon : "logs",
        href : "/logs",
        label : "Logs",
        disable: true 
    },
    {
        title : "Configure Workflows",
        icon : "configure",
        href : "/configure-workflows",
        label : "Configure Workflows",
        disable: true
    },
    {
        title : "Vendors",
        icon : "vendors",
        href : "/vendors",
        label : "Vendors",
        disable: true 
    },
    {
        title : "Pending Approval",
        icon : "pending",
        href : "/pending-approval",
        label : "Pending Approval",
        disable: true 
    },
    {
        title : "Train Agents",
        icon : "train",
        href : "/train-agents",
        label : "Train Agents",
        disable: true 
    }
]

interface activeTabs {
    [key: string]: string;
}
  
export const activeTabs: activeTabs = {
"Order & Payment Received": "order_payment",
"Tolerance rate breached": "tolerance_breached",
"Negative Payout": "negative_payouts",
"Payment Pending": "payment_pending",
"Return": "returns",
}


interface View {
    [key: string]: {
        title: string;
        columns: any;
        filterColumn: string;
        fetchData: () => any;
        filterPlaceholder: string;
    }
}

export const views: View = {
    order_payment : {
      title: 'Orders',
      columns: orderColumns,
      filterColumn: 'order_id',
      fetchData: () => getTransactions(),
      filterPlaceholder: 'Filter by Order ID'
    },
    tolerance_breached: {
      title: 'Tolerance',
      columns: ToleranceColumns,
      filterColumn: 'order_id',
      fetchData: () => getTolerances(),
      filterPlaceholder: 'Filter by Order ID'
    },
    negative_payouts: {
      title: 'Negative Payouts',
      columns: orderColumns,
      filterColumn: 'order_id',
      fetchData: () => getNegativePayouts(),
      filterPlaceholder: 'Filter by Order ID'
    },
    payment_pending: {
      title: 'Payment Pending',
      columns: orderColumns,
      filterColumn: 'order_id',
      fetchData: () => getPaymentPending(),
      filterPlaceholder: 'Filter by Order ID'
    },
    returns:{
      title: 'Returns',
      columns: orderColumns,
      fetchData: () => getReturns(),
      filterColumn: 'order_id',
      filterPlaceholder: 'Filter by Order ID'
    }
  }