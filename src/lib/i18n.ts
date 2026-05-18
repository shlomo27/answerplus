export type Lang = "he" | "en";

export const translations = {
  he: {
    // Navbar
    nav: {
      feed: "פיד",
      askQuestion: "+ שאל שאלה",
      signIn: "התחבר",
      signUp: "הירשם",
      signOut: "התנתק",
      connectedAs: "מחובר כ",
    },
    // Landing page
    landing: {
      tagline: "שאל שאלה אחת - קבל תשובות מ-AI וקהילה",
      subTagline: "שאל AI וקהילה - קבל את התשובה הטובה ביותר",
      ctaPrimary: "התחל עכשיו - הרשם בחינם",
      ctaSecondary: "כבר רשום? התחבר",
      signUp: "הירשם",
      signIn: "התחבר",
      feature1Title: "3 מערכות AI",
      feature1Desc: "Claude, ChatGPT, Gemini עונים בו-זמנית",
      feature2Title: "קהילה אנושית",
      feature2Desc: "אנשים מוסיפים תובנות ותגובות",
      feature3Title: "סיווג אוטומטי",
      feature3Desc: "כל שאלה מסווגת לקטגוריה",
      community: "קהילה",
    },
    // Login page
    login: {
      title: "התחבר לחשבון",
      welcome: "ברוך הבא חזרה",
      signInGoogle: "התחבר עם Google",
      or: "או",
      emailLabel: "כתובת אימייל",
      passwordLabel: "סיסמה",
      passwordPlaceholder: "הסיסמה שלך",
      submitBtn: "התחבר",
      submittingBtn: "מתחבר...",
      noAccount: "אין לך חשבון?",
      registerLink: "הירשם כאן",
      emailVerified: "האימייל אושר בהצלחה! כעת תוכל להתחבר",
      emailNotVerified: "יש לאמת את כתובת המייל לפני ההתחברות",
      errorCredentials: "כתובת אימייל או סיסמה שגויים",
      errorGeneral: "שגיאה בהתחברות, נסה שוב",
    },
    // Register page
    register: {
      title: "יצירת חשבון חדש",
      subtitle: "הצטרף לקהילת Qrowd",
      signUpGoogle: "הירשם עם Google",
      or: "או",
      nameLabel: "שם מלא",
      namePlaceholder: "השם שלך",
      emailLabel: "כתובת אימייל",
      passwordLabel: "סיסמה",
      passwordPlaceholder: "לפחות 6 תווים",
      submitBtn: "צור חשבון",
      submittingBtn: "נרשם...",
      hasAccount: "כבר יש לך חשבון?",
      loginLink: "התחבר כאן",
      errorPasswordLength: "הסיסמה חייבת להכיל לפחות 6 תווים",
      errorGeneral: "שגיאה בהרשמה, נסה שוב",
    },
  },
  en: {
    // Navbar
    nav: {
      feed: "Feed",
      askQuestion: "+ Ask Question",
      signIn: "Sign In",
      signUp: "Sign Up",
      signOut: "Sign Out",
      connectedAs: "Signed in as",
    },
    // Landing page
    landing: {
      tagline: "Ask one question — get answers from AI & community",
      subTagline: "Ask AI and community — get the best answer",
      ctaPrimary: "Get Started Free",
      ctaSecondary: "Already registered? Sign In",
      signUp: "Sign Up",
      signIn: "Sign In",
      feature1Title: "3 AI Systems",
      feature1Desc: "Claude, ChatGPT, Gemini answer simultaneously",
      feature2Title: "Human Community",
      feature2Desc: "People add insights and comments",
      feature3Title: "Auto Categorization",
      feature3Desc: "Every question is automatically categorized",
      community: "Community",
    },
    // Login page
    login: {
      title: "Sign In to Your Account",
      welcome: "Welcome back",
      signInGoogle: "Sign in with Google",
      or: "or",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      passwordPlaceholder: "Your password",
      submitBtn: "Sign In",
      submittingBtn: "Signing in...",
      noAccount: "Don't have an account?",
      registerLink: "Register here",
      emailVerified: "Email verified successfully! You can now sign in.",
      emailNotVerified: "Please verify your email before signing in.",
      errorCredentials: "Invalid email or password",
      errorGeneral: "Sign in error, please try again",
    },
    // Register page
    register: {
      title: "Create a New Account",
      subtitle: "Join the Qrowd community",
      signUpGoogle: "Sign up with Google",
      or: "or",
      nameLabel: "Full Name",
      namePlaceholder: "Your name",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      passwordPlaceholder: "At least 6 characters",
      submitBtn: "Create Account",
      submittingBtn: "Registering...",
      hasAccount: "Already have an account?",
      loginLink: "Sign in here",
      errorPasswordLength: "Password must be at least 6 characters",
      errorGeneral: "Registration error, please try again",
    },
  },
};

export function getTranslations(lang: Lang) {
  return translations[lang];
}
