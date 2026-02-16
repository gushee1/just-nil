"use client";

import { FormEvent, useEffect, useState } from "react";

type Social = { platform: string; url: string; followers: number };

const defaultSocial: Social = { platform: "", url: "", followers: 0 };

export function StudentProfileForm() {
  const [form, setForm] = useState({
    name: "",
    school: "",
    graduationYear: 2027,
    major: "",
    archetype: "athlete",
    location: "",
    bio: "",
    followerCount: 0,
    mediaUrl: "",
    categories: "",
    niches: "",
    tags: ""
  });
  const [socials, setSocials] = useState<Social[]>([defaultSocial]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/student/profile")
      .then((res) => res.json())
      .then((data) => {
        if (!data.profile) return;
        setForm({
          name: data.profile.name ?? "",
          school: data.profile.school ?? "",
          graduationYear: data.profile.graduationYear ?? 2027,
          major: data.profile.major ?? "",
          archetype: data.profile.archetype ?? "",
          location: data.profile.location ?? "",
          bio: data.profile.bio ?? "",
          followerCount: data.profile.followerCount ?? 0,
          mediaUrl: data.profile.mediaUrl ?? "",
          categories: (data.profile.categories ?? []).join(", "),
          niches: (data.profile.niches ?? []).join(", "),
          tags: (data.profile.tags ?? []).map((item: { tag: { name: string } }) => item.tag.name).join(", ")
        });
        setSocials(
          data.profile.socials?.length
            ? data.profile.socials.map((social: Social) => ({ ...social }))
            : [defaultSocial]
        );
      });
  }, []);

  function parseCommaList(value: string) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving...");

    const response = await fetch("/api/student/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        mediaUrl: form.mediaUrl || undefined,
        location: form.location || undefined,
        bio: form.bio || undefined,
        categories: parseCommaList(form.categories),
        niches: parseCommaList(form.niches),
        tags: parseCommaList(form.tags),
        socials: socials.filter((social) => social.platform && social.url)
      })
    });

    setStatus(response.ok ? "Saved" : "Failed to save");
  }

  return (
    <form className="card grid" onSubmit={onSubmit}>
      <h2>Student profile</h2>
      <div className="grid two">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input
          placeholder="School"
          value={form.school}
          onChange={(e) => setForm({ ...form, school: e.target.value })}
          required
        />
        <input
          placeholder="Graduation year"
          type="number"
          value={form.graduationYear}
          onChange={(e) => setForm({ ...form, graduationYear: Number(e.target.value) })}
          required
        />
        <input placeholder="Major" value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })} required />
        <input
          placeholder="Archetype (athlete, influencer...)"
          value={form.archetype}
          onChange={(e) => setForm({ ...form, archetype: e.target.value })}
          required
        />
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <input
          placeholder="Followers"
          type="number"
          value={form.followerCount}
          onChange={(e) => setForm({ ...form, followerCount: Number(e.target.value) })}
        />
        <input
          placeholder="Profile media URL"
          value={form.mediaUrl}
          onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
        />
      </div>
      <textarea placeholder="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} />
      <input
        placeholder="Categories (comma separated)"
        value={form.categories}
        onChange={(e) => setForm({ ...form, categories: e.target.value })}
      />
      <input placeholder="Niches (comma separated)" value={form.niches} onChange={(e) => setForm({ ...form, niches: e.target.value })} />
      <input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />

      <div className="grid">
        <p className="small">Social links</p>
        {socials.map((social, index) => (
          <div className="grid two" key={index}>
            <input
              placeholder="Platform"
              value={social.platform}
              onChange={(e) => {
                const next = [...socials];
                next[index] = { ...next[index], platform: e.target.value };
                setSocials(next);
              }}
            />
            <input
              placeholder="URL"
              value={social.url}
              onChange={(e) => {
                const next = [...socials];
                next[index] = { ...next[index], url: e.target.value };
                setSocials(next);
              }}
            />
            <input
              placeholder="Followers"
              type="number"
              value={social.followers}
              onChange={(e) => {
                const next = [...socials];
                next[index] = { ...next[index], followers: Number(e.target.value) };
                setSocials(next);
              }}
            />
          </div>
        ))}
        <button type="button" className="secondary" onClick={() => setSocials([...socials, defaultSocial])}>
          Add social
        </button>
      </div>

      <button type="submit">Save profile</button>
      {status ? <p className="small">{status}</p> : null}
    </form>
  );
}
