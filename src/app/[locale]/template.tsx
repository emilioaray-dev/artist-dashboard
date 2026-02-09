import { PageTransition } from "@/components/motion/PageTransition";

export default function Template({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PageTransition>{children}</PageTransition>;
}
