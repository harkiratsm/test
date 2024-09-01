import { ColumnDef } from '@tanstack/react-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Checkbox } from './ui/checkbox';

interface ProcessedFile {
    order_id: string
    transaction_type: string
    invoice_amount: number
    net_amount: number
    p_description: string
    order_date: string
}

interface ToleranceBreached {
    order_id: string
    payment_net_amount: number
    shipment_net_amount: number
    percentage: number
    tolerance_status: string
}

export const orderColumns: ColumnDef<ProcessedFile>[] = [
    {
      id: "select",
      header: ({ table }:any ) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value:any) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }:any) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value :any) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "order_id",
      header: "Order ID",
      cell: ({ row }:any) => <div className="capitalize">{row.getValue("order_id")}</div>,
    },
    {
      accessorKey: "transaction_type",
      header: "Transaction Type",
      cell: ({ row }:any) => <div className="capitalize">{row.getValue("transaction_type")}</div>,
    },
    {
      accessorKey: "payment_type",
      header: "Payment Type",
      cell: ({ row }:any) => <div className="capitalize">{row.getValue("payment_type")}</div>,
    },
    {
      accessorKey: "invoice_amount",
      header: ({ column }:any) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Invoice Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }:any) => <div>${row.getValue("invoice_amount")}</div>,
    },
    {
      accessorKey: "net_amount",
      header: ({ column }:any) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Net Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }:any) => <div>${row.getValue("net_amount")}</div>,
    },
    {
      accessorKey: "p_description",
      header: "Description",
      cell: ({ row }:any) => <div>{row.getValue("p_description")}</div>,
    },
    {
      accessorKey: "order_date",
      header: "Order Date",
      cell: ({ row }:any) => <div>{row.getValue("order_date")}</div>,
    },
    {
      accessorKey: "payment_date",
      header: "Payment Date",
      cell: ({ row }:any) => <div>{row.getValue("payment_date")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }:any) => {
        const payment = row.original
  
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.order_id)}
              >
                Copy order ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ];


export const ToleranceColumns: ColumnDef<ToleranceBreached>[] = [
    {
      id: "select",
      header: ({ table }:any ) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value:any) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }:any) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value :any) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "order_id",
      header: "Order ID",
      cell: ({ row }:any) => <div className="capitalize">{row.getValue("order_id")}</div>,
    },
    {
      accessorKey: "payment_net_amount",
      header: "Payment Net Amount",
      cell: ({ row }:any) => <div>${row.getValue("payment_net_amount")}</div>,
    },
    {
      accessorKey: "shipment_net_amount",
      header: "Shipment Net Amount",
      cell: ({ row }:any) => <div>${row.getValue("shipment_net_amount")}</div>,
    },
    {
      accessorKey: "percentage",
      header: "Percentage",
      cell: ({ row }:any) => <div>{row.getValue("percentage")}%</div>,
    },
    {
      accessorKey: "tolerance_status",
      header: "Tolerance Status",
      cell: ({ row }:any) => <div>{row.getValue("tolerance_status")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }:any) => {
        const payment = row.original
  
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.order_id)}
              >
                Copy order ID
              </DropdownMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <DropdownMenuItem>
                    View customer
                  </DropdownMenuItem>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>View payment details</DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </DropdownMenuContent>
            </DropdownMenu>
        )
        }
    },
    ];
