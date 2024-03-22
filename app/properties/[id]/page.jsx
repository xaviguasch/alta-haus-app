'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import PropertyHeaderImage from '@/components/PropertyHeaderImage'
import PropertyDetails from '@/components/PropertyDetails'
import PropertyImages from '@/components/PropertyImages'
import BookmarkButton from '@/components/BookmarkButton'
import SharedButtons from '@/components/SharedButtons'
import PropertyContactForm from '@/components/PropertyContactForm'

import Spinner from '@/components/Spinner'

import { useEffect, useState } from 'react'

import { fetchProperty } from '@/utils/requests'

import { FaArrowLeft } from 'react-icons/fa'

const PropertyPage = () => {
  const { id } = useParams()

  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!id) return
      try {
        const property = await fetchProperty(id)
        setProperty(property)
      } catch (error) {
        console.error('Error fetching property:', error)
      } finally {
        setLoading(false)
      }
    }

    if (property === null) {
      fetchPropertyData()
    }
  }, [id, property])

  return (
    <>
      {loading && <Spinner loading={loading} />}
      {!loading && property && (
        <>
          <PropertyHeaderImage image={property.images[0]} />

          <section>
            <div className='container m-auto py-6 px-6'>
              <Link
                href='/properties'
                className='text-blue-500 hover:text-blue-600 flex items-center'
              >
                <FaArrowLeft className='mr-2' />
                Back to Properties
              </Link>
            </div>
          </section>

          <section className='bg-blue-50'>
            <div className='container m-auto py-10 px-6'>
              <div className='grid grid-cols-1 md:grid-cols-70/30 w-full gap-6'>
                <PropertyDetails property={property} />
                <aside className='space-y-4'>
                  <BookmarkButton property={property} />
                  <SharedButtons property={property} />
                  <PropertyContactForm property={property} />
                </aside>
              </div>
            </div>
          </section>

          <PropertyImages images={property.images} />
        </>
      )}
    </>
  )
}

export default PropertyPage
