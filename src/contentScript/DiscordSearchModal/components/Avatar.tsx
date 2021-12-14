import { useEffect, useState } from 'react';
import { Avatar as AvatarStyle } from '../../../common/styles';

async function imageExists(src: string) {
  return new Promise<boolean>((res) => {
    const img = new Image();
    img.src = src;
    img.onload = () => res(true);
    img.onerror = () => res(false);
  });
}

type Props = {
	src: string;
	name: string;
	className?: string;
}

function Avatar({ src, name, className }: Props) {
  const [isImage, setIsImage] = useState(false);

  useEffect(() => {
    const checkImage = async () => {
      const isExisting = await imageExists(src);
      setIsImage(isExisting);
    };

    checkImage();
  }, []);

  return (
    isImage
      ? (
        <AvatarStyle src={src} alt={name} className={className} />
      )
      : (
        <div className={className}>{name.split(' ').map((word) => word[0].toUpperCase()).slice(0, 2).join('')}</div>
      )
  );
}

export default Avatar;
