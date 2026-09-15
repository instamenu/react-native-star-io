const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const path = require('path');
const exclusionList = require('metro-config/private/defaults/exclusionList').default;

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

const config = {
  watchFolders: [path.resolve(__dirname, '..')],
  resolver: {
    enableSymlinks: true,
    nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],
    blockList: exclusionList([
      new RegExp(`${path.resolve(__dirname, 'ios', 'Pods')}/.*`),
      new RegExp(`${path.resolve(__dirname, 'ios', 'DerivedData')}/.*`),
      new RegExp(`${path.resolve(__dirname, 'ios', 'build')}/.*`),
      new RegExp(`${path.resolve(__dirname, 'android')}/(?:.*/)?build/.*`),
      new RegExp(`${path.resolve(__dirname, '..', '.git')}/.*`),
    ]),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
