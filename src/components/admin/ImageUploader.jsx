import { useState, useRef } from 'react'
import { validateImageFile } from '../../services/storage'

/**
 * ImageUploader — Handles Main image & Gallery images selection, preview, and staging.
 *
 * @param {string|null} existingMainImage - Existing main image public URL
 * @param {File|null} stagedMainFile - Selected new File for main image
 * @param {function} onMainImageChange - Callback (file: File|null, previewUrl: string|null)
 * @param {string[]} existingGallery - Array of existing gallery image URLs
 * @param {File[]} stagedGalleryFiles - Array of staged new Files for gallery
 * @param {function} onGalleryChange - Callback ({ existing: string[], staged: File[] })
 * @param {boolean} disabled - Disable inputs during submission
 */
const ImageUploader = ({
  existingMainImage = null,
  stagedMainFile = null,
  onMainImageChange,
  existingGallery = [],
  stagedGalleryFiles = [],
  onGalleryChange,
  disabled = false,
}) => {
  const [mainError, setMainError] = useState(null)
  const [galleryError, setGalleryError] = useState(null)
  const [mainDragOver, setMainDragOver] = useState(false)
  const [galleryDragOver, setGalleryDragOver] = useState(false)

  const mainInputRef = useRef(null)
  const galleryInputRef = useRef(null)

  // Derive active main preview URL
  const mainPreview = stagedMainFile
    ? URL.createObjectURL(stagedMainFile)
    : existingMainImage

  // Handle main image file selection
  const handleMainFileSelected = (file) => {
    setMainError(null)
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      setMainError(validation.error)
      return
    }

    onMainImageChange(file, URL.createObjectURL(file))
  }

  // Handle remove main image
  const handleRemoveMainImage = () => {
    setMainError(null)
    onMainImageChange(null, null)
    if (mainInputRef.current) mainInputRef.current.value = ''
  }

  // Handle gallery files selection
  const handleGalleryFilesSelected = (filesList) => {
    setGalleryError(null)
    if (!filesList || filesList.length === 0) return

    const newFiles = Array.from(filesList)
    const validNewFiles = []

    for (const file of newFiles) {
      const validation = validateImageFile(file)
      if (!validation.valid) {
        setGalleryError(validation.error)
        return
      }
      validNewFiles.push(file)
    }

    onGalleryChange({
      existing: existingGallery,
      staged: [...stagedGalleryFiles, ...validNewFiles],
    })

    if (galleryInputRef.current) galleryInputRef.current.value = ''
  }

  // Remove single existing gallery image
  const handleRemoveExistingGalleryImage = (indexToRemove) => {
    const updated = existingGallery.filter((_, i) => i !== indexToRemove)
    onGalleryChange({
      existing: updated,
      staged: stagedGalleryFiles,
    })
  }

  // Remove single staged gallery image
  const handleRemoveStagedGalleryImage = (indexToRemove) => {
    const updated = stagedGalleryFiles.filter((_, i) => i !== indexToRemove)
    onGalleryChange({
      existing: existingGallery,
      staged: updated,
    })
  }

  return (
    <div className="space-y-6">

      {/* ── 1. MAIN IMAGE SECTION ──────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-navy-800">
            Main Product Image <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-gray-400">JPG, PNG, WEBP (Max 5MB)</span>
        </div>

        {mainPreview ? (
          <div className="relative group bg-surface border border-gray-200 rounded-lg p-3 flex flex-col sm:flex-row items-center gap-4">
            <div className="h-28 w-28 shrink-0 bg-white rounded-lg border border-gray-100 overflow-hidden flex items-center justify-center p-2">
              <img
                src={mainPreview}
                alt="Main product preview"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex-1 text-center sm:text-left space-y-1">
              <p className="text-xs font-semibold text-navy-800 truncate max-w-xs">
                {stagedMainFile ? stagedMainFile.name : 'Current Main Image'}
              </p>
              {stagedMainFile && (
                <p className="text-xs text-gray-400">
                  {(stagedMainFile.size / 1024).toFixed(1)} KB • Ready to upload
                </p>
              )}
              <div className="flex items-center gap-2 pt-2 justify-center sm:justify-start">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => mainInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs font-medium text-navy-700 bg-white hover:bg-gray-50 border border-gray-200 rounded transition-colors"
                >
                  Change Image
                </button>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={handleRemoveMainImage}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setMainDragOver(true)
            }}
            onDragLeave={() => setMainDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setMainDragOver(false)
              if (e.dataTransfer.files?.[0]) {
                handleMainFileSelected(e.dataTransfer.files[0])
              }
            }}
            onClick={() => mainInputRef.current?.click()}
            className={[
              'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
              mainDragOver
                ? 'border-navy-500 bg-navy-50/50'
                : 'border-gray-300 hover:border-navy-400 bg-surface/50 hover:bg-surface',
              disabled ? 'opacity-50 cursor-not-allowed' : '',
            ].join(' ')}
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <svg
                className="h-8 w-8 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <div>
                <p className="text-xs font-medium text-navy-800">
                  <span className="text-navy-600 font-semibold underline">Click to upload</span> or drag and drop main image
                </p>
                <p className="text-2xs text-gray-400 mt-0.5">PNG, JPG or WEBP up to 5MB</p>
              </div>
            </div>
          </div>
        )}

        <input
          ref={mainInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleMainFileSelected(e.target.files[0])
            }
          }}
        />

        {mainError && (
          <p className="text-xs text-red-600 mt-1.5" role="alert">
            {mainError}
          </p>
        )}
      </div>

      {/* ── 2. GALLERY IMAGES SECTION ──────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-navy-800">
            Gallery Images (Optional)
          </label>
          <span className="text-xs text-gray-400">Multiple images permitted</span>
        </div>

        {/* Existing & Staged Thumbnails Grid */}
        {(existingGallery.length > 0 || stagedGalleryFiles.length > 0) && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-3">
            {/* Existing images from Supabase Storage */}
            {existingGallery.map((url, idx) => (
              <div
                key={`exist-${idx}`}
                className="relative group aspect-square rounded-lg bg-surface border border-gray-200 overflow-hidden flex items-center justify-center p-1"
              >
                <img
                  src={url}
                  alt={`Gallery ${idx + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => handleRemoveExistingGalleryImage(idx)}
                  className="absolute top-1 right-1 h-5 w-5 bg-red-600/90 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ))}

            {/* Staged files waiting to upload */}
            {stagedGalleryFiles.map((file, idx) => (
              <div
                key={`staged-${idx}`}
                className="relative group aspect-square rounded-lg bg-navy-50/50 border border-navy-300 overflow-hidden flex items-center justify-center p-1"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Staged ${idx + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
                <span className="absolute bottom-1 left-1 bg-navy-700/80 text-white text-3xs px-1 rounded">
                  New
                </span>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => handleRemoveStagedGalleryImage(idx)}
                  className="absolute top-1 right-1 h-5 w-5 bg-red-600/90 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove new image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload dropzone for gallery */}
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setGalleryDragOver(true)
          }}
          onDragLeave={() => setGalleryDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setGalleryDragOver(false)
            if (e.dataTransfer.files) {
              handleGalleryFilesSelected(e.dataTransfer.files)
            }
          }}
          onClick={() => galleryInputRef.current?.click()}
          className={[
            'border border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
            galleryDragOver
              ? 'border-navy-500 bg-navy-50/50'
              : 'border-gray-200 hover:border-navy-300 bg-white hover:bg-surface/50',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
          ].join(' ')}
        >
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <svg
              className="h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>
              <span className="font-semibold text-navy-600 underline">Add gallery photos</span> or drop files here
            </span>
          </div>
        </div>

        <input
          ref={galleryInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            if (e.target.files) {
              handleGalleryFilesSelected(e.target.files)
            }
          }}
        />

        {galleryError && (
          <p className="text-xs text-red-600 mt-1.5" role="alert">
            {galleryError}
          </p>
        )}
      </div>

    </div>
  )
}

export default ImageUploader
