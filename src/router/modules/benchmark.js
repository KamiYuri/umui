import Layout from "@/layout";

export const benchmark_routes = {
    path: '/benchmark',
    component: Layout,
    redirect: '/benchmark/detail',
    alwaysShow: true,
    name: 'Benchmark',
    meta: {
        title: 'benchmark',
        icon: 'rules-management',
        roles: ['admin', 'superadmin'] // you can set roles in root nav
    },
    children: [
        {
            path: 'detail',
            component: () => import('@/views/benchmark/detail'),
            name: 'BenchmarkDetail',
            meta: {
                icon: 'ruleset',
                title: 'benchmark_detail',
                roles: ['admin', 'superadmin']
            }
        }
    ]
}