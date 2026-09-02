import PublicLayout from "../../components/public/PublicLayout";
import PublicSection from "../../components/public/PublicSection";

export default function PrivacyPolicyPage() {
  return (
    <PublicLayout title="Privacy Policy">

      <PublicSection title="Introduction">
        Welcome to Encryption Web.
        This application provides secure administration tools for authorized
        users and organizations.
      </PublicSection>

      <PublicSection title="Information We Collect">
        • Name

        • Mobile Number

        • Profile Photo

        • Device Information

        • Account and security activity
      </PublicSection>

      <PublicSection title="How We Use Information">
        We use your information to verify users, provide authorized services,
        deliver notifications, protect the system and improve the application.
      </PublicSection>

      <PublicSection title="Data Security">
        We use secure authentication and role-based access control to protect
        user information. Only authorized administrators can access protected
        information.
      </PublicSection>

      <PublicSection title="Contact">
        Please contact your system administrator for privacy support.

        Phone: +91 XXXXX XXXXX
      </PublicSection>

    </PublicLayout>
  );
}
