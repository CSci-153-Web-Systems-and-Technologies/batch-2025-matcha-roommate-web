# MatchaRoommate 🍵

> **Find your perfect matcha.**
> The safest way to find boarding houses, apartments, and compatible roommates near Visayas State University (VSU).

MatchaRoommate is a modern, secure web application designed to solve the housing challenges of VSU students and Baybay City locals. It replaces messy social media groups with a verified, filterable, and dedicated platform.

![MatchaRoommate Banner](/public/images/logo/logo.jpg)

## 📖 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#-project-structure)
- [Security](#-security)
- [License](#-license)

## ✨ Key Features

- **🔐 Verified Authentication**: Secure signup via Email or Google. Mandatory email verification and profile completion ensure real users.
- **🏠 Dual Listing System**:
  - **Landlords/Tenants**: Post rooms for rent with specific details (amenities, location, price, capacity).
  - **Seekers**: Persons looking for a room or boarding house can post requests with budget and lifestyle preferences.
- **🤝 Smart Matching**: Users can view compatibility based on habits (sleeping schedule, cleanliness, smoking status, study environment).
- **💬 Real-time Messaging**: Built-in chat system allows safe communication without sharing personal phone numbers immediately.
- **🔔 Request System**: Formal "Apply" and "Invite" system for housing, with status tracking (Pending/Accepted/Rejected).
- **📍 Localized Filters**: Custom location filters specific to Baybay City (Gabas, Pangasugan, Upper Campus, etc.).

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router & Server Actions)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/) (Radix Primitives)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks & Context API

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CSci-153-Web-Systems-and-Technologies/batch-2025-matcha-roommate-web.git
   cd matcha-roommate-web

2. **Install Dependencies**
   ```bash
   npm install # or pnpm install

3. Environment Setup Create a .env.local file in the root directory and add your Supabase credentials:
NEXT_PUBLIC_SUPABASE_URL=[https://your-project.supabase.co](https://your-project.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

4. Run the development server
npm run dev
Open http://localhost:3000 to view the app.

## 📂 Project Structure

src/
├── app/                # Next.js App Router pages
│   ├── auth/           # Authentication callback routes
│   ├── dashboard/      # Protected user dashboard (Messages, Profile, Listings)
│   ├── rooms/          # Room listing pages
│   └── verify-email/   # Email verification flow
├── components/         # Reusable UI components
│   ├── auth/           # Login/Register forms
│   ├── dashboard/      # Dashboard widgets & Onboarding Modal
│   ├── layout/         # Navbar, Sidebar, Footer
│   ├── listings/       # Listing cards and filters
│   ├── messaging/      # Chat window and list
│   └── ui/             # Shadcn primitive components
├── context/            # Global React Contexts (e.g., Sidebar state)
├── utils/              # Helper functions (Supabase client)
└── data/               # Static data (e.g., Locations list)

## 🗄️ Database Schema

The application uses a PostgreSQL database hosted on Supabase. Below is the full schema definition.

<details> <summary><strong>Click to view SQL Schema</strong></summary>

-- Profiles & Users
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  first_name text,
  last_name text,
  middle_initial text,
  contact_number text,
  occupation text,
  bio text,
  avatar_url text,
  gender text,
  birthdate date,
  is_verified boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

-- Posts (Master Table)
CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  type text CHECK (type = ANY (ARRAY['room'::text, 'seeker'::text])),
  title text,
  description text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT posts_pkey PRIMARY KEY (id),
  CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

-- Room Details (Extension of Posts)
CREATE TABLE public.room_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  post_id uuid,
  price numeric,
  location text,
  address text,
  payment_scheme text,
  capacity integer DEFAULT 1,
  available_slots integer DEFAULT 1,
  lister_type text,
  CONSTRAINT room_posts_pkey PRIMARY KEY (id),
  CONSTRAINT room_posts_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id)
);

-- Amenities
CREATE TABLE public.amenities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  room_post_id uuid,
  amenity text,
  CONSTRAINT amenities_pkey PRIMARY KEY (id),
  CONSTRAINT amenities_room_post_id_fkey FOREIGN KEY (room_post_id) REFERENCES public.room_posts(id)
);

-- Images
CREATE TABLE public.images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  post_id uuid,
  url text NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT images_pkey PRIMARY KEY (id),
  CONSTRAINT images_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id)
);

-- User Preferences & Habits
CREATE TABLE public.profile_habits (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid,
  cleanliness_level text,
  sleep_schedule text,
  pet_status text,
  smoking_status text,
  study_habit text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT profile_habits_pkey PRIMARY KEY (id),
  CONSTRAINT profile_habits_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);

CREATE TABLE public.profile_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid,
  budget_max numeric,
  location_preference text,
  move_in_date date,
  amenities_required ARRAY DEFAULT '{}'::text[],
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT profile_preferences_pkey PRIMARY KEY (id),
  CONSTRAINT profile_preferences_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);

-- Messaging System
CREATE TABLE public.conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  last_message_at timestamp without time zone DEFAULT now(),
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT conversations_pkey PRIMARY KEY (id)
);

CREATE TABLE public.participants (
  conversation_id uuid NOT NULL,
  user_id uuid NOT NULL,
  last_read_message_id uuid,
  CONSTRAINT participants_pkey PRIMARY KEY (conversation_id, user_id),
  CONSTRAINT participants_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id),
  CONSTRAINT participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conversation_id uuid,
  sender_id uuid,
  content text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id),
  CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id)
);

-- Housing Requests
CREATE TABLE public.housing_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp without time zone DEFAULT now(),
  sender_id uuid,
  receiver_id uuid,
  post_id uuid,
  status text DEFAULT 'pending'::text,
  request_type text CHECK (request_type = ANY (ARRAY['application'::text, 'invite'::text])),
  CONSTRAINT housing_requests_pkey PRIMARY KEY (id),
  CONSTRAINT housing_requests_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id),
  CONSTRAINT housing_requests_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.profiles(id),
  CONSTRAINT housing_requests_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id)
);

-- Notifications
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp without time zone DEFAULT now(),
  user_id uuid,
  type text,
  content text,
  is_read boolean DEFAULT false,
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

</details>

## 🔒 Security

• Row Level Security (RLS): Database policies ensure users can only edit their own profiles and listings.

• Middleware Protection: proxy.ts handles protected route redirection and verification checks.

• Strict Validation: Client-side validation for phone numbers and profile data integrity.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

Built with 💚 for the VSU Community.

### **Recommendation for your Workflow:**

1.  Create this `README.md` file.
2.  Commit it: `docs: add comprehensive README for v1.0.0`
3.  Push it to your `develop` (or release) branch.
4.  Check your existing Pull Request—it will now include this file automatically!
5.  **Then** you can merge the PR comfortably.
