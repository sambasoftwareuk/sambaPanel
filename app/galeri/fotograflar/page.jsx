import GalleryComponent from "../../_components/GalleryComponent";
import galleryImages from "../../mocks/galleryImages.json";

const Photos = () => {
  const images = galleryImages.map((item) => item.imageLink);

  return <GalleryComponent title="Fotoğraflar" images={images} />;
};

export default Photos;
