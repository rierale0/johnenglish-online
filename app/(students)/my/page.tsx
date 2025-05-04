'use client'
import React, { useEffect, useState } from 'react'
import Header from '@/app/global-components/Header'
import { useAuth } from '@/app/(firebase auth)/context/AuthContext'
import NotionEditor from '@/app/global-components/NotionEditor'

export default function MyPage() {
  const { user, loading } = useAuth()
  const [blocks, setBlocks] = useState<any[]|null>(null)
  const [pageId, setPageId] = useState<string|null>(null)
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    if (loading || !user) return
    ;(async () => {
      try {
        // 1) Trae el pageId de Firestore
        const r1 = await fetch(`/api/user-notion-page?uid=${user.uid}`)
        if (!r1.ok) throw new Error('No tienes página asociada')
        const { pageId } = await r1.json()
        setPageId(pageId)

        // 2) Trae los bloques de Notion
        const r2 = await fetch(`/api/notion/read?pageId=${pageId}`)
        if (!r2.ok) throw new Error('Error al leer Notion')
        const { blocks } = await r2.json()
        setBlocks(blocks)
      } catch (e:any) {
        setError(e.message)
      }
    })()
  }, [user, loading])

  return (
    <div>
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">Editor de tu Notion Privado</h1>
        {loading && <p>Cargando usuario…</p>}
        {!loading && !user && <p>Redirigiendo a login…</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!blocks && !error && <p>Cargando contenido…</p>}
        {blocks && pageId && (
          <NotionEditor blocks={blocks} pageId={pageId} />
        )}
      </div>
    </div>
  )
}
