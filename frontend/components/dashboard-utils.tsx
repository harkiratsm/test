'use client'
import React, { useEffect, useState } from "react"
import { BirdIcon, ChevronRightIcon, RocketIcon, Search, } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import DisputeBarChart from "./bar-chart"
import { UploadDialog } from "./upload"
import DataTableView from "./data-table-view"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import DisputeChart from "./pie-chart"
import { activeTabs, views } from "@/constants"

const DashboardCard = ({ title, value, onClick }: any) => {
  const formatValue = (val: any) => {
    if (typeof val === 'number') {
      const roundedVal = Math.round(val * 100) / 100;
      return roundedVal.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    }
    return val;
  };

  return (
    <Card className="flex flex-row items-center justify-between border rounded-lg p-2 cursor-pointer" onClick={onClick}>
      <CardHeader>
        <CardTitle className="text-xl font-medium text-gray-500">{title}</CardTitle>
        <h3 className={`font-bold text-3xl break-words`}>
          {formatValue(value)}
        </h3>
      </CardHeader>
      <CardContent className="p-0">
        <Button variant="ghost">
          <ChevronRightIcon className="h-12 w-12 font-bold" />
        </Button>
      </CardContent>
    </Card>
  );
};

export const DashboardUtils = ({categories}:any) => {
  const [modifierKey, setModifierKey] = useState('Ctrl')
  const [activeView, setActiveView] = useState('dashboard');
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    const agent = typeof navigator === 'undefined' ? '' : navigator.userAgent
    const isMac = /Macintosh|Mac\sOS/i.test(agent)
    setModifierKey(isMac ? '⌘' : 'Ctrl')
  }, [])


  const handleCardClick = (title: string) => {
    setActiveView(activeTabs[title] ?? 'dashboard')
  };

  const renderDashboard = () => (
    <>

<Alert className="mt-2 max-w-md">
      <RocketIcon className="h-4 w-4 text-purple" />
      <AlertTitle className="text-purple">Heads up!</AlertTitle>
      <AlertDescription className="text-muted-foreground">
        If your current documents aren&apos;t sufficient, consider uploading new ones for better results. <span onClick={()=> setUploadOpen(true)} className="text-purple cursor-pointer">Upload now</span>
      </AlertDescription>
    </Alert>
      <section className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
      {Object?.entries(categories).map(([title, value], index) => (
        <DashboardCard
          key={index}
          title={title}
          value={value}
          onClick={() => handleCardClick(title)}
        />
      ))}
      </section>
      <section className="grid gap-2 grid-col-1 md:grid-cols-2 mt-4 w-full">
        <DisputeBarChart />
        <DisputeChart />
      </section>
    </>
  );

  const renderTableView = () => (
    <DataTableView activeView={activeView} setActiveView={setActiveView} />
  );

  return (
    <div className="mt-4 mx-4">
       <div className="flex justify-center items-center">
        <Button
          variant="outline"
          className="text-muted-foreground flex w-96 h-12 items-center justify-between rounded-lg mt-2"
        >
          <div className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            Search
          </div>
          <div>
            <div className="text-muted-foreground bg-muted flex items-center rounded-md px-1.5 py-0.5 text-xs tracking-wider">
              {modifierKey}+K
            </div>
          </div>
        </Button>
        <UploadDialog open={uploadOpen} setOpen={setUploadOpen}/> 
      </div>
      {categories['Order & Payment Received'] > 0  ? (
        activeView === 'dashboard' ? renderDashboard() : renderTableView()
      ) : (
        <div
          className="text-muted-foreground/60 flex h-60 flex-col items-center justify-center gap-y-4"
          data-testid="empty-document-state"
        >
          <BirdIcon className="h-12 w-12" strokeWidth={1.5} />
          <div className="text-center">
            <h3 className="text-lg font-semibold">No Data Found</h3>
            <p className="mt-2 max-w-[60ch]">It looks like the payment and MTR files have not been uploaded yet. Please upload them to proceed.</p>
          </div>
        </div>
      )}
    </div>
  )
}