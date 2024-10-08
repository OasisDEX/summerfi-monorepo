export default {
  exportType: 'default',
  logLevel: 'error',
  updateStaleOnly: true,
  additionalData: `
  @import './node_modules/include-media/dist/_include-media.scss';
  $breakpoints: (
    s: 531px,
    m: 744px,
    l: 1025px,
    xl: 1279px,
  );
  `,
}
