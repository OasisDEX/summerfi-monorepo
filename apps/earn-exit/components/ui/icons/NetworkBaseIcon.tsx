import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const NetworkBaseIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" width={32} height={33} fill="none" viewBox="0 0 32 33" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path fill="#1F52F5" d="M16 32.793c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16" /><path fill="#fff" d="M15.976 29.593c7.075 0 12.823-5.725 12.823-12.8s-5.725-12.8-12.823-12.8c-6.726 0-12.218 5.167-12.777 11.73h16.943v2.14H3.199c.559 6.564 6.051 11.73 12.777 11.73" /></svg>;
export { NetworkBaseIcon };