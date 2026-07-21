import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const EtherIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} fill="none" viewBox="0 0 32 32" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path fill="url(#a)" d="M16 29.333c7.364 0 13.333-5.97 13.333-13.333S23.363 2.667 16 2.667 2.667 8.636 2.667 16 8.637 29.333 16 29.333" /><path fill="#fff" d="M16 8v11.05l-5.333-2.902zM16 8l5.333 8.148L16 19.051zM16 19.981V24l-5.333-6.92zM16 24V19.98l5.333-2.901z" /><linearGradient id="a" x1={3.613} x2={29.17} y1={16} y2={36} gradientUnits="userSpaceOnUse"><stop stopColor="#6580EB" /><stop offset={1} stopColor="#8EA2F2" /></linearGradient></svg>;
export { EtherIcon };