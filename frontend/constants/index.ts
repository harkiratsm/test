// we need dashboard, chat, integrations, Purchase Order, Logs, Configure Workflows, Vendors, Pending Approval, Train Agents 

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
        disable: true // Added disable property
    },
    {
        title : "Integrations",
        icon : "integrations",
        href : "/integrations",
        label : "Integrations",
        disable: true // Added disable property
    },
    {
        title : "Purchase Order",
        icon : "purchaseOrder",
        href : "/purchase-order",
        label : "Purchase Order",
        disable: true // Added disable property
    },
    {
        title : "Logs",
        icon : "logs",
        href : "/logs",
        label : "Logs",
        disable: true // Added disable property
    },
    {
        title : "Configure Workflows",
        icon : "configure",
        href : "/configure-workflows",
        label : "Configure Workflows",
        disable: true // Added disable property
    },
    {
        title : "Vendors",
        icon : "vendors",
        href : "/vendors",
        label : "Vendors",
        disable: true // Added disable property
    },
    {
        title : "Pending Approval",
        icon : "pending",
        href : "/pending-approval",
        label : "Pending Approval",
        disable: true // Added disable property
    },
    {
        title : "Train Agents",
        icon : "train",
        href : "/train-agents",
        label : "Train Agents",
        disable: true // Added disable property
    }
]