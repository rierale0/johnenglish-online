import { notFound } from "next/navigation";
import { getRedirectUrl, getRedirectKeys } from "@/lib/redirects";
import RedirectClient from "@/app/r/[key]/RedirectClient";

type Props = { params: Promise<{ key: string }> };

export function generateStaticParams() {
  return getRedirectKeys().map((key) => ({ key }));
}

export default async function RootRedirectPage({ params }: Props) {
  const { key } = await params;
  const url = getRedirectUrl(key);

  if (!url) {
    notFound();
  }

  return <RedirectClient redirectKey={key} />;
}
