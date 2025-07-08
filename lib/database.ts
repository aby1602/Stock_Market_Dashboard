// Simulated database using localStorage with persistence
export class SimulatedDatabase {
  private static instance: SimulatedDatabase
  private storageKey = "stocksim_data"

  static getInstance(): SimulatedDatabase {
    if (!SimulatedDatabase.instance) {
      SimulatedDatabase.instance = new SimulatedDatabase()
    }
    return SimulatedDatabase.instance
  }

  private getData() {
    if (typeof window === "undefined") return null
    try {
      const data = localStorage.getItem(this.storageKey)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return null
    }
  }

  private saveData(data: any) {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data))
      console.log("Data saved to localStorage:", data)
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }

  getUsers() {
    const data = this.getData()
    const users = data?.users || []
    console.log("Retrieved users from database:", users)
    return users
  }

  saveUsers(users: any[]) {
    const data = this.getData() || {}
    data.users = users
    this.saveData(data)
    console.log("Saved users to database:", users)
  }

  getStocks() {
    const data = this.getData()
    return data?.stocks || []
  }

  saveStocks(stocks: any[]) {
    const data = this.getData() || {}
    data.stocks = stocks
    this.saveData(data)
  }

  getTrades() {
    const data = this.getData()
    return data?.trades || []
  }

  saveTrades(trades: any[]) {
    const data = this.getData() || {}
    data.trades = trades
    this.saveData(data)
  }

  getNews() {
    const data = this.getData()
    return data?.news || []
  }

  saveNews(news: any[]) {
    const data = this.getData() || {}
    data.news = news
    this.saveData(data)
  }

  getParticipants() {
    const data = this.getData()
    return data?.participants || []
  }

  saveParticipants(participants: any[]) {
    const data = this.getData() || {}
    data.participants = participants
    this.saveData(data)
  }

  getActivityLogs() {
    const data = this.getData()
    return data?.activityLogs || []
  }

  saveActivityLogs(logs: any[]) {
    const data = this.getData() || {}
    data.activityLogs = logs
    this.saveData(data)
  }

  getSystemState() {
    const data = this.getData()
    return (
      data?.systemState || {
        lastReset: new Date(),
        totalUsers: 0,
        totalTrades: 0,
        systemStatus: "active",
      }
    )
  }

  saveSystemState(state: any) {
    const data = this.getData() || {}
    data.systemState = state
    this.saveData(data)
  }

  resetAll() {
    localStorage.removeItem(this.storageKey)
    console.log("All data cleared from localStorage")
  }

  // Force initialize users - useful for debugging
  forceInitializeUsers() {
    const mockUsers = [
      {
        id: "admin_1",
        email: "admin@stocksim.com",
        role: "admin",
        name: "System Administrator",
        username: "@admin_stocksim",
        password: "admin123",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      },
      {
        id: "employee_1",
        email: "employee@stocksim.com",
        role: "employee",
        name: "Trading Employee",
        username: "@employee_stocksim",
        password: "emp123",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      },
      {
        id: "participant_1",
        email: "participant@stocksim.com",
        role: "participant",
        name: "Demo Participant",
        username: "@participant_stocksim",
        password: "part123",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      },
    ]
    this.saveUsers(mockUsers)
    console.log("Force initialized users:", mockUsers)
    return mockUsers
  }
}
