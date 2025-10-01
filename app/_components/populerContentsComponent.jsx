import React from 'react'
import CourseCard from '../_molecules/CourseCard'
import { Header2 } from '../_atoms/Headers'

const PopularContentsComponent = ( { courses } ) => {
  return (
    <div className="flex flex-col w-full my-4">
        <Header2>Popular Courses</Header2>
        <div className='flex flex-wrap gap-2 justify-center mt-5 w-full'>
          {courses.map((course, index) => (            
            <CourseCard key={index} course={course} />
          ))}
        </div>
    </div>
  )
}

export default PopularContentsComponent