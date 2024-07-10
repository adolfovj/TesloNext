'use client'

import { Swiper, SwiperSlide } from "swiper/react"
// Modulos que realmente necesitamos para el demo
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

// Es nuestro estilo personalizado 
import './slideshow.css';
import Image from 'next/image';

interface Props {
    images: string[];
    title: string;
    className?: string; // En caso de personalizar clases 
}

export const ProductMobileSlideShow = ({ images, title, className }: Props) => {

  return (
    <div className={ className }>
      {/* 1er Swiper */}
      <Swiper
        style={{
          width: '100vw',
          height: '500px' 
        }}
        pagination={true}
        autoplay={{ // Para que rote
          delay: 2500
        }}
        modules={[FreeMode, Pagination, Autoplay]}
        className="mySwiper2"
      >
          {
            images.map( image => (
              <SwiperSlide key={ image }>
                <Image 
                  width={ 600 }
                  height={ 500 }
                  src={ `/products/${ image }` }
                  alt={ title }
                  className='object-fill'
                />
              </SwiperSlide>
            ))
          }
      </Swiper>
      
    </div>
  )
}