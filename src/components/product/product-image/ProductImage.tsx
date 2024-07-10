import Image from "next/image";

// Este componente se usa en todo lugar donde se muestre
// la imagen del producto
interface Props {

    src?: string;
    alt:  string;
    className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
    style?: React.StyleHTMLAttributes<HTMLImageElement>['style'];
    width: number;
    height: number;
}

export const ProductImage = ({
    src,
    alt,
    className,
    style,
    width,
    height,
}: Props) => {

    // Si viene el src hay que evaluar
    const localSrc = ( src )
        ? src.startsWith('http') // si viene el http https://urlcompletodelaimagen.jpg
        ? src
        // Si no viene el http | Es una imagen que viene de productos
        : `/products/${ src }`
        : '/imgs/placeholder.jpg'

  return (
    <div>
      <Image
        src={ localSrc }
        width={ width }
        height={ height }
        alt={ alt }
        className={ className }
        style={ style }
      />
    </div>
  );
};
