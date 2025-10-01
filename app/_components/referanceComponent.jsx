import React from 'react'
import { Header3 } from '../_atoms/Headers'
import { LogoImage } from '../_atoms/Images'

const ReferenceComponent = ({ referanceImages }) => {
  return (
    <div className="flex flex-col items-center text-center my-4">
        <Header3 className="text-xl font-semibold mb-4">
          Success Stories from Companies
        </Header3>
        <div className="flex flex-wrap justify-center gap-4 my-2">
          {referanceImages.map((image, index) => (
            <LogoImage key={index} imageLink={`/samplelogos/${image.link}`} width={150} height={50} />
          ))}
        </div>
      </div>
  )
}

export default ReferenceComponent