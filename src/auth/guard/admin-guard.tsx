import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';
import _ from 'lodash';
import { EAdminRole } from 'src/types/admin';

// ----------------------------------------------------------------------

const loginPaths: Record<string, string> = {
  // jwt: paths.auth.jwt.login,
  jwt: paths.auth.admin.login,
  // auth0: paths.auth.auth0.login,
  // amplify: paths.auth.amplify.login,
  // firebase: paths.auth.firebase.login,
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AdminGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return <>{loading ? <SplashScreen /> : <Container>{children}</Container>}</>;
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const router = useRouter();

  const { user, authenticated, method, logout } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const check = useCallback(async () => {
    console.log(user)
    if (!user?.role
      //  || !_.values(EAdminRole).includes(user?.role)
    ) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();

      const loginPath = loginPaths[method];

      const href = `${loginPath}?${searchParams}`;

      router.replace(href);
      console.log('----> <<<<');
    } else {
      console.log('---->');
      setChecked(true);
    }
  }, [authenticated, method, router]);

  useEffect(() => {
    console.log('i called')
    check();
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
