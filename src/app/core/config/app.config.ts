import { Layout } from 'app/layout/layout.types';

// Types
export type Scheme = 'auto' | 'dark' | 'light';
export type Theme = 'default' | string;

export interface AppConfig {
    layout: Layout;
    scheme: Scheme;
    theme: Theme;
}

export const appConfig: AppConfig = {
    layout: 'vertical',
    scheme: 'dark',
    theme: 'default'
};
