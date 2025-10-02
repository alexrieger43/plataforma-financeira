import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipos para o banco de dados
export interface Transaction {
  id: number
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
  status: string
  location: string
  time: string
  method: string
  user_id?: string
  created_at?: string
  updated_at?: string
}

export interface Category {
  id: number
  name: string
  budget: number
  spent: number
  color: string
  icon: string
  user_id?: string
  created_at?: string
  updated_at?: string
}

export interface Investment {
  id: number
  name: string
  type: string
  balance: number
  goal_id?: number
  goal_name?: string
  goal_progress?: number
  user_id?: string
  created_at?: string
  updated_at?: string
}

export interface Goal {
  id: number
  name: string
  target: number
  current: number
  user_id?: string
  created_at?: string
  updated_at?: string
}

export interface Asset {
  id: number
  name: string
  type: string
  value: number
  category: string
  user_id?: string
  created_at?: string
  updated_at?: string
}

export interface Debt {
  id: number
  name: string
  total_amount: number
  installment_value: number
  installments_remaining: number
  due_date: string
  user_id?: string
  created_at?: string
  updated_at?: string
}

// Funções para interagir com o banco de dados
export const supabaseService = {
  // Transações
  async getTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) throw error
    return data
  },

  async addTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Categorias
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  },

  async addCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Investimentos
  async getInvestments() {
    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  },

  async addInvestment(investment: Omit<Investment, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('investments')
      .insert([investment])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Metas
  async getGoals() {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  },

  async addGoal(goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('goals')
      .insert([goal])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Ativos
  async getAssets() {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  },

  async addAsset(asset: Omit<Asset, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('assets')
      .insert([asset])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Dívidas
  async getDebts() {
    const { data, error } = await supabase
      .from('debts')
      .select('*')
      .order('due_date')
    
    if (error) throw error
    return data
  },

  async addDebt(debt: Omit<Debt, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('debts')
      .insert([debt])
      .select()
    
    if (error) throw error
    return data[0]
  }
}