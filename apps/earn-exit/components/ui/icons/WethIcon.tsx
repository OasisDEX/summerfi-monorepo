import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const WethIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} fill="none" viewBox="0 0 32 32" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path fill="url(#a)" fillRule="evenodd" d="M29.333 16c0 7.364-5.97 13.334-13.333 13.334S2.667 23.364 2.667 16 8.637 2.667 16 2.667 29.333 8.637 29.333 16m-18.666.149L16 19.05l5.333-2.902L16 8zm0 .931L16 19.981l5.333-2.9L16 24z" clipRule="evenodd" /><linearGradient id="a" x1={3.613} x2={29.17} y1={16.001} y2={36.001} gradientUnits="userSpaceOnUse"><stop stopColor="#6580EB" /><stop offset={1} stopColor="#8EA2F2" /></linearGradient></svg>;
export { WethIcon };