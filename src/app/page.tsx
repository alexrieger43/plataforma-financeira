'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  PieChart, 
  Settings, 
  Plus, 
  Minus,
  Filter,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Download,
  Eye,
  MapPin,
  Clock,
  X,
  Edit,
  Trash2,
  Home,
  Heart,
  Users,
  TrendingDownIcon,
  Building,
  Car,
  Smartphone,
  Laptop,
  Sofa,
  Wallet,
  CreditCardIcon,
  BanknoteIcon,
  RotateCcw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, Pie, Tooltip, Legend } from 'recharts'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// DADOS MOCK EXPANDIDOS PARA EXTRATO - MAIS REALISTAS E DETALHADOS
const initialMockTransactions = [
  // Dezembro 2024 - Transações Recentes
  { id: 1, type: 'expense', amount: 1250.00, category: 'Alimentação', description: 'Supermercado Extra', date: '2024-12-15', status: 'completed', location: 'Shopping Center Norte', time: '14:30', method: 'Cartão de Débito' },
  { id: 2, type: 'income', amount: 6500.00, category: 'Salário', description: 'Salário Dezembro', date: '2024-12-01', status: 'completed', location: 'Transferência Bancária', time: '08:00', method: 'PIX' },
  { id: 3, type: 'expense', amount: 850.00, category: 'Transporte', description: 'Combustível + Manutenção', date: '2024-12-14', status: 'completed', location: 'Posto Shell - Av. Paulista', time: '16:45', method: 'Cartão de Crédito' },
  { id: 4, type: 'expense', amount: 1800.00, category: 'Moradia', description: 'Aluguel + Condomínio', date: '2024-12-01', status: 'completed', location: 'Boleto Bancário', time: '09:15', method: 'Débito Automático' },
  { id: 5, type: 'income', amount: 800.00, category: 'Freelance', description: 'Projeto Website', date: '2024-12-10', status: 'completed', location: 'Transferência Online', time: '11:20', method: 'PIX' },
]

const initialMockCategories = [
  { id: 1, name: 'Alimentação', budget: 2000, spent: 1870, color: '#10B981', icon: '🍽️' },
  { id: 2, name: 'Transporte', budget: 1200, spent: 945, color: '#3B82F6', icon: '🚗' },
  { id: 3, name: 'Moradia', budget: 2500, spent: 2250, color: '#8B5CF6', icon: '🏠' },
  { id: 4, name: 'Lazer', budget: 600, spent: 395, color: '#F59E0B', icon: '🎬' },
  { id: 5, name: 'Saúde', budget: 500, spent: 300, color: '#EF4444', icon: '⚕️' },
  { id: 6, name: 'Salário', budget: 0, spent: 0, color: '#10B981', icon: '💼' },
  { id: 7, name: 'Freelance', budget: 0, spent: 0, color: '#3B82F6', icon: '💻' },
]

// Dados iniciais para investimentos
const initialInvestments = [
  { id: 1, name: 'Tesouro Selic', type: 'Renda Fixa', balance: 15000, goalId: 1, goalName: 'Reserva de Emergência', goalProgress: 75 },
  { id: 2, name: 'Ações ITUB4', type: 'Ações', balance: 8500, goalId: 2, goalName: 'Aposentadoria', goalProgress: 42 },
  { id: 3, name: 'Fundo Imobiliário', type: 'FII', balance: 12000, goalId: 3, goalName: 'Casa Própria', goalProgress: 60 },
]

// Dados iniciais para metas
const initialGoals = [
  { 
    id: 1, 
    name: 'Reserva de Emergência', 
    target: 20000, 
    current: 15000, 
    deadline: '2025-06-30',
    monthlyContribution: 1000,
    linkedInvestment: 'Tesouro Selic'
  },
  { 
    id: 2, 
    name: 'Aposentadoria', 
    target: 50000, 
    current: 21000, 
    deadline: '2030-12-31',
    monthlyContribution: 800,
    linkedInvestment: 'Ações ITUB4'
  },
  { 
    id: 3, 
    name: 'Casa Própria', 
    target: 80000, 
    current: 48000, 
    deadline: '2026-12-31',
    monthlyContribution: 1500,
    linkedInvestment: 'Fundo Imobiliário'
  },
]

// Dados iniciais para patrimônio
const initialAssets = [
  { id: 1, name: 'Apartamento', type: 'Imóvel', value: 350000, category: 'Bens Imóveis' },
  { id: 2, name: 'Carro Honda Civic', type: 'Veículo', value: 85000, category: 'Veículos' },
  { id: 3, name: 'Conta Corrente', type: 'Conta', value: 5500, category: 'Contas Bancárias' },
]

// Dados iniciais para dívidas
const initialDebts = [
  { id: 1, name: 'Financiamento Imobiliário', totalAmount: 280000, installmentValue: 1850, installmentsRemaining: 180, dueDate: '2024-12-05' },
  { id: 2, name: 'Cartão de Crédito', totalAmount: 3500, installmentValue: 350, installmentsRemaining: 10, dueDate: '2024-12-15' },
  { id: 3, name: 'Financiamento Carro', totalAmount: 45000, installmentValue: 890, installmentsRemaining: 36, dueDate: '2024-12-20' },
]

const monthlyData = [
  { month: 'Jul', income: 7200, expenses: 5800 },
  { month: 'Ago', income: 6800, expenses: 5400 },
  { month: 'Set', income: 7500, expenses: 6200 },
  { month: 'Out', income: 7100, expenses: 5900 },
  { month: 'Nov', income: 6900, expenses: 5600 },
  { month: 'Dez', income: 7950, expenses: 6760 },
]

