import Image from 'next/image';
import Link from 'next/link';

export default function Header(): JSX.Element {
  return (
    <nav>
      <Link href="/">
        <a>
          <Image src="/assets/logo.svg" alt="logo" width="240" height="26" />
        </a>
      </Link>
    </nav>
  );
}
