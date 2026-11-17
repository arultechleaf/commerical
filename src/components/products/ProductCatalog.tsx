"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { categories } from "@/data/categories";
import type { Product } from "@/types/product";
import { isNewArrival } from "@/lib/isNew";
import ProductCard from "./ProductCard";

const pageSize = 24;

export default function ProductCatalog({
  products,
  initialCategory = "all",
  initialQuery = "",
  initialMin,
  initialMax,
  initialFilter = "all",
}: {
  products: Product[];
  initialCategory?: string;
  initialQuery?: string;
  initialMin?: number;
  initialMax?: number;
  initialFilter?: string;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState(initialQuery);
  const [min, setMin] = useState(initialMin);
  const [max, setMax] = useState(initialMax);
  const [flag, setFlag] = useState(initialFilter);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = products.filter((product) => {
      if (min !== undefined && product.price < min) return false;
      if (max !== undefined && product.price > max) return false;
      if (flag === "new" && !isNewArrival(product)) return false;
      if (flag === "sale" && !product.compareAtPrice) return false;
      if (flag === "best" && !product.featured) return false;
      const selectedCategory = category === "all" || product.category === category;
      const categoryName = categories.find((item) => item.slug === product.category)?.name ?? "";
      const matchesQuery =
        !normalized ||
        product.name.toLowerCase().includes(normalized) ||
        product.material.toLowerCase().includes(normalized) ||
        product.category.includes(normalized) ||
        categoryName.toLowerCase().includes(normalized);
      return selectedCategory && matchesQuery;
    });

    if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    if (flag === "new") result.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    else if (sort === "featured") result.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    return result;
  }, [products, category, query, sort, min, max, flag]);

  const pills = [
    { label: "All products", active: !query && min === undefined && max === undefined && flag === "all", set: () => { setQuery(""); setMin(undefined); setMax(undefined); setFlag("all"); } },
    { label: "Under ₹300", active: max === 300 && min === undefined, set: () => { setQuery(""); setMin(undefined); setMax(300); setFlag("all"); } },
    { label: "On sale", active: flag === "sale", set: () => { setQuery(""); setMin(undefined); setMax(undefined); setFlag("sale"); } },
    { label: "Bestsellers", active: flag === "best", set: () => { setQuery(""); setMin(undefined); setMax(undefined); setFlag("best"); } },
    { label: "Pearl", active: query === "pearl", set: () => { setQuery("pearl"); setMin(undefined); setMax(undefined); setFlag("all"); } },
  ];

  const totalPages = Math.ceil(filtered.length / pageSize);
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function changeCategory(value: string) {
    setCategory(value);
    setPage(1);
  }

  return (
    <>
      <div className="quick-pills">
        {pills.map((pill) => (
          <button key={pill.label} className={`quick-pill ${pill.active ? "is-active" : ""}`} onClick={() => { pill.set(); setPage(1); }}>
            {pill.label}
          </button>
        ))}
      </div>
      <div className="catalog-toolbar">
        <div className="catalog-filters">
          <label className="filter-field">
            <span>Category</span>
            <select value={category} onChange={(event) => changeCategory(event.target.value)}>
              <option value="all">All products</option>
              {categories.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}
            </select>
          </label>
          <label className="filter-field">
            <span>Search</span>
            <input
              type="search"
              value={query}
              onChange={(event) => { setQuery(event.target.value); setPage(1); }}
              placeholder="Try “butterfly”"
            />
          </label>
        </div>
        <label className="filter-field sort-field">
          <span>Sort by</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </label>
      </div>
      <div className="catalog-result-row">
        <p><strong>{filtered.length}</strong> pretty finds to browse</p>
        {category !== "all" && <button className="text-button" onClick={() => changeCategory("all")}>Clear category</button>}
      </div>
      {visible.length ? (
        <div className="product-grid">
          {visible.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-state-icon">♡</span>
          <h2>{flag === "new" ? "No new arrivals yet" : "No matches just yet"}</h2>
          <p>{flag === "new" ? "Fresh pieces are on their way. Browse everything in the meantime." : "Try a different search or browse all of our cute finds."}</p>
          <Link href="/shop" className="button button-dark" onClick={() => { setQuery(""); changeCategory("all"); }}>See all products</Link>
        </div>
      )}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="button button-outline" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button className="button button-outline" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>Next</button>
        </div>
      )}
    </>
  );
}
