'use client'

import { useLockr } from '@/lib/common/contexts/LockrContext/LockrContext'
import useApi from '@/lib/common/hooks/useApi/useApi'
import useAuth from '@/lib/common/hooks/useAuth/useAuth'
import useQueryParams from '@/lib/common/hooks/useQueryParams/useQueryParams'
import { type CategoryWithSubcategoriesType } from '@/types/categoryTypes'
import { Field, Form, Formik } from 'formik'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  ShoppingCart as CartIcon,
  ShoppingBag as BagIcon,
  Search as SearchIcon,
  User as UserIcon
} from 'react-feather'
import constants from '@/constants/constants'

const Header = () => {
  const { queryParams, setQueryParams } = useQueryParams()
  const searchParams = useSearchParams()
  const { user } = useLockr()
  const { signIn } = useAuth({ redirectUri: constants.APP_URL })
  const { get } = useApi()

  const [categoriesWithSubcategories, setCategoriesWithSubcategories] = useState<CategoryWithSubcategoriesType[]>([])

  async function getCategoriesWithSubcategories () {
    const categoriesWithSubcategories = await get<CategoryWithSubcategoriesType[]>('/api/category')
    setCategoriesWithSubcategories(categoriesWithSubcategories)
  }

  useEffect(() => {
    getCategoriesWithSubcategories()
  }, [])

  return (
    <div className="h-[10vh] flex items-center justify-between px-10 bg-black">
      <div className="flex gap-10 items-center">
        <Link href="/" className="flex flex-col items-center">
          <BagIcon size={30} className="text-primary" />
          <p className="text-white text-[8px]">
            STORE
          </p>
        </Link>
        {categoriesWithSubcategories.map((categoryWithSubcategories, index) => (
          <div key={index} className="dropdown dropdown-hover">
            <label tabIndex={0} className="btn btn-ghost text-white btn-lg m-1"><Link href={`/search?category=${categoryWithSubcategories.category}`}>{categoryWithSubcategories.category}</Link></label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              {categoryWithSubcategories.subcategories.map((subcategory, index) => (
                  <li key={index}><Link href={`/search?subcategory=${subcategory}`}>{subcategory}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex gap-10 items-center">
        <Formik
          initialValues={{ search: searchParams.get('search') ?? '' }}
          onSubmit={(formValues) => {
            const updatedQuery = {
              ...queryParams,
              search: formValues.search,
              page: null
            }
            setQueryParams(updatedQuery, '/search')
          }}
        >
          <Form>
            <div className="input-group">
              <Field
                name="search"
                type="text"
                placeholder="Search"
                className="input input-primary"
              />
              <button className="btn btn-square btn-primary">
                <SearchIcon />
              </button>
            </div>
          </Form>
        </Formik>

        <div className="flex justify-end items-center gap-2">
          {(user == null)
            ? (
            <span>
              <button className="btn btn-outline btn-circle btn-sm btn-primary" onClick={signIn}>
                  <UserIcon size={15}/>
              </button>
            </span>
              )
            : (
            <>
              <Link href="/cart">
                <button className="btn btn-outline btn-circle btn-sm btn-primary">
                  <CartIcon size={15}/>
                </button>
              </Link>

              <Link href="/account">
                <button className="btn btn-outline btn-circle btn-sm btn-primary">
                  <UserIcon size={15}/>
                </button>
              </Link>
            </>
              )}
        </div>
      </div>
    </div>
  )
}
export default Header
