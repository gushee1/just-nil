"use client";

import { FormEvent, useEffect, useState } from "react";

export function CompanyProfileForm() {
  const [form, setForm] = useState({
    companyName: "",
    website: "",
    industry: "",
    contactName: "",
    contactEmail: "",
    location: "",
    lookingFor: "",
    minBudget: 0,
    maxBudget: 0,
    dealTypes: "",
    preferredPlatforms: "",
    tags: ""
  });
  const [verificationStatus, setVerificationStatus] = useState("PENDING");
  const [documents, setDocuments] = useState<Array<{ id: string; fileName: string; fileUrl: string }>>([]);
  const [status, setStatus] = useState<string | null>(null);

  async function loadProfile() {
    const response = await fetch("/api/company/profile");
    const data = await response.json();
    if (!data.profile) return;

    setForm({
      companyName: data.profile.companyName ?? "",
      website: data.profile.website ?? "",
      industry: data.profile.industry ?? "",
      contactName: data.profile.contactName ?? "",
      contactEmail: data.profile.contactEmail ?? "",
      location: data.profile.location ?? "",
      lookingFor: data.profile.lookingFor ?? "",
      minBudget: data.profile.minBudget ?? 0,
      maxBudget: data.profile.maxBudget ?? 0,
      dealTypes: (data.profile.dealTypes ?? []).join(", "),
      preferredPlatforms: (data.profile.preferredPlatforms ?? []).join(", "),
      tags: (data.profile.tagsWanted ?? []).map((item: { tag: { name: string } }) => item.tag.name).join(", ")
    });
    setVerificationStatus(data.profile.verificationStatus ?? "PENDING");
    setDocuments(data.profile.documents ?? []);
  }

  useEffect(() => {
    loadProfile();
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

    const response = await fetch("/api/company/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        website: form.website || undefined,
        location: form.location || undefined,
        minBudget: form.minBudget || undefined,
        maxBudget: form.maxBudget || undefined,
        dealTypes: parseCommaList(form.dealTypes),
        preferredPlatforms: parseCommaList(form.preferredPlatforms),
        tags: parseCommaList(form.tags)
      })
    });

    setStatus(response.ok ? "Saved" : "Failed to save");
    if (response.ok) {
      await loadProfile();
    }
  }

  async function onUpload(file: File) {
    setStatus("Requesting upload URL...");
    const prep = await fetch("/api/company/verification/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: file.name, mimeType: file.type || "application/octet-stream" })
    });

    if (!prep.ok) {
      setStatus("Failed to prepare upload");
      return;
    }

    const { uploadUrl } = await prep.json();
    const uploaded = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file
    });

    setStatus(uploaded.ok ? "Uploaded verification document" : "Upload failed");
    if (uploaded.ok) {
      await loadProfile();
    }
  }

  return (
    <form className="card grid" onSubmit={onSubmit}>
      <h2>Company profile</h2>
      <p className="small">Verification status: {verificationStatus}</p>
      <div className="grid two">
        <input
          placeholder="Company name"
          value={form.companyName}
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          required
        />
        <input placeholder="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        <input
          placeholder="Industry"
          value={form.industry}
          onChange={(e) => setForm({ ...form, industry: e.target.value })}
          required
        />
        <input
          placeholder="Contact name"
          value={form.contactName}
          onChange={(e) => setForm({ ...form, contactName: e.target.value })}
          required
        />
        <input
          placeholder="Contact email"
          type="email"
          value={form.contactEmail}
          onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
          required
        />
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <input
          placeholder="Min budget"
          type="number"
          value={form.minBudget}
          onChange={(e) => setForm({ ...form, minBudget: Number(e.target.value) })}
        />
        <input
          placeholder="Max budget"
          type="number"
          value={form.maxBudget}
          onChange={(e) => setForm({ ...form, maxBudget: Number(e.target.value) })}
        />
      </div>
      <textarea
        placeholder="What are you looking for?"
        value={form.lookingFor}
        onChange={(e) => setForm({ ...form, lookingFor: e.target.value })}
        rows={3}
        required
      />
      <input
        placeholder="Deal types (comma separated)"
        value={form.dealTypes}
        onChange={(e) => setForm({ ...form, dealTypes: e.target.value })}
      />
      <input
        placeholder="Preferred platforms (comma separated)"
        value={form.preferredPlatforms}
        onChange={(e) => setForm({ ...form, preferredPlatforms: e.target.value })}
      />
      <input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />

      <div className="grid">
        <p className="small">Verification docs</p>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              void onUpload(file);
            }
          }}
        />
        {documents.map((document) => (
          <a key={document.id} href={document.fileUrl} target="_blank" rel="noreferrer" className="small">
            {document.fileName}
          </a>
        ))}
      </div>

      <button type="submit">Save profile</button>
      {status ? <p className="small">{status}</p> : null}
    </form>
  );
}
