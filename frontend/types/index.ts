import { Icons } from "@/components/icons";


export interface NavItem {
    title : string;
    icon ?: keyof typeof Icons;
    href : string;
    disable ?: boolean;
    label : string;
}
