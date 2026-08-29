import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const page = name => resolve(root, name);

// GitHub Pages serves project sites from /<repository-name>/.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/',
  build: {
    target: 'es2020',
    rollupOptions: {
      input: {
        home:    page('index.html'),
        report:  page('report.html'),
        track:   page('track.html'),
        check:   page('check.html'),
        learn:   page('learn.html'),
        help:    page('help.html'),
        about:   page('about.html'),
        officer: page('officer.html')
      }
    }
  }
});
