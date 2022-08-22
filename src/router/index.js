import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// const API = 'https://api.utm07.duckdns.org';

/* Layout */
import Layout from '@/layout/index.vue'
import artifactFn from '@/views/rules-management/artifact'
/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    name: 'Login',
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/about',
    hidden: true,
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/about/index'),
        name: 'Documentation',
        meta: { title: 'about', icon: 'documentation', affix: true }
      }
    ]
  },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,
  {
    path: '/profile',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'profile', icon: 'user' }
      }
    ]
  },
  {
    path: '/utm-management',
    component: Layout,
    redirect: '/utm-management/node',
    alwaysShow: true, // will always show the root menu
    name: 'EngineManagement',
    meta: {
      title: 'utm_management',
      icon: 'engines',
      // roles: ['admin', 'superadmin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'node',
        component: () => import('@/views/node-management/node-list'),
        name: 'NodeList',
        meta: {
          title: 'node_list',
          icon: 'tree',
          roles: ['admin', 'superadmin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'ips',
        component: () => import('@/views/node-management/ips-list'),
        name: 'IpsList',
        meta: {
          title: 'ips_list',
          icon: 'host',
          roles: ['admin', 'superadmin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'engine',
        component: () => import('@/views/node-management/engine-list'),
        name: 'EngineList',
        meta: {
          title: 'engine_list',
          icon: 'server',
          roles: ['admin', 'superadmin'] // or you can only set roles in sub nav
        }
      },
    ]
  },
  {
    path: '/rules-management',
    component: Layout,
    redirect: '/rules-management/ruleset',
    alwaysShow: true,
    name: 'RuleManagement',
    meta: {
      title: 'rules_management',
      icon: 'rules-management',
      roles: ['admin', 'superadmin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'hostips-ruleset',
        component: artifactFn({application: 'modsec', fileExt: 'zip'}),
        //component: () => import('@/views/rules-management/artifact'),
        name: 'HostRuleset',
        meta: {
          icon: 'ruleset',
          title: 'modsec_ruleset',
          roles: ['admin', 'superadmin']
        }
      },
      {
        path: 'netips-ruleset',
        component: artifactFn({application: 'idssystem', fileExt: 'zip'}),
        name: 'NetRuleset',
        meta: {
          icon: 'ruleset',
          title: 'suricata_ruleset',
          roles: ['admin', 'superadmin']
        }
      },
      {
        path: 'deepinspector',
        component: artifactFn({application: 'deepinspector', fileExt: 'zip'}),
        name: 'PredictionModels',
        meta: {
          icon: 'anomalies',
          title: 'prediction_models',
          roles: ['admin', 'superadmin']
        }
      },      
      
      {
        path: 'blacklisting',
        //component: () => import('@/views/rules-management/specifics'),
        component: artifactFn({application: 'blacklisting', fileExt: 'sql'}),
        name: 'Specifics',
        meta: {
          icon: 'specifics',
          title: 'blacklisting',
          roles: ['admin', 'superadmin']
        }
      },
      // {
      //   path: 'virtualpatching',
      //   //component: () => import('@/views/rules-management/specifics'),
      //   component: artifactFn({application: 'virtualpatching', fileExt: 'sql'}),
      //   name: 'VirtualPatching',
      //   meta: {
      //     icon: 'specifics',
      //     title: 'virtualpatching',
      //     roles: ['admin', 'superadmin']
      //   }
      // },
      {
        path: 'malwarebehavior',
        //component: () => import('@/views/rules-management/specifics'),
        component: artifactFn({application: 'malwarebehavior', fileExt: 'sql'}),
        name: 'MalwareBehavior',
        meta: {
          icon: 'specifics',
          title: 'malwarebehavior',
          roles: ['admin', 'superadmin']
        }
      },
      {
        path: 'node/:idObject',
        hidden: true,
        name: 'NodeRuleset',
        props: true,
        component: () => import('@/views/rules-management/node-ruleset'),
        meta: {
          title: 'nodeRulesetTitle',
          roles: ['admin', 'superadmin']
        }
      },
    ]
  },  
  {
    path: '/intrusion',
    component: Layout,
    redirect: '/intrusion/monitoring',
    alwaysShow: true, // will always show the root menu
    name: 'UTM_Intrusion',
    meta: {
      title: 'intrusion',
      icon: 'net',
      roles: ['admin', 'superadmin'] // you can set roles in root nav
    },
    children: [      
      {
        path: 'monitoring',
        name: 'IntrusionMonitoring',
        component: () => import('@/views/intrusion/monitoring'),
        meta: {
          noCache: false,
          title: 'intrusion_monitoring',
          icon: 'shield',
          roles: ['admin', 'superadmin'] // or you can only set roles in sub nav
        }
      },     
      {
        path: 'statistics',
        name: 'Statistics',
        component: () => import('@/views/intrusion/statistics'),
        meta: {
          noCache: false,
          title: 'statistics',
          icon: 'chart',
          roles: ['admin','superadmin'] // or you can only set roles in sub nav
        }
      },      
    ]
  },
  {
    path: '/threatintelligence',
    component: Layout,
    redirect: '/threatintelligence/overview',
    alwaysShow: true, // will always show the root menu
    name: 'ThreatIntelligence',
    meta: {
      title: 'threat_intelligence',
      icon: 'net',
      roles: ['admin', 'superadmin'] // you can set roles in root nav
    },
    children: [      
      {
        path: 'overview',
        name: 'Overview',
        component: () => import('@/views/threat-intelligence/overview'),
        meta: {
          noCache: false,
          title: 'overview',
          icon: 'list',
          // roles: ['admin', 'superadmin'] // or you can only set roles in sub nav
        }
      },     
      {
        path: 'scan-file',
        name: 'ScanFile',
        component: () => import('@/views/threat-intelligence/scan-file'),
        meta: {
          noCache: false,
          title: 'scan_file',
          icon: 'search',
          // roles: ['admin','superadmin'] // or you can only set roles in sub nav
        }
      },      
      {
        path: 'scan-observable',
        name: 'ScanObservable',
        component: () => import('@/views/threat-intelligence/scan-observable'),
        meta: {
          noCache: false,
          title: 'scan_observable',
          icon: 'search',
          // roles: ['admin','superadmin'] // or you can only set roles in sub nav
        }
      },   
      {
        path: 'analyzer',
        name: 'Analyzer',
        component: () => import('@/views/threat-intelligence/analyzer'),
        meta: {
          noCache: false,
          title: 'analyzer',
          icon: 'chart',
          // roles: ['admin','superadmin'] // or you can only set roles in sub nav
        }
      },   
      {
        path: 'connector',
        name: 'Connector',
        component: () => import('@/views/threat-intelligence/connector'),
        meta: {
          noCache: false,
          title: 'connector',
          icon: 'chart',
          // roles: ['admin','superadmin'] // or you can only set roles in sub nav
        }
      },   
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/system-management/user-list',
    alwaysShow: true, // will always show the root menu
    name: 'SystemManagement',
    meta: {
      title: 'setting',
      icon: 'setting',
      roles: ['admin', 'superadmin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'user-list',
        component: () => import('@/views/system-management/user-list'),
        name: 'UserList',
        meta: {
          title: 'user_list',
          icon: 'peoples',
          roles: ['admin','superadmin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'user/:id/roles',
        component: () => import('@/views/system-management/role-of-user'),
        name: 'RoleOfUser',
        hidden: true,
        meta: {
          icon: 'role',
          title: 'roles_of_user',
          roles: ['admin','superadmin']
        }
      },
      {
        path: 'role',
        component: () => import('@/views/system-management/role-list'),
        name: 'RoleList',
        meta: {
          title: 'role_list',
          icon: 'roles',
          roles: ['admin', 'superadmin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'role/:id/users',
        component: () => import('@/views/system-management/users-of-role'),
        name: 'UsersOfRole',
        hidden: true,
        meta: {
          icon: 'user',
          title: 'users_of_role',
          roles: ['admin', 'superadmin']
        }
      },
      {
        path: 'role/:id/permissions',
        component: () => import('@/views/permission-management/index'),
        name: 'PermissionOfRole',
        hidden: true,
        meta: {
          title: 'permission_management',
          icon: 'permissions',
          roles: ['admin','superadmin']
        }
      },
      {
        path: 'settings',
        component: () => import('@/views/system-management/settings'),
        name: 'Settings',
        meta: {
          title: 'settings',
          icon: 'settings',
          roles: ['admin','superadmin'] // or you can only set roles in sub nav
        }
      },
    ]
  },
  {
    path: '/system-hardening',
    component: Layout,
    redirect: '/system-hardening/host-list',
    alwaysShow: true, // will always show the root menu
    name: 'SystemHardening',
    meta: {
      title: 'system_hardening',
      icon: 'shield',
      roles: ['admin', 'superadmin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'host-list',
        component: () => import('@/views/system-hardening/host-list'),
        name: 'HostList',
        meta: {
          title: 'host_list',
          icon: 'host',
          roles: ['admin','superadmin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'host-detail/:hostId(\\d+)',
        component: () => import('@/views/system-hardening/host-detail'),
        name: 'HostDetail',
        hidden: true,
        meta: {
          title: 'host_detail',
          icon: 'host',
          roles: ['admin','superadmin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'check-list',
        component: () => import('@/views/system-hardening/check-list'),
        name: 'CheckList',
        meta: {
          title: 'check_list',
          icon: 'list',
          roles: ['admin','superadmin'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
