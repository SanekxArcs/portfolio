import { CvPage } from "@/components/cv/cv-page";

export const revalidate = 3600;

export default function Page() {
  return <CvPage />;
}
