import PublicLayout from "../../components/public/PublicLayout";
import PublicSection from "../../components/public/PublicSection";

export default function TermsConditionsPage() {
  return (
    <PublicLayout title="Terms & Conditions">

      <PublicSection title="Purpose">
        Encryption Web provides secure administration tools for authorized
        organizations and users.
      </PublicSection>

      <PublicSection title="User Responsibilities">
        Users must provide accurate information and use the application
        responsibly.

        Users must not use the system for illegal, abusive or misleading
        activity.
      </PublicSection>

      <PublicSection title="Account Suspension">
        Accounts violating community rules may be suspended or permanently
        blocked.
      </PublicSection>

      <PublicSection title="Disclaimer">
        We strive to keep information accurate but do not guarantee that all
        user-generated content is complete or error-free.
      </PublicSection>

    </PublicLayout>
  );
}
