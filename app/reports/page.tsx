"use client"

import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Calendar, FileSpreadsheet, Printer, Filter } from "lucide-react"
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO, startOfYear, endOfYear, getYear } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getOrders, getClients } from "@/lib/db"

type OrderItem = {
  id: string
  productId: string
  productName: string
  price: number
  quantity: number
  observation: string
}

type Order = {
  id: string
  clientName: string
  clientPhone: string
  items: OrderItem[]
  total: number
  status: "pending" | "accepted" | "in-progress" | "ready" | "delivered"
  createdAt: string
}

type Client = {
  id: string
  name: string
  email: string
  phone: string
}

export default function ReportsPage() {
  const { t } = useLanguage()
  const [orders, setOrders] = useState<Order[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState("today")
  const [startDate, setStartDate] = useState<string>(format(new Date(), "yyyy-MM-dd"))
  const [endDate, setEndDate] = useState<string>(format(new Date(), "yyyy-MM-dd"))
  const [selectedYear, setSelectedYear] = useState<string>(getYear(new Date()).toString())
  const [selectedSemester, setSelectedSemester] = useState<string>("1")
  const [selectedClient, setSelectedClient] = useState<string>("all")
  const [mounted, setMounted] = useState(false)
  const tableRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Available years for filtering
  const availableYears = ["2023", "2024", "2025"]

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch real data from the database
      const [ordersData, clientsData] = await Promise.all([getOrders(), getClients()])

      setOrders(ordersData)
      setClients(clientsData)
      filterOrdersByTab("today", ordersData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: mounted ? t("reports.error") : "Error",
        description: "Failed to load data from the database",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Apply client filter whenever selectedClient changes
    if (mounted) {
      applyFilters()
    }
  }, [selectedClient, mounted])

  const filterOrdersByTab = (tab: string, ordersList: Order[] = orders) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const firstDayOfMonth = startOfMonth(today)
    const lastDayOfMonth = endOfMonth(today)

    const currentYear = getYear(today)
    const firstDayOfYear = startOfYear(new Date(currentYear, 0, 1))
    const lastDayOfYear = endOfYear(new Date(currentYear, 11, 31))

    // First semester: January 1 to June 30
    const firstSemesterStart = new Date(currentYear, 0, 1)
    const firstSemesterEnd = new Date(currentYear, 5, 30)

    // Second semester: July 1 to December 31
    const secondSemesterStart = new Date(currentYear, 6, 1)
    const secondSemesterEnd = new Date(currentYear, 11, 31)

    let filtered: Order[]

    switch (tab) {
      case "today":
        filtered = ordersList.filter((order) => {
          const orderDate = new Date(order.createdAt)
          return orderDate >= today && orderDate < tomorrow
        })
        setStartDate(format(today, "yyyy-MM-dd"))
        setEndDate(format(today, "yyyy-MM-dd"))
        break
      case "month":
        filtered = ordersList.filter((order) => {
          const orderDate = new Date(order.createdAt)
          return orderDate >= firstDayOfMonth && orderDate <= lastDayOfMonth
        })
        setStartDate(format(firstDayOfMonth, "yyyy-MM-dd"))
        setEndDate(format(lastDayOfMonth, "yyyy-MM-dd"))
        break
      case "year":
        filtered = ordersList.filter((order) => {
          const orderDate = new Date(order.createdAt)
          return getYear(orderDate) === Number.parseInt(selectedYear)
        })
        setStartDate(format(new Date(Number.parseInt(selectedYear), 0, 1), "yyyy-MM-dd"))
        setEndDate(format(new Date(Number.parseInt(selectedYear), 11, 31), "yyyy-MM-dd"))
        break
      case "semester":
        const semesterStart = selectedSemester === "1" ? firstSemesterStart : secondSemesterStart
        const semesterEnd = selectedSemester === "1" ? firstSemesterEnd : secondSemesterEnd

        filtered = ordersList.filter((order) => {
          const orderDate = new Date(order.createdAt)
          return orderDate >= semesterStart && orderDate <= semesterEnd
        })
        setStartDate(format(semesterStart, "yyyy-MM-dd"))
        setEndDate(format(semesterEnd, "yyyy-MM-dd"))
        break
      case "custom":
        // Keep current filtered orders for custom tab
        filtered = filteredOrders
        break
      default:
        filtered = ordersList
    }

    // Apply client filter if one is selected
    if (selectedClient !== "all") {
      filtered = filtered.filter(
        (order) => order.clientName === clients.find((client) => client.id === selectedClient)?.name,
      )
    }

    setFilteredOrders(filtered)
    setActiveTab(tab)
  }

  const handleCustomDateFilter = () => {
    try {
      const start = parseISO(startDate)
      const end = parseISO(endDate)

      // Add one day to end date to include the end date in the range
      const endPlusOne = new Date(end)
      endPlusOne.setDate(endPlusOne.getDate() + 1)

      let filtered = orders.filter((order) => {
        const orderDate = parseISO(order.createdAt)
        return isWithinInterval(orderDate, { start, end: endPlusOne })
      })

      // Apply client filter if one is selected
      if (selectedClient !== "all") {
        filtered = filtered.filter(
          (order) => order.clientName === clients.find((client) => client.id === selectedClient)?.name,
        )
      }

      setFilteredOrders(filtered)

      if (filtered.length === 0) {
        toast({
          title: mounted ? t("reports.noOrdersFound") : "No orders found",
          description: mounted ? t("reports.noOrdersFoundInRange") : "No orders were found in the selected date range",
        })
      }
    } catch (error) {
      toast({
        title: mounted ? t("reports.invalidDateRange") : "Invalid date range",
        description: mounted ? t("reports.selectValidDateRange") : "Please select a valid date range",
        variant: "destructive",
      })
    }
  }

  const applyFilters = () => {
    // Re-apply the current tab filter with the selected client
    filterOrdersByTab(activeTab)
  }

  const calculateTotalRevenue = () => {
    return filteredOrders.reduce((sum, order) => sum + order.total, 0)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "MMM dd, yyyy HH:mm")
    } catch (error) {
      return "Invalid date"
    }
  }

  const handleExportToExcel = () => {
    // In a real app, this would use a library like xlsx to generate an Excel file
    toast({
      title: mounted ? t("reports.exportStarted") : "Export started",
      description: mounted ? t("reports.exportingToExcel") : "Your report is being exported to Excel",
    })

    // Simulate download delay
    setTimeout(() => {
      toast({
        title: mounted ? t("reports.exportComplete") : "Export complete",
        description: mounted ? t("reports.exportedToExcel") : "Your report has been exported to Excel",
      })
    }, 1500)
  }

  const handlePrint = () => {
    const printContent = tableRef.current?.innerHTML

    if (printContent) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
        <html>
          <head>
            <title>Sucré Biscoiteria - ${mounted ? t("reports.ordersReport") : "Orders Report"}</title>
            <style>
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .report-header { text-align: center; margin-bottom: 20px; }
              .report-summary { margin-top: 20px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="report-header">
              <h1>Sucré Biscoiteria - ${mounted ? t("reports.ordersReport") : "Orders Report"}</h1>
              <p>${mounted ? t("reports.period") : "Period"}: ${format(parseISO(startDate), "MMM dd, yyyy")} - ${format(parseISO(endDate), "MMM dd, yyyy")}</p>
              ${selectedClient !== "all" ? `<p>${mounted ? t("common.client") : "Client"}: ${clients.find((client) => client.id === selectedClient)?.name || (mounted ? t("reports.allClients") : "All Clients")}</p>` : ""}
            </div>
            ${printContent}
            <div class="report-summary">
              <p>${mounted ? t("reports.totalOrders") : "Total Orders"}: ${filteredOrders.length}</p>
              <p>${mounted ? t("reports.totalRevenue") : "Total Revenue"}: $${calculateTotalRevenue().toFixed(2)}</p>
            </div>
          </body>
        </html>
      `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  // Translated text with fallbacks for SSR
  const ordersReportTitle = mounted ? t("reports.title") : "Orders Report"
  const ordersReportSubtitle = mounted
    ? t("reports.subtitle")
    : "View and analyze order data for different time periods"
  const printButton = mounted ? t("reports.print") : "Print"
  const exportToExcelButton = mounted ? t("reports.exportToExcel") : "Export to Excel"
  const filterOptionsTitle = mounted ? t("reports.filterOptions") : "Filter Options"
  const filterOptionsSubtitle = mounted
    ? t("reports.selectPeriodAndClient")
    : "Select a time period and client to view order data"
  const todayTab = mounted ? t("reports.today") : "Today"
  const thisMonthTab = mounted ? t("reports.thisMonth") : "This Month"
  const yearTab = mounted ? t("reports.year") : "Year"
  const semesterTab = mounted ? t("reports.semester") : "Semester"
  const customRangeTab = mounted ? t("reports.customRange") : "Custom Range"
  const selectYearLabel = mounted ? t("reports.selectYear") : "Select Year"
  const selectSemesterLabel = mounted ? t("reports.selectSemester") : "Select Semester"
  const firstSemesterOption = mounted ? t("reports.firstSemester") : "First Semester (Jan-Jun)"
  const secondSemesterOption = mounted ? t("reports.secondSemester") : "Second Semester (Jul-Dec)"
  const startDateLabel = mounted ? t("reports.startDate") : "Start Date"
  const endDateLabel = mounted ? t("reports.endDate") : "End Date"
  const applyFilterButton = mounted ? t("reports.applyFilter") : "Apply Filter"
  const filterByClientLabel = mounted ? t("reports.filterByClient") : "Filter by Client"
  const allClientsOption = mounted ? t("reports.allClients") : "All Clients"
  const activeFiltersText = mounted ? t("reports.activeFilters") : "Active Filters"
  const periodText = mounted ? t("reports.period") : "Period"
  const clientText = mounted ? t("common.client") : "Client"
  const ordersSummaryTitle = mounted ? t("reports.ordersSummary") : "Orders Summary"
  const ordersFoundText = mounted ? t("reports.ordersFound") : "orders found for the selected period"
  const totalOrdersText = mounted ? t("reports.totalOrders") : "Total Orders"
  const totalRevenueText = mounted ? t("reports.totalRevenue") : "Total Revenue"
  const averageOrderValueText = mounted ? t("reports.averageOrderValue") : "Average Order Value"
  const orderIdText = mounted ? t("reports.orderId") : "Order ID"
  const dateText = mounted ? t("common.date") : "Date"
  const customerText = mounted ? t("reports.customer") : "Customer"
  const statusText = mounted ? t("common.status") : "Status"
  const totalText = mounted ? t("common.total") : "Total"
  const noOrdersFoundText = mounted ? t("reports.noOrdersFoundForPeriod") : "No orders found for the selected period"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{ordersReportTitle}</h2>
            <p className="text-muted-foreground">{ordersReportSubtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              {printButton}
            </Button>
            <Button variant="outline" onClick={handleExportToExcel}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              {exportToExcelButton}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{filterOptionsTitle}</CardTitle>
            <CardDescription>{filterOptionsSubtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mounted && (
                <Tabs value={activeTab} onValueChange={filterOrdersByTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-5 mb-6">
                    <TabsTrigger value="today">{todayTab}</TabsTrigger>
                    <TabsTrigger value="month">{thisMonthTab}</TabsTrigger>
                    <TabsTrigger value="year">{yearTab}</TabsTrigger>
                    <TabsTrigger value="semester">{semesterTab}</TabsTrigger>
                    <TabsTrigger value="custom">{customRangeTab}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="year" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="year-select">{selectYearLabel}</Label>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                          <SelectTrigger id="year-select">
                            <SelectValue placeholder={selectYearLabel} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableYears.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button onClick={() => filterOrdersByTab("year")}>
                          <Filter className="mr-2 h-4 w-4" />
                          {applyFilterButton}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="semester" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="semester-year-select">{selectYearLabel}</Label>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                          <SelectTrigger id="semester-year-select">
                            <SelectValue placeholder={selectYearLabel} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableYears.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="semester-select">{selectSemesterLabel}</Label>
                        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                          <SelectTrigger id="semester-select">
                            <SelectValue placeholder={selectSemesterLabel} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">{firstSemesterOption}</SelectItem>
                            <SelectItem value="2">{secondSemesterOption}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button onClick={() => filterOrdersByTab("semester")}>
                          <Filter className="mr-2 h-4 w-4" />
                          {applyFilterButton}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="custom" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-date">{startDateLabel}</Label>
                        <div className="flex">
                          <Input
                            id="start-date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-date">{endDateLabel}</Label>
                        <div className="flex">
                          <Input
                            id="end-date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex items-end">
                        <Button onClick={handleCustomDateFilter}>
                          <Calendar className="mr-2 h-4 w-4" />
                          {applyFilterButton}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}

              {/* Client filter */}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-select">{filterByClientLabel}</Label>
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                      <SelectTrigger id="client-select">
                        <SelectValue placeholder={filterByClientLabel} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{allClientsOption}</SelectItem>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Active filters summary */}
              <div className="bg-muted/50 p-3 rounded-md text-sm">
                <p className="font-medium">{activeFiltersText}:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                    {periodText}: {format(parseISO(startDate), "MMM dd, yyyy")} -{" "}
                    {format(parseISO(endDate), "MMM dd, yyyy")}
                  </span>
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                    {clientText}:{" "}
                    {selectedClient === "all"
                      ? allClientsOption
                      : clients.find((client) => client.id === selectedClient)?.name}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{ordersSummaryTitle}</CardTitle>
            <CardDescription>
              {filteredOrders.length} {ordersFoundText}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>{totalOrdersText}</CardDescription>
                  <CardTitle className="text-2xl">{filteredOrders.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>{totalRevenueText}</CardDescription>
                  <CardTitle className="text-2xl">${calculateTotalRevenue().toFixed(2)}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>{averageOrderValueText}</CardDescription>
                  <CardTitle className="text-2xl">
                    ${filteredOrders.length > 0 ? (calculateTotalRevenue() / filteredOrders.length).toFixed(2) : "0.00"}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            <div ref={tableRef} className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{orderIdText}</TableHead>
                    <TableHead>{dateText}</TableHead>
                    <TableHead>{customerText}</TableHead>
                    <TableHead>{statusText}</TableHead>
                    <TableHead className="text-right">{totalText}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        {noOrdersFoundText}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id.slice(-4)}</TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>{order.clientName}</TableCell>
                        <TableCell className="capitalize">
                          {mounted ? t(`status.${order.status.replace("-", "")}`) : order.status.replace("-", " ")}
                        </TableCell>
                        <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {filteredOrders.length > 0 && (
              <div className="mt-4 flex justify-end">
                <div className="text-sm font-medium">
                  {totalText}: ${calculateTotalRevenue().toFixed(2)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
