"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { categories } from "@/data/categories";
import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";

const pageSize = 24;

export default function ProductCatalog({
  products,
  initialCategory = "all",
  initialQuery = "",
}: {
  products: Product[];
  initialCategory?: string;
  initialQuery?: string;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = products.filter((product) => {
      const selectedCategory = category === "all" || product.category === category;
      const categoryName = categories.find((item) => item.slug === product.category)?.name ?? "";
      const matchesQuery =
        !normalized ||
        product.name.toLowerCase().includes(normalized) ||
        product.category.includes(normalized) ||
        categoryName.toLowerCase().includes(normalized);
      return selectedCategory && matchesQuery;
    });

    if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "featured") result.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    return result;
  }, [products, category, query, sort]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function changeCategory(value: string) {
    setCategory(value);
    setPage(1);
  }

  return (
    <>
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
          <h2>No matches just yet</h2>
          <p>Try a different search or browse all of our cute finds.</p>
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
