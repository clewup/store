import { type NextRequest, NextResponse as response } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET (request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const latest = searchParams.get('latest')
  const id = searchParams.get('id')
  const category = searchParams.get('category')
  const subcategory = searchParams.get('subcategory')

  if (id) {
    const product = await prisma.product.findUnique({ include: { category: true, subcategory: true }, where: { id: Number(id) } })
    if (!product) return response.json({}, { status: 404 })

    return response.json(product)
  }

  if (latest) {
    const products = await prisma.product.findMany({ include: { category: true, subcategory: true }, orderBy: { createdAt: 'desc' } })
    return response.json(products)
  }

  if (category) {
    const products = await prisma.product.findMany({ include: { category: true, subcategory: true }, where: { category: { name: category } }, orderBy: { createdAt: 'desc' } })
    return response.json(products)
  }

  if (subcategory) {
    const products = await prisma.product.findMany({ include: { category: true, subcategory: true }, where: { subcategory: { name: subcategory } }, orderBy: { createdAt: 'desc' } })
    return response.json(products)
  }

  const products = await prisma.product.findMany({ include: { category: true, subcategory: true } })
  return response.json(products)
}
