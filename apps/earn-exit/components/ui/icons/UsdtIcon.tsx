import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const UsdtIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} fill="none" viewBox="0 0 32 32" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<circle cx={16} cy={16} r={13.333} fill="url(#a)" /><path fill="#fff" d="M24.007 16.305c0-1.005-2.734-1.844-6.369-2.037v-1.602h4.538V9.334H9.768v3.332h4.537v1.61c-3.568.206-6.237 1.036-6.237 2.029s2.67 1.822 6.237 2.029v5.75h3.333v-5.742c3.635-.194 6.37-1.032 6.37-2.037m-7.97.99c-3.9 0-7.062-.604-7.062-1.35 0-.63 2.267-1.16 5.33-1.307v1.936a32.037 32.037 0 0 0 3.333.008v-1.95c3.13.138 5.463.674 5.463 1.314 0 .745-3.162 1.349-7.063 1.349" /><defs><linearGradient id="a" x1={16} x2={29.006} y1={2.667} y2={27.5} gradientUnits="userSpaceOnUse"><stop stopColor="#218F6F" /><stop offset={1} stopColor="#66C5A9" /></linearGradient></defs></svg>;
export { UsdtIcon };