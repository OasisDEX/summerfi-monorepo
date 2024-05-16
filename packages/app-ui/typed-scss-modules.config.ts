export default {
  exportType: 'default',
  logLevel: 'error',
  additionalData: `
  @import './node_modules/include-media/dist/_include-media.scss';
  $breakpoints: (
    s: 768px,
    m: 960px,
    l: 1088px,
  );
  `,
}
