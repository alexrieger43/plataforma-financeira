import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Wifi, WifiOff, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SyncStatusProps {
  isOnline: boolean
  lastSync: Date | null
  syncStatus: 'idle' | 'syncing' | 'error'
  onSync: () => void
}

export function SyncStatus({ isOnline, lastSync, syncStatus, onSync }: SyncStatusProps) {
  const [showDetails, setShowDetails] = useState(false)

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Nunca sincronizado'
    
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Agora mesmo'
    if (minutes < 60) return `${minutes} min atrás`
    
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h atrás`
    
    return date.toLocaleDateString('pt-BR')
  }

  const getSyncIcon = () => {
    if (!isOnline) return <WifiOff className="h-4 w-4 text-red-500" />
    if (syncStatus === 'syncing') return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
    if (syncStatus === 'error') return <AlertCircle className="h-4 w-4 text-red-500" />
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  const getSyncText = () => {
    if (!isOnline) return 'Offline'
    if (syncStatus === 'syncing') return 'Sincronizando...'
    if (syncStatus === 'error') return 'Erro na sincronização'
    return 'Sincronizado'
  }

  const getSyncColor = () => {
    if (!isOnline || syncStatus === 'error') return 'bg-red-100 text-red-800 border-red-200'
    if (syncStatus === 'syncing') return 'bg-blue-100 text-blue-800 border-blue-200'
    return 'bg-green-100 text-green-800 border-green-200'
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getSyncIcon()}
            <span className="text-sm font-medium text-gray-700">
              {getSyncText()}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="h-6 w-6 p-0"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>

        {showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Última sincronização:</span>
              <span>{formatLastSync(lastSync)}</span>
            </div>
            
            <div className="flex justify-between text-xs text-gray-600">
              <span>Status da conexão:</span>
              <Badge variant="outline" className={getSyncColor()}>
                {isOnline ? (
                  <><Wifi className="h-3 w-3 mr-1" /> Online</>
                ) : (
                  <><WifiOff className="h-3 w-3 mr-1" /> Offline</>
                )}
              </Badge>
            </div>

            {isOnline && (
              <Button
                onClick={onSync}
                disabled={syncStatus === 'syncing'}
                size="sm"
                className="w-full mt-2"
              >
                {syncStatus === 'syncing' ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Sincronizar Agora
                  </>
                )}
              </Button>
            )}

            {!isOnline && (
              <div className="text-xs text-gray-500 mt-2">
                Os dados serão sincronizados quando a conexão for restaurada.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Componente de banner para mostrar quando há conflitos
export function ConflictBanner({ conflicts, onResolve }: { 
  conflicts: any[], 
  onResolve: (id: string, resolution: 'local' | 'remote') => void 
}) {
  if (conflicts.length === 0) return null

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            <strong>Conflitos de dados detectados!</strong>
          </p>
          <p className="text-sm text-yellow-600 mt-1">
            Foram encontradas {conflicts.length} alterações conflitantes. 
            Resolva os conflitos para continuar sincronizando.
          </p>
          <div className="mt-3 space-y-2">
            {conflicts.map((conflict) => (
              <div key={conflict.id} className="bg-white p-3 rounded border">
                <p className="text-sm font-medium text-gray-900">
                  {conflict.type}: {conflict.description}
                </p>
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onResolve(conflict.id, 'local')}
                  >
                    Manter Local
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onResolve(conflict.id, 'remote')}
                  >
                    Usar da Nuvem
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}