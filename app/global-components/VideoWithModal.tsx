import Image from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom"

type VideoWithModalProps = {
  picture: string
  videoUrl: string
  containsVideo?: boolean
}

export default function VideoWithModal({
  picture,
  videoUrl,
  containsVideo = true,
}: VideoWithModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.classList.add('modal-open')
    } else {
      document.body.style.overflow = 'unset'
      document.body.classList.remove('modal-open')
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.body.classList.remove('modal-open')
    }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen])

  const modalContent = isOpen ? (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999] backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
      style={{ zIndex: 9999 }}
    >
      <div
        className="relative w-full max-w-5xl mx-4 aspect-video rounded-2xl bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute -top-4 -right-4 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl hover:bg-gray-200 transition-colors z-[10000] shadow-lg"
          aria-label="Cerrar modal"
        >
          ×
        </button>
        <div className="w-full h-full rounded-2xl overflow-hidden">
          <iframe
            src={videoUrl}
            title="Video testimonial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  ) : null

  return (
    <>
      <div
        className={`relative w-full h-full rounded-2xl overflow-hidden group ${
          containsVideo ? 'cursor-pointer' : ''
        }`}
        onClick={() => containsVideo && setIsOpen(true)}
      >
        <Image
          src={picture}
          alt="Video placeholder"
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {containsVideo && (
          <>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full w-16 h-16 flex items-center justify-center opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-xl">
              <svg
                className="w-8 h-8 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6 4l12 6-12 6V4z" />
              </svg>
            </div>
          </>
        )}
      </div>

      {containsVideo && typeof window !== 'undefined' &&
        createPortal(modalContent, document.body)}
    </>
  )
}
