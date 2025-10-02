import { useState, useEffect } from 'react'
import { supabaseService } from '@/lib/supabase'

// Hook para gerenciar sincronização de dados
export function useDataSync() {
  const [isOnline, setIsOnline] = useState(true)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle')

  useEffect(() => {
    // Detectar status de conexão
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const syncData = async () => {
    if (!isOnline) return

    setSyncStatus('syncing')
    try {
      // Aqui você pode implementar a lógica de sincronização
      // Por exemplo, enviar dados locais para o Supabase
      setLastSync(new Date())
      setSyncStatus('idle')
    } catch (error) {
      console.error('Erro na sincronização:', error)
      setSyncStatus('error')
    }
  }

  return {
    isOnline,
    lastSync,
    syncStatus,
    syncData
  }
}

// Hook para gerenciar conflitos de dados
export function useConflictResolution() {
  const [conflicts, setConflicts] = useState<any[]>([])

  const resolveConflict = (conflictId: string, resolution: 'local' | 'remote') => {
    // Implementar lógica de resolução de conflitos
    setConflicts(prev => prev.filter(c => c.id !== conflictId))
  }

  return {
    conflicts,
    resolveConflict
  }
}

// Hook para dados offline
export function useOfflineData() {
  const [offlineData, setOfflineData] = useState<any>({
    transactions: [],
    categories: [],
    investments: [],
    assets: [],
    debts: []
  })

  const saveOffline = (type: string, data: any) => {
    const key = `financas_casal_${type}`
    localStorage.setItem(key, JSON.stringify(data))
    setOfflineData(prev => ({ ...prev, [type]: data }))
  }

  const loadOffline = (type: string) => {
    const key = `financas_casal_${type}`
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  }

  useEffect(() => {
    // Carregar dados offline na inicialização
    const types = ['transactions', 'categories', 'investments', 'assets', 'debts']
    const data: any = {}
    
    types.forEach(type => {
      data[type] = loadOffline(type)
    })
    
    setOfflineData(data)
  }, [])

  return {
    offlineData,
    saveOffline,
    loadOffline
  }
}