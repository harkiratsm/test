import {ChartCandlestickIcon, ChartPieIcon, DumbbellIcon, FingerprintIcon, FolderIcon, LayoutDashboardIcon, LogsIcon, LucideIcon, MessageSquareIcon, NetworkIcon, ShoppingBasketIcon } from "lucide-react";


export type Icon = LucideIcon;

export const Icons = {
    dashboard: ChartPieIcon,
    chat: MessageSquareIcon,
    integrations: FolderIcon,
    purchaseOrder: ChartCandlestickIcon,
    logs: LogsIcon,
    configure: NetworkIcon,
    vendors: ShoppingBasketIcon, 
    pending: FingerprintIcon,
    train: DumbbellIcon
}