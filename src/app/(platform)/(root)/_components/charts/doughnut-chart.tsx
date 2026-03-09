"use client";

import { TrendingUp } from "lucide-react";
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";

export const description = "A donut chart with text";

export function DoughnutChart({
  title,
  description,
  data,
  centerLabel,
  centerValue,
  footerText,
  colorScheme = "emerald",
}: {
  title: string;
  description: string;
  data: { name: string; value: number; fill: string }[];
  centerLabel: string;
  centerValue: string | number;
  footerText: string;
  colorScheme?: string;
}) {
  return (
    <Card className="w-full border border-slate-50 bg-slate-200 p-5 shadow-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-slate-900">
      <CardHeader className="items-center text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="relative mx-auto aspect-square max-h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  fontWeight: "bold",
                  fontSize: "10px",
                }}
                itemStyle={{ textTransform: "uppercase" }}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={80}
                strokeWidth={3}
                blendStroke
                paddingAngle={5}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-slate-900 text-2xl font-black tracking-tighter italic dark:fill-white"
                          >
                            {centerValue}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-slate-400 text-[9px] font-black tracking-widest uppercase"
                          >
                            {centerLabel}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="items-center text-center">
        <div className="flex items-center gap-2 text-[10px] leading-none font-black tracking-widest text-slate-500 uppercase">
          {footerText} <TrendingUp className={`h-3 w-3 text-${colorScheme}-500`} />
        </div>
      </CardFooter>
    </Card>
  );
}
