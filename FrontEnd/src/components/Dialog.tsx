import React from "react"
import { MdClose } from "react-icons/md"

interface DialogProps {
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
  children: React.ReactNode
  title?: string
}

const Dialog = ({ isOpen, onCancel, onConfirm, children, title }: DialogProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900/95 border border-emerald-500/20 text-slate-100 rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <h3 className="text-lg font-extrabold text-white tracking-tight">
            {title || "Confirmation"}
          </h3>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto max-h-[60vh]">{children}</div>

        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800/90 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition border border-slate-700 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-sm font-bold transition shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dialog
