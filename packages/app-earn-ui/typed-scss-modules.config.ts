export default {
  exportType: 'default',
  logLevel: 'error',
  updateStaleOnly: true,
  implementation: 'sass',
  additionalData: `
    @use './node_modules/include-media/dist/_include-media.scss' as im with (
      $breakpoints: (
        s: 531px,
        m: 744px,
        l: 1025px,
        xl: 1279px,
      ),
    );
  `,
}
