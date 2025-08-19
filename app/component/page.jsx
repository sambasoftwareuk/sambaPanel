
import SliderComponent from '../_components/sliderComponent'
import images from '../mocks/images.json'
import sliderData from '../mocks/sliderData.json'

const page = () => {
  return (
    <div>
      <SliderComponent images={images} size={"lg"} sliderData={sliderData} />
    </div>
  )
}

export default page