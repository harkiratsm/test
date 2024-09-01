import React, { useState, useEffect, useMemo } from 'react';
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import axios from 'axios';
import { axios_api } from '@/libs/utils';
import { Skeleton } from './ui/skeleton';
import { getReimbursements } from '@/hooks';

const chartConfig = {
  value: {
    label: "Reimbursement",
    color: "hsl(var(--bar-chart))",
  },
} satisfies ChartConfig;

export interface Reimbursement {
  reimbursement_type: string;
  net_amount: number;
  order_id: string;
  payment_date: string;
  reimbursement_description: string;
}

interface ChartDataItem {
  type: string;
  value: number;
}

export default function ReimbursementBarChart() {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReimbursements = async () => {
      try {
        const response = await getReimbursements()
        setReimbursements(response.data['reimbursements']);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    fetchReimbursements();
  }, []);

  const groupedData = reimbursements.reduce<Record<string, number>>((acc, item) => {
    const { reimbursement_type, net_amount } = item;
    acc[reimbursement_type] = (acc[reimbursement_type] || 0) + net_amount;
    return acc;
  }, {});

  const chartData: ChartDataItem[] = Object.entries(groupedData).map(([type, value]) => ({
    type,
    value: Math.abs(Number(value.toFixed(2))),
  }));

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-xl" />
  }

  return (
    <Card className="w-full p-4 bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-center">
          Reimbursements by Dispute Type - last 30 days
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          
          <BarChart
            width={600}
            height={400}
            data={chartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <XAxis
              dataKey="type"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tickFormatter={(value) => value}
            />
            <YAxis
              dataKey="value"
              axisLine={false}
              className='ml-4'
              tickLine={false}
              tickFormatter={(value) => {
                if (value >= 1000) {
                  return `$${(value / 1000).toFixed(1)}K`;
                }
                return `$${value}`;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="value"
              fill="hsl(var(--bar-chart))"
              radius={[20, 20, 20, 20]}
              barSize={60}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}