export default function FinancasCasal() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedMonth, setSelectedMonth] = useState('01')
  const [selectedYear, setSelectedYear] = useState('2025')
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isAddInvestmentOpen, setIsAddInvestmentOpen] = useState(false)
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false)
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false)
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [dateFilter, setDateFilter] = useState('30-days')
  const [customDateFrom, setCustomDateFrom] = useState('')
  const [customDateTo, setCustomDateTo] = useState('')
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [isTransactionDetailOpen, setIsTransactionDetailOpen] = useState(false)
  
  // Estados para dados
  const [mockTransactions, setMockTransactions] = useState(initialMockTransactions)
  const [mockCategories, setMockCategories] = useState(initialMockCategories)
  const [investments, setInvestments] = useState(initialInvestments)
  const [goals, setGoals] = useState(initialGoals)
  const [assets, setAssets] = useState(initialAssets)
  const [debts, setDebts] = useState(initialDebts)
  
  // Estados para distribuição de gastos (gráfico de pizza na aba Metas)
  const [budgetDistribution, setBudgetDistribution] = useState({
    fixedCosts: 55,
    variableCosts: 30,
    investments: 15
  })
  
  // Estados dos formulários com valores padrão válidos
  const [newTransaction, setNewTransaction] = useState({
    type: 'income',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    method: 'PIX'
  })

  const [newCategory, setNewCategory] = useState({
    name: '',
    budget: '',
    color: '#10B981',
    icon: '💰'
  })

  const [newInvestment, setNewInvestment] = useState({
    name: '',
    type: 'Renda Fixa',
    balance: '',
    goalId: 'none'
  })

  const [newAsset, setNewAsset] = useState({
    name: '',
    type: 'Imóvel',
    value: '',
    category: 'Bens Imóveis'
  })

  const [newDebt, setNewDebt] = useState({
    name: '',
    totalAmount: '',
    installmentValue: '',
    installmentsRemaining: '',
    dueDate: ''
  })

  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    current: '',
    deadline: '',
    monthlyContribution: '',
    linkedInvestment: 'none'
  })

  // Função para zerar todas as informações
  const handleClearAllData = () => {
    if (window.confirm('⚠️ ATENÇÃO: Esta ação irá apagar TODOS os dados (transações, categorias, investimentos, metas, patrimônio e dívidas). Esta ação não pode ser desfeita. Tem certeza que deseja continuar?')) {
      setMockTransactions([])
      setMockCategories([
        { id: 1, name: 'Alimentação', budget: 0, spent: 0, color: '#10B981', icon: '🍽️' },
        { id: 2, name: 'Transporte', budget: 0, spent: 0, color: '#3B82F6', icon: '🚗' },
        { id: 3, name: 'Moradia', budget: 0, spent: 0, color: '#8B5CF6', icon: '🏠' },
        { id: 4, name: 'Lazer', budget: 0, spent: 0, color: '#F59E0B', icon: '🎬' },
        { id: 5, name: 'Saúde', budget: 0, spent: 0, color: '#EF4444', icon: '⚕️' },
        { id: 6, name: 'Salário', budget: 0, spent: 0, color: '#10B981', icon: '💼' },
        { id: 7, name: 'Freelance', budget: 0, spent: 0, color: '#3B82F6', icon: '💻' },
      ])
      setInvestments([])
      setGoals([])
      setAssets([])
      setDebts([])
      setBudgetDistribution({ fixedCosts: 55, variableCosts: 30, investments: 15 })
      setIsSettingsOpen(false)
      alert('✅ Todos os dados foram apagados com sucesso!')
    }
  }

  // Função para resetar formulários
  const resetTransactionForm = () => {
    setNewTransaction({
      type: 'income',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      method: 'PIX'
    })
  }

  const resetCategoryForm = () => {
    setNewCategory({
      name: '',
      budget: '',
      color: '#10B981',
      icon: '💰'
    })
  }

  const resetInvestmentForm = () => {
    setNewInvestment({
      name: '',
      type: 'Renda Fixa',
      balance: '',
      goalId: 'none'
    })
  }

  const resetAssetForm = () => {
    setNewAsset({
      name: '',
      type: 'Imóvel',
      value: '',
      category: 'Bens Imóveis'
    })
  }

  const resetDebtForm = () => {
    setNewDebt({
      name: '',
      totalAmount: '',
      installmentValue: '',
      installmentsRemaining: '',
      dueDate: ''
    })
  }

  const resetGoalForm = () => {
    setNewGoal({
      name: '',
      target: '',
      current: '',
      deadline: '',
      monthlyContribution: '',
      linkedInvestment: 'none'
    })
  }

  // Funções para editar e deletar categorias
  const handleEditCategory = (categoryId: number) => {
    const category = mockCategories.find(cat => cat.id === categoryId)
    if (category) {
      setNewCategory({
        name: category.name,
        budget: category.budget.toString(),
        color: category.color,
        icon: category.icon
      })
      setIsAddCategoryOpen(true)
    }
  }

  const handleDeleteCategory = (categoryId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      setMockCategories(prev => prev.filter(cat => cat.id !== categoryId))
      alert('Categoria excluída com sucesso!')
    }
  }

  // Funções para adicionar novos itens
  const handleAddTransaction = () => {
    if (!newTransaction.type || !newTransaction.amount || !newTransaction.category || !newTransaction.description) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const transaction = {
      id: Math.max(...mockTransactions.map(t => t.id), 0) + 1,
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount.replace(',', '.')),
      category: newTransaction.category,
      description: newTransaction.description,
      date: newTransaction.date,
      status: 'completed',
      location: newTransaction.location || 'Local não informado',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      method: newTransaction.method || 'Não informado'
    }

    setMockTransactions(prev => [transaction, ...prev])
    setIsAddTransactionOpen(false)
    resetTransactionForm()
    alert(`Transação "${transaction.description}" adicionada com sucesso!`)
  }

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.budget) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const categoryExists = mockCategories.some(cat => 
      cat.name.toLowerCase() === newCategory.name.toLowerCase()
    )

    if (categoryExists) {
      alert('Já existe uma categoria com este nome.')
      return
    }

    const category = {
      id: Math.max(...mockCategories.map(c => c.id), 0) + 1,
      name: newCategory.name,
      budget: parseFloat(newCategory.budget.replace(',', '.')),
      spent: 0,
      color: newCategory.color,
      icon: newCategory.icon
    }

    setMockCategories(prev => [...prev, category])
    setIsAddCategoryOpen(false)
    resetCategoryForm()
    alert(`Categoria "${category.name}" criada com sucesso!`)
  }

  const handleAddInvestment = () => {
    if (!newInvestment.name || !newInvestment.type || !newInvestment.balance) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const selectedGoal = goals.find(g => g.id === parseInt(newInvestment.goalId))
    const goalProgress = selectedGoal ? (selectedGoal.current / selectedGoal.target) * 100 : 0

    const investment = {
      id: Math.max(...investments.map(i => i.id), 0) + 1,
      name: newInvestment.name,
      type: newInvestment.type,
      balance: parseFloat(newInvestment.balance.replace(',', '.')),
      goalId: parseInt(newInvestment.goalId) || null,
      goalName: selectedGoal?.name || 'Sem meta',
      goalProgress: goalProgress
    }

    setInvestments(prev => [...prev, investment])
    setIsAddInvestmentOpen(false)
    resetInvestmentForm()
    alert(`Investimento "${investment.name}" adicionado com sucesso!`)
  }

  const handleAddAsset = () => {
    if (!newAsset.name || !newAsset.type || !newAsset.value || !newAsset.category) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const asset = {
      id: Math.max(...assets.map(a => a.id), 0) + 1,
      name: newAsset.name,
      type: newAsset.type,
      value: parseFloat(newAsset.value.replace(',', '.')),
      category: newAsset.category
    }

    setAssets(prev => [...prev, asset])
    setIsAddAssetOpen(false)
    resetAssetForm()
    alert(`Bem "${asset.name}" adicionado com sucesso!`)
  }

  const handleAddDebt = () => {
    if (!newDebt.name || !newDebt.totalAmount || !newDebt.installmentValue || !newDebt.installmentsRemaining || !newDebt.dueDate) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const debt = {
      id: Math.max(...debts.map(d => d.id), 0) + 1,
      name: newDebt.name,
      totalAmount: parseFloat(newDebt.totalAmount.replace(',', '.')),
      installmentValue: parseFloat(newDebt.installmentValue.replace(',', '.')),
      installmentsRemaining: parseInt(newDebt.installmentsRemaining),
      dueDate: newDebt.dueDate
    }

    setDebts(prev => [...prev, debt])
    setIsAddDebtOpen(false)
    resetDebtForm()
    alert(`Dívida "${debt.name}" adicionada com sucesso!`)
  }

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.target || !newGoal.deadline || !newGoal.monthlyContribution) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const goal = {
      id: Math.max(...goals.map(g => g.id), 0) + 1,
      name: newGoal.name,
      target: parseFloat(newGoal.target.replace(',', '.')),
      current: parseFloat(newGoal.current.replace(',', '.')) || 0,
      deadline: newGoal.deadline,
      monthlyContribution: parseFloat(newGoal.monthlyContribution.replace(',', '.')),
      linkedInvestment: newGoal.linkedInvestment || 'Nenhum'
    }

    setGoals(prev => [...prev, goal])
    setIsAddGoalOpen(false)
    resetGoalForm()
    alert(`Meta "${goal.name}" criada com sucesso!`)
  }

  // Função para filtrar transações por data
  const getFilteredTransactions = () => {
    const now = new Date()
    let startDate = new Date()

    switch (dateFilter) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case '7-days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30-days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90-days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case 'this-year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      case 'custom':
        if (customDateFrom && customDateTo) {
          startDate = new Date(customDateFrom)
          const endDate = new Date(customDateTo)
          return mockTransactions.filter(transaction => {
            const transactionDate = new Date(transaction.date)
            const matchesDate = transactionDate >= startDate && transactionDate <= endDate
            const matchesType = transactionTypeFilter === 'all' || transaction.type === transactionTypeFilter
            const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter
            const matchesSearch = searchTerm === '' || 
              transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
            return matchesDate && matchesType && matchesCategory && matchesSearch
          })
        }
        return mockTransactions.filter(transaction => {
          const matchesType = transactionTypeFilter === 'all' || transaction.type === transactionTypeFilter
          const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter
          const matchesSearch = searchTerm === '' || 
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
          return matchesType && matchesCategory && matchesSearch
        })
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    return mockTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date)
      const matchesDate = transactionDate >= startDate
      const matchesType = transactionTypeFilter === 'all' || transaction.type === transactionTypeFilter
      const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter
      const matchesSearch = searchTerm === '' || 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesDate && matchesType && matchesCategory && matchesSearch
    })
  }

  // CÁLCULOS PRINCIPAIS
  const allTransactions = mockTransactions
  const totalIncome = allTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = allTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpenses

  // Cálculos para patrimônio
  const totalInvestments = investments.reduce((sum, inv) => sum + inv.balance, 0)
  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0)
  const totalDebts = debts.reduce((sum, debt) => sum + (debt.installmentValue * debt.installmentsRemaining), 0)
  const netWorth = totalAssets + totalInvestments - totalDebts

  // Para o extrato, usar transações filtradas
  const filteredTransactions = getFilteredTransactions()
  const filteredIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const filteredExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const filteredBalance = filteredIncome - filteredExpenses

  // Preparar dados para o gráfico de pizza
  const pieChartData = mockCategories.map(category => ({
    name: category.name,
    value: category.spent,
    color: category.color
  }))

  // Dados para o gráfico de distribuição de gastos
  const budgetPieData = [
    { name: 'Custos Fixos', value: budgetDistribution.fixedCosts, color: '#EF4444' },
    { name: 'Custos Variáveis', value: budgetDistribution.variableCosts, color: '#F59E0B' },
    { name: 'Investimentos', value: budgetDistribution.investments, color: '#10B981' }
  ]

  // Função para renderizar tooltip customizado
  const renderTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
      const data = props.payload[0]
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-black">{data.name}</p>
          <p className="text-sm text-gray-600">
            R$ {data.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500">
            {((data.value / pieChartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}% do total
          </p>
        </div>
      )
    }
    return null
  }

  // Função para renderizar tooltip do gráfico de distribuição
  const renderBudgetTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
      const data = props.payload[0]
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-black">{data.name}</p>
          <p className="text-sm text-gray-600">{data.value}%</p>
        </div>
      )
    }
    return null
  }

  // Função para abrir detalhes da transação
  const openTransactionDetail = (transaction: any) => {
    setSelectedTransaction(transaction)
    setIsTransactionDetailOpen(true)
  }

  // Função para obter ícone da categoria
  const getCategoryIcon = (category: string) => {
    const categoryData = mockCategories.find(cat => cat.name === category)
    return categoryData?.icon || '💰'
  }

  // Lista de ícones disponíveis para categorias
  const availableIcons = [
    '💰', '🍽️', '🚗', '🏠', '🎬', '⚕️', '💼', '💻', '📈', '🛒', 
    '✈️', '🎓', '👕', '📱', '🏋️', '🎵', '📚', '🎮', '🍕', '☕'
  ]

  // Função para formatar valores com cores
  const formatCurrency = (value: number, showColors = true) => {
    const formatted = value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2 
    })
    
    if (!showColors) return formatted
    
    if (value > 0) {
      return <span className="text-green-600 font-semibold">{formatted}</span>
    } else if (value < 0) {
      return <span className="text-red-600 font-semibold">{formatted}</span>
    } else {
      return <span className="text-gray-600 font-semibold">{formatted}</span>
    }
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Saldo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(balance)}
            </div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome, false)}
            </div>
            <p className="text-xs text-gray-500">Este mês</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses, false)}
            </div>
            <p className="text-xs text-gray-500">Este mês</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Patrimônio Líquido</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(netWorth)}
            </div>
            <p className="text-xs text-gray-500">Ativos - Passivos</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Fluxo de Caixa Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Bar dataKey="income" fill="#10B981" name="Receitas" />
                <Bar dataKey="expenses" fill="#EF4444" name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Gastos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={renderTooltip} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry) => (
                    <span style={{ color: entry.color, fontSize: '12px' }}>
                      {value}
                    </span>
                  )}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Orçamentos */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Controle de Orçamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCategories.map((category) => {
              const percentage = (category.spent / category.budget) * 100
              const isOverBudget = percentage > 100
              
              return (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-black">{category.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {formatCurrency(category.spent, false)} / {formatCurrency(category.budget, false)}
                      </span>
                      {isOverBudget ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className="h-2"
                  />
                  <div className="text-xs text-gray-500">
                    {percentage.toFixed(1)}% do orçamento utilizado
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderGoals = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">Metas Financeiras</h2>
        <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 text-white hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Nova Meta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goal-name" className="text-sm font-medium">Nome da Meta *</Label>
                <Input 
                  id="goal-name" 
                  placeholder="Ex: Viagem Europa, Carro Novo..." 
                  value={newGoal.name}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="goal-target" className="text-sm font-medium">Montante Total *</Label>
                <Input 
                  id="goal-target" 
                  placeholder="0,00" 
                  value={newGoal.target}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, target: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="goal-current" className="text-sm font-medium">Valor Atual</Label>
                <Input 
                  id="goal-current" 
                  placeholder="0,00" 
                  value={newGoal.current}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, current: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="goal-deadline" className="text-sm font-medium">Prazo para Atingir *</Label>
                <Input 
                  id="goal-deadline" 
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="goal-monthly" className="text-sm font-medium">Valor Mensal Aplicado *</Label>
                <Input 
                  id="goal-monthly" 
                  placeholder="0,00" 
                  value={newGoal.monthlyContribution}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, monthlyContribution: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="goal-investment" className="text-sm font-medium">Aplicação Financeira Vinculada</Label>
                <Select value={newGoal.linkedInvestment} onValueChange={(value) => setNewGoal(prev => ({ ...prev, linkedInvestment: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma aplicação (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    {investments.map((investment) => (
                      <SelectItem key={investment.id} value={investment.name}>
                        {investment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddGoalOpen(false)
                    resetGoalForm()
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddGoal}
                  className="flex-1 bg-purple-600 text-white hover:bg-purple-700"
                  disabled={!newGoal.name || !newGoal.target || !newGoal.deadline || !newGoal.monthlyContribution}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Meta
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Metas */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const progressPercentage = (goal.current / goal.target) * 100
          const remainingAmount = goal.target - goal.current
          const daysUntilDeadline = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          const monthsRemaining = Math.max(1, Math.ceil(daysUntilDeadline / 30))
          const suggestedMonthly = remainingAmount / monthsRemaining
          
          return (
            <Card key={goal.id} className="border-purple-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Target className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-black">{goal.name}</h3>
                      <p className="text-sm text-gray-600">
                        Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                        {daysUntilDeadline <= 30 && (
                          <span className="ml-2 text-orange-600 font-medium">
                            ({daysUntilDeadline} dias restantes)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-bold text-purple-600">
                      {progressPercentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">atingido</div>
                    <div className="flex gap-1 mt-2">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Barra de Progresso */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso da Meta</span>
                      <span className="font-medium">{formatCurrency(goal.current, false)} / {formatCurrency(goal.target, false)}</span>
                    </div>
                    <Progress value={Math.min(progressPercentage, 100)} className="h-3" />
                  </div>
                  
                  {/* Informações da Meta */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 block">Valor Mensal</span>
                      <p className="font-semibold text-green-600">{formatCurrency(goal.monthlyContribution, false)}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 block">Faltam</span>
                      <p className="font-semibold text-red-600">{formatCurrency(remainingAmount, false)}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 block">Aplicação</span>
                      <p className="font-semibold text-blue-600">{goal.linkedInvestment}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 block">Sugerido/Mês</span>
                      <p className={`font-semibold ${suggestedMonthly > goal.monthlyContribution ? 'text-orange-600' : 'text-green-600'}`}>
                        {formatCurrency(suggestedMonthly, false)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Alerta se valor mensal insuficiente */}
                  {suggestedMonthly > goal.monthlyContribution && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">
                          Atenção: Para atingir a meta no prazo, seria necessário aplicar {formatCurrency(suggestedMonthly, false)} por mês.
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Meta atingida */}
                  {progressPercentage >= 100 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          🎉 Parabéns! Meta atingida com sucesso!
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
        
        {/* Resumo das Metas */}
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {goals.length}
                </div>
                <div className="text-sm text-purple-800">Metas Ativas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(goals.reduce((sum, goal) => sum + goal.monthlyContribution, 0), false)}
                </div>
                <div className="text-sm text-purple-800">Total Mensal</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(goals.reduce((sum, goal) => sum + goal.target, 0), false)}
                </div>
                <div className="text-sm text-purple-800">Valor Total das Metas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Distribuição de Gastos */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="text-black flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Distribuição Ideal de Gastos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={budgetPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {budgetPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={renderBudgetTooltip} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color, fontSize: '12px' }}>
                        {value}
                      </span>
                    )}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-black mb-4">Ajustar Percentuais</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-sm font-medium text-red-800">Custos Fixos</Label>
                    <span className="text-sm font-bold text-red-600">{budgetDistribution.fixedCosts}%</span>
                  </div>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={budgetDistribution.fixedCosts}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value)
                      const remaining = 100 - newValue
                      const variableRatio = budgetDistribution.variableCosts / (budgetDistribution.variableCosts + budgetDistribution.investments)
                      setBudgetDistribution({
                        fixedCosts: newValue,
                        variableCosts: Math.round(remaining * variableRatio),
                        investments: Math.round(remaining * (1 - variableRatio))
                      })
                    }}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-600 mt-1">Moradia, transporte, educação, etc.</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-sm font-medium text-orange-800">Custos Variáveis</Label>
                    <span className="text-sm font-bold text-orange-600">{budgetDistribution.variableCosts}%</span>
                  </div>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={budgetDistribution.variableCosts}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value)
                      const remaining = 100 - budgetDistribution.fixedCosts - newValue
                      setBudgetDistribution({
                        ...budgetDistribution,
                        variableCosts: newValue,
                        investments: Math.max(0, remaining)
                      })
                    }}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-600 mt-1">Lazer, viagens, compras extras, etc.</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-sm font-medium text-green-800">Investimentos</Label>
                    <span className="text-sm font-bold text-green-600">{budgetDistribution.investments}%</span>
                  </div>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={budgetDistribution.investments}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value)
                      const remaining = 100 - budgetDistribution.fixedCosts - newValue
                      setBudgetDistribution({
                        ...budgetDistribution,
                        investments: newValue,
                        variableCosts: Math.max(0, remaining)
                      })
                    }}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-600 mt-1">Poupança, ações, fundos, etc.</p>
                </div>
                
                <div className="pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setBudgetDistribution({ fixedCosts: 55, variableCosts: 30, investments: 15 })}
                    className="w-full"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restaurar Padrão (55% / 30% / 15%)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderInvestments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">Investimentos</h2>
        <Dialog open={isAddInvestmentOpen} onOpenChange={setIsAddInvestmentOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 text-white hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Investimento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Investimento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="investment-name" className="text-sm font-medium">Nome do Investimento *</Label>
                <Input 
                  id="investment-name" 
                  placeholder="Ex: Tesouro Direto, Ações PETR4..." 
                  value={newInvestment.name}
                  onChange={(e) => setNewInvestment(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="investment-type" className="text-sm font-medium">Modalidade *</Label>
                <Select value={newInvestment.type} onValueChange={(value) => setNewInvestment(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Renda Fixa">Renda Fixa</SelectItem>
                    <SelectItem value="Ações">Ações</SelectItem>
                    <SelectItem value="FII">Fundos Imobiliários</SelectItem>
                    <SelectItem value="Fundos">Fundos de Investimento</SelectItem>
                    <SelectItem value="Criptomoedas">Criptomoedas</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="investment-balance" className="text-sm font-medium">Saldo Atual *</Label>
                <Input 
                  id="investment-balance" 
                  placeholder="0,00" 
                  value={newInvestment.balance}
                  onChange={(e) => setNewInvestment(prev => ({ ...prev, balance: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="investment-goal" className="text-sm font-medium">Meta Vinculada</Label>
                <Select value={newInvestment.goalId} onValueChange={(value) => setNewInvestment(prev => ({ ...prev, goalId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma meta (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem meta</SelectItem>
                    {goals.map((goal) => (
                      <SelectItem key={goal.id} value={goal.id.toString()}>
                        {goal.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddInvestmentOpen(false)
                    resetInvestmentForm()
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddInvestment}
                  className="flex-1 bg-green-600 text-white hover:bg-green-700"
                  disabled={!newInvestment.name || !newInvestment.type || !newInvestment.balance}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Investimentos */}
      <div className="space-y-4">
        {investments.map((investment) => (
          <Card key={investment.id} className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">{investment.name}</h3>
                      <p className="text-sm text-gray-600">{investment.type}</p>
                    </div>
                  </div>
                  
                  {investment.goalId && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-blue-800">Meta: {investment.goalName}</span>
                        <span className="text-sm font-bold text-blue-600">{investment.goalProgress.toFixed(1)}%</span>
                      </div>
                      <Progress value={investment.goalProgress} className="h-2" />
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(investment.balance, false)}
                  </div>
                  <div className="flex gap-1 mt-2">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 hover:text-red-700">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Total Investido */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-green-800">Total Investido</span>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(totalInvestments, false)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderPatrimony = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">Balanço Patrimonial</h2>
        <Dialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Bem
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Bem</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="asset-name" className="text-sm font-medium">Nome do Bem *</Label>
                <Input 
                  id="asset-name" 
                  placeholder="Ex: Apartamento, Carro, Conta Corrente..." 
                  value={newAsset.name}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="asset-type" className="text-sm font-medium">Tipo *</Label>
                <Select value={newAsset.type} onValueChange={(value) => setNewAsset(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Imóvel">Imóvel</SelectItem>
                    <SelectItem value="Veículo">Veículo</SelectItem>
                    <SelectItem value="Conta">Conta Bancária</SelectItem>
                    <SelectItem value="Eletrônico">Eletrônico</SelectItem>
                    <SelectItem value="Móvel">Móvel</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="asset-category" className="text-sm font-medium">Categoria *</Label>
                <Select value={newAsset.category} onValueChange={(value) => setNewAsset(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bens Imóveis">Bens Imóveis</SelectItem>
                    <SelectItem value="Veículos">Veículos</SelectItem>
                    <SelectItem value="Contas Bancárias">Contas Bancárias</SelectItem>
                    <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                    <SelectItem value="Móveis">Móveis</SelectItem>
                    <SelectItem value="Outros Bens">Outros Bens</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="asset-value" className="text-sm font-medium">Valor Atual *</Label>
                <Input 
                  id="asset-value" 
                  placeholder="0,00" 
                  value={newAsset.value}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, value: e.target.value }))}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddAssetOpen(false)
                    resetAssetForm()
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddAsset}
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  disabled={!newAsset.name || !newAsset.type || !newAsset.value || !newAsset.category}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumo Patrimonial */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total de Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalAssets + totalInvestments, false)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Total de Passivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalDebts, false)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Patrimônio Líquido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(netWorth, false)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Investimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(totalInvestments, false)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ativos por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Ativos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(
                assets.reduce((acc, asset) => {
                  if (!acc[asset.category]) acc[asset.category] = []
                  acc[asset.category].push(asset)
                  return acc
                }, {} as Record<string, typeof assets>)
              ).map(([category, categoryAssets]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-semibold text-black flex items-center gap-2">
                    {category === 'Bens Imóveis' && <Home className="h-4 w-4" />}
                    {category === 'Veículos' && <Car className="h-4 w-4" />}
                    {category === 'Contas Bancárias' && <Wallet className="h-4 w-4" />}
                    {category === 'Eletrônicos' && <Smartphone className="h-4 w-4" />}
                    {category === 'Móveis' && <Sofa className="h-4 w-4" />}
                    {category}
                  </h4>
                  {categoryAssets.map((asset) => (
                    <div key={asset.id} className="flex justify-between items-center pl-6 py-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{asset.name}</span>
                      <span className="font-medium text-blue-600">
                        {formatCurrency(asset.value, false)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pl-6 py-2 bg-blue-100 rounded font-semibold">
                    <span className="text-blue-800">Subtotal {category}</span>
                    <span className="text-blue-600">
                      {formatCurrency(categoryAssets.reduce((sum, asset) => sum + asset.value, 0), false)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Investimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {investments.map((investment) => (
                <div key={investment.id} className="flex justify-between items-center py-2 bg-green-50 rounded px-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">{investment.name}</span>
                    <p className="text-xs text-gray-500">{investment.type}</p>
                  </div>
                  <span className="font-medium text-green-600">
                    {formatCurrency(investment.balance, false)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center py-2 bg-green-100 rounded px-3 font-semibold">
                <span className="text-green-800">Total Investimentos</span>
                <span className="text-green-600">
                  {formatCurrency(totalInvestments, false)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saldos das Contas */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Saldos das Contas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assets.filter(asset => asset.category === 'Contas Bancárias').map((account) => (
              <div key={account.id} className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">{account.name}</span>
                </div>
                <div className="text-xl font-bold">
                  {formatCurrency(account.value)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderDebts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">Dívidas</h2>
        <Dialog open={isAddDebtOpen} onOpenChange={setIsAddDebtOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 text-white hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Dívida
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Dívida</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="debt-name" className="text-sm font-medium">Nome da Dívida *</Label>
                <Input 
                  id="debt-name" 
                  placeholder="Ex: Financiamento Imobiliário, Cartão..." 
                  value={newDebt.name}
                  onChange={(e) => setNewDebt(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="debt-total" className="text-sm font-medium">Valor Total do Empréstimo *</Label>
                <Input 
                  id="debt-total" 
                  placeholder="0,00" 
                  value={newDebt.totalAmount}
                  onChange={(e) => setNewDebt(prev => ({ ...prev, totalAmount: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="debt-installment" className="text-sm font-medium">Valor da Parcela *</Label>
                <Input 
                  id="debt-installment" 
                  placeholder="0,00" 
                  value={newDebt.installmentValue}
                  onChange={(e) => setNewDebt(prev => ({ ...prev, installmentValue: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="debt-installments" className="text-sm font-medium">Parcelas Restantes *</Label>
                <Input 
                  id="debt-installments" 
                  type="number"
                  placeholder="0" 
                  value={newDebt.installmentsRemaining}
                  onChange={(e) => setNewDebt(prev => ({ ...prev, installmentsRemaining: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="debt-due" className="text-sm font-medium">Data de Vencimento *</Label>
                <Input 
                  id="debt-due" 
                  type="date"
                  value={newDebt.dueDate}
                  onChange={(e) => setNewDebt(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddDebtOpen(false)
                    resetDebtForm()
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddDebt}
                  className="flex-1 bg-red-600 text-white hover:bg-red-700"
                  disabled={!newDebt.name || !newDebt.totalAmount || !newDebt.installmentValue || !newDebt.installmentsRemaining || !newDebt.dueDate}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Dívidas */}
      <div className="space-y-4">
        {debts.map((debt) => {
          const remainingAmount = debt.installmentValue * debt.installmentsRemaining
          const paidAmount = debt.totalAmount - remainingAmount
          const progressPercentage = (paidAmount / debt.totalAmount) * 100
          const daysUntilDue = Math.ceil((new Date(debt.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          
          return (
            <Card key={debt.id} className="border-red-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-full">
                      <CreditCardIcon className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">{debt.name}</h3>
                      <p className="text-sm text-gray-600">
                        Próximo vencimento: {new Date(debt.dueDate).toLocaleDateString('pt-BR')}
                        {daysUntilDue <= 7 && (
                          <span className="ml-2 text-red-600 font-medium">
                            ({daysUntilDue} dias)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">
                      {formatCurrency(remainingAmount, false)}
                    </div>
                    <div className="text-sm text-gray-600">restante</div>
                    <div className="flex gap-1 mt-2">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Valor Total:</span>
                      <p className="font-medium">{formatCurrency(debt.totalAmount, false)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Parcela:</span>
                      <p className="font-medium">{formatCurrency(debt.installmentValue, false)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Parcelas Restantes:</span>
                      <p className="font-medium">{debt.installmentsRemaining}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Já Pago:</span>
                      <p className="font-medium text-green-600">{formatCurrency(paidAmount, false)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso do Pagamento</span>
                      <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
        
        {/* Total de Dívidas */}
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-red-800">Total de Dívidas</span>
              <span className="text-2xl font-bold text-red-600">
                {formatCurrency(totalDebts, false)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderTransactions = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-black">Extrato Completo</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-300 text-black hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black text-white hover:bg-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  Adicionar Transação
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type" className="text-sm font-medium">Tipo *</Label>
                    <Select value={newTransaction.type} onValueChange={(value) => setNewTransaction(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">💰 Receita</SelectItem>
                        <SelectItem value="expense">💸 Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amount" className="text-sm font-medium">Valor *</Label>
                    <Input 
                      id="amount" 
                      placeholder="0,00" 
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="category" className="text-sm font-medium">Categoria *</Label>
                  <Select value={newTransaction.category} onValueChange={(value) => setNewTransaction(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-sm font-medium">Descrição *</Label>
                  <Input 
                    id="description" 
                    placeholder="Ex: Supermercado, Combustível, Salário..." 
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="date" className="text-sm font-medium">Data</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="location" className="text-sm font-medium">Local</Label>
                  <Input 
                    id="location" 
                    placeholder="Ex: Shopping Center, Posto Shell..." 
                    value={newTransaction.location}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="method" className="text-sm font-medium">Método de Pagamento</Label>
                  <Select value={newTransaction.method} onValueChange={(value) => setNewTransaction(prev => ({ ...prev, method: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PIX">PIX</SelectItem>
                      <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                      <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                      <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="TED">TED</SelectItem>
                      <SelectItem value="Transferência">Transferência</SelectItem>
                      <SelectItem value="Débito Automático">Débito Automático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsAddTransactionOpen(false)
                      resetTransactionForm()
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleAddTransaction}
                    className="flex-1 bg-black text-white hover:bg-gray-800"
                    disabled={!newTransaction.type || !newTransaction.amount || !newTransaction.category || !newTransaction.description}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 text-center">
                  * Campos obrigatórios
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-black flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar por descrição ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Período</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  <Button
                    variant={dateFilter === 'today' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateFilter('today')}
                    className={dateFilter === 'today' ? 'bg-black text-white' : 'border-gray-300 text-black hover:bg-gray-50'}
                  >
                    Hoje
                  </Button>
                  <Button
                    variant={dateFilter === '7-days' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateFilter('7-days')}
                    className={dateFilter === '7-days' ? 'bg-black text-white' : 'border-gray-300 text-black hover:bg-gray-50'}
                  >
                    7 dias
                  </Button>
                  <Button
                    variant={dateFilter === '30-days' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateFilter('30-days')}
                    className={dateFilter === '30-days' ? 'bg-black text-white' : 'border-gray-300 text-black hover:bg-gray-50'}
                  >
                    30 dias
                  </Button>
                  <Button
                    variant={dateFilter === '90-days' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateFilter('90-days')}
                    className={dateFilter === '90-days' ? 'bg-black text-white' : 'border-gray-300 text-black hover:bg-gray-50'}
                  >
                    90 dias
                  </Button>
                  <Button
                    variant={dateFilter === 'this-year' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateFilter('this-year')}
                    className={dateFilter === 'this-year' ? 'bg-black text-white' : 'border-gray-300 text-black hover:bg-gray-50'}
                  >
                    Este ano
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-32">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Tipo</Label>
                  <Select value={transactionTypeFilter} onValueChange={setTransactionTypeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="income">Receitas</SelectItem>
                      <SelectItem value="expense">Despesas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-40">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Categoria</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {mockCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Transações:</span>
                  <Badge className="bg-black text-white">
                    {filteredTransactions.length}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Receitas:</span>
                  <Badge variant="outline" className="border-green-500 text-green-700">
                    +{formatCurrency(filteredIncome, false)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Despesas:</span>
                  <Badge variant="outline" className="border-red-500 text-red-700">
                    -{formatCurrency(filteredExpenses, false)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Saldo:</span>
                  <Badge 
                    variant="outline" 
                    className={`border-2 ${filteredBalance >= 0 ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700'}`}
                  >
                    {filteredBalance >= 0 ? '+' : ''}{formatCurrency(filteredBalance, false)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Transações */}
      <Card className="border-gray-200">
        <CardContent className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Nenhuma transação encontrada</p>
              <p className="text-sm">Tente ajustar os filtros ou adicionar uma nova transação</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                     onClick={() => openTransactionDetail(transaction)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full text-lg ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {getCategoryIcon(transaction.category)}
                      </div>
                      <div>
                        <p className="font-medium text-black">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{transaction.category}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {transaction.location}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {transaction.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold text-lg ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, false)}
                      </p>
                      <div className="flex items-center justify-end gap-2 text-sm text-gray-500">
                        <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                        <Eye className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalhes da Transação */}
      <Dialog open={isTransactionDetailOpen} onOpenChange={setIsTransactionDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedTransaction && getCategoryIcon(selectedTransaction.category)}</span>
              Detalhes da Transação
            </DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <p className={`text-3xl font-bold ${
                  selectedTransaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedTransaction.type === 'income' ? '+' : '-'}{formatCurrency(selectedTransaction.amount, false)}
                </p>
                <p className="text-lg font-medium text-black mt-2">{selectedTransaction.description}</p>
              </div>
              
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Categoria:</span>
                  <span className="font-medium text-black">{selectedTransaction.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-medium text-black">
                    {new Date(selectedTransaction.date).toLocaleDateString('pt-BR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horário:</span>
                  <span className="font-medium text-black">{selectedTransaction.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Local:</span>
                  <span className="font-medium text-black">{selectedTransaction.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Método:</span>
                  <span className="font-medium text-black">{selectedTransaction.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge className="bg-green-100 text-green-800">
                    ✓ Concluída
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">Categorias e Orçamentos</h2>
        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                Criar Nova Categoria
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category-name" className="text-sm font-medium">Nome da Categoria *</Label>
                <Input 
                  id="category-name" 
                  placeholder="Ex: Educação, Pets, Viagem..." 
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="category-budget" className="text-sm font-medium">Orçamento Mensal *</Label>
                <Input 
                  id="category-budget" 
                  placeholder="0,00" 
                  value={newCategory.budget}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, budget: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="category-icon" className="text-sm font-medium">Ícone</Label>
                <div className="grid grid-cols-10 gap-2 mt-2 p-3 border border-gray-200 rounded-lg max-h-32 overflow-y-auto">
                  {availableIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewCategory(prev => ({ ...prev, icon }))}
                      className={`p-2 text-lg hover:bg-gray-100 rounded transition-colors ${
                        newCategory.icon === icon ? 'bg-black text-white' : 'bg-gray-50'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Ícone selecionado: {newCategory.icon}</p>
              </div>
              
              <div>
                <Label htmlFor="category-color" className="text-sm font-medium">Cor</Label>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="color"
                    id="category-color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <div className="flex-1">
                    <Input 
                      value={newCategory.color}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="#10B981"
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-full text-lg bg-white"
                    style={{ borderColor: newCategory.color, borderWidth: '2px', borderStyle: 'solid' }}
                  >
                    {newCategory.icon}
                  </div>
                  <div>
                    <p className="font-medium text-black">{newCategory.name || 'Nome da Categoria'}</p>
                    <p className="text-sm text-gray-600">
                      Orçamento: {formatCurrency(parseFloat(newCategory.budget) || 0, false)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddCategoryOpen(false)
                    resetCategoryForm()
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddCategory}
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                  disabled={!newCategory.name || !newCategory.budget}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Categoria
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                * Campos obrigatórios
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockCategories.map((category) => {
          const percentage = category.budget > 0 ? (category.spent / category.budget) * 100 : 0
          const remaining = category.budget - category.spent
          
          return (
            <Card key={category.id} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-black flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{category.icon}</span>
                    {category.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={() => handleEditCategory(category.id)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gasto</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(category.spent, false)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Orçamento</span>
                    <span className="font-medium text-black">
                      {formatCurrency(category.budget, false)}
                    </span>
                  </div>
                  {category.budget > 0 && (
                    <>
                      <Progress 
                        value={Math.min(percentage, 100)} 
                        className="h-2" 
                      />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {percentage > 100 ? 'Excedeu em' : 'Restante'}
                        </span>
                        <span className={`font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(Math.abs(remaining), false)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 text-center">
                        {percentage.toFixed(1)}% do orçamento utilizado
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-lg flex items-center justify-center relative">
                  <Home className="h-4 w-4 text-white absolute top-1 left-1" />
                  <Heart className="h-3 w-3 text-white absolute top-1 right-1" />
                  <DollarSign className="h-4 w-4 text-white absolute bottom-1 left-1" />
                  <Users className="h-3 w-3 text-white absolute bottom-1 right-1" />
                </div>
                <h1 className="text-xl font-bold text-black">Finanças de Casal</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="01">Janeiro</SelectItem>
                  <SelectItem value="02">Fevereiro</SelectItem>
                  <SelectItem value="03">Março</SelectItem>
                  <SelectItem value="04">Abril</SelectItem>
                  <SelectItem value="05">Maio</SelectItem>
                  <SelectItem value="06">Junho</SelectItem>
                  <SelectItem value="07">Julho</SelectItem>
                  <SelectItem value="08">Agosto</SelectItem>
                  <SelectItem value="09">Setembro</SelectItem>
                  <SelectItem value="10">Outubro</SelectItem>
                  <SelectItem value="11">Novembro</SelectItem>
                  <SelectItem value="12">Dezembro</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
              
              <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-gray-300 text-black hover:bg-gray-50">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Configurações
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">⚠️ Zona de Perigo</h4>
                      <p className="text-sm text-red-700 mb-4">
                        Esta ação irá apagar TODOS os dados do sistema (transações, categorias, investimentos, metas, patrimônio e dívidas). Esta ação não pode ser desfeita.
                      </p>
                      <Button 
                        onClick={handleClearAllData}
                        variant="destructive"
                        className="w-full bg-red-600 text-white hover:bg-red-700"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Zerar Todas as Informações
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Informações</h4>
                      <div className="space-y-2 text-sm text-blue-700">
                        <p><strong>Versão:</strong> 1.0.0</p>
                        <p><strong>Última atualização:</strong> Dezembro 2024</p>
                        <p><strong>Dados salvos:</strong> Localmente no navegador</p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-gray-50">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Extrato</span>
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center space-x-2">
                <PieChart className="h-4 w-4" />
                <span className="hidden sm:inline">Categorias</span>
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Metas</span>
              </TabsTrigger>
              <TabsTrigger value="investments" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Investimentos</span>
              </TabsTrigger>
              <TabsTrigger value="patrimony" className="flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <span className="hidden sm:inline">Patrimônio</span>
              </TabsTrigger>
              <TabsTrigger value="debts" className="flex items-center space-x-2">
                <CreditCardIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Dívidas</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="dashboard">
            {renderDashboard()}
          </TabsContent>
          <TabsContent value="transactions">
            {renderTransactions()}
          </TabsContent>
          <TabsContent value="categories">
            {renderCategories()}
          </TabsContent>
          <TabsContent value="goals">
            {renderGoals()}
          </TabsContent>
          <TabsContent value="investments">
            {renderInvestments()}
          </TabsContent>
          <TabsContent value="patrimony">
            {renderPatrimony()}
          </TabsContent>
          <TabsContent value="debts">
            {renderDebts()}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}