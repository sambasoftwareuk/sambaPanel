import React from 'react'
import Photos from './fotograflar/page'
import Videos from './videolar/page'
import Breadcrumb from '../_molecules/BreadCrumb'

const page = () => {
  return (
    <div className='text-center m-8'>
      <Breadcrumb title={"Galeri"} />
        <Photos/>
        <Videos/>
    </div>
  )
}

export default page