import os

# Define placeholder content template
def create_placeholder(component_name, title="Component"):
    return f"""const {component_name} = () => {{
  return (
    <div className="page-container section-padding">
      <h1 className="text-3xl font-bold mb-6 text-primary">{title}</h1>
      <p className="text-gray-600">This page is under development.</p>
    </div>
  );
}};

export default {component_name};
"""

# Define all needed files
files = {
    # Home Components
    "src/components/Home/Hero.jsx": ("Hero", "Welcome to eTuitionBd"),
    "src/components/Home/LatestTuitions.jsx": ("LatestTuitions", "Latest Tuition Posts"),
    "src/components/Home/LatestTutors.jsx": ("LatestTutors", "Latest Tutors"),
    "src/components/Home/HowItWorks.jsx": ("HowItWorks", "How It Works"),
    "src/components/Home/WhyChooseUs.jsx": ("WhyChooseUs", "Why Choose Us"),
    
    # Tuition Pages
    "src/pages/Tuitions/AllTuitions.jsx": ("AllTuitions", "Browse All Tuitions"),
    "src/pages/Tuitions/TuitionDetails.jsx": ("TuitionDetails", "Tuition Details"),
    
    # Tutor Pages
    "src/pages/Tutors/AllTutors.jsx": ("AllTutors", "Browse All Tutors"),
    "src/pages/Tutors/TutorProfile.jsx": ("TutorProfile", "Tutor Profile"),
    
    # Other Pages
    "src/pages/Contact.jsx": ("Contact", "Contact Us"),
    "src/pages/Error404.jsx": ("Error404", "404 - Page Not Found"),
    "src/pages/ProfileSettings.jsx": ("ProfileSettings", "Profile Settings"),
    
    # Student Dashboard
    "src/pages/Dashboards/Student/StudentDashboard.jsx": ("StudentDashboard", "Student Dashboard"),
    "src/pages/Dashboards/Student/MyTuitions.jsx": ("MyTuitions", "My Tuitions"),
    "src/pages/Dashboards/Student/PostTuition.jsx": ("PostTuition", "Post New Tuition"),
    "src/pages/Dashboards/Student/AppliedTutors.jsx": ("AppliedTutors", "Applied Tutors"),
    "src/pages/Dashboards/Student/PaymentHistory.jsx": ("PaymentHistory", "Payment History"),
    
    # Tutor Dashboard
    "src/pages/Dashboards/Tutor/TutorDashboard.jsx": ("TutorDashboard", "Tutor Dashboard"),
    "src/pages/Dashboards/Tutor/MyApplications.jsx": ("MyApplications", "My Applications"),
    "src/pages/Dashboards/Tutor/OngoingTuitions.jsx": ("OngoingTuitions", "Ongoing Tuitions"),
    "src/pages/Dashboards/Tutor/RevenueHistory.jsx": ("RevenueHistory", "Revenue History"),
    
    # Admin Dashboard
    "src/pages/Dashboards/Admin/AdminDashboard.jsx": ("AdminDashboard", "Admin Dashboard"),
    "src/pages/Dashboards/Admin/UserManagement.jsx": ("UserManagement", "User Management"),
    "src/pages/Dashboards/Admin/TuitionManagement.jsx": ("TuitionManagement", "Tuition Management"),
    "src/pages/Dashboards/Admin/ReportsAnalytics.jsx": ("ReportsAnalytics", "Reports & Analytics"),
    
    # Payment Pages
    "src/pages/Payment/PaymentSuccess.jsx": ("PaymentSuccess", "Payment Successful"),
    "src/pages/Payment/PaymentCancel.jsx": ("PaymentCancel", "Payment Cancelled"),
}

# Create files
for filepath, (component_name, title) in files.items():
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(create_placeholder(component_name, title))
    print(f"Created: {filepath}")

print("\n✅ All placeholder files created successfully!")
