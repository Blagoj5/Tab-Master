import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" passHref>
      <a className="flex items-center pl-2">
        <Image src="/icon128.png" alt="No Image" width="60" height="60" />
        <h3 className="text-2xl text-gray-300">tab master</h3>
      </a>
    </Link>
  );
}
