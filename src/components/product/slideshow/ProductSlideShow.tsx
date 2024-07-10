'use client'

import { Swiper as SwiperObject} from 'swiper'; // Para el slideshow Escritorio
import { Swiper, SwiperSlide } from "swiper/react"
// Modulos que realmente necesitamos para el demo
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

// Es nuestro estilo personalizado 
import './slideshow.css';
import { useState } from "react";
import Image from 'next/image';
import { ProductImage } from '../product-image/ProductImage';

interface Props {
    images: string[];
    title: string;
    className?: string; // En caso de personalizar clases 
}

export const ProductSlideShow = ({ images, title, className }: Props) => {

  // Se usa para conectar los slideShows
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>();


  return (
    <div className={ className }>
      {/* 1er Swiper */}
      <Swiper
        // style={{
        //   '--swiper-navigation-color': '#fff',
        //   '--swiper-pagination-color': '#fff',
        // } as React.CSSProperties } // Para que no presente error React.CSSProperties
        spaceBetween={10}
        navigation={true}
        autoplay={{ // Para que rote
          delay: 2500
        }}
        thumbs={{ 
          // Para corregir error
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null
        }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mySwiper2"
      >
          {
            images.map( image => (
              <SwiperSlide key={ image }>
                <ProductImage
                  width={ 1024 }
                  height={ 1024 }
                  src={ image }
                  alt={ title }
                  className='rounded-lg object-fill'
                />
              </SwiperSlide>
            ))
          }
      </Swiper>
      
      {/* 2do Swiper */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
          {
            images.map( image => (
              <SwiperSlide key={ image }>
                <ProductImage 
                  width={ 300 }
                  height={ 300 }
                  src={ image }
                  alt={ title }
                  className='rounded-lg object-fill'
                />
              </SwiperSlide>
            ))
          }        
      </Swiper>
    </div>
  )
}


