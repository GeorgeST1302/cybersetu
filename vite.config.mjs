import { defineConfig } from 'vite';

// GitHub Pages serves project sites from /<repository-name>/.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/',
});
