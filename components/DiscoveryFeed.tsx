"use client";

import { FormEvent, useEffect, useState } from "react";

type Item = {
  id: string;
  userId: string;
  title: string;
  subtitle: string;
  tags: string[];
  score: number;
  followers?: number;
  budgetRange?: [number | null, number | null];
};

const interactionTypes = ["LIKE", "SAVE", "INTEREST", "REQUEST_CONTACT"] as const;

export function DiscoveryFeed() {
  const [items, setItems] = useState<Item[]>([]);
  const [tags, setTags] = useState("");
  const [location, setLocation] = useState("");
  const [minFollowers, setMinFollowers] = useState(0);
  const [status, setStatus] = useState<string | null>(null);

  async function load() {
    const searchParams = new URLSearchParams();
    if (tags) searchParams.set("tags", tags);
    if (location) searchParams.set("location", location);
    if (minFollowers) searchParams.set("minFollowers", String(minFollowers));

    const response = await fetch(`/api/discovery?${searchParams.toString()}`);
    const data = await response.json();
    setItems(data.items ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await load();
  }

  async function interact(targetUserId: string, type: (typeof interactionTypes)[number]) {
    setStatus(`Submitting ${type.toLowerCase()}...`);
    const response = await fetch("/api/discovery/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId, type })
    });
    setStatus(response.ok ? `${type} submitted` : `Failed to submit ${type}`);
  }

  return (
    <section>
      <form className="card grid two" onSubmit={onFilter}>
        <input placeholder="Filter tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
        <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input
          placeholder="Min followers"
          type="number"
          value={minFollowers}
          onChange={(e) => setMinFollowers(Number(e.target.value))}
        />
        <button type="submit">Apply filters</button>
      </form>

      {status ? <p className="small">{status}</p> : null}

      {items.map((item) => (
        <article key={item.id} className="card">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h3 style={{ marginBottom: 4 }}>{item.title}</h3>
              <p className="small">{item.subtitle}</p>
            </div>
            <strong>Score {item.score}</strong>
          </div>

          <div>
            {item.tags.map((tag) => (
              <span className="pill" key={tag}>
                {tag}
              </span>
            ))}
          </div>

          {typeof item.followers === "number" ? <p className="small">Followers: {item.followers}</p> : null}
          {item.budgetRange ? (
            <p className="small">
              Budget: ${item.budgetRange[0] ?? "?"} - ${item.budgetRange[1] ?? "?"}
            </p>
          ) : null}

          <div className="row">
            {interactionTypes.map((type) => (
              <button key={type} type="button" className="secondary" onClick={() => interact(item.userId, type)}>
                {type.replace("_", " ").toLowerCase()}
              </button>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
