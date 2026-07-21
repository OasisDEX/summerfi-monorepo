import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const NetworkSonicIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} fill="none" viewBox="0 0 32 32" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<circle cx={16} cy={16} r={13} fill="#F5F5F5" /><mask id="a" width={26} height={26} x={3} y={3} maskUnits="userSpaceOnUse" style={{
    maskType: "alpha"
  }}><circle cx={16} cy={16} r={13} fill="#131315" /></mask><g fill="#131315" fillRule="evenodd" clipRule="evenodd" mask="url(#a)"><path d="M10.362 27.34q-.562.632-1.048 1.163l1.326 1.217c.347-.377.713-.787 1.1-1.22 1.732-1.936 3.876-4.334 6.524-6.41 3.224-2.527 7.105-4.501 11.718-4.501v-1.8c-5.157 0-9.42 2.213-12.828 4.884-2.787 2.186-5.06 4.73-6.792 6.667" /><path d="M10.362 4.66Q9.8 4.029 9.314 3.496L10.64 2.28q.52.569 1.1 1.22c1.732 1.936 3.876 4.334 6.524 6.41 3.224 2.528 7.105 4.502 11.718 4.502v1.8c-5.157 0-9.42-2.213-12.828-4.885-2.787-2.185-5.06-4.73-6.792-6.666" /><path d="M10.076 20.553c-1.86.986-3.746 2.337-4.771 3.385l1.286 1.259c.833-.851 2.528-2.1 4.328-3.054 1.786-.946 3.914-1.867 6.162-2.674 4.515-1.622 9.408-2.747 12.9-2.747v-1.8c-3.789 0-8.906 1.2-13.509 2.853-2.312.83-4.52 1.784-6.396 2.778" /><path d="M10.076 11.445c-1.86-.986-3.829-2.42-4.854-3.468l1.286-1.259c.833.851 2.61 2.183 4.411 3.137 1.786.946 3.914 1.867 6.161 2.674 4.516 1.622 9.41 2.748 12.901 2.748v1.8c-3.789 0-8.906-1.2-13.509-2.854-2.312-.83-4.52-1.784-6.396-2.778" /><path d="M29.329 16.9H2.018v-1.8h27.31z" /></g></svg>;
export { NetworkSonicIcon };