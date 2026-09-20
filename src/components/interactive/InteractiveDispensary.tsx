import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ScanLine, 
  AlertCircle, 
  CheckCircle2, 
  FileCheck, 
  ShieldAlert, 
  ArrowRight, 
  RotateCcw
} from 'lucide-react'

interface MemberProfile {
  id: string
  name: string
  reprocannNumber: string
  expiryDate: string
  status: 'valid' | 'warning' | 'expired'
  monthlyQuotaGrams: number
  consumedGrams: number
  doctor: string
  pathology: string
}

const SAMPLE_MEMBERS: MemberProfile[] = [
  {
    id: 'MEM-089',
    name: 'Valeria Morales',
    reprocannNumber: 'RPC-88421-AR',
    expiryDate: '18 Nov 2026',
    status: 'valid',
    monthlyQuotaGrams: 40,
    consumedGrams: 20,
    doctor: 'Dra. Silvina Ramos (MN 124.901)',
    pathology: 'Dolor crónico neuropático / Insomnio'
  },
  {
    id: 'MEM-104',
    name: 'Esteban Rossi',
    reprocannNumber: 'RPC-91203-AR',
    expiryDate: '04 Oct 2026',
    status: 'valid',
    monthlyQuotaGrams: 40,
    consumedGrams: 35,
    doctor: 'Dr. Alejandro Peña (MN 98.412)',
    pathology: 'Trastorno de ansiedad generalizada'
  },
  {
    id: 'MEM-062',
    name: 'Martín Cabrera',
    reprocannNumber: 'RPC-61048-AR',
    expiryDate: '12 Ene 2026 (Vencido)',
    status: 'expired',
    monthlyQuotaGrams: 40,
    consumedGrams: 40,
    doctor: 'Dr. Julián Soria (MN 110.332)',
    pathology: 'Artritis reumatoidea'
  }
]

