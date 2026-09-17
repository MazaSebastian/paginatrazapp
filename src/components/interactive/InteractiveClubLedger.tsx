import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  Layers
} from 'lucide-react'

interface MemberFee {
  id: string
  name: string
  reprocann: string
  tier: string
  amount: string
  status: 'paid' | 'pending' | 'overdue'
  dueDate: string
}

const MEMBERS_FEES: MemberFee[] = [
  { id: '1', name: 'Ignacio Varela', reprocann: 'RPC-77401', tier: 'Cultivo Solidario 40g', amount: '$65.000', status: 'paid', dueDate: '10/05/2026' },
  { id: '2', name: 'Carolina Méndez', reprocann: 'RPC-89124', tier: 'Cultivo Solidario 20g', amount: '$38.000', status: 'paid', dueDate: '10/05/2026' },
  { id: '3', name: 'Rodrigo Benítez', reprocann: 'RPC-90412', tier: 'Cultivo Solidario 40g', amount: '$65.000', status: 'pending', dueDate: '15/05/2026' },
  { id: '4', name: 'Laura Santillán', reprocann: 'RPC-64821', tier: 'Cultivo Solidario 30g', amount: '$52.000', status: 'overdue', dueDate: '05/05/2026' },
  { id: '5', name: 'Joaquín Pereyra', reprocann: 'RPC-99312', tier: 'Cultivo Solidario 40g', amount: '$65.000', status: 'paid', dueDate: '10/05/2026' },
]

export function InteractiveClubLedger() {
  const [activeTab, setActiveTab] = useState<'members' | 'costs' | 'audit'>('members')
  const [remindersSent, setRemindersSent] = useState<Record<string, boolean>>({})
  const [isExporting, setIsExporting] = useState(false)
  const [exportNotice, setExportNotice] = useState(false)

  const handleSendReminder = (id: string) => {
    setRemindersSent(prev => ({ ...prev, [id]: true }))
  }

  const handleExportAudit = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      setExportNotice(true)
      setTimeout(() => setExportNotice(false), 4000)
    }, 800)
  }

  return (
    <div className="w-full max-w-6xl mx-auto rounded-3xl bg-[#090e18]/90 border border-emerald-500/20 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(16,185,129,0.12)] p-4 sm:p-7 text-white relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-lg font-bold">
              GOBERNANZA DE CLUBES & REPORTES OFICIALES
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Cobro automatizado de membresías con Mercado Pago, costeo por gramo y generación del libro foliado para ARICCAME.
          </p>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportAudit}
          disabled={isExporting}
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer shrink-0"
        >
          <Download className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
          <span>{isExporting ? 'Generando Reporte...' : 'Descargar Libro Foliado (PDF)'}</span>
        </button>
      </div>

      {/* Export Alert Notification */}
      {exportNotice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              <strong>Libro de Actas & Trazabilidad generado:</strong> Cumple con el formato oficial de auditoría ARICCAME / INASE (Res. 142/2024).
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-300">Descarga lista</span>
        </motion.div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 my-6">
        <div className="p-4 rounded-2xl bg-[#0f172a]/70 border border-white/[0.08]">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Socios Activos</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white">84 / 100</div>
          <div className="text-[11px] text-emerald-400 mt-1">84% de ocupación de cupo</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f172a]/70 border border-white/[0.08]">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Cobranzas Mes Actual</span>
            <DollarSign className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white">$4.820.000</div>
          <div className="text-[11px] text-teal-300 mt-1">94% recaudado vía Mercado Pago</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f172a]/70 border border-white/[0.08]">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Costo x Gramo Real</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white">$680 <span className="text-xs font-normal text-slate-400">/ g</span></div>
          <div className="text-[11px] text-cyan-300 mt-1">-14% vs trimestre anterior</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f172a]/70 border border-white/[0.08]">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Stock en Reserva</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white">8.450 <span className="text-xs font-normal text-slate-400">g</span></div>
          <div className="text-[11px] text-amber-300 mt-1">3 lotes curados disponibles</div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 mb-4">
        <button
          onClick={() => setActiveTab('members')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'members'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Cobranzas & Cuotas Societarias
        </button>
        <button
          onClick={() => setActiveTab('costs')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'costs'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Desglose de Costos de Cultivo
        </button>
      </div>

      {/* Tab 1: Tabla de Cobranzas */}
      {activeTab === 'members' ? (
        <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-[#0f172a]/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/30 text-slate-400 font-mono text-[11px] uppercase border-b border-white/[0.06]">
              <tr>
                <th className="p-3">Socio / Paciente</th>
                <th className="p-3">Carnet REPROCANN</th>
                <th className="p-3">Plan Solidario</th>
                <th className="p-3">Monto Cuota</th>
                <th className="p-3">Estado de Pago</th>
                <th className="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {MEMBERS_FEES.map((fee) => {
                const isSent = remindersSent[fee.id]
                return (
                  <tr key={fee.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 font-semibold text-white">{fee.name}</td>
                    <td className="p-3 font-mono text-slate-400">{fee.reprocann}</td>
                    <td className="p-3 text-slate-300">{fee.tier}</td>
                    <td className="p-3 font-mono font-bold text-white">{fee.amount}</td>
                    <td className="p-3">
                      {fee.status === 'paid' && (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3" /> Cobrado (MP)
                        </span>
                      )}
                      {fee.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-amber-300 font-semibold text-[11px] bg-amber-500/10 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3" /> Pendiente
                        </span>
                      )}
                      {fee.status === 'overdue' && (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-semibold text-[11px] bg-rose-500/10 px-2 py-0.5 rounded-md">
                          <AlertCircle className="w-3 h-3" /> Vencido
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {fee.status !== 'paid' ? (
                        <button
                          onClick={() => handleSendReminder(fee.id)}
                          disabled={isSent}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all inline-flex items-center gap-1 cursor-pointer ${
                            isSent
                              ? 'bg-white/5 text-slate-500'
                              : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          <Send className="w-3 h-3" />
                          <span>{isSent ? 'Recordatorio Enviado' : 'Link de Pago WhatsApp'}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500">Comprobante emitido</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Tab 2: Desglose de Costos */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#0f172a]/60 border border-white/[0.06]">
          <div className="p-4 rounded-xl bg-black/30 border border-white/[0.04] space-y-2">
            <span className="text-xs text-slate-400 uppercase font-mono">Energía & Climatización</span>
            <div className="text-xl font-bold font-mono text-white">$280 <span className="text-xs font-normal text-slate-400">/ g (41%)</span></div>
            <p className="text-[11px] text-slate-300">
              LEDs Samsung LM301H + extracción forzada con velocidad variable automatizada por sensores.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/30 border border-white/[0.04] space-y-2">
            <span className="text-xs text-slate-400 uppercase font-mono">Insumos & Bio-Nutrición</span>
            <div className="text-xl font-bold font-mono text-white">$190 <span className="text-xs font-normal text-slate-400">/ g (28%)</span></div>
            <p className="text-[11px] text-slate-300">
              Living Soil reutilizable, extractos botánicos, micorrizas y control biológico sin pesticidas.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/30 border border-white/[0.04] space-y-2">
            <span className="text-xs text-slate-400 uppercase font-mono">Personal & Agronomía</span>
            <div className="text-xl font-bold font-mono text-white">$210 <span className="text-xs font-normal text-slate-400">/ g (31%)</span></div>
            <p className="text-[11px] text-slate-300">
              Ingeniero agrónomo responsable, manicuradores profesionales y directores técnicos de sala.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
