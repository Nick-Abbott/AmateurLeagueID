import path from 'path';

export type Environment = 'e0' | 'e1' | 'e2' | 'e3';

// Paths
export const ROOT_PATH = path.resolve(__dirname, '..');

// Config Paths
export const CONFIG_FOLDER_PATH = path.resolve(ROOT_PATH, '..', 'config');
export const SERVICES_CONFIG_PATH = path.resolve(CONFIG_FOLDER_PATH, 'ServicesConfig.json');

// Misc Paths
export const SERVICES_FOLDER_PATH = path.resolve(ROOT_PATH, 'services');

export const ENVIRONMENT = process.env.ENVIRONMENT as Environment || 'e0';
