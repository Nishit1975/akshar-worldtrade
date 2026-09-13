import { useState } from 'react'

/**
 * SpecificationsEditor — Key/Value editor for technical product specs.
 *
 * Converts an object like:
 * { "Moisture": "14% Max", "Purity": "99%", "Broken": "5% Max" }
 * to editable rows and outputs the clean JSONB object.
 *
 * @param {Object} value - initial specifications object
 * @param {function} onChange - callback passing the updated specifications object
 */
const COMMON_SPEC_SUGGESTIONS = [
  'Moisture',
  'Purity',
  'Broken Ratio',
  'Average Grain Length',
  'Admixture',
  'Damaged / Discolored',
  'Crop Year',
  'Foreign Matter',
  'Shelf Life',
]

const SpecificationsEditor = ({ value = {}, onChange }) => {
  // Convert object to array of { id, key, val }
  const [rows, setRows] = useState(() => {
    if (value && typeof value === 'object' && Object.keys(value).length > 0) {
      return Object.entries(value).map(([k, v], idx) => ({
        id: `spec-${idx}-${Date.now()}`,
        key: k,
        val: typeof v === 'object' ? JSON.stringify(v) : String(v),
      }))
    }
    // Default starting rows if empty
    return [
      { id: `spec-0-${Date.now()}`, key: 'Moisture', val: '' },
      { id: `spec-1-${Date.now()}`, key: 'Purity', val: '' },
    ]
  })

  // Sync internal rows to parent onChange
  const triggerChange = (updatedRows) => {
    setRows(updatedRows)
    const specObj = {}
    updatedRows.forEach(({ key, val }) => {
      const trimmedKey = (key || '').trim()
      const trimmedVal = (val || '').trim()
      if (trimmedKey) {
        specObj[trimmedKey] = trimmedVal
      }
    })
    onChange?.(specObj)
  }

  // Update a specific row's key or value
  const handleUpdate = (index, field, newValue) => {
    const updated = rows.map((r, i) =>
      i === index ? { ...r, [field]: newValue } : r,
    )
    triggerChange(updated)
  }

  // Add a new empty row
  const handleAddRow = (initialKey = '', initialVal = '') => {
    const newRow = {
      id: `spec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      key: initialKey,
      val: initialVal,
    }
    triggerChange([...rows, newRow])
  }

  // Remove a row
  const handleRemoveRow = (index) => {
    const updated = rows.filter((_, i) => i !== index)
    triggerChange(updated.length > 0 ? updated : [{ id: `spec-${Date.now()}`, key: '', val: '' }])
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-navy-800">
            Technical Specifications
          </label>
          <p className="text-xs text-gray-400">
            Key-value parameters displayed in the product specification table.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleAddRow()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-navy-700 bg-navy-50 hover:bg-navy-100 rounded border border-navy-200 transition-colors"
        >
          <svg
            className="h-3.5 w-3.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Add Specification
        </button>
      </div>

      {/* Rows Container */}
      <div className="bg-surface rounded-lg p-3 sm:p-4 border border-gray-100 space-y-2.5">
        {rows.map((row, idx) => (
          <div
            key={row.id}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white p-2.5 rounded border border-gray-100 shadow-2xs"
          >
            {/* Spec Name / Key */}
            <div className="flex-1">
              <label htmlFor={`spec-key-${row.id}`} className="sr-only">Specification Name</label>
              <input
                id={`spec-key-${row.id}`}
                type="text"
                value={row.key}
                onChange={(e) => handleUpdate(idx, 'key', e.target.value)}
                placeholder="e.g. Moisture, Purity"
                className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy-500 focus:border-navy-500 font-medium text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Separator icon on desktop */}
            <span className="hidden sm:inline text-gray-400 font-semibold">:</span>

            {/* Spec Value */}
            <div className="flex-1">
              <label htmlFor={`spec-val-${row.id}`} className="sr-only">Specification Value</label>
              <input
                id={`spec-val-${row.id}`}
                type="text"
                value={row.val}
                onChange={(e) => handleUpdate(idx, 'val', e.target.value)}
                placeholder="e.g. 14% Max, 99% Min"
                className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy-500 focus:border-navy-500 text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={() => handleRemoveRow(idx)}
              aria-label={`Remove specification ${row.key || idx + 1}`}
              className="self-end sm:self-center p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Remove specification"
            >
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        ))}

        {/* Quick add suggestion badges */}
        <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
          <span className="font-medium text-gray-400">Suggestions:</span>
          {COMMON_SPEC_SUGGESTIONS.map((sug) => {
            const alreadyExists = rows.some(
              (r) => r.key.trim().toLowerCase() === sug.toLowerCase(),
            )
            if (alreadyExists) return null
            return (
              <button
                key={sug}
                type="button"
                onClick={() => handleAddRow(sug, '')}
                className="px-2 py-0.5 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 rounded text-2xs transition-colors"
              >
                + {sug}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SpecificationsEditor
