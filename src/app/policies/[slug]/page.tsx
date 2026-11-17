import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { policies } from "@/data/policies";

export function generateStaticParams() {
  return policies.map((policy) => ({ slug: policy.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const policy = policies.find((item) => item.slug === slug);
  return { title: policy?.title ?? "Policy not found" };
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = policies.find((item) => item.slug === slug);
  if (!policy) notFound();
  return (
    <section className="section shell policy-page">
      <div className="page-heading"><span className="eyebrow">Mithu policies</span><h1>{policy.title}</h1><p>{policy.intro}</p></div>
      <div className="policy-layout">
        <nav className="policy-nav" aria-label="Policies">
          <h2>Policies</h2>
          {policies.map((item) => (
            <Link key={item.slug} href={`/policies/${item.slug}`} className={item.slug === slug ? "is-active" : ""} aria-current={item.slug === slug ? "page" : undefined}>
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="policy-body">
          {policy.sections.map((section, index) => (
            <article key={section.heading}>
              <h2><span>{index + 1}</span>{section.heading}</h2>
              {section.body.map((text) => <p key={text}>{text}</p>)}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
