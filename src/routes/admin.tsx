import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Dashboard } from "@/components/admin/Dashboard";
import { ImageLibrary } from "@/components/admin/ImageLibrary";
import { LoginForm } from "@/components/admin/LoginForm";
import { ResourceManager, type FieldConfig } from "@/components/admin/ResourceManager";
import { Sidebar, type AdminTab } from "@/components/admin/Sidebar";
import { SubmissionManager } from "@/components/admin/SubmissionManager";
import { ToastContainer } from "@/components/admin/Toast";
import { adminApi, type ContactSubmission, type Donation, type NewsletterSubscriber, type VolunteerSubmission } from "@/lib/admin-api";
import { useToast } from "@/hooks/use-toast";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — Eagle's Wings Empowerment" }],
  }),
  component: AdminPage,
});

const programFields: FieldConfig[] = [
  { name: "slug", label: "Slug", type: "text", required: true },
  { name: "title", label: "Title", type: "text", required: true },
  { name: "subtitle", label: "Subtitle", type: "text" },
  { name: "summary", label: "Summary", type: "textarea", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "image_url", label: "Image", type: "image" },
  { name: "icon", label: "Icon (Lucide name)", type: "text" },
  { name: "order", label: "Order", type: "number" },
  { name: "is_active", label: "Active", type: "checkbox" },
  { name: "meta_title", label: "Meta Title", type: "text" },
  { name: "meta_description", label: "Meta Description", type: "textarea" },
];

const storyFields: FieldConfig[] = [
  { name: "slug", label: "Slug", type: "text", required: true },
  { name: "title", label: "Title", type: "text", required: true },
  { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
  { name: "content", label: "Content", type: "textarea", required: true },
  { name: "image_url", label: "Image", type: "image" },
  { name: "author_name", label: "Author Name", type: "text" },
  { name: "published_at", label: "Published At", type: "datetime" },
  { name: "is_active", label: "Active", type: "checkbox" },
];

const testimonialFields: FieldConfig[] = [
  { name: "quote", label: "Quote", type: "textarea", required: true },
  { name: "author_name", label: "Author Name", type: "text", required: true },
  { name: "author_role", label: "Author Role", type: "text" },
  { name: "author_image_url", label: "Author Image", type: "image" },
  { name: "order", label: "Order", type: "number" },
  { name: "is_active", label: "Active", type: "checkbox" },
];

const heroSlideFields: FieldConfig[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "subtitle", label: "Subtitle", type: "textarea" },
  { name: "image_url", label: "Image", type: "image" },
  { name: "cta_text", label: "CTA Text", type: "text" },
  { name: "cta_link", label: "CTA Link", type: "text" },
  { name: "order", label: "Order", type: "number" },
  { name: "is_active", label: "Active", type: "checkbox" },
];

const timelineFields: FieldConfig[] = [
  { name: "year", label: "Year", type: "text", required: true },
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "order", label: "Order", type: "number" },
];

const impactStatFields: FieldConfig[] = [
  { name: "label", label: "Label", type: "text", required: true },
  { name: "value", label: "Value", type: "number", required: true },
  { name: "suffix", label: "Suffix", type: "text" },
  { name: "icon", label: "Icon (Lucide name)", type: "text" },
  { name: "order", label: "Order", type: "number" },
  { name: "is_active", label: "Active", type: "checkbox" },
];

const siteSettingFields: FieldConfig[] = [
  { name: "key", label: "Key", type: "text", required: true },
  { name: "value", label: "Value", type: "textarea", required: true },
  { name: "group", label: "Group", type: "text" },
];

const donationConfigFields: FieldConfig[] = [
  { name: "currency", label: "Currency (3-letter)", type: "text", required: true },
  { name: "amount", label: "Amount", type: "number", required: true },
  { name: "description", label: "Description", type: "text", required: true },
  { name: "is_active", label: "Active", type: "checkbox" },
  { name: "order", label: "Order", type: "number" },
];

const teamMemberFields: FieldConfig[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "role", label: "Role", type: "text", required: true },
  { name: "bio", label: "Bio", type: "textarea" },
  { name: "image_url", label: "Photo", type: "image" },
  { name: "email", label: "Email", type: "text" },
  { name: "order", label: "Order", type: "number" },
  { name: "is_active", label: "Active", type: "checkbox" },
];

