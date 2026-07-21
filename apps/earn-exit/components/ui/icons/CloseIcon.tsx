import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const CloseIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} fill="none" viewBox="0 0 15 15" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path fill="currentColor" d="M1.065 13.772a1.3 1.3 0 0 1 0-1.839L12.096.903a1.3 1.3 0 0 1 1.839 1.838L2.904 13.77a1.3 1.3 0 0 1-1.839 0" /><path fill="currentColor" d="M13.935 13.772a1.3 1.3 0 0 1-1.839 0L1.066 2.74A1.3 1.3 0 1 1 2.903.902l11.03 11.031a1.3 1.3 0 0 1 0 1.839" /></svg>;
export { CloseIcon };