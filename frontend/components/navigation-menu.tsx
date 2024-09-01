import { cn } from "@/libs/utils";
import { NavItem } from "@/types";
import { usePathname } from "next/navigation";
import { Icons } from "./icons";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export interface DashboardNavProps {
    className ?: string;
    navitems: NavItem[];
}

export const DashboardNav = ({ className, ...props }: DashboardNavProps ) => {
    const pathName = usePathname();

    return (
        <div className={cn("flex flex-col gap-y-2", className)} {...props}>
             <TooltipProvider>
            {props.navitems.map((item, index) => {
                const Icon = Icons[item.icon || 'purchaseOrder'];
                return (
                    item.href && (
                    <Tooltip key={index}>
                        <TooltipTrigger asChild>
                        <Link
                            href={item.disable ? '/dashboard' : item.href}
                            className={cn(
                            'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent ',
                            pathName === item.href ? 'bg-purple text-white hover:bg-purple' : 'transparent',
                            item.disable && 'cursor-not-allowed opacity-80'
                            )}
                           
                        >
                            <Icon className={`ml-0 lg:ml-3 w-8
                                 flex-none ${index === 0 ? 'transform scale-x-[-1]' : ''}`} />
                            <span className="mr-0 truncate hidden lg:block lg:mr-2">{item.title}</span>
                        </Link>
                        </TooltipTrigger>
                        <TooltipContent
                        align="center"
                        side="right"
                        sideOffset={8}
                        className={'inline-block lg:hidden'}
                        >
                        {item.title}
                        </TooltipContent>
                    </Tooltip>
                    )
                );
            })}
            </TooltipProvider>
        </div>
    )
}