export function InteractiveDispensary() {
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(0)
  const [gramsToDispense, setGramsToDispense] = useState(10)
  const [productType, setProductType] = useState<'flower' | 'oil'>('flower')
  const [dispenseSuccess, setDispenseSuccess] = useState(false)

  const member = SAMPLE_MEMBERS[selectedMemberIndex]
  const remainingGrams = member.monthlyQuotaGrams - member.consumedGrams
  const isOverQuota = productType === 'flower' && gramsToDispense > remainingGrams
  const isBlocked = member.status === 'expired' || isOverQuota

  const handleDispense = () => {
    if (isBlocked) return
    setDispenseSuccess(true)
  }

  const handleReset = () => {
    setDispenseSuccess(false)
  }

  return (
    <div className="w-full max-w-6xl mx-auto rounded-3xl bg-[#090e18]/90 border border-emerald-500/20 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(16,185,129,0.12)] p-4 sm:p-7 text-white relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col items-center justify-center text-center gap-3 pb-6 border-b border-white/[0.08]">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-lg font-bold">
              DISPENSARIO SEGURO & CERTIFICACIÓN REPROCANN
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl mx-auto text-center">
            Entrega asistida a socios registrados con validación automática de cupo legal mensual y trazabilidad de lote.
          </p>
        </div>

        {/* Member Switcher for Demo */}
        <div className="flex items-center justify-center bg-[#0d1526] p-1 rounded-2xl border border-white/10 mx-auto">
          {SAMPLE_MEMBERS.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => {
                setSelectedMemberIndex(idx)
                setDispenseSuccess(false)
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedMemberIndex === idx
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {m.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Columna Izquierda: Ficha del Paciente / Socio */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0f172a]/80 border border-white/[0.08] flex flex-col justify-between items-center text-center">
          <div className="w-full flex flex-col items-center text-center">
            <div className="flex flex-col items-center justify-center gap-2 mb-4 text-center w-full">
              <div className="text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Socio Activo</span>
                <h4 className="text-lg font-bold text-white text-center">{member.name}</h4>
                <div className="text-xs text-slate-300 font-mono mt-0.5 text-center">{member.reprocannNumber}</div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 mx-auto ${
                member.status === 'valid'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {member.status === 'valid' ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    REPROCANN Vigente
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-3 h-3" />
                    Vencido / Bloqueado
                  </>
                )}
              </span>
            </div>

            {/* Diagnostic Details */}
            <div className="space-y-2 py-3 border-y border-white/[0.06] text-xs w-full">
              <div className="flex flex-col sm:flex-row justify-between items-center text-center gap-1">
                <span className="text-slate-400">Patología Indicada:</span>
                <span className="text-slate-200 font-medium">{member.pathology}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center text-center gap-1">
                <span className="text-slate-400">Médico Prescriptor:</span>
                <span className="text-slate-200 font-mono">{member.doctor}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center text-center gap-1">
                <span className="text-slate-400">Fecha de Vencimiento:</span>
                <span className={`font-mono font-medium ${member.status === 'expired' ? 'text-rose-400' : 'text-slate-200'}`}>
                  {member.expiryDate}
                </span>
              </div>
            </div>

            {/* Quota Progress Bar */}
            <div className="mt-4 w-full text-center">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400">Cupo Legal Mensual (Max 40g):</span>
                <span className="font-mono font-bold text-emerald-400">
                  {member.consumedGrams}g / {member.monthlyQuotaGrams}g
                </span>
              </div>
              <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    member.consumedGrams >= member.monthlyQuotaGrams ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  }`}
                  style={{ width: `${Math.min((member.consumedGrams / member.monthlyQuotaGrams) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Consumido este mes</span>
                <span className="text-emerald-300 font-semibold">{remainingGrams}g disponibles</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center justify-center gap-1.5 w-full text-center">
            <ScanLine className="w-4 h-4 text-emerald-400" />
            <span>Verificación instantánea con credencial digital con QR</span>
          </div>
        </div>

        {/* Columna Derecha: Terminal de Dispensación */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0f172a]/80 border border-white/[0.08] flex flex-col justify-between">
          {!dispenseSuccess ? (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-center justify-between text-center gap-2">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider text-center">
                  Selección de Medicación & Lote
                </h4>
                <span className="text-xs text-slate-400 font-mono text-center">Báscula Certificada: 0.00g</span>
              </div>

              {/* Selector de Producto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setProductType('flower')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                    productType === 'flower'
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                      : 'bg-black/30 border-white/[0.06] text-slate-400'
                  }`}
                >
                  <div className="font-bold text-xs text-center">Flores Secas Curadas</div>
                  <div className="text-[11px] text-emerald-400 font-mono mt-0.5 text-center">Lote #TRZ-2026-LH04</div>
                  <div className="text-[10px] text-slate-400 mt-1 text-center">THC 20.4% • Stock: 1.480g</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProductType('oil')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                    productType === 'oil'
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                      : 'bg-black/30 border-white/[0.06] text-slate-400'
                  }`}
                >
                  <div className="font-bold text-xs text-center">Aceite Sublingual (30ml)</div>
                  <div className="text-[11px] text-teal-400 font-mono mt-0.5 text-center">Lote #OIL-1:1-B02</div>
                  <div className="text-[10px] text-slate-400 mt-1 text-center">CBD:THC 1:1 • Stock: 42 u</div>
                </button>
              </div>

              {/* Slider de Cantidad (si es flor) */}
              {productType === 'flower' && (
                <div className="p-4 rounded-xl bg-black/30 border border-white/[0.06] space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-center gap-1">
                    <span className="text-slate-300 font-semibold">Cantidad a dispensar:</span>
                    <span className="font-mono text-xl font-black text-emerald-400">
                      {gramsToDispense} <span className="text-xs font-normal text-slate-400">gramos</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    {[5, 10, 15, 20].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setGramsToDispense(val)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                          gramsToDispense === val
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {val}g
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Alerta si está bloqueado */}
              {isOverQuota && (
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Límite excedido: La cantidad seleccionada ({gramsToDispense}g) supera el cupo mensual restante ({remainingGrams}g).
                  </span>
                </div>
              )}

              {member.status === 'expired' && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    Entrega bloqueada: El REPROCANN del socio se encuentra vencido. Se requiere renovación médica.
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={handleDispense}
                disabled={isBlocked}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isBlocked
                    ? 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25'
                }`}
              >
                <FileCheck className="w-4 h-4" />
                <span>Confirmar Entrega & Emitir Remito Digital</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Entrega Registrada & Certificada</h4>
                <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                  Se ha emitido el remito digital #{Math.floor(100000 + Math.random() * 900000)} con firma criptográfica del socio {member.name}. Stock deducido en tiempo real.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] max-w-sm mx-auto text-left text-xs font-mono space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Hash Comprobante:</span>
                  <span className="text-emerald-400 font-bold">SHA-256 VALID</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Nuevo Saldo Restante:</span>
                  <span className="text-white font-bold">{Math.max(0, remainingGrams - gramsToDispense)}g</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Probar otra entrega</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
