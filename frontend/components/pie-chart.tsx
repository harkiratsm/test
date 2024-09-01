"use client"
import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart"

const generateRandomRGBColor = (): string => {
  const baseColor = "#724DFF" 
  const baseRGB = parseInt(baseColor.slice(1), 16);
  const baseR = (baseRGB >> 16) & 255;
  const baseG = (baseRGB >> 8) & 255;
  const baseB = baseRGB & 255;

  const r = Math.max(0, Math.min(255, baseR + Math.floor(Math.random() * 100 - 50)));
  const g = Math.max(0, Math.min(255, baseG + Math.floor(Math.random() * 100 - 50)));
  const b = Math.max(0, Math.min(255, baseB + Math.floor(Math.random() * 100 - 50)));

  return `rgb(${r}, ${g}, ${b})`;
};

interface DisputeChartProps {
  refinedData: any
}

const chartConfig = {} satisfies ChartConfig

interface ChartData {
  name: string;
  value: number;
  fill: string;
}

export default function DisputeChart({ refinedData }: DisputeChartProps) {
  const data = refinedData.map((item:any) => ({
    name: item.p_description,
    value: Math.abs(Math.round(item.net_amount * 100) / 100),
    fill: generateRandomRGBColor()
  }))

  return (
    <Card className="w-full p-4 h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl text-center">
          Reimbursements by Dispute Type - this year
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col 2xl:flex-row flex-1 pb-0">
        <div className="w-full 2xl:w-1/2 h-[300px] 2xl:h-[400px] mb-4 lg:mb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-full p-4"
        >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry: ChartData, index:number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
        </ChartContainer>
        </div>
        <div className="w-full 2xl:w-1/2 flex flex-col justify-center">
          {data.map((entry: ChartData, index:number) => (
            <div key={index} className="flex items-center mb-3">
              <div
                className="w-3 h-3 mr-3 rounded-full"
                style={{ backgroundColor: entry.fill }}
                aria-hidden="true"
              />
              <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-muted-foreground w-full">
                <span className="mr-2 mb-1 sm:mb-0">{entry.name}</span>
                <span className="font-medium">
                  {Math.abs(entry.value).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}