function hasAdminSession() {
  if (typeof document === "undefined") return false;
  return /(?:^|; )csrf_token=/.test(document.cookie);
}

function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(hasAdminSession());
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const { toasts, addToast, removeToast } = useToast();

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = async () => {
    try {
      await adminApi.logout();
    } catch {
      // Ignore logout errors; clearing local state is enough for UI.
    }
    setIsLoggedIn(false);
  };

  const content = useMemo(() => {
    const props = {
      onSuccess: (msg: string) => addToast(msg, "success"),
      onError: (msg: string) => addToast(msg, "error"),
    };

    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "storage":
        return <ImageLibrary {...props} />;
      case "programs":
        return (
          <ResourceManager
            title="Programs"
            fields={programFields}
            load={adminApi.listPrograms}
            create={adminApi.createProgram}
            update={adminApi.updateProgram}
            remove={adminApi.deleteProgram}
            columns={[
              { key: "title", header: "Title" },
              { key: "slug", header: "Slug" },
              { key: "order", header: "Order" },
              {
                key: "is_active",
                header: "Active",
                render: (item) => (
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      item.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.is_active ? "Active" : "Inactive"}
                  </span>
                ),
              },
            ]}
            {...props}
          />
        );
      case "stories":
        return (
          <ResourceManager
            title="Stories"
            fields={storyFields}
            load={adminApi.listStories}
            create={adminApi.createStory}
            update={adminApi.updateStory}
            remove={adminApi.deleteStory}
            columns={[
              { key: "title", header: "Title" },
              { key: "slug", header: "Slug" },
              { key: "author_name", header: "Author" },
              {
                key: "is_active",
                header: "Active",
                render: (item) => (
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      item.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.is_active ? "Active" : "Inactive"}
                  </span>
                ),
              },
            ]}
            {...props}
          />
        );
      case "testimonials":
        return (
          <ResourceManager
            title="Testimonials"
            fields={testimonialFields}
            load={adminApi.listTestimonials}
            create={adminApi.createTestimonial}
            update={adminApi.updateTestimonial}
            remove={adminApi.deleteTestimonial}
            columns={[
              { key: "author_name", header: "Author" },
              { key: "author_role", header: "Role" },
              { key: "order", header: "Order" },
            ]}
            {...props}
          />
        );
      case "hero-slides":
        return (
          <ResourceManager
            title="Hero Slides"
            fields={heroSlideFields}
            load={adminApi.listHeroSlides}
            create={adminApi.createHeroSlide}
            update={adminApi.updateHeroSlide}
            remove={adminApi.deleteHeroSlide}
            columns={[
              { key: "title", header: "Title" },
              { key: "cta_text", header: "CTA" },
              { key: "order", header: "Order" },
            ]}
            {...props}
          />
        );
      case "timeline":
        return (
          <ResourceManager
            title="Timeline Events"
            fields={timelineFields}
            load={adminApi.listTimeline}
            create={adminApi.createTimelineEvent}
            update={adminApi.updateTimelineEvent}
            remove={adminApi.deleteTimelineEvent}
            columns={[
              { key: "year", header: "Year" },
              { key: "title", header: "Title" },
              { key: "order", header: "Order" },
            ]}
            {...props}
          />
        );
      case "impact-stats":
        return (
          <ResourceManager
            title="Impact Stats"
            fields={impactStatFields}
            load={adminApi.listImpactStats}
            create={adminApi.createImpactStat}
            update={adminApi.updateImpactStat}
            remove={adminApi.deleteImpactStat}
            columns={[
              { key: "label", header: "Label" },
              { key: "value", header: "Value" },
              { key: "suffix", header: "Suffix" },
            ]}
            {...props}
          />
        );
      case "site-settings":
        return (
          <ResourceManager
            title="Site Settings"
            fields={siteSettingFields}
            keyField="key"
            load={adminApi.listSiteSettings}
            create={adminApi.createSiteSetting}
            update={(key, data) => adminApi.updateSiteSetting(key, data)}
            remove={(key) => adminApi.deleteSiteSetting(key)}
            columns={[
              { key: "key", header: "Key" },
              { key: "value", header: "Value", render: (item) => <span className="truncate max-w-xs block">{(item as { value: string }).value}</span> },
              { key: "group", header: "Group" },
            ]}
            {...props}
          />
        );
      case "donation-config":
        return (
          <ResourceManager
            title="Donation Config"
            fields={donationConfigFields}
            load={adminApi.listDonationConfigs}
            create={adminApi.createDonationConfig}
            update={adminApi.updateDonationConfig}
            remove={adminApi.deleteDonationConfig}
            columns={[
              { key: "currency", header: "Currency" },
              { key: "amount", header: "Amount" },
              { key: "description", header: "Description" },
            ]}
            {...props}
          />
        );
      case "contacts":
        return (
          <SubmissionManager<ContactSubmission>
            title="Contact Messages"
            load={adminApi.listContacts}
            columns={[
              { key: "name", header: "Name" },
              { key: "email", header: "Email" },
              { key: "phone", header: "Phone" },
              {
                key: "message",
                header: "Message",
                render: (item) => <span className="truncate max-w-xs block">{item.message}</span>,
              },
              {
                key: "status",
                header: "Status",
                render: (item) => (
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      item.status === "new"
                        ? "bg-blue-100 text-blue-700"
                        : item.status === "replied"
                          ? "bg-green-100 text-green-700"
                          : item.status === "spam"
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.status}
                  </span>
                ),
              },
            ]}
            statusOptions={[
              { value: "new", label: "New" },
              { value: "replied", label: "Replied" },
              { value: "spam", label: "Spam" },
              { value: "archived", label: "Archived" },
            ]}
            onStatusChange={adminApi.updateContactStatus}
            onNotesChange={adminApi.updateContactNotes}
            onError={props.onError}
          />
        );
      case "volunteers":
        return (
          <SubmissionManager<VolunteerSubmission>
            title="Volunteer Applications"
            load={adminApi.listVolunteers}
            columns={[
              { key: "name", header: "Name" },
              { key: "email", header: "Email" },
              { key: "area_of_interest", header: "Interest" },
              { key: "cv_filename", header: "CV" },
              {
                key: "status",
                header: "Status",
                render: (item) => (
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      item.status === "new"
                        ? "bg-blue-100 text-blue-700"
                        : item.status === "reviewing"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                ),
              },
            ]}
            statusOptions={[
              { value: "new", label: "New" },
              { value: "reviewing", label: "Reviewing" },
              { value: "accepted", label: "Accepted" },
              { value: "rejected", label: "Rejected" },
            ]}
            onStatusChange={adminApi.updateVolunteerStatus}
            onNotesChange={adminApi.updateVolunteerNotes}
            onDownload={async (item) => {
              const data = await adminApi.getVolunteerCvUrl(item.id);
              window.open(data.signed_url, "_blank", "noopener,noreferrer");
            }}
            onError={props.onError}
          />
        );
      case "newsletter":
        return (
          <SubmissionManager<NewsletterSubscriber>
            title="Newsletter Subscribers"
            load={adminApi.listNewsletterSubscribers}
            columns={[
              { key: "email", header: "Email" },
              {
                key: "is_active",
                header: "Active",
                render: (item) => (
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      item.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.is_active ? "Active" : "Inactive"}
                  </span>
                ),
              },
              { key: "subscribed_at", header: "Subscribed" },
            ]}
            onError={props.onError}
          />
        );
      case "team-members":
        return (
          <ResourceManager
            title="Team Members"
            fields={teamMemberFields}
            load={adminApi.listTeamMembers}
            create={adminApi.createTeamMember}
            update={adminApi.updateTeamMember}
            remove={adminApi.deleteTeamMember}
            columns={[
              { key: "name", header: "Name" },
              { key: "role", header: "Role" },
              { key: "email", header: "Email" },
              { key: "order", header: "Order" },
            ]}
            {...props}
          />
        );
      case "donations":
        return (
          <SubmissionManager<Donation>
            title="Donations"
            load={adminApi.listDonations}
            columns={[
              { key: "donor_name", header: "Donor" },
              { key: "donor_email", header: "Email" },
              { key: "amount", header: "Amount", render: (item) => `${item.amount} ${item.currency}` },
              { key: "frequency", header: "Frequency" },
              {
                key: "status",
                header: "Status",
                render: (item) => (
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      item.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : item.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                ),
              },
              { key: "created_at", header: "Date" },
            ]}
            onError={props.onError}
          />
        );
      default:
        return null;
    }
  }, [activeTab, addToast]);

  if (!isLoggedIn) {
    return (
      <>
        <LoginForm onLogin={handleLogin} />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{content}</div>
      </main>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
