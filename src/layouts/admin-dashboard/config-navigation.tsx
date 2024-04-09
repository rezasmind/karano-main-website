import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [

      {
        subheader: t('overview'),
        items: [
          {
            title: t('خانه'),
            path: paths.admin_dashboard.root,
            icon: ICONS.dashboard,
          },
          {
            title: t('مدیریت دسترسی ها'),
            path: paths.admin_dashboard.general.ecommerce,
            icon: ICONS.ecommerce,
          },
          {
            title: t('مدیریت فروش'),
            path: paths.admin_dashboard.general.analytics,
            icon: ICONS.analytics,
          },
          {
            title: t('مدیریت تولید'),
            path: paths.admin_dashboard.general.banking,
            icon: ICONS.banking,
          },
          // {
          //   title: t('مدیریت انبار'),
          //   path: paths.admin_dashboard.general.booking,
          //   icon: ICONS.booking,
          // },
          {
            title: t('مدیریت ارسال'),
            path: paths.admin_dashboard.general.file,
            icon: ICONS.file,
          },
        ],
      },

    ],
    [t]
  );

  return data;
}
