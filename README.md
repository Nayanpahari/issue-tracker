# Issue Tracker App

![Next.js](https://img.shields.io/badge/Framework-Next.js-black?style=for-the-badge&logo=next.js)
![Firebase](https://img.shields.io/badge/Backend-Firebase-yellow?style=for-the-badge&logo=firebase)
![Vercel](https://img.shields.io/badge/Hosting-Vercel-black?style=for-the-badge&logo=vercel)

---

## Overview

This is a simple **issue tracker application** built with **Next.js** on the frontend and **Firebase Firestore** for the backend.  
Users can sign up, log in, create issues, and view the issue list with filtering and status rules.

---

## 1. Why I chose the frontend stack

I chose **Next.js** because:  

- It allows **server-side rendering (SSR)** and **static site generation (SSG)** for better performance and SEO.  
- Seamless integration with **React** for component-based UI development.  
- Its **app directory and routing system** simplifies multiple pages like `/login`, `/dashboard`, and `/issues`.  
- Deployment to **Vercel** is straightforward since Next.js is built by Vercel.  

---

## 2. Firestore Data Structure

All issues are stored in a **Firestore collection** named `issues`. Each document represents a single issue:

issues (collection)
├─ issueId (document)
│ ├─ title: string
│ ├─ description: string
│ ├─ priority: string (Low / Medium / High)
│ ├─ status: string (Open / In Progress / Done)
│ ├─ assignedTo: string (user email)
│ ├─ createdBy: string (user email)
│ ├─ createdTime: timestamp


- Each user is authenticated via **Firebase Auth (Email/Password)**  
- The `assignedTo` field stores the email of the assigned user  
- `createdTime` is automatically generated at issue creation  

---

## 3. How I handled similar issues

- When creating a new issue, the app **checks Firestore** for any existing issue with a **similar title**.  
- If a similar issue exists:  
  - A **warning message** is shown to the user  
  - The user can choose to **proceed or cancel**  
- This ensures duplicates are minimized while still allowing flexibility  

> Current approach: basic string comparison for titles. Future improvement: AI-based semantic similarity.

---

## 4. Confusing or challenging parts

- **Firebase integration during build:** Next.js pre-renders pages at build time, and accessing Firebase without environment variables caused build errors on Vercel.  
- **Authentication state handling:** Making sure the logged-in user is correctly displayed and redirecting unauthenticated users was tricky.  
- **Next.js app folder structure:** Understanding `app/page.tsx`, `/login/page.tsx`, and routing was initially confusing.  

---

## 5. Improvements I would make next

- Implement **better similar issue detection** using AI/NLP for semantic similarity  
- Add **real-time updates** with Firestore listeners  
- Improve **UI/UX** with a dashboard showing issues by priority and status visually  
- Add **notifications** when someone is assigned a new issue or status changes  
- Implement **role-based access** (admin, regular user)  

---

**Author:** Nayan Pahari  
**Deployed App:** [(https://issue-tracker-three-sigma.vercel.app/login)]

---
