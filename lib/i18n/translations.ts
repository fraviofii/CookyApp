export type Language = "en" | "pt-BR"

export type TranslationKey =
  | "common.dashboard"
  | "common.kitchen"
  | "common.production"
  | "common.clients"
  | "common.orders"
  | "common.newOrder"
  | "common.products"
  | "common.staff"
  | "common.reports"
  | "common.logout"
  | "common.login"
  | "common.email"
  | "common.password"
  | "common.cancel"
  | "common.save"
  | "common.add"
  | "common.edit"
  | "common.delete"
  | "common.search"
  | "common.status"
  | "common.total"
  | "common.subtotal"
  | "common.tax"
  | "common.name"
  | "common.phone"
  | "common.details"
  | "common.viewDetails"
  | "common.noResults"
  | "common.welcome"
  | "common.demoAccounts"
  | "common.manager"
  | "common.employee"
  | "common.sales"
  | "common.enterCredentials"
  | "common.product"
  | "common.client"
  | "common.date"
  | "common.order"
  | "common.actions"
  | "common.loading"
  | "common.from"
  | "status.pending"
  | "status.accepted"
  | "status.inProgress"
  | "status.ready"
  | "status.delivered"
  | "status.all"
  | "dashboard.title"
  | "dashboard.subtitle"
  | "dashboard.totalOrders"
  | "dashboard.pendingOrders"
  | "dashboard.totalProducts"
  | "dashboard.totalClients"
  | "dashboard.recentActivity"
  | "dashboard.overview"
  | "dashboard.fromLastMonth"
  | "dashboard.requiresAttention"
  | "dashboard.addedThisWeek"
  | "dashboard.manageInSection"
  | "dashboard.newOrderReceived"
  | "dashboard.orderFrom"
  | "dashboard.minutesAgo"
  | "dashboard.productUpdated"
  | "dashboard.chocolateCakeUpdated"
  | "dashboard.hoursAgo"
  | "dashboard.newClientAdded"
  | "dashboard.sarahJohnsonAdded"
  | "dashboard.dayAgo"
  | "dashboard.error"
  | "dashboard.noRecentActivity"
  | "orders.title"
  | "orders.subtitle"
  | "orders.searchPlaceholder"
  | "orders.orderNumber"
  | "orders.customerInfo"
  | "orders.orderItems"
  | "orders.noOrders"
  | "orders.items"
  | "orders.note"
  | "orders.error"
  | "orders.selectProduct"
  | "orders.itemAdded"
  | "orders.addedToOrder"
  | "orders.selectClient"
  | "orders.emptyOrder"
  | "orders.createNewOrder"
  | "orders.createOrderForClient"
  | "orders.clientInfo"
  | "orders.selectClientLabel"
  | "orders.selectClientPlaceholder"
  | "orders.addItems"
  | "orders.selectProducts"
  | "orders.quantity"
  | "orders.specialInstructions"
  | "orders.specialRequests"
  | "orders.addToOrder"
  | "orders.orderSummary"
  | "orders.itemsInOrder"
  | "orders.addItemsToOrder"
  | "orders.placeOrder"
  | "orders.orderConfirmed"
  | "orders.thankYou"
  | "orders.orderDetails"
  | "orders.customerInfo"
  | "orders.estimatedTime"
  | "orders.readyIn"
  | "orders.returnHome"
  | "orders.placedOn"
  | "orders.noOrderDetails"
  | "orders.placeNewOrder"
  | "kitchen.accept"
  | "kitchen.startPreparing"
  | "kitchen.markReady"
  | "kitchen.delivered"
  | "kitchen.acceptOrder"
  | "kitchen.startPreparingOrder"
  | "kitchen.markReadyOrder"
  | "kitchen.markDelivered"
  | "kitchen.orderUpdated"
  | "kitchen.statusChangedToAccepted"
  | "kitchen.statusChangedToInProgress"
  | "kitchen.statusChangedToReady"
  | "kitchen.statusChangedToDelivered"
  | "clients.title"
  | "clients.subtitle"
  | "clients.addClient"
  | "clients.editClient"
  | "clients.clientNumber"
  | "clients.noEmail"
  | "clients.error"
  | "clients.requiredFields"
  | "clients.added"
  | "clients.hasBeenAdded"
  | "clients.updated"
  | "clients.hasBeenUpdated"
  | "clients.deleted"
  | "clients.hasBeenDeleted"
  | "clients.addClientDesc"
  | "clients.editClientDesc"
  | "users.title"
  | "users.addUser"
  | "users.addUserDesc"
  | "users.role"
  | "users.selectRole"
  | "users.added"
  | "users.hasBeenAddedAs"
  | "users.cannotDelete"
  | "users.cannotDeleteMainManager"
  | "users.deleted"
  | "users.hasBeenDeleted"
  | "products.title"
  | "products.addProduct"
  | "products.editProduct"
  | "products.description"
  | "products.price"
  | "products.addProductDesc"
  | "products.editProductDesc"
  | "products.added"
  | "products.hasBeenAdded"
  | "products.updated"
  | "products.hasBeenUpdated"
  | "products.deleted"
  | "products.hasBeenDeleted"
  | "reports.title"
  | "reports.subtitle"
  | "reports.print"
  | "reports.exportToExcel"
  | "reports.filterOptions"
  | "reports.selectPeriodAndClient"
  | "reports.today"
  | "reports.thisMonth"
  | "reports.year"
  | "reports.semester"
  | "reports.customRange"
  | "reports.selectYear"
  | "reports.selectSemester"
  | "reports.firstSemester"
  | "reports.secondSemester"
  | "reports.startDate"
  | "reports.endDate"
  | "reports.applyFilter"
  | "reports.filterByClient"
  | "reports.allClients"
  | "reports.activeFilters"
  | "reports.period"
  | "reports.ordersSummary"
  | "reports.ordersFound"
  | "reports.totalOrders"
  | "reports.totalRevenue"
  | "reports.averageOrderValue"
  | "reports.orderId"
  | "reports.customer"
  | "reports.noOrdersFoundForPeriod"
  | "reports.noOrdersFound"
  | "reports.noOrdersFoundInRange"
  | "reports.invalidDateRange"
  | "reports.selectValidDateRange"
  | "reports.exportStarted"
  | "reports.exportingToExcel"
  | "reports.exportComplete"
  | "reports.exportedToExcel"
  | "reports.ordersReport"
  | "reports.error"
  | "login.success"
  | "login.failed"
  | "login.invalidCredentials"
  | "login.loggedOut"
  | "auth.required"
  | "auth.accessDenied"
  | "auth.noPermission"
  | "orders.viewDetails"
  | "orders.orderDetails"
  | "orders.updateStatus"
  | "orders.pending"
  | "orders.accepted"
  | "orders.inProgress"
  | "orders.ready"
  | "orders.delivered"
  | "orders.updated"
  | "orders.statusUpdated"
  | "orders.createOrder"
  | "order.createOrder"
  | "order.createOrderDesc"
  | "order.selectClient"
  | "order.noClients"
  | "order.orderItems"
  | "order.addItem"
  | "order.noItems"
  | "order.submitOrder"
  | "order.addItemDesc"
  | "order.selectProduct"
  | "order.noProducts"
  | "order.error"
  | "order.invalidItem"
  | "order.addItems"
  | "order.success"
  | "order.orderCreated"
  | "common.locale"
  | "common.submitting"
  | "users.cannotDeleteSelf"
  | "production.title"
  | "production.subtitle"
  | "production.allOrders"
  | "production.today"
  | "production.thisWeek"
  | "production.thisMonth"
  | "production.product"
  | "production.quantity"
  | "production.noProducts"
  | "production.productDetails"
  | "production.totalQuantity"
  | "production.viewOrder"
  | "orders.shareOrder"
  | "orders.shareViaWhatsApp"
  | "orders.sendToClient"
  | "kitchen.contactCustomer"
  | "whatsapp.whatsappOrders"
  | "whatsapp.manageWhatsappOrders"
  | "whatsapp.noNumberConfigured"
  | "whatsapp.pleaseConfigureNumber"
  | "whatsapp.whatsappIntegrationActive"
  | "whatsapp.openWhatsappToViewOrders"
  | "whatsapp.howToManageOrders"
  | "whatsapp.followTheseSteps"
  | "whatsapp.openWhatsapp"
  | "whatsapp.openWhatsappDesc"
  | "whatsapp.openWhatsappWeb"
  | "whatsapp.reviewMessages"
  | "whatsapp.reviewMessagesDesc"
  | "whatsapp.createOrder"
  | "whatsapp.createOrderDesc"
  | "whatsapp.confirmOrder"
  | "whatsapp.confirmOrderDesc"
  | "whatsapp.orderButton"
  | "whatsapp.orderButtonDesc"
  | "whatsapp.orderQRCode"
  | "whatsapp.orderQRCodeDesc"
  | "whatsapp.newOrderRequest"
  | "whatsapp.orderInstructions"
  | "whatsapp.orderDetails"
  | "whatsapp.productQuantityFormat"
  | "whatsapp.specialInstructions"
  | "whatsapp.thankYou"
  | "whatsapp.orderViaWhatsApp"
  | "whatsapp.scanToOrder"
  | "whatsapp.scanQRCodeToOrder"
  | "settings.title"
  | "settings.subtitle"
  | "settings.general"
  | "settings.whatsappIntegration"
  | "settings.configureWhatsappNumber"
  | "settings.whatsappBusinessNumber"
  | "settings.whatsappNumberFormat"
  | "settings.whatsappOrderButton"
  | "settings.whatsappOrderButtonDesc"
  | "settings.whatsappQRCode"
  | "settings.whatsappQRCodeDesc"
  | "settings.downloadQRCode"
  | "settings.generalSettings"
  | "settings.generalSettingsDesc"
  | "settings.comingSoon"
  | "settings.error"
  | "settings.enterValidNumber"
  | "settings.success"
  | "settings.whatsappNumberSaved"

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    "common.dashboard": "Dashboard",
    "common.kitchen": "Kitchen",
    "common.production": "Production",
    "common.clients": "Clients",
    "common.orders": "Orders",
    "common.newOrder": "New Order",
    "common.products": "Products",
    "common.staff": "Staff",
    "common.reports": "Reports",
    "common.logout": "Logout",
    "common.login": "Login",
    "common.email": "Email",
    "common.password": "Password",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.add": "Add",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.search": "Search",
    "common.status": "Status",
    "common.total": "Total",
    "common.subtotal": "Subtotal",
    "common.tax": "Tax",
    "common.name": "Name",
    "common.phone": "Phone",
    "common.details": "Details",
    "common.viewDetails": "View Details",
    "common.noResults": "No results found",
    "common.welcome": "Welcome back",
    "common.demoAccounts": "Demo accounts:",
    "common.manager": "Manager",
    "common.employee": "Employee",
    "common.sales": "Sales",
    "common.enterCredentials": "Enter your credentials to access your account",
    "common.product": "Product",
    "common.client": "Client",
    "common.date": "Date",
    "common.order": "Order",
    "common.actions": "Actions",
    "common.loading": "Loading...",
    "common.from": "from",
    "status.pending": "Pending",
    "status.accepted": "Accepted",
    "status.inProgress": "In Progress",
    "status.ready": "Ready",
    "status.delivered": "Delivered",
    "status.all": "All Orders",
    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Overview of your business",
    "dashboard.totalOrders": "Total Orders",
    "dashboard.pendingOrders": "Pending Orders",
    "dashboard.totalProducts": "Total Products",
    "dashboard.totalClients": "Total Clients",
    "dashboard.recentActivity": "Recent Activity",
    "dashboard.overview": "Overview of recent orders and system activity",
    "dashboard.fromLastMonth": "+12% from last month",
    "dashboard.requiresAttention": "Requires attention",
    "dashboard.addedThisWeek": "+2 added this week",
    "dashboard.manageInSection": "Manage in Clients section",
    "dashboard.newOrderReceived": "New order received",
    "dashboard.orderFrom": "Order #1234 from John Doe",
    "dashboard.minutesAgo": "5 min ago",
    "dashboard.productUpdated": "Product updated",
    "dashboard.chocolateCakeUpdated": '"Chocolate Cake" price updated',
    "dashboard.hoursAgo": "2 hours ago",
    "dashboard.newClientAdded": "New client added",
    "dashboard.sarahJohnsonAdded": '"Sarah Johnson" added as client',
    "dashboard.dayAgo": "1 day ago",
    "dashboard.error": "Error loading dashboard",
    "dashboard.noRecentActivity": "No recent activity",
    "orders.title": "Orders",
    "orders.subtitle": "View and manage all orders",
    "orders.searchPlaceholder": "Search orders...",
    "orders.orderNumber": "Order #",
    "orders.customerInfo": "Customer Information",
    "orders.orderItems": "Order Items",
    "orders.noOrders": "No orders found",
    "orders.items": "item(s)",
    "orders.note": "Note",
    "orders.error": "Error",
    "orders.selectProduct": "Please select a product",
    "orders.itemAdded": "Item added",
    "orders.addedToOrder": "added to the order",
    "orders.selectClient": "Please select a client",
    "orders.emptyOrder": "Your order is empty",
    "orders.createNewOrder": "Create New Order",
    "orders.createOrderForClient": "Create a new order for a client",
    "orders.clientInfo": "Client Information",
    "orders.selectClientLabel": "Select Client",
    "orders.selectClientPlaceholder": "Select a client",
    "orders.addItems": "Add Items",
    "orders.selectProducts": "Select products to add to the order",
    "orders.quantity": "Quantity",
    "orders.specialInstructions": "Special Instructions",
    "orders.specialRequests": "Any special requests or instructions",
    "orders.addToOrder": "Add to Order",
    "orders.orderSummary": "Order Summary",
    "orders.itemsInOrder": "item(s) in your order",
    "orders.addItemsToOrder": "Add some items to your order",
    "orders.placeOrder": "Place Order",
    "orders.orderConfirmed": "Order Confirmed!",
    "orders.thankYou": "Thank you for your order. We'll start preparing it right away.",
    "orders.orderDetails": "Order Details",
    "orders.customerInfo": "Customer Information",
    "orders.estimatedTime": "Estimated Preparation Time",
    "orders.readyIn": "Your order will be ready in approximately 20-30 minutes",
    "orders.returnHome": "Return to Home",
    "orders.placedOn": "Placed on",
    "orders.noOrderDetails": "We couldn't find your order details",
    "orders.placeNewOrder": "Place a New Order",
    "kitchen.accept": "Accept",
    "kitchen.startPreparing": "Start Preparing",
    "kitchen.markReady": "Mark Ready",
    "kitchen.delivered": "Delivered",
    "kitchen.acceptOrder": "Accept Order",
    "kitchen.startPreparingOrder": "Start Preparing",
    "kitchen.markReadyOrder": "Mark Ready",
    "kitchen.markDelivered": "Mark Delivered",
    "kitchen.orderUpdated": "Order updated",
    "kitchen.statusChangedToAccepted": "status changed to accepted",
    "kitchen.statusChangedToInProgress": "status changed to in progress",
    "kitchen.statusChangedToReady": "status changed to ready",
    "kitchen.statusChangedToDelivered": "status changed to delivered",
    "clients.title": "Client Management",
    "clients.subtitle": "Manage your clients",
    "clients.addClient": "Add New Client",
    "clients.editClient": "Edit Client",
    "clients.clientNumber": "Client #",
    "clients.noEmail": "No email provided",
    "clients.error": "Error",
    "clients.requiredFields": "Name and phone number are required",
    "clients.added": "Client added",
    "clients.hasBeenAdded": "has been added to your clients",
    "clients.updated": "Client updated",
    "clients.hasBeenUpdated": "information has been updated",
    "clients.deleted": "Client deleted",
    "clients.hasBeenDeleted": "has been deleted successfully",
    "clients.addClientDesc": "Add a new client to your database",
    "clients.editClientDesc": "Update client information",
    "users.title": "User Management",
    "users.addUser": "Add User",
    "users.addUserDesc": "Create a new user account for your staff",
    "users.error": "Error",
    "users.editUser": "Edit User",
    "users.editUserDesc": "Update user information",
    "users.updated": "User updated",
    "users.hasBeenUpdated": "information has been updated",
    "users.leaveBlankToKeep": "Leave blank to keep current",
    "users.noUsers": "No users found",
    "users.role": "Role",
    "users.selectRole": "Select role",
    "users.added": "User added",
    "users.hasBeenAddedAs": "has been added as",
    "users.cannotDelete": "Cannot delete",
    "users.cannotDeleteMainManager": "You cannot delete the main manager account",
    "users.deleted": "User deleted",
    "users.hasBeenDeleted": "The user has been deleted successfully",
    "products.title": "Product Management",
    "products.addProduct": "Add Product",
    "products.editProduct": "Edit Product",
    "products.description": "Description",
    "products.price": "Price",
    "products.addProductDesc": "Add a new product to your menu",
    "products.editProductDesc": "Update product information",
    "products.added": "Product added",
    "products.hasBeenAdded": "has been added to the menu",
    "products.updated": "Product updated",
    "products.hasBeenUpdated": "has been updated",
    "products.deleted": "Product deleted",
    "products.hasBeenDeleted": "The product has been deleted successfully",
    "reports.title": "Orders Report",
    "reports.subtitle": "View and analyze order data for different time periods",
    "reports.print": "Print",
    "reports.exportToExcel": "Export to Excel",
    "reports.filterOptions": "Filter Options",
    "reports.selectPeriodAndClient": "Select a time period and client to view order data",
    "reports.today": "Today",
    "reports.thisMonth": "This Month",
    "reports.year": "Year",
    "reports.semester": "Semester",
    "reports.customRange": "Custom Range",
    "reports.selectYear": "Select Year",
    "reports.selectSemester": "Select Semester",
    "reports.firstSemester": "First Semester (Jan-Jun)",
    "reports.secondSemester": "Second Semester (Jul-Dec)",
    "reports.startDate": "Start Date",
    "reports.endDate": "End Date",
    "reports.applyFilter": "Apply Filter",
    "reports.filterByClient": "Filter by Client",
    "reports.allClients": "All Clients",
    "reports.activeFilters": "Active Filters",
    "reports.period": "Period",
    "reports.ordersSummary": "Orders Summary",
    "reports.ordersFound": "orders found for the selected period",
    "reports.totalOrders": "Total Orders",
    "reports.totalRevenue": "Total Revenue",
    "reports.averageOrderValue": "Average Order Value",
    "reports.orderId": "Order ID",
    "reports.customer": "Customer",
    "reports.noOrdersFoundForPeriod": "No orders found for the selected period",
    "reports.noOrdersFound": "No orders found",
    "reports.noOrdersFoundInRange": "No orders were found in the selected date range",
    "reports.invalidDateRange": "Invalid date range",
    "reports.selectValidDateRange": "Please select a valid date range",
    "reports.exportStarted": "Export started",
    "reports.exportingToExcel": "Your report is being exported to Excel",
    "reports.exportComplete": "Export complete",
    "reports.exportedToExcel": "Your report has been exported to Excel",
    "reports.ordersReport": "Orders Report",
    "reports.error": "Error",
    "login.success": "Login successful",
    "login.failed": "Login failed",
    "login.invalidCredentials": "Invalid email or password",
    "login.loggedOut": "You have been logged out successfully",
    "auth.required": "Authentication required",
    "auth.accessDenied": "Access denied",
    "auth.noPermission": "You don't have permission to access this page",
    "orders.viewDetails": "View Details",
    "orders.orderDetails": "Order Details",
    "orders.updateStatus": "Update Status",
    "orders.pending": "Pending",
    "orders.accepted": "Accepted",
    "orders.inProgress": "In Progress",
    "orders.ready": "Ready",
    "orders.delivered": "Delivered",
    "orders.updated": "Order Updated",
    "orders.statusUpdated": "Order status has been updated successfully",
    "orders.createOrder": "Create Order",
    "order.createOrder": "Create Order",
    "order.createOrderDesc": "Create a new order for a client",
    "order.selectClient": "Select Client",
    "order.noClients": "No clients available",
    "order.orderItems": "Order Items",
    "order.addItem": "Add Item",
    "order.noItems": "No items added to the order",
    "order.submitOrder": "Submit Order",
    "order.addItemDesc": "Add a new item to the order",
    "order.selectProduct": "Select Product",
    "order.noProducts": "No products available",
    "order.error": "Error",
    "order.invalidItem": "Please select a product and enter a valid quantity",
    "order.addItems": "Please add at least one item to the order",
    "order.success": "Success",
    "order.orderCreated": "Order created successfully",
    "common.locale": "en-US",
    "common.submitting": "Submitting...",
    "users.cannotDeleteSelf": "You cannot delete your own account",
    "production.title": "Production",
    "production.subtitle": "Open orders by product",
    "production.allOrders": "All Orders",
    "production.today": "Today",
    "production.thisWeek": "This Week",
    "production.thisMonth": "This Month",
    "production.product": "Product",
    "production.quantity": "Quantity",
    "production.noProducts": "No products to produce",
    "production.productDetails": "Product Details",
    "production.totalQuantity": "Total Quantity",
    "production.viewOrder": "View Order",
    "orders.shareOrder": "Share Order",
    "orders.shareViaWhatsApp": "Share via WhatsApp",
    "orders.sendToClient": "Send to Client",
    "kitchen.contactCustomer": "Contact Customer via WhatsApp",
    "whatsapp.whatsappOrders": "WhatsApp Orders",
    "whatsapp.manageWhatsappOrders": "Manage orders received via WhatsApp",
    "whatsapp.noNumberConfigured": "No WhatsApp Number Configured",
    "whatsapp.pleaseConfigureNumber": "Please configure your WhatsApp business number in",
    "whatsapp.whatsappIntegrationActive": "WhatsApp Integration Active",
    "whatsapp.openWhatsappToViewOrders": "Open WhatsApp to view and process incoming orders.",
    "whatsapp.howToManageOrders": "How to Manage WhatsApp Orders",
    "whatsapp.followTheseSteps": "Follow these steps to manage orders received via WhatsApp",
    "whatsapp.openWhatsapp": "Open WhatsApp",
    "whatsapp.openWhatsappDesc": "Open WhatsApp on your phone or WhatsApp Web on your computer.",
    "whatsapp.openWhatsappWeb": "Open WhatsApp Web",
    "whatsapp.reviewMessages": "Review Messages",
    "whatsapp.reviewMessagesDesc": "Check for new messages from customers using the order template.",
    "whatsapp.createOrder": "Create Order in System",
    "whatsapp.createOrderDesc":
      "After receiving an order via WhatsApp, create it in the system to track and process it.",
    "whatsapp.confirmOrder": "Confirm Order with Customer",
    "whatsapp.confirmOrderDesc":
      "Reply to the customer to confirm their order has been received and is being processed.",
    "whatsapp.orderButton": "Order Button",
    "whatsapp.orderButtonDesc": "Share this button with customers to place orders via WhatsApp",
    "whatsapp.orderQRCode": "Order QR Code",
    "whatsapp.orderQRCodeDesc": "Display this QR code in your store for easy ordering",
    "whatsapp.newOrderRequest": "New Order Request",
    "whatsapp.orderInstructions": "Please fill out the following information to place your order:",
    "whatsapp.orderDetails": "Order Details",
    "whatsapp.productQuantityFormat": "Product name - Quantity",
    "whatsapp.specialInstructions": "Special Instructions",
    "whatsapp.thankYou": "Thank you for your order!",
    "whatsapp.orderViaWhatsApp": "Order via WhatsApp",
    "whatsapp.scanToOrder": "Scan to Order",
    "whatsapp.scanQRCodeToOrder": "Scan this QR code with your phone to place an order via WhatsApp",
    "settings.title": "Settings",
    "settings.subtitle": "Configure your application settings",
    "settings.general": "General",
    "settings.whatsappIntegration": "WhatsApp Integration",
    "settings.configureWhatsappNumber": "Configure your WhatsApp business phone number for order processing",
    "settings.whatsappBusinessNumber": "WhatsApp Business Number",
    "settings.whatsappNumberFormat":
      "Enter your full number with country code, no spaces or special characters (e.g., 5511999999999)",
    "settings.whatsappOrderButton": "WhatsApp Order Button",
    "settings.whatsappOrderButtonDesc": "Add this button to your website or share the link with customers",
    "settings.whatsappQRCode": "WhatsApp QR Code",
    "settings.whatsappQRCodeDesc": "Display this QR code in your store for customers to scan and place orders",
    "settings.downloadQRCode": "Download QR Code",
    "settings.generalSettings": "General Settings",
    "settings.generalSettingsDesc": "Configure general application settings",
    "settings.comingSoon": "Coming soon",
    "settings.error": "Error",
    "settings.enterValidNumber": "Please enter a valid phone number",
    "settings.success": "Success",
    "settings.whatsappNumberSaved": "WhatsApp business number saved successfully",
  },
  "pt-BR": {
    "common.dashboard": "Painel",
    "common.kitchen": "Cozinha",
    "common.production": "Produção",
    "common.clients": "Clientes",
    "common.orders": "Pedidos",
    "common.newOrder": "Novo Pedido",
    "common.products": "Produtos",
    "common.staff": "Funcionários",
    "common.reports": "Relatórios",
    "common.logout": "Sair",
    "common.login": "Entrar",
    "common.email": "Email",
    "common.password": "Senha",
    "common.cancel": "Cancelar",
    "common.save": "Salvar",
    "common.add": "Adicionar",
    "common.edit": "Editar",
    "common.delete": "Excluir",
    "common.search": "Buscar",
    "common.status": "Status",
    "common.total": "Total",
    "common.subtotal": "Subtotal",
    "common.tax": "Imposto",
    "common.name": "Nome",
    "common.phone": "Telefone",
    "common.details": "Detalhes",
    "common.viewDetails": "Ver Detalhes",
    "common.noResults": "Nenhum resultado encontrado",
    "common.welcome": "Bem-vindo de volta",
    "common.demoAccounts": "Contas de demonstração:",
    "common.manager": "Gerente",
    "common.employee": "Funcionário",
    "common.sales": "Vendas",
    "common.enterCredentials": "Digite suas credenciais para acessar sua conta",
    "common.product": "Produto",
    "common.client": "Cliente",
    "common.date": "Data",
    "common.order": "Pedido",
    "common.actions": "Ações",
    "common.loading": "Carregando...",
    "common.from": "de",
    "status.pending": "Pendente",
    "status.accepted": "Aceito",
    "status.inProgress": "Em Andamento",
    "status.ready": "Pronto",
    "status.delivered": "Entregue",
    "status.all": "Todos os Pedidos",
    "dashboard.title": "Painel",
    "dashboard.subtitle": "Visão geral do seu negócio",
    "dashboard.totalOrders": "Total de Pedidos",
    "dashboard.pendingOrders": "Pedidos Pendentes",
    "dashboard.totalProducts": "Total de Produtos",
    "dashboard.totalClients": "Total de Clientes",
    "dashboard.recentActivity": "Atividade Recente",
    "dashboard.overview": "Visão geral de pedidos recentes e atividade do sistema",
    "dashboard.fromLastMonth": "+12% em relação ao mês passado",
    "dashboard.requiresAttention": "Requer atenção",
    "dashboard.addedThisWeek": "+2 adicionados esta semana",
    "dashboard.manageInSection": "Gerenciar na seção Clientes",
    "dashboard.newOrderReceived": "Novo pedido recebido",
    "dashboard.orderFrom": "Pedido #1234 de John Doe",
    "dashboard.minutesAgo": "5 minutos atrás",
    "dashboard.productUpdated": "Produto atualizado",
    "dashboard.chocolateCakeUpdated": '"Bolo de Chocolate" preço atualizado',
    "dashboard.hoursAgo": "2 horas atrás",
    "dashboard.newClientAdded": "Novo cliente adicionado",
    "dashboard.sarahJohnsonAdded": '"Sarah Johnson" adicionada como cliente',
    "dashboard.dayAgo": "1 dia atrás",
    "dashboard.error": "Erro ao carregar o painel",
    "dashboard.noRecentActivity": "Nenhuma atividade recente",
    "orders.title": "Pedidos",
    "orders.subtitle": "Visualize e gerencie todos os pedidos",
    "orders.searchPlaceholder": "Buscar pedidos...",
    "orders.orderNumber": "Pedido #",
    "orders.customerInfo": "Informações do Cliente",
    "orders.orderItems": "Itens do Pedido",
    "orders.noOrders": "Nenhum pedido encontrado",
    "orders.items": "item(ns)",
    "orders.note": "Observação",
    "orders.error": "Erro",
    "orders.selectProduct": "Por favor, selecione um produto",
    "orders.itemAdded": "Item adicionado",
    "orders.addedToOrder": "adicionado ao pedido",
    "orders.selectClient": "Por favor, selecione um cliente",
    "orders.emptyOrder": "Seu pedido está vazio",
    "orders.createNewOrder": "Criar Novo Pedido",
    "orders.createOrderForClient": "Criar um novo pedido para um cliente",
    "orders.clientInfo": "Informações do Cliente",
    "orders.selectClientLabel": "Selecionar Cliente",
    "orders.selectClientPlaceholder": "Selecione um cliente",
    "orders.addItems": "Adicionar Itens",
    "orders.selectProducts": "Selecione produtos para adicionar ao pedido",
    "orders.quantity": "Quantidade",
    "orders.specialInstructions": "Instruções Especiais",
    "orders.specialRequests": "Quaisquer solicitações ou instruções especiais",
    "orders.addToOrder": "Adicionar ao Pedido",
    "orders.orderSummary": "Resumo do Pedido",
    "orders.itemsInOrder": "item(ns) no seu pedido",
    "orders.addItemsToOrder": "Adicione alguns itens ao seu pedido",
    "orders.placeOrder": "Fazer Pedido",
    "orders.orderConfirmed": "Pedido Confirmado!",
    "orders.thankYou": "Obrigado pelo seu pedido. Começaremos a prepará-lo imediatamente.",
    "orders.orderDetails": "Detalhes do Pedido",
    "orders.customerInfo": "Informações do Cliente",
    "orders.estimatedTime": "Tempo Estimado de Preparação",
    "orders.readyIn": "Seu pedido estará pronto em aproximadamente 20-30 minutos",
    "orders.returnHome": "Voltar para a Página Inicial",
    "orders.placedOn": "Realizado em",
    "orders.noOrderDetails": "Não foi possível encontrar os detalhes do seu pedido",
    "orders.placeNewOrder": "Fazer um Novo Pedido",
    "kitchen.accept": "Aceitar",
    "kitchen.startPreparing": "Iniciar Preparo",
    "kitchen.markReady": "Marcar como Pronto",
    "kitchen.delivered": "Entregue",
    "kitchen.acceptOrder": "Aceitar Pedido",
    "kitchen.startPreparingOrder": "Iniciar Preparo",
    "kitchen.markReadyOrder": "Marcar como Pronto",
    "kitchen.markDelivered": "Marcar como Entregue",
    "kitchen.orderUpdated": "Pedido atualizado",
    "kitchen.statusChangedToAccepted": "status alterado para aceito",
    "kitchen.statusChangedToInProgress": "status alterado para em andamento",
    "kitchen.statusChangedToReady": "status alterado para pronto",
    "kitchen.statusChangedToDelivered": "status alterado para entregue",
    "clients.title": "Gerenciamento de Clientes",
    "clients.subtitle": "Gerencie seus clientes",
    "clients.addClient": "Adicionar Novo Cliente",
    "clients.editClient": "Editar Cliente",
    "clients.clientNumber": "Cliente #",
    "clients.noEmail": "Nenhum email fornecido",
    "clients.error": "Erro",
    "clients.requiredFields": "Nome e telefone são obrigatórios",
    "clients.added": "Cliente adicionado",
    "clients.hasBeenAdded": "foi adicionado aos seus clientes",
    "clients.updated": "Cliente atualizado",
    "clients.hasBeenUpdated": "teve suas informações atualizadas",
    "clients.deleted": "Cliente excluído",
    "clients.hasBeenDeleted": "foi excluído com sucesso",
    "clients.addClientDesc": "Adicione um novo cliente ao seu banco de dados",
    "clients.editClientDesc": "Atualize as informações do cliente",
    "users.title": "Gerenciamento de Usuários",
    "users.addUser": "Adicionar Usuário",
    "users.addUserDesc": "Crie uma nova conta de usuário para sua equipe",
    "users.error": "Erro",
    "users.editUser": "Editar Usuário",
    "users.editUserDesc": "Atualizar informações do usuário",
    "users.updated": "Usuário atualizado",
    "users.hasBeenUpdated": "teve suas informações atualizadas",
    "users.leaveBlankToKeep": "Deixe em branco para manter atual",
    "users.noUsers": "Nenhum usuário encontrado",
    "users.role": "Função",
    "users.selectRole": "Selecione a função",
    "users.added": "Usuário adicionado",
    "users.hasBeenAddedAs": "foi adicionado como",
    "users.cannotDelete": "Não é possível excluir",
    "users.cannotDeleteMainManager": "Você não pode excluir a conta do gerente principal",
    "users.deleted": "Usuário excluído",
    "users.hasBeenDeleted": "O usuário foi excluído com sucesso",
    "products.title": "Gerenciamento de Produtos",
    "products.addProduct": "Adicionar Produto",
    "products.editProduct": "Editar Produto",
    "products.description": "Descrição",
    "products.price": "Preço",
    "products.addProductDesc": "Adicione um novo produto ao seu menu",
    "products.editProductDesc": "Atualize as informações do produto",
    "products.added": "Produto adicionado",
    "products.hasBeenAdded": "foi adicionado ao menu",
    "products.updated": "Produto atualizado",
    "products.hasBeenUpdated": "foi atualizado",
    "products.deleted": "Produto excluído",
    "products.hasBeenDeleted": "O produto foi excluído com sucesso",
    "reports.title": "Relatório de Pedidos",
    "reports.subtitle": "Visualize e analise dados de pedidos para diferentes períodos",
    "reports.print": "Imprimir",
    "reports.exportToExcel": "Exportar para Excel",
    "reports.filterOptions": "Opções de Filtro",
    "reports.selectPeriodAndClient": "Selecione um período e cliente para visualizar dados de pedidos",
    "reports.today": "Hoje",
    "reports.thisMonth": "Este Mês",
    "reports.year": "Ano",
    "reports.semester": "Semestre",
    "reports.customRange": "Intervalo Personalizado",
    "reports.selectYear": "Selecionar Ano",
    "reports.selectSemester": "Selecionar Semestre",
    "reports.firstSemester": "Primeiro Semestre (Jan-Jun)",
    "reports.secondSemester": "Segundo Semestre (Jul-Dez)",
    "reports.startDate": "Data Inicial",
    "reports.endDate": "Data Final",
    "reports.applyFilter": "Aplicar Filtro",
    "reports.filterByClient": "Filtrar por Cliente",
    "reports.allClients": "Todos os Clientes",
    "reports.activeFilters": "Filtros Ativos",
    "reports.period": "Período",
    "reports.ordersSummary": "Resumo de Pedidos",
    "reports.ordersFound": "pedidos encontrados para o período selecionado",
    "reports.totalOrders": "Total de Pedidos",
    "reports.totalRevenue": "Receita Total",
    "reports.averageOrderValue": "Valor Médio do Pedido",
    "reports.orderId": "ID do Pedido",
    "reports.customer": "Cliente",
    "reports.noOrdersFoundForPeriod": "Nenhum pedido encontrado para o período selecionado",
    "reports.noOrdersFound": "Nenhum pedido encontrado",
    "reports.noOrdersFoundInRange": "Nenhum pedido foi encontrado no intervalo de datas selecionado",
    "reports.invalidDateRange": "Intervalo de datas inválido",
    "reports.selectValidDateRange": "Por favor, selecione um intervalo de datas válido",
    "reports.exportStarted": "Exportação iniciada",
    "reports.exportingToExcel": "Seu relatório está sendo exportado para Excel",
    "reports.exportComplete": "Exportação concluída",
    "reports.exportedToExcel": "Seu relatório foi exportado para Excel",
    "reports.ordersReport": "Relatório de Pedidos",
    "reports.error": "Erro",
    "login.success": "Login realizado com sucesso",
    "login.failed": "Falha no login",
    "login.invalidCredentials": "Email ou senha inválidos",
    "login.loggedOut": "Você saiu com sucesso",
    "auth.required": "Autenticação necessária",
    "auth.accessDenied": "Acesso negado",
    "auth.noPermission": "Você não tem permissão para acessar esta página",
    "orders.viewDetails": "Ver Detalhes",
    "orders.orderDetails": "Detalhes do Pedido",
    "orders.updateStatus": "Atualizar Status",
    "orders.pending": "Pendente",
    "orders.accepted": "Aceito",
    "orders.inProgress": "Em Andamento",
    "orders.ready": "Pronto",
    "orders.delivered": "Entregue",
    "orders.updated": "Pedido Atualizado",
    "orders.statusUpdated": "O status do pedido foi atualizado com sucesso",
    "orders.createOrder": "Criar Pedido",
    "order.createOrder": "Criar Pedido",
    "order.createOrderDesc": "Criar um novo pedido para um cliente",
    "order.selectClient": "Selecionar Cliente",
    "order.noClients": "Nenhum cliente disponível",
    "order.orderItems": "Itens do Pedido",
    "order.addItem": "Adicionar Item",
    "order.noItems": "Nenhum item adicionado ao pedido",
    "order.submitOrder": "Enviar Pedido",
    "order.addItemDesc": "Adicionar um novo item ao pedido",
    "order.selectProduct": "Selecionar Produto",
    "order.noProducts": "Nenhum produto disponível",
    "order.error": "Erro",
    "order.invalidItem": "Por favor, selecione um produto e insira uma quantidade válida",
    "order.addItems": "Por favor, adicione pelo menos um item ao pedido",
    "order.success": "Sucesso",
    "order.orderCreated": "Pedido criado com sucesso",
    "common.locale": "pt-BR",
    "common.submitting": "Enviando...",
    "users.cannotDeleteSelf": "Você não pode excluir sua própria conta",
    "production.title": "Produção",
    "production.subtitle": "Pedidos abertos por produto",
    "production.allOrders": "Todos os Pedidos",
    "production.today": "Hoje",
    "production.thisWeek": "Esta Semana",
    "production.thisMonth": "Este Mês",
    "production.product": "Produto",
    "production.quantity": "Quantidade",
    "production.noProducts": "Nenhum produto para produzir",
    "production.productDetails": "Detalhes do Produto",
    "production.totalQuantity": "Quantidade Total",
    "production.viewOrder": "Ver Pedido",
    "orders.shareOrder": "Compartilhar Pedido",
    "orders.shareViaWhatsApp": "Compartilhar via WhatsApp",
    "orders.sendToClient": "Enviar para Cliente",
    "kitchen.contactCustomer": "Contatar Cliente via WhatsApp",
    "whatsapp.whatsappOrders": "Pedidos via WhatsApp",
    "whatsapp.manageWhatsappOrders": "Gerenciar pedidos recebidos via WhatsApp",
    "whatsapp.noNumberConfigured": "Nenhum Número de WhatsApp Configurado",
    "whatsapp.pleaseConfigureNumber": "Por favor, configure seu número de WhatsApp comercial em",
    "whatsapp.whatsappIntegrationActive": "Integração com WhatsApp Ativa",
    "whatsapp.openWhatsappToViewOrders": "Abra o WhatsApp para visualizar e processar pedidos recebidos.",
    "whatsapp.howToManageOrders": "Como Gerenciar Pedidos via WhatsApp",
    "whatsapp.followTheseSteps": "Siga estes passos para gerenciar pedidos recebidos via WhatsApp",
    "whatsapp.openWhatsapp": "Abrir WhatsApp",
    "whatsapp.openWhatsappDesc": "Abra o WhatsApp no seu telefone ou o WhatsApp Web no seu computador.",
    "whatsapp.openWhatsappWeb": "Abrir WhatsApp Web",
    "whatsapp.reviewMessages": "Revisar Mensagens",
    "whatsapp.reviewMessagesDesc": "Verifique novas mensagens de clientes usando o modelo de pedido.",
    "whatsapp.createOrder": "Criar Pedido no Sistema",
    "whatsapp.createOrderDesc": "Após receber um pedido via WhatsApp, crie-o no sistema para rastrear e processá-lo.",
    "whatsapp.confirmOrder": "Confirmar Pedido com o Cliente",
    "whatsapp.confirmOrderDesc":
      "Responda ao cliente para confirmar que o pedido foi recebido e está sendo processado.",
    "whatsapp.orderButton": "Botão de Pedido",
    "whatsapp.orderButtonDesc": "Compartilhe este botão com os clientes para fazer pedidos via WhatsApp",
    "whatsapp.orderQRCode": "QR Code para Pedidos",
    "whatsapp.orderQRCodeDesc": "Exiba este QR code em sua loja para facilitar os pedidos",
    "whatsapp.newOrderRequest": "Novo Pedido",
    "whatsapp.orderInstructions": "Por favor, preencha as seguintes informações para fazer seu pedido:",
    "whatsapp.orderDetails": "Detalhes do Pedido",
    "whatsapp.productQuantityFormat": "Nome do produto - Quantidade",
    "whatsapp.specialInstructions": "Instruções Especiais",
    "whatsapp.thankYou": "Obrigado pelo seu pedido!",
    "whatsapp.orderViaWhatsApp": "Pedir via WhatsApp",
    "whatsapp.scanToOrder": "Escaneie para Pedir",
    "whatsapp.scanQRCodeToOrder": "Escaneie este QR code com seu telefone para fazer um pedido via WhatsApp",
    "settings.title": "Configurações",
    "settings.subtitle": "Configure as configurações do aplicativo",
    "settings.general": "Geral",
    "settings.whatsappIntegration": "Integração com WhatsApp",
    "settings.configureWhatsappNumber":
      "Configure seu número de telefone comercial do WhatsApp para processamento de pedidos",
    "settings.whatsappBusinessNumber": "Número Comercial do WhatsApp",
    "settings.whatsappNumberFormat":
      "Digite seu número completo com código do país, sem espaços ou caracteres especiais (ex: 5511999999999)",
    "settings.whatsappOrderButton": "Botão de Pedido WhatsApp",
    "settings.whatsappOrderButtonDesc": "Adicione este botão ao seu site ou compartilhe o link com os clientes",
    "settings.whatsappQRCode": "QR Code do WhatsApp",
    "settings.whatsappQRCodeDesc":
      "Exiba este QR code em sua loja para que os clientes possam escanear e fazer pedidos",
    "settings.downloadQRCode": "Baixar QR Code",
    "settings.generalSettings": "Configurações Gerais",
    "settings.generalSettingsDesc": "Configure as configurações gerais do aplicativo",
    "settings.comingSoon": "Em breve",
    "settings.error": "Erro",
    "settings.enterValidNumber": "Por favor, digite um número de telefone válido",
    "settings.success": "Sucesso",
    "settings.whatsappNumberSaved": "Número comercial do WhatsApp salvo com sucesso",
  },
}
