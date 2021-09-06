import Image from 'next/image';
import Link from 'next/link';

import commonStyles from '../../styles/common.module.scss';

import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <nav className={`${commonStyles.container} ${styles.container}`}>
      <Link href="/">
        <a>
          <Image src="/assets/logo.svg" alt="logo" width="240" height="26" />
        </a>
      </Link>
    </nav>
  );
}
