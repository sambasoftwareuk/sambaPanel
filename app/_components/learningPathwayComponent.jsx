import React from 'react'
import { Header1 } from '../_atoms/Headers'
import { CareerCard } from '../_molecules/careerCard'
import { OutlinedButton } from '../_atoms/buttons'


const LearningPathwayComponent = ( {careers} ) => {
  return (
    <div>
         <div className="mt-4">
            <Header1>Are you ready to empower yourself?</Header1>
            <p>We are here to help you to empower life in the UK</p>
          </div>
          <div>
            <div className="flex flex-wrap gap-2 justify-center mt-5  ">
              {careers.map((career, index) => (
                <div key={index}>
                  <CareerCard {...career} />
                </div>
              ))}
            </div>
          </div>
          <div className="my-4">
        <OutlinedButton label="All Empowers" />
      </div>
    </div>
  )
}

export default LearningPathwayComponent