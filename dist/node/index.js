import { normalizePath } from 'vite';
export { loadEnv } from 'vite';
import { g as glob, c as createMarkdownRenderer, f as fs, m as matter, a as getDefaultExportFromCjs } from './serve-oY-f4fXJ.js';
export { S as ScaffoldThemeType, b as build, p as createServer, e as defineConfig, h as defineConfigWithTheme, d as defineLoader, n as init, j as mergeConfig, r as resolveConfig, l as resolvePages, k as resolveSiteData, i as resolveUserConfig, s as scaffold, o as serve } from './serve-oY-f4fXJ.js';
import path from 'path';
import 'crypto';
import 'module';
import 'node:path';
import 'node:process';
import 'node:fs/promises';
import 'node:url';
import 'node:fs';
import 'fs';
import 'node:events';
import 'node:stream';
import 'node:string_decoder';
import 'util';
import 'os';
import 'url';
import 'assert';
import 'events';
import 'stream';
import 'readline';
import 'child_process';
import 'string_decoder';
import 'zlib';
import '@vue/shared';
import 'node:readline';
import 'node:tty';
import 'http';
import 'querystring';
import 'tty';
import 'constants';
import 'node:crypto';
import 'shiki';
import '@shikijs/transformers';
import 'minisearch';

function createContentLoader(pattern, {
  includeSrc,
  render,
  excerpt: renderExcerpt,
  transform,
  globOptions
} = {}) {
  const config = global.VITEPRESS_CONFIG;
  if (!config) {
    throw new Error(
      "content loader invoked without an active vitepress process, or before vitepress config is resolved."
    );
  }
  if (typeof pattern === "string") pattern = [pattern];
  pattern = pattern.map((p) => normalizePath(path.join(config.srcDir, p)));
  let md;
  const cache = /* @__PURE__ */ new Map();
  return {
    watch: pattern,
    async load(files) {
      if (!files) {
        files = (await glob(pattern, {
          ignore: ["**/node_modules/**", "**/dist/**"],
          ...globOptions
        })).sort();
      }
      md = md || await createMarkdownRenderer(
        config.srcDir,
        config.markdown,
        config.site.base,
        config.logger
      );
      const raw = [];
      for (const file of files) {
        if (!file.endsWith(".md")) {
          continue;
        }
        const timestamp = fs.statSync(file).mtimeMs;
        const cached = cache.get(file);
        if (cached && timestamp === cached.timestamp) {
          raw.push(cached.data);
        } else {
          const src = fs.readFileSync(file, "utf-8");
          const { data: frontmatter, excerpt } = matter(
            src,
            // @ts-expect-error gray-matter types are wrong
            typeof renderExcerpt === "string" ? { excerpt_separator: renderExcerpt } : { excerpt: renderExcerpt }
          );
          const url = "/" + normalizePath(path.relative(config.srcDir, file)).replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, config.cleanUrls ? "" : ".html");
          const html = render ? md.render(src) : void 0;
          const renderedExcerpt = renderExcerpt ? excerpt && md.render(excerpt) : void 0;
          const data = {
            src: includeSrc ? src : void 0,
            html,
            frontmatter,
            excerpt: renderedExcerpt,
            url
          };
          cache.set(file, { data, timestamp });
          raw.push(data);
        }
      }
      return transform ? transform(raw) : raw;
    }
  };
}

var postcssPrefixSelector = function postcssPrefixSelector(options) {
  const prefix = options.prefix;
  const prefixWithSpace = /\s+$/.test(prefix) ? prefix : `${prefix} `;
  const ignoreFiles = options.ignoreFiles ? [].concat(options.ignoreFiles) : [];
  const includeFiles = options.includeFiles
    ? [].concat(options.includeFiles)
    : [];

  return function (root) {
    if (
      ignoreFiles.length &&
      root.source.input.file &&
      isFileInArray(root.source.input.file, ignoreFiles)
    ) {
      return;
    }
    if (
      includeFiles.length &&
      root.source.input.file &&
      !isFileInArray(root.source.input.file, includeFiles)
    ) {
      return;
    }

    root.walkRules((rule) => {
      const keyframeRules = [
        'keyframes',
        '-webkit-keyframes',
        '-moz-keyframes',
        '-o-keyframes',
        '-ms-keyframes',
      ];

      if (rule.parent && keyframeRules.includes(rule.parent.name)) {
        return;
      }

      rule.selectors = rule.selectors.map((selector) => {
        if (options.exclude && excludeSelector(selector, options.exclude)) {
          return selector;
        }

        if (options.transform) {
          return options.transform(
            prefix,
            selector,
            prefixWithSpace + selector,
            root.source.input.file,
            rule
          );
        }

        return prefixWithSpace + selector;
      });
    });
  };
};

function isFileInArray(file, arr) {
  return arr.some((ruleOrString) => {
    if (ruleOrString instanceof RegExp) {
      return ruleOrString.test(file);
    }

    return file.includes(ruleOrString);
  });
}

function excludeSelector(selector, excludeArr) {
  return excludeArr.some((excludeRule) => {
    if (excludeRule instanceof RegExp) {
      return excludeRule.test(selector);
    }

    return selector === excludeRule;
  });
}

var postcssPrefixSelector$1 = /*@__PURE__*/getDefaultExportFromCjs(postcssPrefixSelector);

function postcssIsolateStyles(options = {}) {
  return postcssPrefixSelector$1({
    prefix: ":not(:where(.vp-raw, .vp-raw *))",
    includeFiles: [/base\.css/],
    transform(prefix, _selector) {
      const [selector, pseudo = ""] = _selector.split(/(:\S*)$/);
      return selector + prefix + pseudo;
    },
    ...options
  });
}

export { createContentLoader, createMarkdownRenderer, postcssIsolateStyles };
